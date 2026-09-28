import {
  TIPOS_VENUE,
  type Idioma,
  type NivelListado,
  type TipoVenue,
  type VenueTarjeta,
} from '@/lib/contenido/tipos';

/*
 * Filtros del listado de venues (sección 11, decisión D-026). Funciones puras: se usan en el
 * cliente y se prueban con Vitest. Los rangos son [DEMO] hasta que se definan los reales.
 */

export const RANGOS_CAPACIDAD = [
  { id: 'hasta-100', min: 0, max: 100 },
  { id: '100-200', min: 101, max: 200 },
  { id: '200-350', min: 201, max: 350 },
  { id: 'mas-350', min: 351, max: Number.POSITIVE_INFINITY },
] as const;

export const RANGOS_INVERSION = [
  { id: 'menos-10k', min: 0, max: 9_999 },
  { id: '10-20k', min: 10_000, max: 19_999 },
  { id: '20-35k', min: 20_000, max: 34_999 },
  { id: 'mas-35k', min: 35_000, max: Number.POSITIVE_INFINITY },
] as const;

export const ORDENES = ['destacados', 'capacidad', 'nombre'] as const;
export const OPCIONES_CATERING = ['propio', 'externo'] as const;

export type IdRangoCapacidad = (typeof RANGOS_CAPACIDAD)[number]['id'];
export type IdRangoInversion = (typeof RANGOS_INVERSION)[number]['id'];
export type OrdenVenues = (typeof ORDENES)[number];
export type OpcionCatering = (typeof OPCIONES_CATERING)[number];

export interface FiltrosVenues {
  regiones: string[];
  tipos: TipoVenue[];
  capacidades: IdRangoCapacidad[];
  hospedaje: boolean;
  catering: OpcionCatering[];
  inversiones: IdRangoInversion[];
  orden: OrdenVenues;
}

export const FILTROS_VACIOS: FiltrosVenues = {
  regiones: [],
  tipos: [],
  capacidades: [],
  hospedaje: false,
  catering: [],
  inversiones: [],
  orden: 'destacados',
};

/** Nombres de los parámetros en la URL. Valores múltiples separados por comas. */
const PARAMETRO = {
  regiones: 'region',
  tipos: 'tipo',
  capacidades: 'capacidad',
  hospedaje: 'hospedaje',
  catering: 'catering',
  inversiones: 'inversion',
  orden: 'orden',
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
  regionesValidas: readonly string[],
): FiltrosVenues {
  const orden = params.get(PARAMETRO.orden);
  return {
    regiones: lista(params.get(PARAMETRO.regiones), regionesValidas),
    tipos: lista(params.get(PARAMETRO.tipos), TIPOS_VENUE),
    capacidades: lista(
      params.get(PARAMETRO.capacidades),
      RANGOS_CAPACIDAD.map((r) => r.id),
    ),
    hospedaje: params.get(PARAMETRO.hospedaje) === 'si',
    catering: lista(params.get(PARAMETRO.catering), OPCIONES_CATERING),
    inversiones: lista(
      params.get(PARAMETRO.inversiones),
      RANGOS_INVERSION.map((r) => r.id),
    ),
    orden: ORDENES.find((o) => o === orden) ?? 'destacados',
  };
}

/** Convierte los filtros en query string estable (sin "?"); omite los valores por defecto. */
export function escribirFiltros(filtros: FiltrosVenues): string {
  const params = new URLSearchParams();
  if (filtros.regiones.length) params.set(PARAMETRO.regiones, filtros.regiones.join(','));
  if (filtros.tipos.length) params.set(PARAMETRO.tipos, filtros.tipos.join(','));
  if (filtros.capacidades.length) params.set(PARAMETRO.capacidades, filtros.capacidades.join(','));
  if (filtros.hospedaje) params.set(PARAMETRO.hospedaje, 'si');
  if (filtros.catering.length) params.set(PARAMETRO.catering, filtros.catering.join(','));
  if (filtros.inversiones.length) params.set(PARAMETRO.inversiones, filtros.inversiones.join(','));
  if (filtros.orden !== 'destacados') params.set(PARAMETRO.orden, filtros.orden);
  // Las comas se dejan legibles en la URL compartible.
  return params.toString().replaceAll('%2C', ',');
}

export function contarFiltrosActivos(filtros: FiltrosVenues): number {
  return (
    filtros.regiones.length +
    filtros.tipos.length +
    filtros.capacidades.length +
    (filtros.hospedaje ? 1 : 0) +
    filtros.catering.length +
    filtros.inversiones.length
  );
}

/** Agrega el valor si no está y lo quita si ya está. */
export function alternar<T>(valores: readonly T[], valor: T): T[] {
  return valores.includes(valor) ? valores.filter((v) => v !== valor) : [...valores, valor];
}

function enRango(valor: number, rango: { min: number; max: number }): boolean {
  return valor >= rango.min && valor <= rango.max;
}

/**
 * Aplica los filtros. Dentro de un grupo los valores se combinan con "o"; entre grupos, con "y".
 * Catering: "propio" incluye venues con catering propio o ambos; "externo", externo o ambos.
 */
export function filtrarVenues(
  venues: readonly VenueTarjeta[],
  filtros: FiltrosVenues,
): VenueTarjeta[] {
  return venues.filter((venue) => {
    if (filtros.regiones.length && !filtros.regiones.includes(venue.region.slug)) return false;
    if (filtros.tipos.length && !venue.tipos.some((tipo) => filtros.tipos.includes(tipo)))
      return false;
    if (
      filtros.capacidades.length &&
      !RANGOS_CAPACIDAD.some(
        (rango) =>
          filtros.capacidades.includes(rango.id) && enRango(venue.capacidadBanqueteMax, rango),
      )
    ) {
      return false;
    }
    if (filtros.hospedaje && !venue.tieneHospedaje) return false;
    if (
      filtros.catering.length &&
      !filtros.catering.some((opcion) => venue.catering === opcion || venue.catering === 'ambos')
    ) {
      return false;
    }
    if (filtros.inversiones.length) {
      const inversion = venue.inversionDesdeUSD;
      if (inversion === undefined) return false;
      if (
        !RANGOS_INVERSION.some(
          (rango) => filtros.inversiones.includes(rango.id) && enRango(inversion, rango),
        )
      ) {
        return false;
      }
    }
    return true;
  });
}

const PRIORIDAD_NIVEL: Record<NivelListado, number> = { destacado: 0, video: 1, basico: 2 };

/**
 * Ordena sin modificar el arreglo original.
 * "destacados": nivel comercial, luego la marca editorial `destacado` y luego nombre (D-015).
 */
export function ordenarVenues(
  venues: readonly VenueTarjeta[],
  orden: OrdenVenues,
  idioma: Idioma,
): VenueTarjeta[] {
  const porNombre = (a: VenueTarjeta, b: VenueTarjeta) =>
    a.nombre.localeCompare(b.nombre, idioma, { sensitivity: 'base' });

  return [...venues].sort((a, b) => {
    if (orden === 'capacidad')
      return b.capacidadBanqueteMax - a.capacidadBanqueteMax || porNombre(a, b);
    if (orden === 'nombre') return porNombre(a, b);
    return (
      PRIORIDAD_NIVEL[a.nivelListado] - PRIORIDAD_NIVEL[b.nivelListado] ||
      Number(b.destacado) - Number(a.destacado) ||
      porNombre(a, b)
    );
  });
}
