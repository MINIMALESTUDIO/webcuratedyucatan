import type { Entorno, InteriorExterior, Venue, VenueTarjeta } from './tipos';

/*
 * Datos calculados a partir del contenido (funciones puras, compartidas por las fuentes DEMO y
 * Sanity y probadas con Vitest).
 */

/**
 * Interior / exterior del venue a partir de sus espacios: "mixto" cuenta como ambos.
 * Sin espacios se asume exterior, el caso más común en haciendas.
 */
export function entornoDeEspacios(tipos: readonly InteriorExterior[]): Entorno {
  const interior = tipos.some((t) => t === 'interior' || t === 'mixto');
  const exterior = tipos.some((t) => t === 'exterior' || t === 'mixto');
  if (interior && exterior) return 'ambos';
  return interior ? 'interior' : 'exterior';
}

/** ¿El venue sirve para la preferencia interior o exterior? "ambos" sirve para las dos. */
export function coincideEntorno(entorno: Entorno, preferencia: 'interior' | 'exterior'): boolean {
  return entorno === 'ambos' || entorno === preferencia;
}

/** Proyección de tarjeta a partir del venue completo (fuente DEMO). */
export function aTarjeta(venue: Venue): VenueTarjeta {
  return {
    _id: venue._id,
    nombre: venue.nombre,
    slug: venue.slug,
    destacado: venue.destacado,
    coleccion: venue.coleccion,
    region: venue.region,
    localidad: venue.localidad,
    minutosCentroMerida: venue.fichaTecnica.minutosCentroMerida,
    imagen: venue.media.imagenHero,
    capacidadMax: venue.fichaTecnica.capacidadMax,
    tieneHospedaje: venue.fichaTecnica.hospedaje.tieneHospedaje,
    habitaciones: venue.fichaTecnica.hospedaje.habitaciones,
    entorno: entornoDeEspacios(venue.espacios.map((e) => e.interiorExterior)),
    atributos: venue.atributos,
  };
}

/**
 * Venues parecidos: misma colección suma 3 puntos y misma región suma 1. Si no hay
 * suficientes, se completa con los demás, primero los destacados editoriales.
 */
export function calcularSimilares(
  base: Pick<Venue, 'slug' | 'coleccion' | 'region'>,
  candidatos: readonly VenueTarjeta[],
  limite: number,
): VenueTarjeta[] {
  return candidatos
    .filter((otro) => otro.slug !== base.slug)
    .map((otro) => ({
      otro,
      puntos:
        (otro.coleccion.slug === base.coleccion.slug ? 3 : 0) +
        (otro.region.slug === base.region.slug ? 1 : 0),
    }))
    .sort(
      (a, b) =>
        b.puntos - a.puntos ||
        Number(b.otro.destacado) - Number(a.otro.destacado) ||
        a.otro.nombre.localeCompare(b.otro.nombre),
    )
    .slice(0, limite)
    .map(({ otro }) => otro);
}
