import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import en from '@/i18n/mensajes/en.json';
import es from '@/i18n/mensajes/es.json';
import { routing } from '@/i18n/routing';
import {
  obtenerArticulos,
  obtenerColecciones,
  obtenerPaginaEditorial,
  obtenerProveedores,
  obtenerVenue,
  obtenerVenuesDestacados,
  obtenerVenuesSimilares,
  obtenerVenuesTarjeta,
} from '@/lib/contenido';
import type { Imagen } from '@/lib/contenido/tipos';
import { coleccionesDemo } from '@/lib/demo/colecciones';
import { configuracionDemo } from '@/lib/demo/configuracion';
import { disenoDemo } from '@/lib/demo/diseno';
import { articulosDemo, descubreDemo, paginasDemo } from '@/lib/demo/editorial';
import { proveedoresDemo } from '@/lib/demo/proveedores';
import { venuesDemo } from '@/lib/demo/venues';

function clavesPlanas(objeto: object, prefijo = ''): string[] {
  return Object.entries(objeto).flatMap(([clave, valor]) =>
    typeof valor === 'object' && valor !== null
      ? clavesPlanas(valor, `${prefijo}${clave}.`)
      : [`${prefijo}${clave}`],
  );
}

describe('mensajes de interfaz', () => {
  it('inglés y español tienen exactamente las mismas claves', () => {
    expect(clavesPlanas(es).sort()).toEqual(clavesPlanas(en).sort());
  });

  it('no hay textos vacíos', () => {
    const valores = (objeto: object): unknown[] =>
      Object.values(objeto).flatMap((v) =>
        typeof v === 'object' && v !== null ? valores(v) : [v],
      );
    for (const valor of [...valores(en), ...valores(es)]) {
      expect(typeof valor === 'string' && valor.trim().length > 0).toBe(true);
    }
  });

  it('las rutas cubren el mapa general del documento de estructura', () => {
    expect(Object.keys(routing.pathnames)).toHaveLength(15);
    // URL estables de los QR de LOVE MÉXICO (Home y Find Your Yucatán).
    expect(routing.pathnames['/encuentra-tu-yucatan']).toEqual({
      en: '/find-your-yucatan',
      es: '/encuentra-tu-yucatan',
    });
    expect(routing.pathnames['/planea-tu-evento']).toEqual({
      en: '/plan-your-event',
      es: '/planea-tu-evento',
    });
  });
});

