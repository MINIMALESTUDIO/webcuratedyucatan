import { describe, expect, it } from 'vitest';
import type { VenueTarjeta } from '@/lib/contenido/tipos';
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

const REGIONES = ['merida-centro', 'haciendas', 'costa'];

function tarjeta(parcial: Partial<VenueTarjeta> & Pick<VenueTarjeta, 'slug'>): VenueTarjeta {
  return {
    _id: parcial.slug,
    nombre: parcial.slug,
    destacado: false,
    nivelListado: 'basico',
    region: { nombre: { en: 'Region' }, slug: 'haciendas' },
    tipos: ['hacienda'],
    resumen: { en: 'Resumen' },
    imagen: { url: '/x.jpg', ancho: 10, alto: 10, alt: { en: 'x' } },
    capacidadBanqueteMax: 150,
    tieneHospedaje: false,
    catering: 'propio',
    tieneEntrevista: false,
    ...parcial,
  };
}

const venues: VenueTarjeta[] = [
  tarjeta({
    slug: 'a',
    nombre: 'Alba',
    capacidadBanqueteMax: 350,
    catering: 'ambos',
    inversionDesdeUSD: 25_000,
    tieneHospedaje: true,
    nivelListado: 'destacado',
  }),
  tarjeta({
    slug: 'b',
    nombre: 'Bruma',
    region: { nombre: { en: 'C' }, slug: 'costa' },
    tipos: ['playa'],
    capacidadBanqueteMax: 180,
    catering: 'externo',
    inversionDesdeUSD: 9_000,
    nivelListado: 'video',
    destacado: true,
  }),
  tarjeta({
    slug: 'c',
    nombre: 'Ceiba',
    region: { nombre: { en: 'M' }, slug: 'merida-centro' },
    tipos: ['boutique', 'ciudad-colonial'],
    capacidadBanqueteMax: 70,
    catering: 'propio',
  }),
  tarjeta({
    slug: 'd',
    nombre: 'Duna',
    region: { nombre: { en: 'C' }, slug: 'costa' },
    tipos: ['playa', 'otro'],
    capacidadBanqueteMax: 420,
    catering: 'propio',
    inversionDesdeUSD: undefined,
    destacado: true,
  }),
];

describe('leerFiltros y escribirFiltros', () => {
  it('lee valores válidos, descarta desconocidos y duplicados', () => {
    const params = new URLSearchParams(
      'region=costa,inventada,costa&tipo=playa,xyz&capacidad=200-350&hospedaje=si&catering=externo&inversion=20-35k&orden=nombre',
    );
    expect(leerFiltros(params, REGIONES)).toEqual({
      regiones: ['costa'],
      tipos: ['playa'],
      capacidades: ['200-350'],
      hospedaje: true,
      catering: ['externo'],
      inversiones: ['20-35k'],
      orden: 'nombre',
    });
  });

  it('usa los valores por defecto con una URL vacía o un orden inválido', () => {
    expect(leerFiltros(new URLSearchParams('orden=precio'), REGIONES)).toEqual(FILTROS_VACIOS);
  });

  it('escribe una query estable, legible y sin valores por defecto', () => {
    const query = escribirFiltros({
      ...FILTROS_VACIOS,
      tipos: ['hacienda', 'playa'],
      hospedaje: true,
    });
    expect(query).toBe('tipo=hacienda,playa&hospedaje=si');
    expect(escribirFiltros(FILTROS_VACIOS)).toBe('');
  });

  it('ida y vuelta: leer(escribir(f)) devuelve los mismos filtros', () => {
    const filtros: FiltrosVenues = {
      ...FILTROS_VACIOS,
      regiones: ['haciendas'],
      capacidades: ['hasta-100', 'mas-350'],
      orden: 'capacidad',
    };
    expect(leerFiltros(new URLSearchParams(escribirFiltros(filtros)), REGIONES)).toEqual(filtros);
  });
});

describe('filtrarVenues', () => {
  it('sin filtros devuelve todos', () => {
    expect(filtrarVenues(venues, FILTROS_VACIOS)).toHaveLength(4);
  });

  it('combina con "o" dentro de un grupo y con "y" entre grupos', () => {
    const resultado = filtrarVenues(venues, {
      ...FILTROS_VACIOS,
      tipos: ['playa', 'boutique'],
      regiones: ['costa'],
    });
    expect(resultado.map((v) => v.slug)).toEqual(['b', 'd']);
  });

  it('filtra por rango de capacidad de banquete con límites inclusivos', () => {
    const resultado = filtrarVenues(venues, { ...FILTROS_VACIOS, capacidades: ['200-350'] });
    expect(resultado.map((v) => v.slug)).toEqual(['a']);
  });

  it('catering propio incluye "ambos" y externo también', () => {
    expect(
      filtrarVenues(venues, { ...FILTROS_VACIOS, catering: ['externo'] }).map((v) => v.slug),
    ).toEqual(['a', 'b']);
    expect(
      filtrarVenues(venues, { ...FILTROS_VACIOS, catering: ['propio'] }).map((v) => v.slug),
    ).toEqual(['a', 'c', 'd']);
  });

  it('el filtro de inversión excluye venues sin dato', () => {
    const resultado = filtrarVenues(venues, {
      ...FILTROS_VACIOS,
      inversiones: ['menos-10k', 'mas-35k'],
    });
    expect(resultado.map((v) => v.slug)).toEqual(['b']);
  });

  it('hospedaje en sitio', () => {
    expect(
      filtrarVenues(venues, { ...FILTROS_VACIOS, hospedaje: true }).map((v) => v.slug),
    ).toEqual(['a']);
  });
});

describe('ordenarVenues', () => {
  it('destacados: nivel comercial, luego marca editorial y luego nombre', () => {
    expect(ordenarVenues(venues, 'destacados', 'es').map((v) => v.slug)).toEqual([
      'a',
      'b',
      'd',
      'c',
    ]);
  });

  it('capacidad de mayor a menor y nombre alfabético', () => {
    expect(ordenarVenues(venues, 'capacidad', 'en').map((v) => v.slug)).toEqual([
      'd',
      'a',
      'b',
      'c',
    ]);
    expect(ordenarVenues(venues, 'nombre', 'en').map((v) => v.slug)).toEqual(['a', 'b', 'c', 'd']);
  });

  it('no modifica el arreglo original', () => {
    const copia = [...venues];
    ordenarVenues(venues, 'capacidad', 'en');
    expect(venues).toEqual(copia);
  });
});

describe('utilidades de filtros', () => {
  it('alternar agrega y quita', () => {
    expect(alternar(['a'], 'b')).toEqual(['a', 'b']);
    expect(alternar(['a', 'b'], 'a')).toEqual(['b']);
  });

  it('cuenta filtros activos sin contar el orden', () => {
    expect(
      contarFiltrosActivos({
        ...FILTROS_VACIOS,
        tipos: ['playa'],
        hospedaje: true,
        orden: 'nombre',
      }),
    ).toBe(2);
  });
});
