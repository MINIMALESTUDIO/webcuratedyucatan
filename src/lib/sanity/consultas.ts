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

const REGION_RESUMEN = /* groq */ `{ nombre, "slug": slug.current }`;

const VENUE_TARJETA = /* groq */ `{
  _id,
  nombre,
  "slug": slug.current,
  destacado,
  nivelListado,
  "region": region->${REGION_RESUMEN},
  "tipos": coalesce(tipos, []),
  resumen,
  "imagen": media.imagenHero${IMAGEN},
  "capacidadBanqueteMax": coalesce(fichaTecnica.capacidadBanqueteMax, 0),
  "tieneHospedaje": fichaTecnica.hospedaje.tieneHospedaje == true,
  "habitaciones": fichaTecnica.hospedaje.habitaciones,
  "catering": fichaTecnica.catering,
  "inversionDesdeUSD": fichaTecnica.inversionDesdeUSD,
  "tieneEntrevista": nivelListado != "basico" && defined(entrevista.youtubeId)
}`;

// Solo venues completos: sin foto principal, región o ficha técnica, la tarjeta no se puede dibujar.
const FILTRO_VENUE = /* groq */ `_type == "venue" && publicado != false && defined(slug.current)
  && defined(media.imagenHero.asset) && defined(region._ref) && defined(fichaTecnica.capacidadBanqueteMax)`;

export const CONSULTA_CONFIGURACION = defineQuery(`*[_id == "configuracionSitio"][0]{
  _id,
  _type,
  fraseHero,
  subtituloHero,
  "imagenHero": imagenHero${IMAGEN},
  "videoHero": { "escritorio": videoHero.escritorio${VIDEO}, "movil": videoHero.movil${VIDEO} },
  "porQueYucatan": {
    "titulo": porQueYucatan.titulo,
    "entradilla": porQueYucatan.entradilla,
    "puntos": coalesce(porQueYucatan.puntos[]{ _key, titulo, texto }, [])
  },
  "sello": {
    "titulo": sello.titulo,
    "texto": sello.texto,
    "pasos": coalesce(sello.pasos[]{ _key, titulo, texto }, [])
  },
  "tradiciones": {
    "titulo": tradiciones.titulo,
    "entradilla": tradiciones.entradilla,
    "elementos": coalesce(tradiciones.elementos[]{ _key, titulo, texto, "imagen": imagen${IMAGEN} }, [])
  },
  "metricas": {
    "venuesVisitados": coalesce(metricas.venuesVisitados, 0),
    "horasEntrevista": coalesce(metricas.horasEntrevista, 0),
    "edicionesImpresas": coalesce(metricas.edicionesImpresas, 0)
  },
  "redes": { "instagram": redes.instagram, "youtube": redes.youtube },
  correoContacto
}`);

export const CONSULTA_REGIONES =
  defineQuery(`*[_type == "region" && defined(slug.current) && defined(imagen.asset)] | order(orden asc){
  _id, _type, nombre, "slug": slug.current, descripcion, "imagen": imagen${IMAGEN}, "orden": coalesce(orden, 0)
}`);

export const CONSULTA_CATEGORIAS =
  defineQuery(`*[_type == "categoriaProveedor" && defined(slug.current)] | order(orden asc){
  _id, _type, nombre, "slug": slug.current, icono, "orden": coalesce(orden, 0)
}`);

export const CONSULTA_VENUES_TARJETA = defineQuery(
  `*[${FILTRO_VENUE}] | order(nombre asc)${VENUE_TARJETA}`,
);

export const CONSULTA_VENUES_DESTACADOS = defineQuery(
  `*[${FILTRO_VENUE} && destacado == true] | order(nombre asc)[0...$limite]${VENUE_TARJETA}`,
);

export const CONSULTA_SLUGS_VENUES = defineQuery(`*[${FILTRO_VENUE}].slug.current`);

/** Slug vigente de un venue a partir de un slug anterior (redirección 308, D-020). */
export const CONSULTA_SLUG_ACTUAL = defineQuery(
  `*[${FILTRO_VENUE} && $slug in slugsAnteriores][0].slug.current`,
);

export const CONSULTA_VENUE = defineQuery(`*[${FILTRO_VENUE} && slug.current == $slug][0]{
  _id,
  _type,
  nombre,
  "slug": slug.current,
  slugsAnteriores,
  destacado,
  nivelListado,
  publicado,
  "region": region->${REGION_RESUMEN},
  "tipos": coalesce(tipos, []),
  resumen,
  descripcion,
  fichaTecnica,
  "media": {
    "imagenHero": media.imagenHero${IMAGEN},
    "videoLoop": media.videoLoop${VIDEO},
    "videoLoopMovil": media.videoLoopMovil${VIDEO},
    "galeria": coalesce(media.galeria[]${IMAGEN}, [])
  },
  "entrevista": select(
    nivelListado != "basico" && defined(entrevista.youtubeId) => {
      "youtubeId": entrevista.youtubeId,
      "titulo": coalesce(entrevista.titulo, { "en": nombre }),
      "capitulos": coalesce(entrevista.capitulos[]{ _key, titulo, segundoInicio }, [])
    }
  ),
  "citasDestacadas": coalesce(citasDestacadas[]{ _key, texto, autor, cargo }, []),
  "espacios": coalesce(espacios[]{
    _key, nombre, descripcion, interiorExterior,
    capacidadCeremonia, capacidadCoctel, capacidadBanquete,
    "imagenes": coalesce(imagenes[]${IMAGEN}, [])
  }, []),
  "proveedoresRecomendados": coalesce(proveedoresRecomendados[]->{
    _id, nombre, "slug": slug.current,
    "categoria": categoria->{ nombre, "slug": slug.current, icono },
    resumen,
    "imagen": imagenes[0]${IMAGEN}
  }, []),
  seo{ titulo, descripcion, "imagenOG": imagenOG${IMAGEN} }
}`);

export const CONSULTA_ULTIMO_EPISODIO =
  defineQuery(`*[_type == "episodio"] | order(fechaPublicacion desc)[0]{
  _id, _type, titulo, youtubeId, descripcion,
  "capitulos": coalesce(capitulos[]{ _key, titulo, segundoInicio }, []),
  "venue": venue->{ nombre, "slug": slug.current },
  fechaPublicacion
}`);

export const CONSULTA_GUIA_ACTIVA =
  defineQuery(`*[_type == "guia" && activa == true] | order(edicion desc)[0]{
  _id, _type, edicion,
  "portada": portada${IMAGEN},
  "archivoPDF": { "en": archivoPDF.en.asset->url, "es": archivoPDF.es.asset->url },
  "paginasMuestra": coalesce(paginasMuestra[]${IMAGEN}, []),
  descripcion,
  activa
}`);

/** El tiempo de lectura se calcula del cuerpo en inglés: ~1000 caracteres por minuto. */
export const CONSULTA_HISTORIAS_RECIENTES =
  defineQuery(`*[_type == "historia" && defined(slug.current)]
  | order(fechaPublicacion desc)[0...$limite]{
    _id, titulo, "slug": slug.current, tipo,
    "imagenPortada": imagenPortada${IMAGEN},
    extracto,
    fechaPublicacion,
    "tiempoLectura": select(length(pt::text(cuerpo.en)) > 1000 => round(length(pt::text(cuerpo.en)) / 1000), 1)
  }`);
