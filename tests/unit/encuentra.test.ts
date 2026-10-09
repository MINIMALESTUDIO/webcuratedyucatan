import { describe, expect, it } from 'vitest';
import { aTarjeta, entornoDeEspacios } from '@/lib/contenido/derivados';
import {
  cumplePrioridad,
  puntuar,
  recomendarVenues,
  type RespuestasEncuentra,
} from '@/lib/descubrimiento/encuentra';
import { venuesDemo } from '@/lib/demo/venues';
import { tarjeta } from './ayudantes';

const base: RespuestasEncuentra = {
  evento: 'boda',
  atmosfera: 'timeless',
  hospedaje: 'no-necesario',
  entorno: 'indistinto',
  prioridades: ['arquitectura-historia'],
  invitados: '100-200',
};

const coleccion = (slug: string) => ({ nombre: { en: slug }, slug, resultado: { en: slug } });

describe('entornoDeEspacios', () => {
  it('mixto cuenta como interior y exterior', () => {
    expect(entornoDeEspacios(['interior', 'exterior'])).toBe('ambos');
    expect(entornoDeEspacios(['mixto'])).toBe('ambos');
    expect(entornoDeEspacios(['interior'])).toBe('interior');
    expect(entornoDeEspacios([])).toBe('exterior');
  });
});

describe('Find Your Yucatán (D-053)', () => {
  const venues = [
    tarjeta({ slug: 't1', nombre: 'T1', atributos: ['arquitectura'], capacidadMax: 300 }),
    tarjeta({ slug: 't2', nombre: 'T2', capacidadMax: 80 }),
    tarjeta({ slug: 't3', nombre: 'T3', destacado: true, tieneHospedaje: true, capacidadMax: 200 }),
    tarjeta({ slug: 'o1', nombre: 'O1', coleccion: coleccion('organic'), capacidadMax: 400 }),
  ];

  it('nunca recomienda un venue con capacidad menor que el rango de invitados', () => {
    const resultado = recomendarVenues(venues, base).map((v) => v.slug);
    // t2 (80) no llega a 100 invitados: queda fuera aunque sea de la colección.
    expect(resultado).toEqual(['t1', 't3']);
  });

  it('hospedaje "Yes, it matters" descarta a los venues sin hospedaje confirmado', () => {
    const resultado = recomendarVenues(venues, { ...base, hospedaje: 'requerido' }).map(
      (v) => v.slug,
    );
    expect(resultado).toEqual(['t3']);
  });

  it('solo si nada de la colección cumple, busca en las demás', () => {
    const resultado = recomendarVenues(venues, { ...base, invitados: '400-800' }).map(
      (v) => v.slug,
    );
    expect(resultado).toEqual(['o1']);
  });

  it('puntos: +3 por prioridad (hasta 2), hospedaje deseado +1, entorno +1, destacado +1', () => {
    const venue = tarjeta({
      slug: 'x',
      atributos: ['naturaleza', 'privacidad'],
      tieneHospedaje: true,
      entorno: 'ambos',
      destacado: true,
    });
    expect(
      puntuar(venue, {
        ...base,
        prioridades: ['naturaleza-paisaje', 'privacidad'],
        hospedaje: 'preferido',
        entorno: 'mixto',
      }),
    ).toBe(9);
    expect(puntuar(venue, base)).toBe(1);
    // "A mix of indoor & outdoor" solo coincide con venues que tienen ambos.
    expect(
      puntuar(tarjeta({ slug: 'y', entorno: 'exterior' }), { ...base, entorno: 'mixto' }),
    ).toBe(0);
  });

  it('prioridades derivadas: espacios grandes, cercanía a Mérida y hospedaje', () => {
    expect(cumplePrioridad(tarjeta({ slug: 'a', capacidadMax: 800 }), 'espacios-grandes')).toBe(
      true,
    );
    expect(cumplePrioridad(tarjeta({ slug: 'b', capacidadMax: 750 }), 'espacios-grandes')).toBe(
      false,
    );
    expect(
      cumplePrioridad(tarjeta({ slug: 'c', minutosCentroMerida: 25 }), 'cercania-merida'),
    ).toBe(true);
    expect(
      cumplePrioridad(
        tarjeta({ slug: 'd', minutosCentroMerida: undefined, atributos: ['ubicacion'] }),
        'cercania-merida',
      ),
    ).toBe(true);
    expect(cumplePrioridad(tarjeta({ slug: 'e', tieneHospedaje: true }), 'hospedaje')).toBe(true);
  });

  it('el entorno indicado en la ficha manda sobre el de los espacios (D-047)', () => {
    const yaxcopoil = venuesDemo.find((v) => v.slug === 'hacienda-yaxcopoil');
    // Solo nombra la capilla (interior), pero la ficha dice "Indoor and outdoor spaces".
    expect(yaxcopoil && entornoDeEspacios(yaxcopoil.espacios.map((x) => x.interiorExterior))).toBe(
      'interior',
    );
    expect(yaxcopoil && aTarjeta(yaxcopoil).entorno).toBe('ambos');
  });

  it('con los venues reales, 400–800 invitados da 3 venues de la colección elegida', () => {
    const tarjetas = venuesDemo.map(aTarjeta);
    for (const atmosfera of ['contemporary', 'organic', 'timeless']) {
      const resultado = recomendarVenues(tarjetas, { ...base, atmosfera, invitados: '400-800' });
      expect(resultado).toHaveLength(3);
      expect(resultado.every((v) => v.coleccion.slug === atmosfera)).toBe(true);
      expect(resultado.every((v) => v.capacidadMax >= 400)).toBe(true);
    }
  });
});
