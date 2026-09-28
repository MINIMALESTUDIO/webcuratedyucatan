import 'server-only';
import { categoriasDemo } from '@/lib/demo/categorias';
import { configuracionDemo } from '@/lib/demo/configuracion';
import { episodioDemo, guiaDemo, historiasDemo } from '@/lib/demo/editorial';
import { regionesDemo } from '@/lib/demo/regiones';
import { venuesDemo } from '@/lib/demo/venues';
import type {
  CategoriaProveedor,
  ConfiguracionSitio,
  Episodio,
  Guia,
  HistoriaResumen,
  Region,
  Venue,
  VenueTarjeta,
} from './tipos';

/*
 * Fuente de contenido del piloto (D-007): datos DEMO locales.
 * En la fase de CMS estas funciones pasan a hacer consultas GROQ a Sanity con la misma firma;
 * los componentes no cambian.
 */

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

export async function obtenerConfiguracionSitio(): Promise<ConfiguracionSitio> {
  return configuracionDemo;
}

export async function obtenerRegiones(): Promise<Region[]> {
  return [...regionesDemo].sort((a, b) => a.orden - b.orden);
}

export async function obtenerCategoriasProveedor(): Promise<CategoriaProveedor[]> {
  return [...categoriasDemo].sort((a, b) => a.orden - b.orden);
}

export async function obtenerVenuesTarjeta(): Promise<VenueTarjeta[]> {
  return venuesPublicados().map(aTarjeta);
}

/** Venues con la marca editorial `destacado` (D-015), para el home. */
export async function obtenerVenuesDestacados(limite = 4): Promise<VenueTarjeta[]> {
  return venuesPublicados()
    .filter((venue) => venue.destacado)
    .slice(0, limite)
    .map(aTarjeta);
}

export async function obtenerSlugsVenues(): Promise<string[]> {
  return venuesPublicados().map((venue) => venue.slug);
}

export async function obtenerVenue(slug: string): Promise<Venue | null> {
  return venuesPublicados().find((venue) => venue.slug === slug) ?? null;
}

/**
 * Misma región suma 2 puntos y cada tipo en común suma 1. Si no hay suficientes parecidos,
 * se completa con los demás venues, primero los destacados editoriales.
 */
export async function obtenerVenuesSimilares(venue: Venue, limite = 3): Promise<VenueTarjeta[]> {
  return venuesPublicados()
    .filter((otro) => otro.slug !== venue.slug)
    .map((otro) => ({
      otro,
      puntos:
        (otro.region.slug === venue.region.slug ? 2 : 0) +
        otro.tipos.filter((tipo) => venue.tipos.includes(tipo)).length,
    }))
    .sort(
      (a, b) =>
        b.puntos - a.puntos ||
        Number(b.otro.destacado) - Number(a.otro.destacado) ||
        a.otro.nombre.localeCompare(b.otro.nombre),
    )
    .slice(0, limite)
    .map(({ otro }) => aTarjeta(otro));
}

export async function obtenerUltimoEpisodio(): Promise<Episodio | null> {
  return episodioDemo;
}

export async function obtenerGuiaActiva(): Promise<Guia | null> {
  return guiaDemo.activa ? guiaDemo : null;
}

export async function obtenerHistoriasRecientes(limite = 3): Promise<HistoriaResumen[]> {
  return [...historiasDemo]
    .sort((a, b) => b.fechaPublicacion.localeCompare(a.fechaPublicacion))
    .slice(0, limite);
}
