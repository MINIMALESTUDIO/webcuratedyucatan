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

/** Contrato común de las fuentes de contenido: DEMO local y Sanity (D-033). */
export interface FuenteContenido {
  obtenerConfiguracionSitio(): Promise<ConfiguracionSitio>;
  obtenerRegiones(): Promise<Region[]>;
  obtenerCategoriasProveedor(): Promise<CategoriaProveedor[]>;
  obtenerVenuesTarjeta(): Promise<VenueTarjeta[]>;
  obtenerVenuesDestacados(limite: number): Promise<VenueTarjeta[]>;
  /** Slugs publicados, sin stega: para generateStaticParams. */
  obtenerSlugsVenues(): Promise<string[]>;
  obtenerVenue(slug: string): Promise<Venue | null>;
  /** Slug vigente de un venue que antes usaba `slugAnterior` (redirección 308, D-020). */
  obtenerSlugActual(slugAnterior: string): Promise<string | null>;
  obtenerUltimoEpisodio(): Promise<Episodio | null>;
  obtenerGuiaActiva(): Promise<Guia | null>;
  obtenerHistoriasRecientes(limite: number): Promise<HistoriaResumen[]>;
}

/**
 * Venues parecidos: misma región suma 2 puntos y cada tipo en común suma 1. Si no hay
 * suficientes, se completa con los demás, primero los destacados editoriales.
 */
export function calcularSimilares(
  base: Pick<Venue, 'slug' | 'region' | 'tipos'>,
  candidatos: VenueTarjeta[],
  limite: number,
): VenueTarjeta[] {
  return candidatos
    .filter((otro) => otro.slug !== base.slug)
    .map((otro) => ({
      otro,
      puntos:
        (otro.region.slug === base.region.slug ? 2 : 0) +
        otro.tipos.filter((tipo) => base.tipos.includes(tipo)).length,
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
