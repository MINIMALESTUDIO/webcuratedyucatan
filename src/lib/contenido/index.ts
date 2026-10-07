import 'server-only';
import { sanityConfigurado } from '@/lib/sanity/configuracion';
import { calcularSimilares } from './derivados';
import type { FuenteContenido, TipoConSlug } from './fuente';
import type { PaginaFija, TipoProveedor, Venue } from './tipos';

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

export async function obtenerColecciones() {
  return (await fuente()).obtenerColecciones();
}

export async function obtenerRegiones() {
  return (await fuente()).obtenerRegiones();
}

export async function obtenerVenuesTarjeta() {
  return (await fuente()).obtenerVenuesTarjeta();
}

/** Venues con la marca editorial `destacado` (D-015): el inicio muestra de 4 a 6. */
export async function obtenerVenuesDestacados(limite = 6) {
  return (await fuente()).obtenerVenuesDestacados(limite);
}

export async function obtenerSlugsVenues() {
  return (await fuente()).obtenerSlugsVenues();
}

export async function obtenerVenue(slug: string) {
  return (await fuente()).obtenerVenue(slug);
}

export async function obtenerSlugActual(tipo: TipoConSlug, slugAnterior: string) {
  return (await fuente()).obtenerSlugActual(tipo, slugAnterior);
}

export async function obtenerVenuesSimilares(venue: Venue, limite = 3) {
  return calcularSimilares(venue, await obtenerVenuesTarjeta(), limite);
}

export async function obtenerProveedores(tipo: TipoProveedor) {
  return (await fuente()).obtenerProveedores(tipo);
}

export async function obtenerSlugsProveedores(tipo: TipoProveedor) {
  return (await fuente()).obtenerSlugsProveedores(tipo);
}

export async function obtenerProveedor(tipo: TipoProveedor, slug: string) {
  return (await fuente()).obtenerProveedor(tipo, slug);
}

export async function obtenerDisenoProduccion() {
  return (await fuente()).obtenerDisenoProduccion();
}

export async function obtenerArticulos(limite?: number) {
  return (await fuente()).obtenerArticulos(limite);
}

export async function obtenerSlugsArticulos() {
  return (await fuente()).obtenerSlugsArticulos();
}

export async function obtenerArticulo(slug: string) {
  return (await fuente()).obtenerArticulo(slug);
}

export async function obtenerDescubreYucatan() {
  return (await fuente()).obtenerDescubreYucatan();
}

export async function obtenerCategoriasDescubre() {
  return (await fuente()).obtenerCategoriasDescubre();
}

export async function obtenerSlugsCategoriasDescubre() {
  return (await fuente()).obtenerSlugsCategoriasDescubre();
}

export async function obtenerCategoriaDescubre(slug: string) {
  return (await fuente()).obtenerCategoriaDescubre(slug);
}

export async function obtenerPaginaEditorial(pagina: PaginaFija) {
  return (await fuente()).obtenerPaginaEditorial(pagina);
}
