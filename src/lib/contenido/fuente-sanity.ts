import 'server-only';
import { sanityFetch } from '@/lib/sanity/live';
import {
  CONSULTA_ARTICULO,
  CONSULTA_ARTICULOS,
  CONSULTA_COLECCIONES,
  CONSULTA_CONFIGURACION,
  CONSULTA_CATEGORIA_DESCUBRE,
  CONSULTA_CATEGORIAS_DESCUBRE,
  CONSULTA_DESCUBRE,
  CONSULTA_SLUGS_CATEGORIAS_DESCUBRE,
  CONSULTA_DISENO,
  CONSULTA_PAGINA_EDITORIAL,
  CONSULTA_PROVEEDOR,
  CONSULTA_PROVEEDORES,
  CONSULTA_REGIONES,
  CONSULTA_SLUG_ACTUAL_PROVEEDOR,
  CONSULTA_SLUG_ACTUAL_VENUE,
  CONSULTA_SLUGS_ARTICULOS,
  CONSULTA_SLUGS_PROVEEDORES,
  CONSULTA_SLUGS_VENUES,
  CONSULTA_VENUE,
  CONSULTA_VENUES_DESTACADOS,
  CONSULTA_VENUES_TARJETA,
} from '@/lib/sanity/consultas';
import { sinNulos } from '@/lib/sanity/sin-nulos';
import { entornoDeEspacios } from './derivados';
import { fuenteDemo } from './fuente-demo';
import type { FuenteContenido } from './fuente';
import {
  PAGINAS_FIJAS,
  type Articulo,
  type ArticuloResumen,
  type CategoriaDescubre,
  type CategoriaDescubreResumen,
  type Coleccion,
  type ConfiguracionSitio,
  type DescubreYucatan,
  type DisenoProduccion,
  type Entorno,
  type InteriorExterior,
  type PaginaEditorial,
  type Proveedor,
  type ProveedorResumen,
  type Region,
  type Venue,
  type VenueTarjeta,
} from './tipos';

/*
 * Fuente Sanity (D-033). Cada consulta lleva etiquetas por tipo de documento (y por slug en
 * las fichas) que /api/revalidar invalida al publicar (D-010). Si falta un documento único,
 * se usa el DEMO con un aviso en el registro del servidor.
 */

interface Opciones {
  params?: Record<string, unknown>;
  etiquetas: string[];
  /** Sin stega ni borradores: para generateStaticParams y redirecciones. */
  limpio?: boolean;
}

async function consultar<T>(query: string, { params = {}, etiquetas, limpio = false }: Opciones) {
  const { data } = await sanityFetch({
    query,
    params,
    tags: etiquetas,
    ...(limpio ? { perspective: 'published' as const, stega: false as const } : {}),
  });
  return sinNulos(data) as T;
}

type TarjetaCruda = Omit<VenueTarjeta, 'entorno'> & {
  tiposEspacio: InteriorExterior[];
  entornoFicha?: Entorno;
};

function aTarjetas(crudas: TarjetaCruda[] | null): VenueTarjeta[] {
  return (crudas ?? []).map(({ tiposEspacio, entornoFicha, ...tarjeta }) => ({
    ...tarjeta,
    // El entorno indicado en la ficha manda sobre el cálculo por espacios (D-047).
    entorno: entornoFicha ?? entornoDeEspacios(tiposEspacio),
  }));
}

/** Documento único con respaldo DEMO si todavía no existe en el dataset. */
async function unico<T>(
  query: string,
  etiqueta: string,
  respaldo: () => Promise<T>,
  params: Record<string, unknown> = {},
): Promise<T> {
  const documento = await consultar<T | null>(query, { etiquetas: [etiqueta], params });
  if (documento) return documento;
  console.warn(`[sanity] Falta el documento de "${etiqueta}"; se usan los textos DEMO.`);
  return respaldo();
}

const ETIQUETAS_VENUES = ['venue', 'coleccion', 'region'];

/**
 * Categorías de Discover Yucatán: mientras el dataset no tenga ninguna, se usan las DEMO (con
 * aviso), igual que los documentos únicos. Así el sitio no pierde la sección antes de importar.
 */
async function categoriasEnSanity(): Promise<CategoriaDescubreResumen[]> {
  return (
    (await consultar<CategoriaDescubreResumen[] | null>(CONSULTA_CATEGORIAS_DESCUBRE, {
      etiquetas: ['categoriaDescubre'],
    })) ?? []
  );
}

function avisarCategoriasDemo() {
  console.warn('[sanity] No hay categorías de Discover Yucatán; se usan las DEMO.');
}

