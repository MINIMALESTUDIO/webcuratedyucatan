/*
 * Tipos de contenido con la forma de los documentos de Sanity (D-007), alineados con
 * "Estructura y dirección web — Curated Yucatán" (docs/referencias, D-038).
 *
 * Representan el resultado de las consultas GROQ ya proyectadas:
 * - las referencias vienen resueltas (p. ej. `coleccion` trae nombre y slug);
 * - `slug` es el valor de `slug.current`;
 * - las imágenes traen URL, dimensiones y texto alternativo.
 * Las dos fuentes (DEMO local y Sanity) devuelven exactamente estos tipos (D-033).
 */

import type { PortableTextBlock } from '@portabletext/react';

export type Idioma = 'en' | 'es';

/** Campo bilingüe. El inglés es obligatorio; si falta el español se muestra el inglés (D-008). */
export interface TextoLocalizado {
  en: string;
  es?: string;
}

/** Bloque de texto enriquecido (Portable Text). */
export type BloqueTexto = PortableTextBlock;

export interface BloquesLocalizados {
  en: BloqueTexto[];
  es?: BloqueTexto[];
}

export interface Imagen {
  /** Clave del elemento dentro de un arreglo de Sanity (galerías): permite editarlo en la página. */
  _key?: string;
  url: string;
  ancho: number;
  alto: number;
  /** Texto alternativo obligatorio. */
  alt: TextoLocalizado;
  /** Punto de interés elegido en Sanity (0–1): se usa como object-position al recortar. */
  hotspot?: { x: number; y: number };
  /** Imagen de relleno del piloto. */
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

/** Elemento de una lista bilingüe (servicios, por ejemplo). */
export interface ElementoLista {
  _key: string;
  texto: TextoLocalizado;
}

export interface Capitulo {
  _key: string;
  titulo: TextoLocalizado;
  segundoInicio: number;
}

// --- Colecciones (estilos del libro) --------------------------------------------

/**
 * Categoría curada de venues: ordena el libro, el listado y el resultado de Find Your Yucatán.
 * Es un documento (no una lista fija) para poder cambiar la taxonomía sin tocar código (D-039).
 */
export interface Coleccion {
  _id: string;
  _type: 'coleccion';
  /** "Timeless Venues". */
  nombre: TextoLocalizado;
  slug: string;
  /** "Heritage and elegance." */
  lema: TextoLocalizado;
  descripcion: TextoLocalizado;
  /** Palabra del resultado de Find Your Yucatán: "Your Yucatán is… Timeless". */
  resultado: TextoLocalizado;
  imagen: Imagen;
  orden: number;
}

export type ColeccionResumen = Pick<Coleccion, 'nombre' | 'slug' | 'resultado'>;

// --- Región (ubicación) -----------------------------------------------------------

export interface Region {
  _id: string;
  _type: 'region';
  nombre: TextoLocalizado;
  slug: string;
  orden: number;
}

export type RegionResumen = Pick<Region, 'nombre' | 'slug'>;

// --- Venues --------------------------------------------------------------------------

/** Tipo de cada espacio. */
export type InteriorExterior = 'interior' | 'exterior' | 'mixto';
/** Resumen del venue, calculado a partir de sus espacios. */
export type Entorno = 'interior' | 'exterior' | 'ambos';

/** Lo que distingue a un venue; alimenta "What matters most?" de Find Your Yucatán. */
export const ATRIBUTOS_VENUE = [
  'arquitectura',
  'naturaleza',
  'gastronomia',
  'privacidad',
  'ubicacion',
] as const;
export type AtributoVenue = (typeof ATRIBUTOS_VENUE)[number];

export interface FichaTecnica {
  /** Capacidad máxima del venue, en su espacio más grande. */
  capacidadMax: number;
  hospedaje: {
    tieneHospedaje: boolean;
    habitaciones?: number;
    huespedesMax?: number;
  };
  minutosCentroMerida: number;
  kmCentroMerida?: number;
}

export interface Espacio {
  _key: string;
  nombre: TextoLocalizado;
  descripcion?: TextoLocalizado;
  interiorExterior: InteriorExterior;
  capacidad?: number;
  imagenes: Imagen[];
}

/** Nota práctica para wedding planners ("Curated Notes"). */
export interface NotaCurated {
  _key: string;
  titulo: TextoLocalizado;
  texto: TextoLocalizado;
}

/** Video del venue en la serie "El Lugar de Tu Historia" (YouTube). */
export interface Pelicula {
  youtubeId: string;
  titulo: TextoLocalizado;
  capitulos: Capitulo[];
  /** Solo en el piloto: el video no es de la serie (D-007). */
  esDemo?: boolean;
}

export interface Venue {
  _id: string;
  _type: 'venue';
  /** Nombre propio: no se traduce (D-008). */
  nombre: string;
  slug: string;
  slugsAnteriores?: string[];
  publicado: boolean;
  /** Decisión editorial: aparece en el inicio (D-015). */
  destacado: boolean;
  coleccion: ColeccionResumen;
  region: RegionResumen;
  /** Municipio o localidad, nombre propio ("Chocholá"). */
  localidad: string;
  /** Máximo 200 caracteres. */
  resumen: TextoLocalizado;
  descripcion: BloquesLocalizados;
  fichaTecnica: FichaTecnica;
  espacios: Espacio[];
  notasCurated: NotaCurated[];
  atributos: AtributoVenue[];
  media: {
    imagenHero: Imagen;
    videoLoop?: ArchivoVideo;
    videoLoopMovil?: ArchivoVideo;
    galeria: Imagen[];
  };
  pelicula?: Pelicula;
  seo?: Seo;
  // Los correos de contacto no forman parte del contenido público: viven en privado.* (D-012).
}

/** Proyección para tarjetas, listado con filtros y Find Your Yucatán. */
export interface VenueTarjeta {
  _id: string;
  nombre: string;
  slug: string;
  destacado: boolean;
  coleccion: ColeccionResumen;
  region: RegionResumen;
  localidad: string;
  minutosCentroMerida: number;
  imagen: Imagen;
  capacidadMax: number;
  tieneHospedaje: boolean;
  habitaciones?: number;
  entorno: Entorno;
  atributos: AtributoVenue[];
}

// --- Proveedores: Catering y Photography ---------------------------------------------

export const TIPOS_PROVEEDOR = ['catering', 'fotografia'] as const;
export type TipoProveedor = (typeof TIPOS_PROVEEDOR)[number];

/** Enfoques de fotografía que menciona el documento de estructura (sección 9). */
export const ESTILOS_FOTOGRAFIA = [
  'editorial',
  'documental',
  'fine-art',
  'cinematografico',
] as const;
export type EstiloFotografia = (typeof ESTILOS_FOTOGRAFIA)[number];

export interface Proveedor {
  _id: string;
  _type: 'proveedor';
  tipo: TipoProveedor;
  /** Nombre comercial: no se traduce (D-008). */
  nombre: string;
  slug: string;
  slugsAnteriores?: string[];
  /** Categoría y especialidad ("Hacienda banquets", "Documentary photography"). */
  especialidad: TextoLocalizado;
  /** Diferenciador breve para la vista general. */
  resumen: TextoLocalizado;
  descripcion: BloquesLocalizados;
  servicios: ElementoLista[];
  /** Estilo o diferenciador. */
  estilo: TextoLocalizado;
  estilosFotografia: EstiloFotografia[];
  /** Ciudad base, nombre propio. */
  ciudadBase: string;
  /** Zonas donde trabajan. */
  cobertura: TextoLocalizado;
  /** Experiencia en bodas destino o eventos internacionales. */
  experiencia: TextoLocalizado;
  sitioWeb?: string;
  instagram?: string;
  logotipo?: Imagen;
  imagenPrincipal: Imagen;
  galeria: Imagen[];
  orden: number;
  seo?: Seo;
  // El contacto comercial vive en privado.* (D-012).
}

export interface ProveedorResumen {
  _id: string;
  tipo: TipoProveedor;
  nombre: string;
  slug: string;
  especialidad: TextoLocalizado;
  resumen: TextoLocalizado;
  estilosFotografia: EstiloFotografia[];
  imagen: Imagen;
}

// --- Design & Production (Minimal) ---------------------------------------------------

export interface AreaDiseno {
  _key: string;
  nombre: TextoLocalizado;
  descripcion: TextoLocalizado;
  imagenes: Imagen[];
}

/** Minimal como Curated Design & Production Partner: no es un directorio (sección 10). */
export interface DisenoProduccion {
  _id: 'disenoProduccion';
  _type: 'disenoProduccion';
  nombre: string;
  lema: TextoLocalizado;
  descripcion: BloquesLocalizados;
  imagenPrincipal: Imagen;
  areas: AreaDiseno[];
  servicios: ElementoLista[];
  estilo: TextoLocalizado;
  experiencia: TextoLocalizado;
  ciudadBase: string;
  cobertura: TextoLocalizado;
  sitioWeb?: string;
  instagram?: string;
  logotipo?: Imagen;
}

// --- Curated Journal -----------------------------------------------------------------

export interface ArticuloResumen {
  _id: string;
  titulo: TextoLocalizado;
  slug: string;
  imagenPortada: Imagen;
  extracto: TextoLocalizado;
  fechaPublicacion: string;
  /** Calculado a partir del cuerpo del artículo. */
  tiempoLectura: number;
}

export interface Articulo extends ArticuloResumen {
  _type: 'articulo';
  cuerpo: BloquesLocalizados;
  seo?: Seo;
}

// --- Discover Yucatán ----------------------------------------------------------------

export interface SeccionDescubre {
  _key: string;
  /** Identificador de la sección en la URL (#merida). */
  ancla: string;
  titulo: TextoLocalizado;
  /** "City · Architecture · Gastronomy · Lifestyle". */
  etiquetas: TextoLocalizado;
  texto: BloquesLocalizados;
  imagenes: Imagen[];
}

export interface DescubreYucatan {
  _id: 'descubreYucatan';
  _type: 'descubreYucatan';
  titulo: TextoLocalizado;
  entradilla: TextoLocalizado;
  imagenPrincipal: Imagen;
  secciones: SeccionDescubre[];
}

// --- Páginas editoriales (About, Privacy) --------------------------------------------

/** Destinos internos de los llamados a la acción. */
export const DESTINOS_LLAMADO = [
  'planea-tu-evento',
  'encuentra-tu-yucatan',
  'venues',
  'descubre-yucatan',
] as const;
export type DestinoLlamado = (typeof DESTINOS_LLAMADO)[number];

export type SeccionEditorial =
  | { _type: 'seccionTexto'; _key: string; titulo?: TextoLocalizado; texto: BloquesLocalizados }
  | { _type: 'seccionImagen'; _key: string; imagen: Imagen; pie?: TextoLocalizado }
  | {
      _type: 'seccionPreguntas';
      _key: string;
      titulo?: TextoLocalizado;
      preguntas: Array<{ _key: string; pregunta: TextoLocalizado; respuesta: TextoLocalizado }>;
    }
  | {
      _type: 'seccionLlamado';
      _key: string;
      titulo: TextoLocalizado;
      texto?: TextoLocalizado;
      destino: DestinoLlamado;
    };

export interface PaginaEditorial {
  _id: string;
  _type: 'paginaEditorial';
  titulo: TextoLocalizado;
  entradilla?: TextoLocalizado;
  imagen?: Imagen;
  secciones: SeccionEditorial[];
  seo?: Seo;
}

/** Páginas editoriales con ruta fija: su documento tiene ID fijo (sin punto: sería privado). */
export const PAGINAS_FIJAS = {
  nosotros: 'pagina-nosotros',
  privacidad: 'pagina-privacidad',
} as const;
export type PaginaFija = keyof typeof PAGINAS_FIJAS;

// --- Configuración del sitio e inicio ------------------------------------------------

export const DESTINOS_EXPLORA = ['venues', 'catering', 'fotografia', 'diseno-produccion'] as const;
export type DestinoExplora = (typeof DESTINOS_EXPLORA)[number];

export interface TemaDescubre {
  _key: string;
  titulo: TextoLocalizado;
  imagen: Imagen;
  /** Sección de Discover Yucatán a la que lleva (ancla). */
  ancla: string;
}

export interface AreaExplora {
  _key: string;
  destino: DestinoExplora;
  texto: TextoLocalizado;
  imagen: Imagen;
}

export interface ConfiguracionSitio {
  _id: 'configuracionSitio';
  _type: 'configuracionSitio';
  /** "Your insider guide to celebrating in Yucatán." */
  lema: TextoLocalizado;
  imagenHero: Imagen;
  videoHero?: { escritorio?: ArchivoVideo; movil?: ArchivoVideo };
  queEsCurated: { texto: TextoLocalizado };
  descubre: { texto: TextoLocalizado; temas: TemaDescubre[] };
  exploraCurated: { texto: TextoLocalizado; areas: AreaExplora[] };
  planea: { texto: TextoLocalizado; imagen?: Imagen };
  redes: { instagram?: string; youtube?: string };
  correoContacto?: string;
}
