import { projectId, sanityConfigurado, studioUrl } from './configuracion';

/** Documento y ruta del campo que se abre al hacer clic en un elemento de la página. */
export interface OrigenEdicion {
  id: string;
  tipo: string;
  /**
   * Ruta del campo en el formato de la edición visual: puntos entre campos y ":clave" para
   * elementos de arreglos, p. ej. "media.imagenHero" o "media.galeria:abc123". Usa rutaElemento().
   */
  ruta: string;
}

/**
 * Atributo data-sanity para lo que stega no puede marcar (imágenes, números, videos).
 * Equivale a createDataAttribute(...).toString() de next-sanity (lo comprueba una prueba
 * unitaria) sin cargar su código en el navegador (~11 KB). Sin proyecto (modo DEMO) no agrega nada.
 */
export function atributoEdicion(origen: OrigenEdicion | undefined): string | undefined {
  if (!origen || !sanityConfigurado() || !projectId) return undefined;
  const idPublicado = origen.id.replace(/^drafts\./, '');
  return [
    ['id', idPublicado],
    ['type', origen.tipo],
    ['path', origen.ruta],
    ['base', encodeURIComponent(studioUrl)],
  ]
    .map((parte) => parte.join('='))
    .join(';');
}

/** Ruta de un elemento dentro de un arreglo de Sanity por su _key (o índice si no tiene). */
export function rutaElemento(
  arreglo: string,
  clave: string | number | undefined,
  sufijo = '',
): string {
  return clave === undefined ? arreglo : `${arreglo}:${clave}${sufijo}`;
}
