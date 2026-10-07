import { describe, expect, it } from 'vitest';
import type { VenueTarjeta } from '@/lib/contenido/tipos';
import { tarjeta } from './ayudantes';
import {
  alternar,
  contarFiltrosActivos,
  escribirFiltros,
  FILTROS_VACIOS,
  filtrarVenues,
  type FiltrosVenues,
  leerFiltros,
  ordenarVenues,
} from '@/lib/venues/filtros';

const VALIDOS = {
  colecciones: ['contemporary', 'organic', 'timeless'],
  regiones: ['merida', 'alrededores-de-merida', 'costa'],
};

const coleccion = (slug: string) => ({ nombre: { en: slug }, slug, resultado: { en: slug } });

const venues: VenueTarjeta[] = [
  tarjeta({ slug: 'a', nombre: 'Alba', capacidadMax: 500, tieneHospedaje: true, entorno: 'ambos' }),
  tarjeta({
    slug: 'b',
    nombre: 'Brisa',
    coleccion: coleccion('contemporary'),
    region: { nombre: { en: 'Costa' }, slug: 'costa' },
    capacidadMax: 180,
    entorno: 'exterior',
    destacado: true,
  }),
  tarjeta({
    slug: 'c',
    nombre: 'Ceiba',
    coleccion: coleccion('organic'),
    capacidadMax: 350,
    tieneHospedaje: true,
    entorno: 'interior',
  }),
];

const con = (cambio: Partial<FiltrosVenues>): FiltrosVenues => ({ ...FILTROS_VACIOS, ...cambio });
const slugs = (lista: VenueTarjeta[]) => lista.map((v) => v.slug);

describe('filtrarVenues', () => {
  it('sin filtros devuelve todos', () => {
    expect(slugs(filtrarVenues(venues, FILTROS_VACIOS))).toEqual(['a', 'b', 'c']);
  });

  it('estilo: colecciones combinadas con "o"', () => {
    expect(slugs(filtrarVenues(venues, con({ colecciones: ['organic', 'contemporary'] })))).toEqual(
      ['b', 'c'],
    );
  });

  it('capacidad por rangos sobre la capacidad máxima', () => {
    expect(slugs(filtrarVenues(venues, con({ capacidades: ['hasta-200'] })))).toEqual(['b']);
    expect(slugs(filtrarVenues(venues, con({ capacidades: ['200-400', 'mas-400'] })))).toEqual([
      'a',
      'c',
    ]);
  });

  it('hospedaje y ubicación se combinan con "y"', () => {
    expect(slugs(filtrarVenues(venues, con({ hospedaje: true })))).toEqual(['a', 'c']);
    expect(slugs(filtrarVenues(venues, con({ hospedaje: true, regiones: ['costa'] })))).toEqual([]);
  });

  it('interior / exterior: un venue con ambos cumple con cualquiera', () => {
    expect(slugs(filtrarVenues(venues, con({ entornos: ['interior'] })))).toEqual(['a', 'c']);
    expect(slugs(filtrarVenues(venues, con({ entornos: ['exterior'] })))).toEqual(['a', 'b']);
  });
});

describe('URL de filtros', () => {
  it('ida y vuelta estable, con comas legibles', () => {
    const filtros = con({
      colecciones: ['timeless'],
      capacidades: ['200-400', 'mas-400'],
      hospedaje: true,
      regiones: ['costa'],
      entornos: ['exterior'],
    });
    const query = escribirFiltros(filtros);
    expect(query).toBe(
      'estilo=timeless&capacidad=200-400,mas-400&hospedaje=si&ubicacion=costa&entorno=exterior',
    );
    expect(leerFiltros(new URLSearchParams(query), VALIDOS)).toEqual(filtros);
  });

  it('ignora valores desconocidos y duplicados', () => {
    const leidos = leerFiltros(
      new URLSearchParams('estilo=timeless,nada,timeless&entorno=techo&ubicacion=luna&hospedaje=1'),
      VALIDOS,
    );
    expect(leidos).toEqual(con({ colecciones: ['timeless'] }));
  });

  it('sin filtros la query queda vacía', () => {
    expect(escribirFiltros(FILTROS_VACIOS)).toBe('');
  });
});

describe('ayudantes', () => {
  it('cuenta los filtros del panel (sin el estilo)', () => {
    expect(
      contarFiltrosActivos(
        con({ colecciones: ['timeless'], hospedaje: true, entornos: ['interior'] }),
      ),
    ).toBe(2);
  });

  it('alternar agrega y quita', () => {
    expect(alternar(['a'], 'b')).toEqual(['a', 'b']);
    expect(alternar(['a', 'b'], 'a')).toEqual(['b']);
  });

  it('orden editorial: destacados primero y luego nombre, sin mutar', () => {
    const copia = [...venues];
    expect(slugs(ordenarVenues(venues, 'en'))).toEqual(['b', 'a', 'c']);
    expect(venues).toEqual(copia);
  });
});