describe('datos DEMO', () => {
  it('6 venues y 8 partners, todos marcados [DEMO] y con slug demo-', () => {
    expect(venuesDemo).toHaveLength(6);
    expect(proveedoresDemo).toHaveLength(8);
    for (const item of [...venuesDemo, ...proveedoresDemo]) {
      expect(item.nombre.startsWith('[DEMO]')).toBe(true);
      expect(item.slug.startsWith('demo-')).toBe(true);
    }
  });

  it('entre 3 y 5 partners por sección (documento de estructura, secciones 8 y 9)', () => {
    for (const tipo of ['catering', 'fotografia'] as const) {
      const cantidad = proveedoresDemo.filter((p) => p.tipo === tipo).length;
      expect(cantidad).toBeGreaterThanOrEqual(3);
      expect(cantidad).toBeLessThanOrEqual(5);
    }
  });

  it('las tres colecciones del documento, cada una con dos venues', () => {
    expect(coleccionesDemo.map((c) => c.nombre.en)).toEqual([
      'Contemporary Sanctuaries',
      'Organic Estates',
      'Timeless Venues',
    ]);
    for (const coleccion of coleccionesDemo) {
      expect(venuesDemo.filter((v) => v.coleccion.slug === coleccion.slug)).toHaveLength(2);
    }
  });

  it('los slugs son únicos', () => {
    const slugs = [...venuesDemo, ...proveedoresDemo, ...articulosDemo].map((d) => d.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('los textos de ejemplo llevan [DEMO] en ambos idiomas', () => {
    for (const venue of venuesDemo) {
      expect(venue.resumen.en.startsWith('[DEMO]')).toBe(true);
      expect(venue.resumen.es?.startsWith('[DEMO]')).toBe(true);
      for (const nota of venue.notasCurated) expect(nota.texto.en.startsWith('[DEMO]')).toBe(true);
    }
  });

  it('el Curated Journal es copy real (sin [DEMO]) de 01_WEB/07_CURATED JOURNAL', () => {
    expect(articulosDemo).toHaveLength(6);
    for (const articulo of articulosDemo) {
      expect(articulo.titulo.en.startsWith('[DEMO]')).toBe(false);
      expect(articulo.extracto.en.startsWith('[DEMO]')).toBe(false);
      // Real y sin traducir todavía: se apoya en el respaldo a inglés (D-008), no en un
      // texto en español inventado.
      expect(articulo.titulo.es).toBeUndefined();
      expect(articulo.cuerpo.en.length).toBeGreaterThan(5);
    }
  });

  it('los temas del inicio llevan a secciones existentes de Discover Yucatán', () => {
    const anclas = descubreDemo.secciones.map((s) => s.ancla);
    for (const tema of configuracionDemo.descubre.temas) expect(anclas).toContain(tema.ancla);
    expect(configuracionDemo.descubre.temas).toHaveLength(7);
  });

  it('todas las imágenes tienen texto alternativo en ambos idiomas y el archivo existe', () => {
    const imagenes: Imagen[] = [
      configuracionDemo.imagenHero,
      ...configuracionDemo.descubre.temas.map((t) => t.imagen),
      ...configuracionDemo.exploraCurated.areas.map((a) => a.imagen),
      ...(configuracionDemo.planea.imagen ? [configuracionDemo.planea.imagen] : []),
      ...coleccionesDemo.map((c) => c.imagen),
      ...venuesDemo.flatMap((v) => [v.media.imagenHero, ...v.media.galeria]),
      ...proveedoresDemo.flatMap((p) => [p.imagenPrincipal, ...p.galeria]),
      disenoDemo.imagenPrincipal,
      ...disenoDemo.areas.flatMap((a) => a.imagenes),
      descubreDemo.imagenPrincipal,
      ...descubreDemo.secciones.flatMap((s) => s.imagenes),
      ...articulosDemo.map((a) => a.imagenPortada),
      ...paginasDemo.flatMap((p) => (p.imagen ? [p.imagen] : [])),
    ];
    for (const imagen of imagenes) {
      expect(imagen.alt.en.length).toBeGreaterThan(0);
      expect(imagen.alt.es?.length ?? 0).toBeGreaterThan(0);
      expect(existsSync(join(process.cwd(), 'public', imagen.url)), imagen.url).toBe(true);
    }
  });
});

describe('capa de contenido', () => {
  it('devuelve tarjetas, de 4 a 6 destacados y artículos ordenados', async () => {
    expect(await obtenerVenuesTarjeta()).toHaveLength(6);
    const destacados = await obtenerVenuesDestacados();
    expect(destacados.length).toBeGreaterThanOrEqual(4);
    expect(destacados.length).toBeLessThanOrEqual(6);
    expect(destacados.every((v) => v.destacado)).toBe(true);
    const articulos = await obtenerArticulos();
    expect(articulos.map((a) => a.fechaPublicacion)).toEqual(
      [...articulos.map((a) => a.fechaPublicacion)].sort().reverse(),
    );
    expect(await obtenerArticulos(3)).toHaveLength(3);
  });

  it('venues similares excluyen al propio venue y priorizan la colección', async () => {
    const venue = await obtenerVenue('demo-hacienda-ejemplo-norte');
    expect(venue).not.toBeNull();
    const similares = await obtenerVenuesSimilares(venue!);
    expect(similares.map((v) => v.slug)).not.toContain('demo-hacienda-ejemplo-norte');
    expect(similares[0]?.coleccion.slug).toBe('timeless');
  });

  it('partners por sección, colecciones y páginas fijas', async () => {
    expect((await obtenerProveedores('catering')).every((p) => p.tipo === 'catering')).toBe(true);
    expect((await obtenerColecciones()).map((c) => c.orden)).toEqual([1, 2, 3]);
    expect((await obtenerPaginaEditorial('nosotros'))?._id).toBe('pagina-nosotros');
  });

  it('un slug inexistente devuelve null', async () => {
    expect(await obtenerVenue('no-existe')).toBeNull();
  });
});
