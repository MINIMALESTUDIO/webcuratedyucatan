import { defineQuery } from 'next-sanity';

/*
 * Consultas GROQ. Cada proyección devuelve la forma de los tipos de src/lib/contenido/tipos.ts
 * (referencias resueltas, imágenes con URL y dimensiones). Los arreglos usan coalesce(..., [])
 * y los valores null se eliminan al recibir los datos (fuente-sanity.ts).
 */

const IMAGEN = /* groq */ `{
  _key,
  "url": asset->url,
  "ancho": asset->metadata.dimensions.width,
  "alto": asset->metadata.dimensions.height,
  alt,
  "hotspot": hotspot{ x, y }
}`;

const VIDEO = /* groq */ `{ "url": asset->url, "mimeType": asset->mimeType, "pesoBytes": asset->size }`;

const RESUMEN_REGION = /* groq */ `{ nombre, "slug": slug.current }`;
const RESUMEN_COLECCION = /* groq */ `{ nombre, "slug": slug.current, resultado }`;

/** Tarjeta de venue; "entornoFicha" o "tiposEspacio" se convierten en `entorno` al recibir los datos. */
const VENUE_TARJETA = /* groq */ `{
  _id,
  nombre,
  "slug": slug.current,
  "destacado": destacado == true,
  "coleccion": coleccion->${RESUMEN_COLECCION},
  "region": region->${RESUMEN_REGION},
  localidad,
  "minutosCentroMerida": fichaTecnica.minutosCentroMerida,
  "imagen": media.imagenHero${IMAGEN},
  "capacidadMax": coalesce(fichaTecnica.capacidadMax, 0),
  "tieneHospedaje": fichaTecnica.hospedaje.tieneHospedaje == true,
  "habitaciones": fichaTecnica.hospedaje.habitaciones,
  "tiposEspacio": coalesce(espacios[].interiorExterior, []),
  "entornoFicha": fichaTecnica.entorno,
  "atributos": coalesce(atributos, [])
}`;

// Solo venues completos: sin foto, colección, región o capacidad la tarjeta no se puede dibujar.
const FILTRO_VENUE = /* groq */ `_type == "venue" && publicado != false && defined(slug.current)
  && defined(media.imagenHero.asset) && defined(coleccion._ref) && defined(region._ref)
  && defined(localidad) && defined(fichaTecnica.capacidadMax)`;

const FILTRO_PROVEEDOR = /* groq */ `_type == "proveedor" && tipo == $tipo && defined(slug.current)
  && defined(imagenPrincipal.asset)`;

export const CONSULTA_CONFIGURACION = defineQuery(`*[_id == "configuracionSitio"][0]{
  _id,
  _type,
  lema,
  "imagenHero": imagenHero${IMAGEN},
  "videoHero": { "escritorio": videoHero.escritorio${VIDEO}, "movil": videoHero.movil${VIDEO} },
  "queEsCurated": { "texto": queEsCurated.texto },
  "descubre": { "texto": descubre.texto },
  "exploraCurated": {
    "texto": exploraCurated.texto,
    "areas": coalesce(exploraCurated.areas[]{ _key, destino, texto, "imagen": imagen${IMAGEN} }, [])
  },
  "planea": { "texto": planea.texto, "imagen": planea.imagen${IMAGEN} },
  "redes": { "instagram": redes.instagram, "youtube": redes.youtube },
  correoContacto
}`);

export const CONSULTA_COLECCIONES =
  defineQuery(`*[_type == "coleccion" && defined(slug.current) && defined(imagen.asset)] | order(orden asc){
  _id, _type, nombre, "slug": slug.current, lema, descripcion, resultado,
  "imagen": imagen${IMAGEN}, "orden": coalesce(orden, 0)
}`);

export const CONSULTA_REGIONES =
  defineQuery(`*[_type == "region" && defined(slug.current)] | order(orden asc){
  _id, _type, nombre, "slug": slug.current, "orden": coalesce(orden, 0)
}`);

// --- Venues ----------------------------------------------------------------------------

export const CONSULTA_VENUES_TARJETA = defineQuery(
  `*[${FILTRO_VENUE}] | order(nombre asc)${VENUE_TARJETA}`,
);

export const CONSULTA_VENUES_DESTACADOS = defineQuery(
  `*[${FILTRO_VENUE} && destacado == true] | order(nombre asc)[0...$limite]${VENUE_TARJETA}`,
);

