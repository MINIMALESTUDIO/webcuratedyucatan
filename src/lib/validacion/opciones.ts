/*
 * Opciones cerradas de los formularios (documento de estructura, secciones 13 y 14). No importa
 * zod: los componentes lo cargan de forma estática sin sumar peso al JS inicial (D-031).
 */

/** "What are you planning?" de Plan Your Event. */
export const TIPOS_EVENTO = ['boda', 'fiesta-bienvenida', 'cena-ensayo', 'otro'] as const;

/** "Estimated guests?" (también lo usa Find Your Yucatán). */
export const RANGOS_INVITADOS = ['menos-50', '50-100', '100-200', '200-400', 'mas-400'] as const;

/** "Looking for". */
export const BUSQUEDAS = [
  'venue',
  'catering',
  'fotografia',
  'diseno-produccion',
  'no-seguro',
] as const;

/** Desde dónde se abrió la solicitud (se adjunta al lead, Fase 4). */
export const ORIGENES_SOLICITUD = ['general', 'venue', 'proveedor', 'diseno'] as const;

export type TipoEvento = (typeof TIPOS_EVENTO)[number];
export type RangoInvitados = (typeof RANGOS_INVITADOS)[number];
export type Busqueda = (typeof BUSQUEDAS)[number];
export type OrigenSolicitud = (typeof ORIGENES_SOLICITUD)[number];
