// Convierte los datos DEMO locales en documentos de Sanity (NDJSON) con sus imágenes.
// Uso:
//   npm run sanity:semilla
//   npx sanity dataset import sanity/semilla/demo.ndjson production --replace
// La importación sube las imágenes de public/demo/ (sin duplicarlas) y usa la sesión de la CLI.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { BloqueTexto, Imagen, TextoLocalizado } from '../src/lib/contenido/tipos';
import { categoriasDemo } from '../src/lib/demo/categorias';
import { configuracionDemo } from '../src/lib/demo/configuracion';
import { episodioDemo, guiaDemo, historiasDemo } from '../src/lib/demo/editorial';
import { proveedoresDemo } from '../src/lib/demo/proveedores';
import { regionesDemo } from '../src/lib/demo/regiones';
import { venuesDemo } from '../src/lib/demo/venues';

const RAIZ = process.cwd();
const DESTINO = join(RAIZ, 'sanity', 'semilla', 'demo.ndjson');

type Documento = Record<string, unknown> & { _id: string; _type: string };

function imagen(img: Imagen, clave?: string) {
  const archivo = pathToFileURL(join(RAIZ, 'public', img.url)).href;
  return {
    _type: 'imagenConAlt',
    ...(clave ? { _key: clave } : {}),
    _sanityAsset: `image@${archivo}`,
    alt: img.alt,
  };
}

const referencia = (id: string, clave?: string) => ({
  _type: 'reference',
  _ref: id,
  ...(clave ? { _key: clave } : {}),
});

const slug = (valor: string) => ({ _type: 'slug', current: valor });

function bloquesDe(
  prefijo: string,
  texto: TextoLocalizado,
): { en: BloqueTexto[]; es: BloqueTexto[] } {
  const bloque = (idioma: string, contenido: string): BloqueTexto => ({
    _type: 'block',
    _key: `${prefijo}-${idioma}`,
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: `${prefijo}-${idioma}-s`, text: contenido, marks: [] }],
  });
  return { en: [bloque('en', texto.en)], es: [bloque('es', texto.es ?? texto.en)] };
}

const documentos: Documento[] = [];

for (const r of regionesDemo) {
  documentos.push({
    _id: r._id,
    _type: 'region',
    nombre: r.nombre,
    slug: slug(r.slug),
    descripcion: r.descripcion,
    imagen: imagen(r.imagen),
    orden: r.orden,
  });
}

for (const c of categoriasDemo) {
  documentos.push({
    _id: c._id,
    _type: 'categoriaProveedor',
    nombre: c.nombre,
    slug: slug(c.slug),
    icono: c.icono,
    orden: c.orden,
  });
}

for (const p of proveedoresDemo) {
  documentos.push({
    _id: p._id,
    _type: 'proveedor',
    nombre: p.nombre,
    slug: slug(p.slug),
    categoria: referencia(`categoria-${p.categoria.slug}`),
    resumen: p.resumen,
    descripcion: p.descripcion,
    imagenes: p.imagenes.map((img, i) => imagen(img, `img${i + 1}`)),
    regionesQueCubre: p.regionesQueCubre.map((r) => referencia(`region-${r.slug}`, r.slug)),
    destacado: p.destacado,
  });
}

