import { coincideEntorno } from '@/lib/contenido/derivados';
import type { AtributoVenue, VenueTarjeta } from '@/lib/contenido/tipos';

/*
 * Find Your Yucatán (documento de estructura, sección 14; D-041): experiencia de descubrimiento,
 * no un formulario comercial. Reglas simples, deterministas y documentadas:
 *
 * 1. El resultado ("Your Yucatán is… Timeless") es la atmósfera elegida: cada atmósfera es una
 *    colección del libro, y las mismas colecciones ordenan el listado de venues.
 * 2. Se recomiendan ~3 venues de esa colección. Descartan: capacidad menor que el mínimo del
 *    rango de invitados, y sin hospedaje cuando es "requerido".
 * 3. Entre los que quedan, puntúan: lo que más importa (+3), hospedaje cuando es "preferido"
 *    (+1), interior o exterior que coincide (+1) y la marca editorial "destacado" (+1).
 * 4. Si no alcanzan, se completa primero con venues de la misma colección que no cumplen todo y
 *    luego con los de otras colecciones, siempre por puntos.
 */

export const TIPOS_EVENTO_ENCUENTRA = ['boda', 'cena-bienvenida', 'celebracion'] as const;
export const OPCIONES_HOSPEDAJE = ['requerido', 'preferido', 'no-necesario'] as const;
export const OPCIONES_ENTORNO = ['interior', 'exterior', 'indistinto'] as const;
export const RANGOS_INVITADOS = [
  { id: 'menos-50', min: 1 },
  { id: '50-100', min: 50 },
  { id: '100-200', min: 100 },
  { id: '200-400', min: 200 },
  { id: 'mas-400', min: 400 },
] as const;

export type TipoEventoEncuentra = (typeof TIPOS_EVENTO_ENCUENTRA)[number];
export type OpcionHospedaje = (typeof OPCIONES_HOSPEDAJE)[number];
export type OpcionEntorno = (typeof OPCIONES_ENTORNO)[number];
export type IdRangoInvitados = (typeof RANGOS_INVITADOS)[number]['id'];

export interface RespuestasEncuentra {
  evento: TipoEventoEncuentra;
  /** Slug de la colección elegida como atmósfera. */
  atmosfera: string;
  hospedaje: OpcionHospedaje;
  entorno: OpcionEntorno;
  prioridad: AtributoVenue;
  invitados: IdRangoInvitados;
}

function minimoInvitados(rango: IdRangoInvitados): number {
  return RANGOS_INVITADOS.find((r) => r.id === rango)?.min ?? 1;
}

function cumpleRequisitos(venue: VenueTarjeta, r: RespuestasEncuentra): boolean {
  if (venue.capacidadMax < minimoInvitados(r.invitados)) return false;
  if (r.hospedaje === 'requerido' && !venue.tieneHospedaje) return false;
  return true;
}

/** Puntos de afinidad de un venue con las respuestas (ver regla 3). */
export function puntuar(venue: VenueTarjeta, r: RespuestasEncuentra): number {
  let puntos = 0;
  if (venue.atributos.includes(r.prioridad)) puntos += 3;
  if (r.hospedaje === 'preferido' && venue.tieneHospedaje) puntos += 1;
  if (r.entorno !== 'indistinto' && coincideEntorno(venue.entorno, r.entorno)) puntos += 1;
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

  const deLaColeccion = venues.filter((v) => v.coleccion.slug === respuestas.atmosfera);
  const otros = venues.filter((v) => v.coleccion.slug !== respuestas.atmosfera);

  const orden = [
    ...porPuntos(deLaColeccion.filter((v) => cumpleRequisitos(v, respuestas))),
    ...porPuntos(deLaColeccion.filter((v) => !cumpleRequisitos(v, respuestas))),
    ...porPuntos(otros.filter((v) => cumpleRequisitos(v, respuestas))),
  ];
  return orden.slice(0, limite);
}