export const fuenteSanity: FuenteContenido = {
  async obtenerConfiguracionSitio() {
    return unico<ConfiguracionSitio>(CONSULTA_CONFIGURACION, 'configuracionSitio', () =>
      fuenteDemo.obtenerConfiguracionSitio(),
    );
  },
  async obtenerColecciones() {
    return (
      (await consultar<Coleccion[] | null>(CONSULTA_COLECCIONES, { etiquetas: ['coleccion'] })) ??
      []
    );
  },
  async obtenerRegiones() {
    return (await consultar<Region[] | null>(CONSULTA_REGIONES, { etiquetas: ['region'] })) ?? [];
  },
  async obtenerVenuesTarjeta() {
    return aTarjetas(
      await consultar<TarjetaCruda[] | null>(CONSULTA_VENUES_TARJETA, {
        etiquetas: ETIQUETAS_VENUES,
      }),
    );
  },
  async obtenerVenuesDestacados(limite) {
    return aTarjetas(
      await consultar<TarjetaCruda[] | null>(CONSULTA_VENUES_DESTACADOS, {
        params: { limite },
        etiquetas: ETIQUETAS_VENUES,
      }),
    );
  },
  async obtenerSlugsVenues() {
    return (
      (await consultar<string[] | null>(CONSULTA_SLUGS_VENUES, {
        etiquetas: ['venue'],
        limpio: true,
      })) ?? []
    );
  },
  async obtenerVenue(slug) {
    return consultar<Venue | null>(CONSULTA_VENUE, {
      params: { slug },
      etiquetas: [...ETIQUETAS_VENUES, `venue:${slug}`],
    });
  },
  async obtenerSlugActual(tipo, slugAnterior) {
    return consultar<string | null>(
      tipo === 'venue' ? CONSULTA_SLUG_ACTUAL_VENUE : CONSULTA_SLUG_ACTUAL_PROVEEDOR,
      { params: { slug: slugAnterior }, etiquetas: [tipo], limpio: true },
    );
  },
  async obtenerProveedores(tipo) {
    return (
      (await consultar<ProveedorResumen[] | null>(CONSULTA_PROVEEDORES, {
        params: { tipo },
        etiquetas: ['proveedor'],
      })) ?? []
    );
  },
  async obtenerSlugsProveedores(tipo) {
    return (
      (await consultar<string[] | null>(CONSULTA_SLUGS_PROVEEDORES, {
        params: { tipo },
        etiquetas: ['proveedor'],
        limpio: true,
      })) ?? []
    );
  },
  async obtenerProveedor(tipo, slug) {
    return consultar<Proveedor | null>(CONSULTA_PROVEEDOR, {
      params: { tipo, slug },
      etiquetas: ['proveedor', `proveedor:${slug}`],
    });
  },
  async obtenerDisenoProduccion() {
    return unico<DisenoProduccion>(CONSULTA_DISENO, 'disenoProduccion', () =>
      fuenteDemo.obtenerDisenoProduccion(),
    );
  },
  async obtenerArticulos(limite) {
    return (
      (await consultar<ArticuloResumen[] | null>(CONSULTA_ARTICULOS, {
        params: { limite: limite ?? 1000 },
        etiquetas: ['articulo'],
      })) ?? []
    );
  },
  async obtenerSlugsArticulos() {
    return (
      (await consultar<string[] | null>(CONSULTA_SLUGS_ARTICULOS, {
        etiquetas: ['articulo'],
        limpio: true,
      })) ?? []
    );
  },
  async obtenerArticulo(slug) {
    return consultar<Articulo | null>(CONSULTA_ARTICULO, {
      params: { slug },
      etiquetas: ['articulo', `articulo:${slug}`],
    });
  },
  async obtenerDescubreYucatan() {
    return unico<DescubreYucatan>(CONSULTA_DESCUBRE, 'descubreYucatan', () =>
      fuenteDemo.obtenerDescubreYucatan(),
    );
  },
  async obtenerCategoriasDescubre() {
    const categorias = await categoriasEnSanity();
    if (categorias.length > 0) return categorias;
    avisarCategoriasDemo();
    return fuenteDemo.obtenerCategoriasDescubre();
  },
  async obtenerSlugsCategoriasDescubre() {
    const slugs =
      (await consultar<string[] | null>(CONSULTA_SLUGS_CATEGORIAS_DESCUBRE, {
        etiquetas: ['categoriaDescubre'],
        limpio: true,
      })) ?? [];
    return slugs.length > 0 ? slugs : fuenteDemo.obtenerSlugsCategoriasDescubre();
  },
  async obtenerCategoriaDescubre(slug) {
    const categoria = await consultar<CategoriaDescubre | null>(CONSULTA_CATEGORIA_DESCUBRE, {
      params: { slug },
      etiquetas: ['categoriaDescubre', `categoriaDescubre:${slug}`],
    });
    if (categoria) return categoria;
    if ((await categoriasEnSanity()).length > 0) return null;
    avisarCategoriasDemo();
    return fuenteDemo.obtenerCategoriaDescubre(slug);
  },
  async obtenerPaginaEditorial(pagina) {
    return unico<PaginaEditorial | null>(
      CONSULTA_PAGINA_EDITORIAL,
      'paginaEditorial',
      () => fuenteDemo.obtenerPaginaEditorial(pagina),
      { id: PAGINAS_FIJAS[pagina] },
    );
  },
};