for (const v of venuesDemo) {
  const { ubicacion, ...ficha } = v.fichaTecnica;
  documentos.push({
    _id: v._id,
    _type: 'venue',
    nombre: v.nombre,
    slug: slug(v.slug),
    publicado: v.publicado,
    destacado: v.destacado,
    nivelListado: v.nivelListado,
    region: referencia(`region-${v.region.slug}`),
    tipos: v.tipos,
    resumen: v.resumen,
    descripcion: v.descripcion,
    fichaTecnica: { ...ficha, ubicacion: { _type: 'geopoint', ...ubicacion } },
    media: {
      imagenHero: imagen(v.media.imagenHero),
      galeria: v.media.galeria.map((img, i) => imagen(img, `g${i + 1}`)),
    },
    ...(v.entrevista
      ? {
          entrevista: {
            youtubeId: v.entrevista.youtubeId,
            titulo: v.entrevista.titulo,
            capitulos: v.entrevista.capitulos.map((c) => ({ _type: 'capitulo', ...c })),
          },
        }
      : {}),
    citasDestacadas: v.citasDestacadas.map((c) => ({ _type: 'cita', ...c })),
    espacios: v.espacios.map((e) => ({
      _type: 'espacio',
      _key: e._key,
      nombre: e.nombre,
      descripcion: e.descripcion,
      interiorExterior: e.interiorExterior,
      capacidadCeremonia: e.capacidadCeremonia,
      capacidadCoctel: e.capacidadCoctel,
      capacidadBanquete: e.capacidadBanquete,
      imagenes: e.imagenes.map((img, i) => imagen(img, `${e._key}-i${i + 1}`)),
    })),
    proveedoresRecomendados: v.proveedoresRecomendados.map((p) => referencia(p._id, p.slug)),
  });
}

const cfg = configuracionDemo;
documentos.push({
  _id: 'configuracionSitio',
  _type: 'configuracionSitio',
  fraseHero: cfg.fraseHero,
  subtituloHero: cfg.subtituloHero,
  imagenHero: imagen(cfg.imagenHero),
  porQueYucatan: {
    ...cfg.porQueYucatan,
    puntos: cfg.porQueYucatan.puntos.map((p) => ({ _type: 'punto', ...p })),
  },
  sello: { ...cfg.sello, pasos: cfg.sello.pasos.map((p) => ({ _type: 'paso', ...p })) },
  tradiciones: {
    ...cfg.tradiciones,
    elementos: cfg.tradiciones.elementos.map((e) => ({
      _type: 'tradicion',
      ...e,
      imagen: imagen(e.imagen),
    })),
  },
  metricas: cfg.metricas,
});

documentos.push({
  _id: episodioDemo._id,
  _type: 'episodio',
  titulo: episodioDemo.titulo,
  youtubeId: episodioDemo.youtubeId,
  descripcion: episodioDemo.descripcion,
  fechaPublicacion: episodioDemo.fechaPublicacion,
});

// La guía DEMO no tiene PDF: el Studio marcará el campo como pendiente.
documentos.push({
  _id: guiaDemo._id,
  _type: 'guia',
  edicion: guiaDemo.edicion,
  portada: imagen(guiaDemo.portada),
  descripcion: guiaDemo.descripcion,
  activa: guiaDemo.activa,
});

for (const h of historiasDemo) {
  documentos.push({
    _id: h._id,
    _type: 'historia',
    titulo: h.titulo,
    slug: slug(h.slug),
    tipo: h.tipo,
    imagenPortada: imagen(h.imagenPortada),
    extracto: h.extracto,
    cuerpo: bloquesDe(h._id, h.extracto),
    fechaPublicacion: h.fechaPublicacion,
  });
}

// Contactos privados (D-012): correos de ejemplo en example.com, dominio reservado para pruebas.
documentos.push({
  _id: 'privado.contactosLeads',
  _type: 'contactosLeads',
  contactos: venuesDemo.map((v, i) => ({
    _type: 'contacto',
    _key: `c${i + 1}`,
    referencia: { _type: 'reference', _ref: v._id, _weak: true },
    correo: `demo+${v.slug}@example.com`,
  })),
});

mkdirSync(join(RAIZ, 'sanity', 'semilla'), { recursive: true });
writeFileSync(DESTINO, documentos.map((d) => JSON.stringify(d)).join('\n') + '\n');
console.log(`[semilla] ${documentos.length} documentos en sanity/semilla/demo.ndjson`);
console.log(
  '[semilla] Siguiente paso: npx sanity dataset import sanity/semilla/demo.ndjson production --replace',
);
