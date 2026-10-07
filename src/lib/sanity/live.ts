import 'server-only';
import { defineLive } from 'next-sanity/live';
import { cliente } from './cliente';

/*
 * sanityFetch detecta el modo borrador: fuera de él lee lo publicado (con caché y etiquetas);
 * dentro, lee borradores con el token del servidor y activa stega para la edición visual.
 *
 * El token de lectura nunca se comparte con el navegador (regla 9): `browserToken: false`.
 * En "Editar en la página", la vista previa se actualiza desde el servidor.
 */
export const { sanityFetch, SanityLive } = defineLive({
  client: cliente,
  serverToken: process.env.SANITY_API_READ_TOKEN || false,
  browserToken: false,
});
