// Convierte los datos DEMO locales en documentos de Sanity (NDJSON) con sus imágenes.
// Uso:
//   npm run sanity:semilla
//   npx sanity dataset import sanity/semilla/demo.ndjson production --replace
// La importación sube las imágenes de public/demo/ (sin duplicarlas) y usa la sesión de la CLI.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import type {
  BloquesLocalizados,
  BloqueTexto,
  Capitulo,
  ElementoLista,
  Imagen,
  SeccionEditorial,
} from '../src/lib/contenido/tipos';
import { coleccionesDemo } from '../src/lib/demo/colecciones';
import { configuracionDemo } from '../src/lib/demo/configuracion';
import { disenoDemo } from '../src/lib/demo/diseno';
import { articulosDemo, descubreDemo, paginasDemo } from '../src/lib/demo/editorial';
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

const imagenes = (lista: Imagen[], prefijo: string) =>
  lista.map((img, i) => imagen(img, img._key ?? `${prefijo}${i + 1}`));

const referencia = (id: string) => ({ _type: 'reference', _ref: id });
const slug = (valor: string) => ({ _type: 'slug', current: valor });

/** Portable Text con markDefs y marks explícitos, como los guarda el Studio. */
function bloques(valor: BloquesLocalizados) {
  const normalizar = (lista: BloqueTexto[] = []) =>
    lista.map((b) => ({
      ...b,
      markDefs: b.markDefs ?? [],
      children: b.children.map((hijo) => ({
        ...hijo,
        marks: (hijo as { marks?: string[] }).marks ?? [],
      })),
    }));
  return { en: normalizar(valor.en), es: normalizar(valor.es) };
}

const lista = (elementos: ElementoLista[]) =>
  elementos.map((e) => ({ _type: 'elementoLista', _key: e._key, texto: e.texto }));
const capitulos = (lista: Capitulo[]) => lista.map((c) => ({ _type: 'capitulo', ...c }));

const documentos: Documento[] = [];

for (const c of coleccionesDemo) {
  documentos.push({
    _id: c._id,
    _type: 'coleccion',
    nombre: c.nombre,
    slug: slug(c.slug),
    lema: c.lema,
    descripcion: c.descripcion,
    resultado: c.resultado,
    imagen: imagen(c.imagen),
    orden: c.orden,
  });
}

for (const r of regionesDemo) {
  documentos.push({
    _id: r._id,
    _type: 'region',
    nombre: r.nombre,
    slug: slug(r.slug),
    orden: r.orden,
  });
}

for (const v of venuesDemo) {
  documentos.push({
    _id: v._id,
    _type: 'venue',
    nombre: v.nombre,
    slug: slug(v.slug),
    publicado: v.publicado,
    destacado: v.destacado,
    coleccion: referencia(`coleccion-${v.coleccion.slug}`),
    region: referencia(`region-${v.region.slug}`),
    localidad: v.localidad,
    resumen: v.resumen,
    descripcion: bloques(v.descripcion),
    atributos: v.atributos,
    fichaTecnica: v.fichaTecnica,
    espacios: v.espacios.map((e) => ({
      _type: 'espacio',
      _key: e._key,
      nombre: e.nombre,
      descripcion: e.descripcion,
      interiorExterior: e.interiorExterior,
      capacidad: e.capacidad,
      imagenes: imagenes(e.imagenes, `${e._key}-i`),
    })),
    notasCurated: v.notasCurated.map((n) => ({ _type: 'notaCurated', ...n })),
    media: {
      imagenHero: imagen(v.media.imagenHero),
      galeria: imagenes(v.media.galeria, 'g'),
    },
    ...(v.pelicula
      ? {
          pelicula: {
            youtubeId: v.pelicula.youtubeId,
            titulo: v.pelicula.titulo,
            capitulos: capitulos(v.pelicula.capitulos),
          },
        }
      : {}),
  });
}

for (const p of proveedoresDemo) {
  documentos.push({
    _id: p._id,
    _type: 'proveedor',
    tipo: p.tipo,
    nombre: p.nombre,
    slug: slug(p.slug),
    especialidad: p.especialidad,
    resumen: p.resumen,
    estilosFotografia: p.estilosFotografia,
    orden: p.orden,
    descripcion: bloques(p.descripcion),
    servicios: lista(p.servicios),
    estilo: p.estilo,
    experiencia: p.experiencia,
    ciudadBase: p.ciudadBase,
    cobertura: p.cobertura,
    sitioWeb: p.sitioWeb,
    instagram: p.instagram,
    imagenPrincipal: imagen(p.imagenPrincipal),
    galeria: imagenes(p.galeria, 'g'),
  });
}

