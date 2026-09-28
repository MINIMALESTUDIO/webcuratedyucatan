import 'server-only';
import { sanityConfigurado } from '@/lib/sanity/configuracion';
import { calcularSimilares, type FuenteContenido } from './fuente';
import type { Venue } from './tipos';

/*
 * Punto único de acceso al contenido (D-007, D-033). Con NEXT_PUBLIC_SANITY_PROJECT_ID se lee
 * de Sanity; sin él, de los datos DEMO locales. Los componentes no saben de dónde viene.
 * La fuente se carga con import() para que el modo DEMO no cargue el cliente de Sanity.
 */

async function fuente(): Promise<FuenteContenido> {
  return sanityConfigurado()
    ? (await import('./fuente-sanity')).fuenteSanity
    : (await import('./fuente-demo')).fuenteDemo;
}

export async function obtenerConfiguracionSitio() {
  return (await fuente()).obtenerConfiguracionSitio();
}

export async function obtenerRegiones() {
  return (await fuente()).obtenerRegiones();
}

export async function obtenerCategoriasProveedor() {
  return (await fuente()).obtenerCategoriasProveedor();
}

export async function obtenerVenuesTarjeta() {
  return (await fuente()).obtenerVenuesTarjeta();
}

/** Venues con la marca editorial `destacado` (D-015), para el inicio. */
export async function obtenerVenuesDestacados(limite = 4) {
  return (await fuente()).obtenerVenuesDestacados(limite);
}

export async function obtenerSlugsVenues() {
  return (await fuente()).obtenerSlugsVenues();
}

export async function obtenerVenue(slug: string) {
  return (await fuente()).obtenerVenue(slug);
}

export async function obtenerSlugActual(slugAnterior: string) {
  return (await fuente()).obtenerSlugActual(slugAnterior);
}

export async function obtenerVenuesSimilares(venue: Venue, limite = 3) {
  return calcularSimilares(venue, await obtenerVenuesTarjeta(), limite);
}

export async function obtenerUltimoEpisodio() {
  return (await fuente()).obtenerUltimoEpisodio();
}

export async function obtenerGuiaActiva() {
  return (await fuente()).obtenerGuiaActiva();
}

export async function obtenerHistoriasRecientes(limite = 3) {
  return (await fuente()).obtenerHistoriasRecientes(limite);
}
