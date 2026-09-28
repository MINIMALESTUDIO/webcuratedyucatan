/*
 * Tipos de contenido con la forma que tendrán los documentos de Sanity (sección 6 de
 * docs/PROMPT.md, decisión D-007).
 *
 * Representan el resultado de las consultas GROQ ya proyectadas:
 * - las referencias vienen resueltas (p. ej. `region` trae nombre y slug);
 * - `slug` es el valor de `slug.current`;
 * - las imágenes traen URL, dimensiones y texto alternativo (`asset->url`,
 *   `asset->metadata.dimensions`).
 * En la fase de CMS solo cambia la implementación de src/lib/contenido/index.ts.
 */

export type Idioma = 'en' | 'es';

/** Campo bilingüe. El inglés es obligatorio; si falta el español se muestra el inglés (D-008). */
export interface TextoLocalizado {
  en: string;
  es?: string;
}

/** Subconjunto de Portable Text que usa el piloto. */
export interface BloqueTexto {
  _type: 'block';
  _key: string;
  style: 'normal' | 'h3';
  children: Array<{ _type: 'span'; _key: string; text: string }>;
}

export interface BloquesLocalizados {
  en: BloqueTexto[];
  es?: BloqueTexto[];
}

export interface Imagen {
  url: string;
  ancho: number;
  alto: number;
  /** Texto alternativo obligatorio. */
  alt: TextoLocalizado;
  /** Imagen de relleno del piloto: la interfaz la marca como "[DEMO] Foto pendiente". */
  esDemo?: boolean;
}

export interface ArchivoVideo {
  url: string;
  mimeType: 'video/mp4' | 'video/webm';
  /** Tope aprobado: 2 MB escritorio y 1 MB móvil (D-014). */
  pesoBytes: number;
}

export interface Seo {
  titulo?: TextoLocalizado;
  descripcion?: TextoLocalizado;
  imagenOG?: Imagen;
}

// --- Región ------------------------------------------------------------------

export interface Region {
  _id: string;
  _type: 'region';
  nombre: TextoLocalizado;
  slug: string;
  descripcion: TextoLocalizado;
  imagen: Imagen;
  orden: number;
}

export type RegionResumen = Pick<Region, 'nombre' | 'slug'>;

// --- Proveedores -------------------------------------------------------------

export type IconoCategoria =
  | 'planner'
  | 'camara'
  | 'flor'
  | 'silla'
  | 'musica'
  | 'banquete'
  | 'belleza'
  | 'transporte'
  | 'hospedaje';

export interface CategoriaProveedor {
  _id: string;
  _type: 'categoriaProveedor';
  nombre: TextoLocalizado;
  slug: string;
  icono: IconoCategoria;
  orden: number;
}

export interface Proveedor {
  _id: string;
  _type: 'proveedor';
  /** Nombre propio: no se traduce (D-008). */
  nombre: string;
  slug: string;
  slugsAnteriores?: string[];
  categoria: Pick<CategoriaProveedor, 'nombre' | 'slug' | 'icono'>;
  resumen: TextoLocalizado;
  descripcion: BloquesLocalizados;
  imagenes: Imagen[];
  sitioWeb?: string;
  instagram?: string;
  regionesQueCubre: RegionResumen[];
  destacado: boolean;
  seo?: Seo;
  // `contactoLeads` no forma parte del contenido público: vive en documentos privado.* (D-012).
}

export type ProveedorResumen = Pick<
  Proveedor,
  '_id' | 'nombre' | 'slug' | 'categoria' | 'resumen'
> & {
  imagen: Imagen;
};

// --- Venues ------------------------------------------------------------------

export type TipoVenue =
  'hacienda' | 'ciudad-colonial' | 'playa' | 'cenote-selva' | 'boutique' | 'otro';
export type NivelListado = 'basico' | 'video' | 'destacado';
export type TipoCatering = 'propio' | 'externo' | 'ambos';
export type InteriorExterior = 'interior' | 'exterior' | 'mixto';

export const TIPOS_VENUE: readonly TipoVenue[] = [
  'hacienda',
  'ciudad-colonial',
  'playa',
  'cenote-selva',
  'boutique',
  'otro',
];

export interface FichaTecnica {
  capacidadCeremoniaMax: number;
  capacidadCoctelMax: number;
  capacidadBanqueteMax: number;
  hospedaje: {
    tieneHospedaje: boolean;
    habitaciones?: number;
    huespedesMax?: number;
  };
  catering: TipoCatering;
  horarioLimiteMusica: TextoLocalizado;
  minutosAeropuertoMID: number;
  minutosCentroMerida: number;
  inversionDesdeUSD?: number;
  mejorTemporada: TextoLocalizado;
  ubicacion: { lat: number; lng: number };
}

