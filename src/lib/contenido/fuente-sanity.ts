import 'server-only';
import { sanityFetch } from '@/lib/sanity/live';
import {
  CONSULTA_CATEGORIAS,
  CONSULTA_CONFIGURACION,
  CONSULTA_GUIA_ACTIVA,
  CONSULTA_HISTORIAS_RECIENTES,
  CONSULTA_REGIONES,
  CONSULTA_SLUG_ACTUAL,
  CONSULTA_SLUGS_VENUES,
  CONSULTA_ULTIMO_EPISODIO,
  CONSULTA_VENUE,
  CONSULTA_VENUES_DESTACADOS,
  CONSULTA_VENUES_TARJETA,
} from '@/lib/sanity/consultas';
import { sinNulos } from '@/lib/sanity/sin-nulos';
import { fuenteDemo } from './fuente-demo';
import type { FuenteContenido } from './fuente';
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
 * Fuente Sanity (D-033). Cada consulta lleva etiquetas por tipo de documento (y por slug en
 * las fichas) que /api/revalidar invalida al publicar (D-010).
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

export const fuenteSanity: FuenteContenido = {
  async obtenerConfiguracionSitio() {
    const configuracion = await consultar<ConfiguracionSitio | null>(CONSULTA_CONFIGURACION, {
      etiquetas: ['configuracionSitio'],
    });
    if (configuracion) return configuracion;
    console.warn('[sanity] Falta el documento configuracionSitio; se usan los textos DEMO.');
    return fuenteDemo.obtenerConfiguracionSitio();
  },
  async obtenerRegiones() {
    return (await consultar<Region[] | null>(CONSULTA_REGIONES, { etiquetas: ['region'] })) ?? [];
  },
  async obtenerCategoriasProveedor() {
    return (
      (await consultar<CategoriaProveedor[] | null>(CONSULTA_CATEGORIAS, {
        etiquetas: ['categoriaProveedor'],
      })) ?? []
    );
  },
  async obtenerVenuesTarjeta() {
    return (
      (await consultar<VenueTarjeta[] | null>(CONSULTA_VENUES_TARJETA, {
        etiquetas: ['venue', 'region'],
      })) ?? []
    );
  },
  async obtenerVenuesDestacados(limite) {
    return (
      (await consultar<VenueTarjeta[] | null>(CONSULTA_VENUES_DESTACADOS, {
        params: { limite },
        etiquetas: ['venue', 'region'],
      })) ?? []
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
      etiquetas: ['venue', `venue:${slug}`, 'region', 'proveedor', 'categoriaProveedor'],
    });
  },
  async obtenerSlugActual(slugAnterior) {
    return consultar<string | null>(CONSULTA_SLUG_ACTUAL, {
      params: { slug: slugAnterior },
      etiquetas: ['venue'],
      limpio: true,
    });
  },
  async obtenerUltimoEpisodio() {
    return consultar<Episodio | null>(CONSULTA_ULTIMO_EPISODIO, {
      etiquetas: ['episodio', 'venue'],
    });
  },
  async obtenerGuiaActiva() {
    return consultar<Guia | null>(CONSULTA_GUIA_ACTIVA, { etiquetas: ['guia'] });
  },
  async obtenerHistoriasRecientes(limite) {
    return (
      (await consultar<HistoriaResumen[] | null>(CONSULTA_HISTORIAS_RECIENTES, {
        params: { limite },
        etiquetas: ['historia'],
      })) ?? []
    );
  },
};
