// Carga en Sanity las fotos reales del Drive según sanity/fotos/fotos-drive.json (D-051).
// Uso: npm run sanity:fotos   (usa la sesión de la CLI de Sanity: npx sanity login)
//
// Por cada foto: la descarga del Drive (carpeta pública, solo lectura), la reduce a 2400 px por
// lado como máximo (JPEG), la sube como asset y la asigna al campo indicado con su texto
// alternativo. Es repetible: si un asset con el mismo ID de Drive ya existe, se reutiliza.
// Una foto también puede venir de un .zip del Drive (`zip`: posición dentro del archivo), como las
// entregas por WeTransfer de los partners; su ID de asset es "<ID del zip>#<posición>" (D-057).
// Después de importar la semilla (que trae los marcadores [DEMO]) hay que volver a correrlo.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import { join } from 'node:path';
import { inflateRawSync } from 'node:zlib';
import sharp from 'sharp';
import { getCliClient } from 'sanity/cli';

interface FotoMapa {
  drive: string;
  /**
   * Posición (desde 0) de la foto en el directorio del .zip cuyo ID de Drive es `drive`. Se usa
   * la posición y no el nombre porque los nombres de archivo pueden traer datos de los clientes.
   */
  zip?: number;
  origen: string;
  alt: { en: string; es: string };
}
interface GrupoMapa {
  destino: string;
  campo: string;
  lista?: boolean;
  fotos: FotoMapa[];
}
interface Mapa {
  grupos: GrupoMapa[];
  vaciar: Array<{ destino: string; campos: string[] }>;
}

const cliente = getCliClient({ apiVersion: '2026-02-01' });
const mapa = JSON.parse(
  readFileSync(join(process.cwd(), 'sanity', 'fotos', 'fotos-drive.json'), 'utf8'),
) as Mapa;
const CACHE = join(os.tmpdir(), 'curated-fotos-drive');
mkdirSync(CACHE, { recursive: true });

const reducir = (original: Buffer) =>
  sharp(original)
    .rotate()
    .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();

/** Extrae el archivo número `indice` de un .zip leyendo su directorio central (sin dependencias). */
function extraerDeZip(zip: Buffer, indice: number): Buffer {
  let fin = zip.length - 22;
  while (fin >= 0 && zip.readUInt32LE(fin) !== 0x06054b50) fin--;
  if (fin < 0) throw new Error('El archivo no es un .zip válido');
  let posicion = zip.readUInt32LE(fin + 16);
  const entradas = zip.readUInt16LE(fin + 10);
  for (let i = 0; i < entradas; i++) {
    const metodo = zip.readUInt16LE(posicion + 10);
    const comprimido = zip.readUInt32LE(posicion + 20);
    const largoNombre = zip.readUInt16LE(posicion + 28);
    const largoExtra = zip.readUInt16LE(posicion + 30);
    const largoComentario = zip.readUInt16LE(posicion + 32);
    const local = zip.readUInt32LE(posicion + 42);
    if (i === indice) {
      const inicio = local + 30 + zip.readUInt16LE(local + 26) + zip.readUInt16LE(local + 28);
      const datos = zip.subarray(inicio, inicio + comprimido);
      if (metodo === 0) return Buffer.from(datos);
      if (metodo === 8) return inflateRawSync(datos);
      throw new Error(`Compresión ${metodo} no soportada (archivo ${indice} del .zip)`);
    }
    posicion += 46 + largoNombre + largoExtra + largoComentario;
  }
  throw new Error(`El .zip no tiene archivo ${indice}`);
}