export const CONSULTA_SLUGS_VENUES = defineQuery(`*[${FILTRO_VENUE}].slug.current`);

/** Slug vigente de un venue a partir de un slug anterior (redirección 308, D-020). */
export const CONSULTA_SLUG_ACTUAL_VENUE = defineQuery(
  `*[${FILTRO_VENUE} && $slug in slugsAnteriores][0].slug.current`,
);

export const CONSULTA_VENUE = defineQuery(`*[${FILTRO_VENUE} && slug.current == $slug][0]{
  _id,
  _type,
  nombre,
  "slug": slug.current,
  slugsAnteriores,
  "publicado": publicado != false,
  "destacado": destacado == true,
  "coleccion": coleccion->${RESUMEN_COLECCION},
  "region": region->${RESUMEN_REGION},
  localidad,
  direccion,
  resumen,
  descripcion,
  "fichaTecnica": {
    "capacidadMax": fichaTecnica.capacidadMax,
    "capacidadDetalle": fichaTecnica.capacidadDetalle,
    "hospedaje": {
      "tieneHospedaje": fichaTecnica.hospedaje.tieneHospedaje == true,
      "habitaciones": fichaTecnica.hospedaje.habitaciones,
      "huespedesMax": fichaTecnica.hospedaje.huespedesMax,
      "descripcion": fichaTecnica.hospedaje.descripcion
    },
    "minutosCentroMerida": fichaTecnica.minutosCentroMerida,
    "kmCentroMerida": fichaTecnica.kmCentroMerida,
    "estilo": fichaTecnica.estilo,
    "interiorExterior": fichaTecnica.interiorExterior,
    "entorno": fichaTecnica.entorno
  },
  "espacios": coalesce(espacios[]{
    _key, nombre, descripcion, interiorExterior, capacidad,
    "imagenes": coalesce(imagenes[]${IMAGEN}, [])
  }, []),
  "notasCurated": coalesce(notasCurated[]{ _key, titulo, texto }, []),
  "atributos": coalesce(atributos, []),
  "media": {
    "imagenHero": media.imagenHero${IMAGEN},
    "videoLoop": media.videoLoop${VIDEO},
    "videoLoopMovil": media.videoLoopMovil${VIDEO},
    "galeria": coalesce(media.galeria[]${IMAGEN}, [])
  },
  "pelicula": select(
    defined(pelicula.youtubeId) => {
      "youtubeId": pelicula.youtubeId,
      "titulo": coalesce(pelicula.titulo, { "en": nombre }),
      "capitulos": coalesce(pelicula.capitulos[]{ _key, titulo, segundoInicio }, [])
    }
  ),
  seo{ titulo, descripcion, "imagenOG": imagenOG${IMAGEN} }
}`);

// --- Catering y Photography ------------------------------------------------------------

export const CONSULTA_PROVEEDORES =
  defineQuery(`*[${FILTRO_PROVEEDOR}] | order(orden asc, nombre asc){
  _id, tipo, nombre, "slug": slug.current, especialidad, resumen,
  "estilosFotografia": coalesce(estilosFotografia, []),
  "imagen": imagenPrincipal${IMAGEN}
}`);

export const CONSULTA_SLUGS_PROVEEDORES = defineQuery(`*[${FILTRO_PROVEEDOR}].slug.current`);

export const CONSULTA_SLUG_ACTUAL_PROVEEDOR = defineQuery(
  `*[_type == "proveedor" && defined(slug.current) && $slug in slugsAnteriores][0].slug.current`,
);

export const CONSULTA_PROVEEDOR = defineQuery(`*[${FILTRO_PROVEEDOR} && slug.current == $slug][0]{
  _id, _type, tipo, nombre, "slug": slug.current, slugsAnteriores,
  especialidad, resumen, descripcion,
  "servicios": coalesce(servicios[]{ _key, texto }, []),
  estilo,
  "estilosFotografia": coalesce(estilosFotografia, []),
  ciudadBase, cobertura, experiencia, sitioWeb, instagram,
  "logotipo": logotipo${IMAGEN},
  "imagenPrincipal": imagenPrincipal${IMAGEN},
  "galeria": coalesce(galeria[]${IMAGEN}, []),
  "orden": coalesce(orden, 0),
  seo{ titulo, descripcion, "imagenOG": imagenOG${IMAGEN} }
}`);

