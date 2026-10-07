import { describe, expect, it } from 'vitest';
import { aTarjeta, entornoDeEspacios } from '@/lib/contenido/derivados';
import {
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
  prioridad: 'arquitectura',
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

describe('Find Your Yucatán', () => {
  const venues = [
    tarjeta({ slug: 't1', nombre: 'T1', atributos: ['arquitectura'], capacidadMax: 300 }),
    tarjeta({ slug: 't2', nombre: 'T2', capacidadMax: 80 }),
    tarjeta({ slug: 't3', nombre: 'T3', destacado: true, tieneHospedaje: true, capacidadMax: 200 }),
    tarjeta({ slug: 'o1', nombre: 'O1', coleccion: coleccion('organic'), capacidadMax: 400 }),
  ];

  it('recomienda de la colección elegida y respeta la capacidad mínima', () => {
    const resultado = recomendarVenues(venues, base).map((v) => v.slug);
    // t2 no llega a 100 invitados: va después de los que cumplen, pero sigue en su colección.
    expect(resultado).toEqual(['t1', 't3', 't2']);
  });

  it('hospedaje requerido descarta a los que no tienen', () => {
    const resultado = recomendarVenues(venues, { ...base, hospedaje: 'requerido' }).map(
      (v) => v.slug,
    );
    expect(resultado[0]).toBe('t3');
  });

  it('puntos: prioridad +3, hospedaje preferido +1, entorno +1, destacado +1', () => {
    const venue = tarjeta({
      slug: 'x',
      atributos: ['naturaleza'],
      tieneHospedaje: true,
      entorno: 'ambos',
      destacado: true,
    });
    expect(
      puntuar(venue, {
        ...base,
        prioridad: 'naturaleza',
        hospedaje: 'preferido',
        entorno: 'interior',
      }),
    ).toBe(6);
    expect(puntuar(venue, base)).toBe(1);
  });

  it('el entorno indicado en la ficha manda sobre el de los espacios (D-047)', () => {
    const yaxcopoil = venuesDemo.find((v) => v.slug === 'hacienda-yaxcopoil');
    // Solo nombra la capilla (interior), pero la ficha dice "Indoor and outdoor spaces".
    expect(yaxcopoil && entornoDeEspacios(yaxcopoil.espacios.map((x) => x.interiorExterior))).toBe(
      'interior',
    );
    expect(yaxcopoil && aTarjeta(yaxcopoil).entorno).toBe('ambos');
  });

  it('con los venues reales siempre devuelve 3 venues y empieza por la colección elegida', () => {
    const tarjetas = venuesDemo.map(aTarjeta);
    for (const atmosfera of ['contemporary', 'organic', 'timeless']) {
      const resultado = recomendarVenues(tarjetas, { ...base, atmosfera, invitados: 'mas-400' });
      expect(resultado).toHaveLength(3);
      expect(resultado[0]?.coleccion.slug).toBe(atmosfera);
    }
  });
});
