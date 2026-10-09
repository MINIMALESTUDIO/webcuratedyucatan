import { coincideEntorno } from '@/lib/contenido/derivados';
import type { VenueTarjeta } from '@/lib/contenido/tipos';

/*
 * Find Your Yucatán (D-041, actualizado en D-053 con "Estructura y contenido FIND YOUR YUCATÁN"
 * del Drive): experiencia de descubrimiento, no un formulario comercial. Reglas deterministas:
 *
 * 1. La atmósfera (pregunta 2) determina el resultado: cada atmósfera es una colección.
 * 2. Requisitos que nunca se rompen: capacidad confirmada al menos igual al mínimo del rango de
 *    invitados, y hospedaje en el lugar cuando es "Yes, it matters". "No" y "Not specified" en
 *    la ficha no cuentan como hospedaje.
 * 3. Entre los venues de la colección que cumplen, puntúan: cada prioridad elegida que cumple
 *    (+3, hasta 2 prioridades), hospedaje cuando es "It would be nice" (+1), el entorno que
 *    coincide (+1) y la marca editorial "destacado" (+1).
 * 4. Se muestran hasta 3. Solo si ningún venue de la colección cumple los requisitos se buscan
 *    en las demás colecciones, igual por puntos.
 */

export const TIPOS_EVENTO_ENCUENTRA = [
  'boda',
  'fiesta-bienvenida',
  'cena-ensayo',
  'after-party',
  'otra-celebracion',
] as const;
export const OPCIONES_HOSPEDAJE = ['requerido', 'preferido', 'no-necesario'] as const;
/** "Mostly outdoors", "A mix of indoor & outdoor", "Mostly indoors", "Open to either". */
export const OPCIONES_ENTORNO = ['exterior', 'mixto', 'interior', 'indistinto'] as const;
/** "What matters most?": se eligen hasta 2. */
export const PRIORIDADES_ENCUENTRA = [
  'arquitectura-historia',
  'naturaleza-paisaje',
  'privacidad',
  'hospedaje',
  'espacios-grandes',
  'cercania-merida',
] as const;
export const MAX_PRIORIDADES = 2;
export const RANGOS_INVITADOS_ENCUENTRA = [
  { id: 'menos-100', min: 1 },
  { id: '100-200', min: 100 },
  { id: '200-400', min: 200 },
  { id: '400-800', min: 400 },
  { id: 'mas-800', min: 800 },
] as const;

/** "Large Celebration Spaces": capacidad desde 800 invitados (el rango más alto del quiz). */
export const CAPACIDAD_GRANDE = 800;
/** "Proximity to Mérida": hasta 30 minutos del centro, o venues dentro de la ciudad. */
export const MINUTOS_CERCA = 30;

export type TipoEventoEncuentra = (typeof TIPOS_EVENTO_ENCUENTRA)[number];
export type OpcionHospedaje = (typeof OPCIONES_HOSPEDAJE)[number];
export type OpcionEntorno = (typeof OPCIONES_ENTORNO)[number];
export type PrioridadEncuentra = (typeof PRIORIDADES_ENCUENTRA)[number];
export type IdRangoInvitados = (typeof RANGOS_INVITADOS_ENCUENTRA)[number]['id'];

export interface RespuestasEncuentra {
  evento: TipoEventoEncuentra;
  /** Slug de la colección elegida como atmósfera. */
  atmosfera: string;
  hospedaje: OpcionHospedaje;
  entorno: OpcionEntorno;
  prioridades: PrioridadEncuentra[];
  invitados: IdRangoInvitados;
}

function minimoInvitados(rango: IdRangoInvitados): number {
  return RANGOS_INVITADOS_ENCUENTRA.find((r) => r.id === rango)?.min ?? 1;
}

/** Regla 2: requisitos que nunca se rompen. */
export function cumpleRequisitos(venue: VenueTarjeta, r: RespuestasEncuentra): boolean {
  if (venue.capacidadMax < minimoInvitados(r.invitados)) return false;
  if (r.hospedaje === 'requerido' && !venue.tieneHospedaje) return false;
  return true;
}

export function cumplePrioridad(venue: VenueTarjeta, prioridad: PrioridadEncuentra): boolean {
  switch (prioridad) {
    case 'arquitectura-historia':
      return venue.atributos.includes('arquitectura');
    case 'naturaleza-paisaje':
      return venue.atributos.includes('naturaleza');
    case 'privacidad':
      return venue.atributos.includes('privacidad');
    case 'hospedaje':
      return venue.tieneHospedaje;
    case 'espacios-grandes':
      return venue.capacidadMax >= CAPACIDAD_GRANDE;
    case 'cercania-merida':
      return (
        venue.atributos.includes('ubicacion') ||
        (venue.minutosCentroMerida !== undefined && venue.minutosCentroMerida <= MINUTOS_CERCA)
      );
  }
}

function coincideConEntorno(venue: VenueTarjeta, entorno: OpcionEntorno): boolean {
  switch (entorno) {
    case 'mixto':
      return venue.entorno === 'ambos';
    case 'interior':
    case 'exterior':
      return coincideEntorno(venue.entorno, entorno);
    case 'indistinto':
      return false;
  }
}

/** Puntos de afinidad de un venue con las respuestas (ver regla 3). */
export function puntuar(venue: VenueTarjeta, r: RespuestasEncuentra): number {
  let puntos = 0;
  for (const prioridad of r.prioridades.slice(0, MAX_PRIORIDADES)) {
    if (cumplePrioridad(venue, prioridad)) puntos += 3;
  }
  if (r.hospedaje === 'preferido' && venue.tieneHospedaje) puntos += 1;
  if (coincideConEntorno(venue, r.entorno)) puntos += 1;
  if (venue.destacado) puntos += 1;
  return puntos;
}

/** Venues recomendados para las respuestas, en orden (ver reglas 2 a 4). */
export function recomendarVenues(
  venues: readonly VenueTarjeta[],
  respuestas: RespuestasEncuentra,
  limite = 3,
): VenueTarjeta[] {
  const porPuntos = (lista: readonly VenueTarjeta[]) =>
    [...lista].sort(
      (a, b) => puntuar(b, respuestas) - puntuar(a, respuestas) || a.nombre.localeCompare(b.nombre),
    );
  const cumplen = venues.filter((v) => cumpleRequisitos(v, respuestas));
  const deLaColeccion = cumplen.filter((v) => v.coleccion.slug === respuestas.atmosfera);
  const candidatos = deLaColeccion.length > 0 ? deLaColeccion : cumplen;
  return porPuntos(candidatos).slice(0, limite);
}
