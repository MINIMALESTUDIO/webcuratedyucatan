// Aplica en Sanity las traducciones al español de sanity/traducciones/es.json (D-056).
//
//   npm run sanity:traducciones            → escribe el español donde falta
//   PRUEBA=1 npm run sanity:traducciones   → solo informa, sin escribir
//
// Recorre los documentos publicados (sin borradores ni privado.*), busca cada campo localizado
// { en, es } que tenga inglés y no tenga español, y lo completa con el diccionario: textos
// simples y bloques de texto enriquecido (span por span, conservando estructura y marcas).
// Nunca sobrescribe un español que ya exista, así que no pisa lo que se edite en el Studio.
// Después de importar la semilla con --replace hay que volver a correrlo (igual que sanity:fotos).
import { readFileSync } from 'node:fs';
import { getCliClient } from 'sanity/cli';

const cliente = getCliClient({ apiVersion: '2026-02-01' });
// sanity exec no deja pasar banderas propias: el modo de prueba va por variable de entorno.
const prueba = process.env.PRUEBA === '1';
const { textos } = JSON.parse(readFileSync('sanity/traducciones/es.json', 'utf8')) as {
  textos: Record<string, string>;
};

interface Span {
  _type: string;
  text?: string;
}
interface Bloque {
  _type: string;
  children?: Span[];
}

const sinTraduccion = new Set<string>();
const traducir = (en: string): string | null => {
  const es = textos[en];
  if (es === undefined) sinTraduccion.add(en);
  return es ?? null;
};

/** Copia de los bloques con cada span traducido; null si algún span no tiene traducción. */
function traducirBloques(bloques: Bloque[]): Bloque[] | null {
  let completo = true;
  const copia = bloques.map((bloque) => ({
    ...bloque,
    children: bloque.children?.map((hijo) => {
      if (hijo._type !== 'span' || !hijo.text?.trim()) return hijo;
      const es = traducir(hijo.text);
      if (es === null) completo = false;
      return { ...hijo, text: es ?? hijo.text };
    }),
  }));
  return completo ? copia : null;
}

const tieneEspanol = (v: unknown) =>
  Array.isArray(v) ? v.length > 0 : typeof v === 'string' && v.trim() !== '';

const docs = await cliente.fetch<Record<string, unknown>[]>(
  `*[!(_id in path("drafts.**")) && !(_id in path("privado.**")) && !(_type match "sanity.*")]`,
);

const parches = new Map<string, Record<string, unknown>>();
function recorrer(valor: unknown, ruta: string, id: string) {
  if (Array.isArray(valor)) {
    valor.forEach((x, i) => {
      const clave = x && typeof x === 'object' && '_key' in x ? `_key=="${x._key}"` : String(i);
      recorrer(x, `${ruta}[${clave}]`, id);
    });
    return;
  }
  if (!valor || typeof valor !== 'object') return;
  const objeto = valor as Record<string, unknown>;
  if ('en' in objeto && (typeof objeto.en === 'string' || Array.isArray(objeto.en))) {
    if (tieneEspanol(objeto.es)) return;
    const es =
      typeof objeto.en === 'string'
        ? objeto.en.trim()
          ? traducir(objeto.en)
          : null
        : objeto.en.length
          ? traducirBloques(objeto.en as Bloque[])
          : null;
    if (es !== null) {
      const campos = parches.get(id) ?? {};
      campos[`${ruta.replace(/^\./, '')}.es`] = es;
      parches.set(id, campos);
    }
    return;
  }
  for (const [clave, x] of Object.entries(objeto)) {
    if (!clave.startsWith('_')) recorrer(x, `${ruta}.${clave}`, id);
  }
}
for (const doc of docs) recorrer(doc, '', String(doc._id));

const total = [...parches.values()].reduce((n, campos) => n + Object.keys(campos).length, 0);
if (!prueba && total > 0) {
  const transaccion = cliente.transaction();
  for (const [id, campos] of parches) transaccion.patch(id, (p) => p.set(campos));
  await transaccion.commit();
}
console.log(
  `[traducciones] ${total} campos ${prueba ? 'por traducir' : 'traducidos'} en ${parches.size} documentos`,
);
if (sinTraduccion.size > 0) {
  console.log(`[traducciones] ${sinTraduccion.size} textos sin traducción en el diccionario:`);
  for (const en of [...sinTraduccion].slice(0, 20)) console.log(`  - ${en.slice(0, 100)}`);
}
