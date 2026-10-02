import 'server-only';
import { coleccionesDemo } from '@/lib/demo/colecciones';
import { configuracionDemo } from '@/lib/demo/configuracion';
import { disenoDemo } from '@/lib/demo/diseno';
import { categoriasDescubreDemo, descubreDemo } from '@/lib/demo/descubre';
import { articulosDemo, paginasDemo } from '@/lib/demo/editorial';
import { proveedoresDemo, resumenProveedor } from '@/lib/demo/proveedores';
import { regionesDemo } from '@/lib/demo/regiones';
import { venuesDemo } from '@/lib/demo/venues';
import { aTarjeta } from './derivados';
import type { FuenteContenido } from './fuente';
import { PAGINAS_FIJAS, type Articulo, type ArticuloResumen, type Venue } from './tipos';

/** Fuente DEMO local: se usa mientras no haya proyecto de Sanity configurado (D-007, D-033). */

function venuesPublicados(): Venue[] {
  return venuesDemo.filter((venue) => venue.publicado);
}

function proveedoresDe(tipo: string) {
  return proveedoresDemo.filter((p) => p.tipo === tipo).sort((a, b) => a.orden - b.orden);
}

function aResumen(articulo: Articulo): ArticuloResumen {
  const { _id, titulo, slug, imagenPortada, extracto, fechaPublicacion, tiempoLectura } = articulo;
  return { _id, titulo, slug, imagenPortada, extracto, fechaPublicacion, tiempoLectura };
}

export const fuenteDemo: FuenteContenido = {
  async obtenerConfiguracionSitio() {
    return configuracionDemo;
  },
  async obtenerColecciones() {
    return [...coleccionesDemo].sort((a, b) => a.orden - b.orden);
  },
  async obtenerRegiones() {
    return [...regionesDemo].sort((a, b) => a.orden - b.orden);
  },
  async obtenerVenuesTarjeta() {
    return venuesPublicados().map(aTarjeta);
  },
  async obtenerVenuesDestacados(limite) {
    return venuesPublicados()
      .filter((venue) => venue.destacado)
      .slice(0, limite)
      .map(aTarjeta);
  },
  async obtenerSlugsVenues() {
    return venuesPublicados().map((venue) => venue.slug);
  },
  async obtenerVenue(slug) {
    return venuesPublicados().find((venue) => venue.slug === slug) ?? null;
  },
  async obtenerSlugActual(tipo, slugAnterior) {
    const documentos = tipo === 'venue' ? venuesPublicados() : proveedoresDemo;
    return documentos.find((d) => d.slugsAnteriores?.includes(slugAnterior))?.slug ?? null;
  },
  async obtenerProveedores(tipo) {
    return proveedoresDe(tipo).map(resumenProveedor);
  },
  async obtenerSlugsProveedores(tipo) {
    return proveedoresDe(tipo).map((p) => p.slug);
  },
  async obtenerProveedor(tipo, slug) {
    return proveedoresDe(tipo).find((p) => p.slug === slug) ?? null;
  },
  async obtenerDisenoProduccion() {
    return disenoDemo;
  },
  async obtenerArticulos(limite) {
    const ordenados = [...articulosDemo]
      .sort((a, b) => b.fechaPublicacion.localeCompare(a.fechaPublicacion))
      .map(aResumen);
    return limite ? ordenados.slice(0, limite) : ordenados;
  },
  async obtenerSlugsArticulos() {
    return articulosDemo.map((a) => a.slug);
  },
  async obtenerArticulo(slug) {
    return articulosDemo.find((a) => a.slug === slug) ?? null;
  },
  async obtenerDescubreYucatan() {
    return descubreDemo;
  },
  async obtenerCategoriasDescubre() {
    return categoriasDescubreDemo
      .map(({ _id, titulo, slug, orden, resumen, imagenPrincipal }) => ({
        _id,
        titulo,
        slug,
        orden,
        resumen,
        imagenPrincipal,
      }))
      .sort((a, b) => a.orden - b.orden);
  },
  async obtenerSlugsCategoriasDescubre() {
    return categoriasDescubreDemo.map((c) => c.slug);
  },
  async obtenerCategoriaDescubre(slug) {
    return categoriasDescubreDemo.find((c) => c.slug === slug) ?? null;
  },
  async obtenerPaginaEditorial(pagina) {
    return paginasDemo.find((p) => p._id === PAGINAS_FIJAS[pagina]) ?? null;
  },
};
