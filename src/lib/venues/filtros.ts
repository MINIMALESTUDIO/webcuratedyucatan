import { coincideEntorno } from '@/lib/contenido/derivados';
import type { Idioma, VenueTarjeta } from '@/lib/contenido/tipos';

/*
 * Filtros del listado de venues (documento de estructura, sección 6): Style, Capacity,
 * Accommodation, Location e Indoor / Outdoor (D-040). Funciones puras: se usan en el cliente y
 * se prueban con Vitest. Los rangos de capacidad son [DEMO] hasta que se definan los reales.
 */

export const RANGOS_CAPACIDAD = [
  { id: 'hasta-200', min: 0, max: 200 },
  { id: '200-400', min: 201, max: 400 },
  { id: 'mas-400', min: 401, max: Number.POSITIVE_INFINITY },
] as const;

export const ENTORNOS = ['interior', 'exterior'] as const;

export type IdRangoCapacidad = (typeof RANGOS_CAPACIDAD)[number]['id'];
export type PreferenciaEntorno = (typeof ENTORNOS)[number];

export interface FiltrosVenues {
  /** Slugs de colección (estilo). */
  colecciones: string[];
  capacidades: IdRangoCapacidad[];
  hospedaje: boolean;
  /** Slugs de región (ubicación). */
  regiones: string[];
  entornos: PreferenciaEntorno[];
}

export const FILTROS_VACIOS: FiltrosVenues = {
  colecciones: [],
  capacidades: [],
  hospedaje: false,
  regiones: [],
  entornos: [],
};

/** Nombres de los parámetros en la URL. Valores múltiples separados por comas. */
const PARAMETRO = {
  colecciones: 'estilo',
  capacidades: 'capacidad',
  hospedaje: 'hospedaje',
  regiones: 'ubicacion',
  entornos: 'entorno',
} as const;

interface LectorParametros {
  get(nombre: string): string | null;
}

function lista<T extends string>(valor: string | null, validos: readonly T[]): T[] {
  if (!valor) return [];
  const pedidos = valor.split(',').map((v) => v.trim());
  // Conserva el orden de los valores válidos y descarta duplicados y desconocidos.
  return validos.filter((v) => pedidos.includes(v));
}

/** Lee los filtros de la URL; ignora valores desconocidos. */
export function leerFiltros(
  params: LectorParametros,
  validos: { colecciones: readonly string[]; regiones: readonly string[] },
): FiltrosVenues {
  return {
    colecciones: lista(params.get(PARAMETRO.colecciones), validos.colecciones),
    capacidades: lista(
      params.get(PARAMETRO.capacidades),
      RANGOS_CAPACIDAD.map((r) => r.id),
    ),
    hospedaje: params.get(PARAMETRO.hospedaje) === 'si',
    regiones: lista(params.get(PARAMETRO.regiones), validos.regiones),
    entornos: lista(params.get(PARAMETRO.entornos), ENTORNOS),
  };
}

/** Convierte los filtros en query string estable (sin "?"); omite los valores vacíos. */
export function escribirFiltros(filtros: FiltrosVenues): string {
  const params = new URLSearchParams();
  if (filtros.colecciones.length) params.set(PARAMETRO.colecciones, filtros.colecciones.join(','));
  if (filtros.capacidades.length) params.set(PARAMETRO.capacidades, filtros.capacidades.join(','));
  if (filtros.hospedaje) params.set(PARAMETRO.hospedaje, 'si');
  if (filtros.regiones.length) params.set(PARAMETRO.regiones, filtros.regiones.join(','));
  if (filtros.entornos.length) params.set(PARAMETRO.entornos, filtros.entornos.join(','));
  // Las comas se dejan legibles en la URL compartible.
  return params.toString().replaceAll('%2C', ',');
}

/** Filtros del panel (sin contar el estilo, que se elige con las colecciones). */
export function contarFiltrosActivos(filtros: FiltrosVenues): number {
  return (
    filtros.capacidades.length +
    (filtros.hospedaje ? 1 : 0) +
    filtros.regiones.length +
    filtros.entornos.length
  );
}

/** Agrega el valor si no está y lo quita si ya está. */
export function alternar<T>(valores: readonly T[], valor: T): T[] {
  return valores.includes(valor) ? valores.filter((v) => v !== valor) : [...valores, valor];
}

/**
 * Aplica los filtros. Dentro de un grupo los valores se combinan con "o"; entre grupos, con "y".
 * Interior / exterior: un venue con espacios de ambos tipos cumple con cualquiera.
 */
export function filtrarVenues(
  venues: readonly VenueTarjeta[],
  filtros: FiltrosVenues,
): VenueTarjeta[] {
  return venues.filter((venue) => {
    if (filtros.colecciones.length && !filtros.colecciones.includes(venue.coleccion.slug))
      return false;
    if (
      filtros.capacidades.length &&
      !RANGOS_CAPACIDAD.some(
        (rango) =>
          filtros.capacidades.includes(rango.id) &&
          venue.capacidadMax >= rango.min &&
          venue.capacidadMax <= rango.max,
      )
    ) {
      return false;
    }
    if (filtros.hospedaje && !venue.tieneHospedaje) return false;
    if (filtros.regiones.length && !filtros.regiones.includes(venue.region.slug)) return false;
    if (
      filtros.entornos.length &&
      !filtros.entornos.some((preferencia) => coincideEntorno(venue.entorno, preferencia))
    ) {
      return false;
    }
    return true;
  });
}

/** Orden editorial fijo, sin modificar el arreglo original: destacados primero y luego nombre. */
export function ordenarVenues(venues: readonly VenueTarjeta[], idioma: Idioma): VenueTarjeta[] {
  return [...venues].sort(
    (a, b) =>
      Number(b.destacado) - Number(a.destacado) ||
      a.nombre.localeCompare(b.nombre, idioma, { sensitivity: 'base' }),
  );
}