export interface Capitulo {
  _key: string;
  titulo: TextoLocalizado;
  segundoInicio: number;
}

export interface Entrevista {
  youtubeId: string;
  /** Título del video, para el iframe y la miniatura. */
  titulo: TextoLocalizado;
  capitulos: Capitulo[];
  /** Solo en el piloto: el video no es una entrevista real (D-007). */
  esDemo?: boolean;
}

export interface Cita {
  _key: string;
  texto: TextoLocalizado;
  autor: string;
  cargo: TextoLocalizado;
}

export interface Espacio {
  _key: string;
  nombre: TextoLocalizado;
  descripcion: TextoLocalizado;
  interiorExterior: InteriorExterior;
  capacidadCeremonia?: number;
  capacidadCoctel?: number;
  capacidadBanquete?: number;
  imagenes: Imagen[];
}

export interface Venue {
  _id: string;
  _type: 'venue';
  /** Nombre propio: no se traduce (D-008). */
  nombre: string;
  slug: string;
  slugsAnteriores?: string[];
  /** Decisión editorial: aparece en el home (D-015). */
  destacado: boolean;
  /** Plan comercial: bloques visibles y prioridad en el orden "destacados" (D-015). */
  nivelListado: NivelListado;
  publicado: boolean;
  region: RegionResumen;
  tipos: TipoVenue[];
  /** Máximo 200 caracteres. */
  resumen: TextoLocalizado;
  descripcion: BloquesLocalizados;
  fichaTecnica: FichaTecnica;
  media: {
    imagenHero: Imagen;
    videoLoop?: ArchivoVideo;
    videoLoopMovil?: ArchivoVideo;
    galeria: Imagen[];
  };
  entrevista?: Entrevista;
  citasDestacadas: Cita[];
  espacios: Espacio[];
  proveedoresRecomendados: ProveedorResumen[];
  seo?: Seo;
  // `contactoLeads` no forma parte del contenido público: vive en documentos privado.* (D-012).
}

/** Proyección para tarjetas y para el listado con filtros. */
export interface VenueTarjeta {
  _id: string;
  nombre: string;
  slug: string;
  destacado: boolean;
  nivelListado: NivelListado;
  region: RegionResumen;
  tipos: TipoVenue[];
  resumen: TextoLocalizado;
  imagen: Imagen;
  capacidadBanqueteMax: number;
  tieneHospedaje: boolean;
  habitaciones?: number;
  catering: TipoCatering;
  inversionDesdeUSD?: number;
  tieneEntrevista: boolean;
}

// --- Editorial ---------------------------------------------------------------

export interface Episodio {
  _id: string;
  _type: 'episodio';
  titulo: TextoLocalizado;
  youtubeId: string;
  descripcion: TextoLocalizado;
  capitulos: Capitulo[];
  venue?: Pick<Venue, 'nombre' | 'slug'>;
  fechaPublicacion: string;
  esDemo?: boolean;
}

export interface Guia {
  _id: string;
  _type: 'guia';
  edicion: string;
  portada: Imagen;
  /** Un archivo por idioma con respaldo en inglés (D-018). */
  archivoPDF: { en: string; es?: string };
  paginasMuestra: Imagen[];
  descripcion: TextoLocalizado;
  activa: boolean;
}

export type TipoHistoria = 'articulo' | 'boda-real' | 'lista';

export interface HistoriaResumen {
  _id: string;
  titulo: TextoLocalizado;
  slug: string;
  tipo: TipoHistoria;
  imagenPortada: Imagen;
  extracto: TextoLocalizado;
  fechaPublicacion: string;
  /** Calculado en la consulta a partir del cuerpo del artículo. */
  tiempoLectura: number;
}

export interface ElementoTexto {
  _key: string;
  titulo: TextoLocalizado;
  texto: TextoLocalizado;
}

export interface ConfiguracionSitio {
  _id: 'configuracionSitio';
  _type: 'configuracionSitio';
  fraseHero: TextoLocalizado;
  subtituloHero: TextoLocalizado;
  imagenHero: Imagen;
  videoHero?: { escritorio?: ArchivoVideo; movil?: ArchivoVideo };
  porQueYucatan: { titulo: TextoLocalizado; entradilla: TextoLocalizado; puntos: ElementoTexto[] };
  sello: { titulo: TextoLocalizado; texto: TextoLocalizado; pasos: ElementoTexto[] };
  tradiciones: {
    titulo: TextoLocalizado;
    entradilla: TextoLocalizado;
    elementos: Array<ElementoTexto & { imagen: Imagen }>;
  };
  metricas: { venuesVisitados: number; horasEntrevista: number; edicionesImpresas: number };
  redes: { instagram?: string; youtube?: string };
  correoContacto?: string;
}