const zips = new Map<string, Promise<Buffer>>();
function descargarZip(id: string): Promise<Buffer> {
  const archivo = join(CACHE, `${id}.zip`);
  if (!zips.has(id)) {
    zips.set(
      id,
      existsSync(archivo)
        ? Promise.resolve(readFileSync(archivo))
        : fetch(`https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`)
            .then(async (respuesta) => {
              if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status} al bajar el .zip ${id}`);
              return Buffer.from(await respuesta.arrayBuffer());
            })
            .then((zip) => {
              writeFileSync(archivo, zip);
              return zip;
            }),
    );
  }
  return zips.get(id)!;
}

const idDe = (foto: FotoMapa) =>
  foto.zip === undefined ? foto.drive : `${foto.drive}#${foto.zip}`;

async function descargar(foto: FotoMapa, intento = 1): Promise<Buffer> {
  const id = idDe(foto);
  const archivo = join(CACHE, `${id.replace(/[^\w.-]+/g, '_')}.jpg`);
  if (existsSync(archivo)) return readFileSync(archivo);
  if (foto.zip !== undefined) {
    const reducida = await reducir(extraerDeZip(await descargarZip(foto.drive), foto.zip));
    writeFileSync(archivo, reducida);
    return reducida;
  }
  try {
    const respuesta = await fetch(
      `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`,
    );
    const tipo = respuesta.headers.get('content-type') ?? '';
    if (!respuesta.ok || !tipo.startsWith('image/')) {
      throw new Error(`HTTP ${respuesta.status} (${tipo})`);
    }
    const original = Buffer.from(await respuesta.arrayBuffer());
    const reducida = await reducir(original);
    writeFileSync(archivo, reducida);
    return reducida;
  } catch (error) {
    if (intento >= 4) throw error;
    await new Promise((listo) => setTimeout(listo, 2000 * intento));
    return descargar(foto, intento + 1);
  }
}

const assets = new Map<string, string>();
async function assetDe(foto: FotoMapa): Promise<string> {
  const clave = idDe(foto);
  const conocido = assets.get(clave);
  if (conocido) return conocido;
  const existente = await cliente.fetch<string | null>(
    `*[_type == "sanity.imageAsset" && source.name == "google-drive" && source.id == $id][0]._id`,
    { id: clave },
  );
  let id = existente;
  if (!id) {
    const buffer = await descargar(foto);
    const subido = await cliente.assets.upload('image', buffer, {
      filename: `${clave.replace('#', '-')}.jpg`,
      source: {
        name: 'google-drive',
        id: clave,
        url: `https://drive.google.com/file/d/${foto.drive}/view`,
      },
    });
    id = subido._id;
  }
  assets.set(clave, id);
  return id;
}

const imagen = (assetId: string, alt: FotoMapa['alt'], clave?: string) => ({
  _type: 'imagenConAlt',
  ...(clave ? { _key: clave } : {}),
  asset: { _type: 'reference', _ref: assetId },
  alt,
});

// 1. Assets (de 3 en 3 para no saturar la conexión).
const todas = mapa.grupos.flatMap((g) => g.fotos);
let hechas = 0;
for (let i = 0; i < todas.length; i += 3) {
  await Promise.all(todas.slice(i, i + 3).map((foto) => assetDe(foto)));
  hechas = Math.min(i + 3, todas.length);
  process.stdout.write(`\r[fotos] assets ${hechas}/${todas.length}`);
}
process.stdout.write('\n');

// 2. Un parche por documento con todos sus campos.
const porDocumento = new Map<string, Record<string, unknown>>();
const asignar = (destino: string, campo: string, valor: unknown) => {
  const campos = porDocumento.get(destino) ?? {};
  campos[campo] = valor;
  porDocumento.set(destino, campos);
};
for (const grupo of mapa.grupos) {
  if (grupo.lista) {
    asignar(
      grupo.destino,
      grupo.campo,
      grupo.fotos.map((foto, i) =>
        imagen(assets.get(idDe(foto))!, foto.alt, `drive-${foto.drive.slice(0, 10)}-${i + 1}`),
      ),
    );
  } else {
    const [foto] = grupo.fotos;
    if (foto) asignar(grupo.destino, grupo.campo, imagen(assets.get(idDe(foto))!, foto.alt));
  }
}
for (const { destino, campos } of mapa.vaciar) {
  for (const campo of campos) asignar(destino, campo, []);
}

const transaccion = cliente.transaction();
for (const [destino, campos] of porDocumento) transaccion.patch(destino, (p) => p.set(campos));
await transaccion.commit();
console.log(`[fotos] ${porDocumento.size} documentos actualizados con ${todas.length} fotos`);
