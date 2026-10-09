// Carga en Sanity las fotos reales del Drive según sanity/fotos/fotos-drive.json (D-051).
// Uso: npm run sanity:fotos   (usa la sesión de la CLI de Sanity: npx sanity login)
//
// Por cada foto: la descarga del Drive (carpeta pública, solo lectura), la reduce a 2400 px por
// lado como máximo (JPEG), la sube como asset y la asigna al campo indicado con su texto
// alternativo. Es repetible: si un asset con el mismo ID de Drive ya existe, se reutiliza.
// Después de importar la semilla (que trae los marcadores [DEMO]) hay que volver a correrlo.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import { getCliClient } from 'sanity/cli';

interface FotoMapa {
  drive: string;
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

async function descargar(id: string, intento = 1): Promise<Buffer> {
  const archivo = join(CACHE, `${id}.jpg`);
  if (existsSync(archivo)) return readFileSync(archivo);
  try {
    const respuesta = await fetch(
      `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`,
    );
    const tipo = respuesta.headers.get('content-type') ?? '';
    if (!respuesta.ok || !tipo.startsWith('image/')) {
      throw new Error(`HTTP ${respuesta.status} (${tipo})`);
    }
    const original = Buffer.from(await respuesta.arrayBuffer());
    const reducida = await sharp(original)
      .rotate()
      .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();
    writeFileSync(archivo, reducida);
    return reducida;
  } catch (error) {
    if (intento >= 4) throw error;
    await new Promise((listo) => setTimeout(listo, 2000 * intento));
    return descargar(id, intento + 1);
  }
}

const assets = new Map<string, string>();
async function assetDe(foto: FotoMapa): Promise<string> {
  const conocido = assets.get(foto.drive);
  if (conocido) return conocido;
  const existente = await cliente.fetch<string | null>(
    `*[_type == "sanity.imageAsset" && source.name == "google-drive" && source.id == $id][0]._id`,
    { id: foto.drive },
  );
  let id = existente;
  if (!id) {
    const buffer = await descargar(foto.drive);
    const subido = await cliente.assets.upload('image', buffer, {
      filename: `${foto.drive}.jpg`,
      source: {
        name: 'google-drive',
        id: foto.drive,
        url: `https://drive.google.com/file/d/${foto.drive}/view`,
      },
    });
    id = subido._id;
  }
  assets.set(foto.drive, id);
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
        imagen(assets.get(foto.drive)!, foto.alt, `drive-${foto.drive.slice(0, 10)}-${i + 1}`),
      ),
    );
  } else {
    const [foto] = grupo.fotos;
    if (foto) asignar(grupo.destino, grupo.campo, imagen(assets.get(foto.drive)!, foto.alt));
  }
}
for (const { destino, campos } of mapa.vaciar) {
  for (const campo of campos) asignar(destino, campo, []);
}

const transaccion = cliente.transaction();
for (const [destino, campos] of porDocumento) transaccion.patch(destino, (p) => p.set(campos));
await transaccion.commit();
console.log(`[fotos] ${porDocumento.size} documentos actualizados con ${todas.length} fotos`);
