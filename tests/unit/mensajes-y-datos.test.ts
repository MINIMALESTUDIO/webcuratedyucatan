import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import en from '@/i18n/mensajes/en.json';
import es from '@/i18n/mensajes/es.json';
import { routing } from '@/i18n/routing';
import {
  obtenerArticulos,
  obtenerCategoriaDescubre,
  obtenerCategoriasDescubre,
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
import { categoriasDescubreDemo, descubreDemo } from '@/lib/demo/descubre';
import { articulosDemo, paginasDemo } from '@/lib/demo/editorial';
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
    expect(Object.keys(routing.pathnames)).toHaveLength(16);
    // Páginas individuales de Discover Yucatán (00 — ESTRUCTURA GENERAL, D-048).
    expect(routing.pathnames['/descubre-yucatan/[categoria]']).toEqual({
      en: '/discover-yucatan/[categoria]',
      es: '/descubre-yucatan/[categoria]',
    });
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
  it('partners: 4 de catering y Gabo Preciado reales; los fotógrafos restantes son [DEMO]', () => {
    const reales = proveedoresDemo.filter((p) => !p.slug.startsWith('demo-'));
    expect(reales.map((p) => p.slug)).toEqual([
      'bravo-catering',
      'experiences-banquetes',
      'margo-amalia',
      'ritualia',
      'gabo-preciado-fotografia',
    ]);
    for (const p of reales) {
      expect(p.nombre.includes('[DEMO]')).toBe(false);
      expect(p.descripcion.en.length).toBeGreaterThanOrEqual(3);
      expect(p.notasCurated?.en.length ?? 0).toBeGreaterThan(0);
      // Copy real sin traducir: respaldo a inglés (D-008).
      expect(p.resumen.es).toBeUndefined();
    }
    for (const p of proveedoresDemo.filter((p) => p.slug.startsWith('demo-'))) {
      expect(p.nombre.startsWith('[DEMO]')).toBe(true);
      expect(p.tipo).toBe('fotografia');
    }
  });

  it('entre 3 y 5 partners por sección (documento de estructura, secciones 8 y 9)', () => {
    for (const tipo of ['catering', 'fotografia'] as const) {
      const cantidad = proveedoresDemo.filter((p) => p.tipo === tipo).length;
      expect(cantidad).toBeGreaterThanOrEqual(3);
      expect(cantidad).toBeLessThanOrEqual(5);
    }
  });

  it('las tres colecciones del documento con los venues de FICHAS DE VENUES (4, 6 y 8)', () => {
    expect(coleccionesDemo.map((c) => c.nombre.en)).toEqual([
      'Contemporary Sanctuaries',
      'Organic Estates',
      'Timeless Venues',
    ]);
    const porColeccion = coleccionesDemo.map(
      (coleccion) => venuesDemo.filter((v) => v.coleccion.slug === coleccion.slug).length,
    );
    expect(porColeccion).toEqual([4, 6, 8]);
  });

  it('los slugs son únicos', () => {
    const slugs = [...venuesDemo, ...proveedoresDemo, ...articulosDemo].map((d) => d.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('los venues son copy real de 01_WEB/03_VENUES (sin [DEMO] salvo las fotos)', () => {
    expect(venuesDemo).toHaveLength(18);
    for (const venue of venuesDemo) {
      const textos = [
        venue.nombre,
        venue.resumen.en,
        ...venue.notasCurated.map((n) => n.texto.en),
        ...venue.espacios.map((e) => e.nombre.en),
      ];
      for (const t of textos) expect(t.includes('[DEMO]'), t).toBe(false);
      expect(venue.slug.startsWith('demo-')).toBe(false);
      // Real y sin traducir todavía: respaldo a inglés (D-008), no un español inventado.
      expect(venue.resumen.es).toBeUndefined();
      expect(venue.resumen.en.length).toBeLessThanOrEqual(200);
      expect(venue.descripcion.en).toHaveLength(3);
      expect(venue.notasCurated).toHaveLength(1);
      expect(venue.pelicula).toBeUndefined();
      // Las fotos siguen siendo marcadores hasta que lleguen las de FOTOS VENUES.
      expect(venue.media.imagenHero.esDemo).toBe(true);
    }
  });

  it('los destacados son los cuatro de Home > Featured Venues', () => {
    expect(
      venuesDemo
        .filter((v) => v.destacado)
        .map((v) => v.slug)
        .sort(),
    ).toEqual([
      'hacienda-chable',
      'hacienda-sac-chich',
      'hacienda-san-antonio-hool',
      'hacienda-san-diego-cutz',
    ]);
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

  it('Discover Yucatán: las seis categorías del documento con copy real (D-048)', () => {
    expect(categoriasDescubreDemo.map((c) => c.slug)).toEqual([
      'architecture',
      'culture',
      'gastronomy',
      'history',
      'nature',
      'experiences',
    ]);
    const slugs = new Set(categoriasDescubreDemo.map((c) => c.slug));
    for (const categoria of categoriasDescubreDemo) {
      const textos = [
        categoria.resumen.en,
        categoria.titular.en,
        categoria.entradilla.en,
        ...categoria.secciones.flatMap((seccion) => [
          seccion.titulo.en,
          ...seccion.texto.en.flatMap((b) => b.children.map((h) => (h as { text: string }).text)),
        ]),
      ];
      for (const t of textos) {
        expect(t.includes('[DEMO]'), t).toBe(false);
        // Sin las notas internas del documento ("Texto pegado", comentarios de investigación).
        expect(/Texto pegado|investigación|research/i.test(t), t).toBe(false);
      }
      expect(categoria.secciones.length).toBeGreaterThanOrEqual(6);
      // "Continue exploring": tres categorías distintas de la propia.
      expect(categoria.relacionadas).toHaveLength(3);
      for (const r of categoria.relacionadas) {
        expect(slugs.has(r.slug)).toBe(true);
        expect(r.slug).not.toBe(categoria.slug);
      }
    }
    expect(descubreDemo.entradilla.en.startsWith('[DEMO]')).toBe(false);
  });

  it('todas las imágenes tienen texto alternativo en ambos idiomas y el archivo existe', () => {
    const imagenes: Imagen[] = [
      configuracionDemo.imagenHero,
      ...configuracionDemo.exploraCurated.areas.map((a) => a.imagen),
      ...(configuracionDemo.planea.imagen ? [configuracionDemo.planea.imagen] : []),
      ...coleccionesDemo.map((c) => c.imagen),
      ...venuesDemo.flatMap((v) => [v.media.imagenHero, ...v.media.galeria]),
      ...proveedoresDemo.flatMap((p) => [p.imagenPrincipal, ...p.galeria]),
      disenoDemo.imagenPrincipal,
      ...disenoDemo.marcas.flatMap((m) => m.imagenes),
      descubreDemo.imagenPrincipal,
      ...categoriasDescubreDemo.flatMap((c) => [
        c.imagenPrincipal,
        ...c.secciones.flatMap((seccion) => seccion.imagenes),
      ]),
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
    expect(await obtenerVenuesTarjeta()).toHaveLength(18);
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
    const venue = await obtenerVenue('hacienda-xtepen');
    expect(venue).not.toBeNull();
    const similares = await obtenerVenuesSimilares(venue!);
    expect(similares.map((v) => v.slug)).not.toContain('hacienda-xtepen');
    expect(similares[0]?.coleccion.slug).toBe('timeless');
  });

  it('partners por sección, colecciones y páginas fijas', async () => {
    expect((await obtenerProveedores('catering')).every((p) => p.tipo === 'catering')).toBe(true);
    expect((await obtenerColecciones()).map((c) => c.orden)).toEqual([1, 2, 3]);
    expect((await obtenerPaginaEditorial('nosotros'))?._id).toBe('pagina-nosotros');
  });

  it('categorías de Discover Yucatán por orden y página individual', async () => {
    expect((await obtenerCategoriasDescubre()).map((c) => c.orden)).toEqual([1, 2, 3, 4, 5, 6]);
    const arquitectura = await obtenerCategoriaDescubre('architecture');
    expect(arquitectura?.relacionadas.map((r) => r.slug)).toEqual([
      'culture',
      'history',
      'experiences',
    ]);
    expect(await obtenerCategoriaDescubre('no-existe')).toBeNull();
  });

  it('un slug inexistente devuelve null', async () => {
    expect(await obtenerVenue('no-existe')).toBeNull();
  });
});
