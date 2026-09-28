import 'server-only';
import { categoriasDemo } from '@/lib/demo/categorias';
import { configuracionDemo } from '@/lib/demo/configuracion';
import { episodioDemo, guiaDemo, historiasDemo } from '@/lib/demo/editorial';
import { regionesDemo } from '@/lib/demo/regiones';
import { venuesDemo } from '@/lib/demo/venues';
import type { FuenteContenido } from './fuente';
import type { Venue, VenueTarjeta } from './tipos';

/** Fuente DEMO local: se usa mientras no haya proyecto de Sanity configurado (D-007, D-033). */

function venuesPublicados(): Venue[] {
  return venuesDemo.filter((venue) => venue.publicado);
}

function aTarjeta(venue: Venue): VenueTarjeta {
  const { fichaTecnica: ficha } = venue;
  return {
    _id: venue._id,
    nombre: venue.nombre,
    slug: venue.slug,
    destacado: venue.destacado,
    nivelListado: venue.nivelListado,
    region: venue.region,
    tipos: venue.tipos,
    resumen: venue.resumen,
    imagen: venue.media.imagenHero,
    capacidadBanqueteMax: ficha.capacidadBanqueteMax,
    tieneHospedaje: ficha.hospedaje.tieneHospedaje,
    habitaciones: ficha.hospedaje.habitaciones,
    catering: ficha.catering,
    inversionDesdeUSD: ficha.inversionDesdeUSD,
    tieneEntrevista: Boolean(venue.entrevista),
  };
}

export const fuenteDemo: FuenteContenido = {
  async obtenerConfiguracionSitio() {
    return configuracionDemo;
  },
  async obtenerRegiones() {
    return [...regionesDemo].sort((a, b) => a.orden - b.orden);
  },
  async obtenerCategoriasProveedor() {
    return [...categoriasDemo].sort((a, b) => a.orden - b.orden);
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
  async obtenerSlugActual(slugAnterior) {
    return (
      venuesPublicados().find((venue) => venue.slugsAnteriores?.includes(slugAnterior))?.slug ??
      null
    );
  },
  async obtenerUltimoEpisodio() {
    return episodioDemo;
  },
  async obtenerGuiaActiva() {
    return guiaDemo.activa ? guiaDemo : null;
  },
  async obtenerHistoriasRecientes(limite) {
    return [...historiasDemo]
      .sort((a, b) => b.fechaPublicacion.localeCompare(a.fechaPublicacion))
      .slice(0, limite);
  },
};
