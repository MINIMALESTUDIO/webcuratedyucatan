// Convierte los datos DEMO locales en documentos de Sanity (NDJSON) con sus imágenes.
// Uso:
//   npm run sanity:semilla
//   npx sanity dataset import sanity/semilla/demo.ndjson --dataset production --replace
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
import { categoriasDescubreDemo, descubreDemo } from '../src/lib/demo/descubre';
import { articulosDemo, paginasDemo } from '../src/lib/demo/editorial';
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
  elementos.map((e) => ({
    _type: 'elementoLista',
    _key: e._key,
    texto: e.texto,
    ...(e.detalle ? { detalle: e.detalle } : {}),
  }));
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
    direccion: v.direccion,
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
    ...(p.notasCurated ? { notasCurated: bloques(p.notasCurated) } : {}),
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
  titular: disenoDemo.titular,
  entradilla: disenoDemo.entradilla,
  imagenPrincipal: imagen(disenoDemo.imagenPrincipal),
  introduccion: {
    titulo: disenoDemo.introduccion.titulo,
    texto: bloques(disenoDemo.introduccion.texto),
  },
  marcas: disenoDemo.marcas.map((m) => ({
    _type: 'marcaDiseno',
    _key: m._key,
    nombre: m.nombre,
    categoria: m.categoria,
    titular: m.titular,
    descripcion: bloques(m.descripcion),
    servicios: lista(m.servicios),
    ...(m.notasCurated ? { notasCurated: bloques(m.notasCurated) } : {}),
    imagenes: imagenes(m.imagenes, `${m._key}-i`),
    ...(m.sitioWeb ? { sitioWeb: m.sitioWeb } : {}),
  })),
  experienciaDestino: {
    ...disenoDemo.experienciaDestino,
    texto: bloques(disenoDemo.experienciaDestino.texto),
  },
  cierre: disenoDemo.cierre,
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
});

// Páginas de categoría de Discover Yucatán (D-048).
for (const c of categoriasDescubreDemo) {
  documentos.push({
    _id: c._id,
    _type: 'categoriaDescubre',
    titulo: c.titulo,
    slug: slug(c.slug),
    orden: c.orden,
    resumen: c.resumen,
    imagenPrincipal: imagen(c.imagenPrincipal),
    titular: c.titular,
    entradilla: c.entradilla,
    secciones: c.secciones.map((seccion) => ({
      _type: 'seccionCategoria',
      _key: seccion._key,
      titulo: seccion.titulo,
      texto: bloques(seccion.texto),
      imagenes: imagenes(seccion.imagenes, `${seccion._key}-i`),
    })),
    relacionadas: c.relacionadas.map((r) => ({ ...referencia(r._id), _key: r._id })),
  });
}

function seccion(s: SeccionEditorial) {
  switch (s._type) {
    case 'seccionTexto':
      return { ...s, texto: bloques(s.texto) };
    case 'seccionImagen':
      return { ...s, imagen: imagen(s.imagen) };
    case 'seccionPreguntas':
      return { ...s, preguntas: s.preguntas.map((p) => ({ _type: 'pregunta', ...p })) };
    case 'seccionEnlaces':
      return { ...s, enlaces: s.enlaces.map((e) => ({ _type: 'enlaceSeccion', ...e })) };
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
  descubre: { texto: cfg.descubre.texto },
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
  '[semilla] Siguiente paso: npx sanity dataset import sanity/semilla/demo.ndjson --dataset production --replace',
);