export const CONSULTA_DISENO = defineQuery(`*[_id == "disenoProduccion"][0]{
  _id, _type, nombre, lema, descripcion,
  "imagenPrincipal": imagenPrincipal${IMAGEN},
  "areas": coalesce(areas[]{ _key, nombre, descripcion, "imagenes": coalesce(imagenes[]${IMAGEN}, []) }, []),
  "servicios": coalesce(servicios[]{ _key, texto }, []),
  estilo, experiencia, ciudadBase, cobertura, sitioWeb, instagram,
  "logotipo": logotipo${IMAGEN}
}`);

// --- Curated Journal ---------------------------------------------------------------------

/** El tiempo de lectura se calcula del cuerpo en inglés: ~1000 caracteres por minuto. */
const ARTICULO_RESUMEN = /* groq */ `
  _id, titulo, "slug": slug.current,
  "imagenPortada": imagenPortada${IMAGEN},
  extracto,
  fechaPublicacion,
  "tiempoLectura": select(length(pt::text(cuerpo.en)) > 1000 => round(length(pt::text(cuerpo.en)) / 1000), 1)`;

const FILTRO_ARTICULO = /* groq */ `_type == "articulo" && defined(slug.current) && defined(imagenPortada.asset)`;

export const CONSULTA_ARTICULOS = defineQuery(
  `*[${FILTRO_ARTICULO}] | order(fechaPublicacion desc)[0...$limite]{${ARTICULO_RESUMEN}}`,
);

export const CONSULTA_SLUGS_ARTICULOS = defineQuery(`*[${FILTRO_ARTICULO}].slug.current`);

export const CONSULTA_ARTICULO = defineQuery(`*[${FILTRO_ARTICULO} && slug.current == $slug][0]{
  _type, ${ARTICULO_RESUMEN},
  cuerpo,
  seo{ titulo, descripcion, "imagenOG": imagenOG${IMAGEN} }
}`);

// --- Discover Yucatán y páginas editoriales -------------------------------------------------

export const CONSULTA_DESCUBRE = defineQuery(`*[_id == "descubreYucatan"][0]{
  _id, _type, titulo, entradilla,
  "imagenPrincipal": imagenPrincipal${IMAGEN}
}`);

// Categorías completas: sin imagen principal la portada y las tarjetas no se pueden dibujar.
const FILTRO_CATEGORIA = /* groq */ `_type == "categoriaDescubre" && defined(slug.current)
  && defined(imagenPrincipal.asset)`;

const CATEGORIA_RESUMEN = /* groq */ `_id, titulo, "slug": slug.current,
  "orden": coalesce(orden, 0), resumen, "imagenPrincipal": imagenPrincipal${IMAGEN}`;

export const CONSULTA_CATEGORIAS_DESCUBRE = defineQuery(
  `*[${FILTRO_CATEGORIA}] | order(orden asc){ ${CATEGORIA_RESUMEN} }`,
);

export const CONSULTA_SLUGS_CATEGORIAS_DESCUBRE = defineQuery(
  `*[${FILTRO_CATEGORIA}].slug.current`,
);

// En "relacionadas", los paréntesis hacen que el filtro se aplique a los documentos ya
// resueltos; sin ellos, GROQ lo toma como acceso a un atributo y devuelve null.
export const CONSULTA_CATEGORIA_DESCUBRE =
  defineQuery(`*[${FILTRO_CATEGORIA} && slug.current == $slug][0]{
  _type, ${CATEGORIA_RESUMEN},
  titular, entradilla,
  "secciones": coalesce(secciones[]{ _key, titulo, texto, "imagenes": coalesce(imagenes[]${IMAGEN}, []) }, []),
  "relacionadas": coalesce((relacionadas[]->)[${FILTRO_CATEGORIA}]{ ${CATEGORIA_RESUMEN} }, []),
  seo{ titulo, descripcion, "imagenOG": imagenOG${IMAGEN} }
}`);

export const CONSULTA_PAGINA_EDITORIAL = defineQuery(`*[_id == $id][0]{
  _id, _type, titulo, entradilla,
  "imagen": imagen${IMAGEN},
  "secciones": coalesce(secciones[]{
    ...,
    _type == "seccionImagen" => { "imagen": imagen${IMAGEN} },
    _type == "seccionPreguntas" => { "preguntas": coalesce(preguntas[]{ _key, pregunta, respuesta }, []) }
  }, []),
  seo{ titulo, descripcion, "imagenOG": imagenOG${IMAGEN} }
}`);