documentos.push({
  _id: 'disenoProduccion',
  _type: 'disenoProduccion',
  nombre: disenoDemo.nombre,
  lema: disenoDemo.lema,
  descripcion: bloques(disenoDemo.descripcion),
  imagenPrincipal: imagen(disenoDemo.imagenPrincipal),
  areas: disenoDemo.areas.map((a) => ({
    _type: 'areaDiseno',
    _key: a._key,
    nombre: a.nombre,
    descripcion: a.descripcion,
    imagenes: imagenes(a.imagenes, `${a._key}-i`),
  })),
  servicios: lista(disenoDemo.servicios),
  estilo: disenoDemo.estilo,
  experiencia: disenoDemo.experiencia,
  ciudadBase: disenoDemo.ciudadBase,
  cobertura: disenoDemo.cobertura,
  sitioWeb: disenoDemo.sitioWeb,
  instagram: disenoDemo.instagram,
});

for (const a of articulosDemo) {
  documentos.push({
    _id: a._id,
    _type: 'articulo',
    titulo: a.titulo,
    slug: slug(a.slug),
    imagenPortada: imagen(a.imagenPortada),
    extracto: a.extracto,
    cuerpo: bloques(a.cuerpo),
    fechaPublicacion: a.fechaPublicacion,
  });
}

documentos.push({
  _id: 'descubreYucatan',
  _type: 'descubreYucatan',
  titulo: descubreDemo.titulo,
  entradilla: descubreDemo.entradilla,
  imagenPrincipal: imagen(descubreDemo.imagenPrincipal),
  secciones: descubreDemo.secciones.map((s) => ({
    _type: 'seccionDescubre',
    _key: s._key,
    ancla: s.ancla,
    titulo: s.titulo,
    // Las etiquetas son opcionales: se omiten si vienen vacías.
    ...(s.etiquetas.en ? { etiquetas: s.etiquetas } : {}),
    texto: bloques(s.texto),
    imagenes: imagenes(s.imagenes, `${s._key}-i`),
  })),
});

function seccion(s: SeccionEditorial) {
  switch (s._type) {
    case 'seccionTexto':
      return { ...s, texto: bloques(s.texto) };
    case 'seccionImagen':
      return { ...s, imagen: imagen(s.imagen) };
    case 'seccionPreguntas':
      return { ...s, preguntas: s.preguntas.map((p) => ({ _type: 'pregunta', ...p })) };
    case 'seccionLlamado':
      return s;
  }
}

for (const p of paginasDemo) {
  documentos.push({
    _id: p._id,
    _type: 'paginaEditorial',
    titulo: p.titulo,
    entradilla: p.entradilla,
    ...(p.imagen ? { imagen: imagen(p.imagen) } : {}),
    secciones: p.secciones.map(seccion),
  });
}

const cfg = configuracionDemo;
documentos.push({
  _id: 'configuracionSitio',
  _type: 'configuracionSitio',
  lema: cfg.lema,
  imagenHero: imagen(cfg.imagenHero),
  queEsCurated: cfg.queEsCurated,
  descubre: {
    texto: cfg.descubre.texto,
    temas: cfg.descubre.temas.map((t) => ({
      _type: 'temaDescubre',
      ...t,
      imagen: imagen(t.imagen),
    })),
  },
  exploraCurated: {
    texto: cfg.exploraCurated.texto,
    areas: cfg.exploraCurated.areas.map((a) => ({
      _type: 'areaExplora',
      ...a,
      imagen: imagen(a.imagen),
    })),
  },
  planea: {
    texto: cfg.planea.texto,
    ...(cfg.planea.imagen ? { imagen: imagen(cfg.planea.imagen) } : {}),
  },
});

// Contactos privados (D-012): correos de ejemplo en example.com, dominio reservado para pruebas.
documentos.push({
  _id: 'privado.contactosLeads',
  _type: 'contactosLeads',
  contactos: [...venuesDemo, ...proveedoresDemo].map((d, i) => ({
    _type: 'contacto',
    _key: `c${i + 1}`,
    referencia: { _type: 'reference', _ref: d._id, _weak: true },
    correo: `demo+${d.slug}@example.com`,
  })),
});

mkdirSync(join(RAIZ, 'sanity', 'semilla'), { recursive: true });
writeFileSync(DESTINO, documentos.map((d) => JSON.stringify(d)).join('\n') + '\n');
console.log(`[semilla] ${documentos.length} documentos en sanity/semilla/demo.ndjson`);
console.log(
  '[semilla] Siguiente paso: npx sanity dataset import sanity/semilla/demo.ndjson production --replace',
);
