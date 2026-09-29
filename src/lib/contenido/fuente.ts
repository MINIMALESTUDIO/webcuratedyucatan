import type {
  Articulo,
  ArticuloResumen,
  Coleccion,
  ConfiguracionSitio,
  DescubreYucatan,
  DisenoProduccion,
  PaginaEditorial,
  PaginaFija,
  Proveedor,
  ProveedorResumen,
  Region,
  TipoProveedor,
  Venue,
  VenueTarjeta,
} from './tipos';

/** Tipos de documento con slugs anteriores (redirección 308, D-020). */
export type TipoConSlug = 'venue' | 'proveedor';

/** Contrato común de las fuentes de contenido: DEMO local y Sanity (D-033). */
export interface FuenteContenido {
  obtenerConfiguracionSitio(): Promise<ConfiguracionSitio>;
  obtenerColecciones(): Promise<Coleccion[]>;
  obtenerRegiones(): Promise<Region[]>;
  obtenerVenuesTarjeta(): Promise<VenueTarjeta[]>;
  obtenerVenuesDestacados(limite: number): Promise<VenueTarjeta[]>;
  /** Slugs publicados, sin stega: para generateStaticParams. */
  obtenerSlugsVenues(): Promise<string[]>;
  obtenerVenue(slug: string): Promise<Venue | null>;
  /** Slug vigente de un documento que antes usaba `slugAnterior` (redirección 308, D-020). */
  obtenerSlugActual(tipo: TipoConSlug, slugAnterior: string): Promise<string | null>;
  obtenerProveedores(tipo: TipoProveedor): Promise<ProveedorResumen[]>;
  obtenerSlugsProveedores(tipo: TipoProveedor): Promise<string[]>;
  obtenerProveedor(tipo: TipoProveedor, slug: string): Promise<Proveedor | null>;
  obtenerDisenoProduccion(): Promise<DisenoProduccion>;
  obtenerArticulos(limite?: number): Promise<ArticuloResumen[]>;
  obtenerSlugsArticulos(): Promise<string[]>;
  obtenerArticulo(slug: string): Promise<Articulo | null>;
  obtenerDescubreYucatan(): Promise<DescubreYucatan>;
  obtenerPaginaEditorial(pagina: PaginaFija): Promise<PaginaEditorial | null>;
}
