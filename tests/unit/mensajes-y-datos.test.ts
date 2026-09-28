import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import en from '@/i18n/mensajes/en.json';
import es from '@/i18n/mensajes/es.json';
import { routing } from '@/i18n/routing';
import {
  obtenerHistoriasRecientes,
  obtenerVenue,
  obtenerVenuesDestacados,
  obtenerVenuesSimilares,
  obtenerVenuesTarjeta,
} from '@/lib/contenido';
import type { Imagen } from '@/lib/contenido/tipos';
import { configuracionDemo } from '@/lib/demo/configuracion';
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

  it('las rutas traducidas cubren la sección 4 del documento', () => {
    expect(Object.keys(routing.pathnames)).toHaveLength(16);
  });
});

describe('datos DEMO', () => {
  it('hay 6 venues y 6 proveedores, todos marcados [DEMO] y con slug demo-', () => {
    expect(venuesDemo).toHaveLength(6);
    expect(proveedoresDemo).toHaveLength(6);
    for (const item of [...venuesDemo, ...proveedoresDemo]) {
      expect(item.nombre.startsWith('[DEMO]')).toBe(true);
      expect(item.slug.startsWith('demo-')).toBe(true);
    }
  });

  it('los slugs son únicos', () => {
    const slugs = venuesDemo.map((v) => v.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('los textos visibles de los venues llevan [DEMO] en ambos idiomas', () => {
    for (const venue of venuesDemo) {
      expect(venue.resumen.en.startsWith('[DEMO]')).toBe(true);
      expect(venue.resumen.es?.startsWith('[DEMO]')).toBe(true);
      for (const cita of venue.citasDestacadas) {
        expect(cita.texto.en.startsWith('[DEMO]')).toBe(true);
      }
    }
    expect(configuracionDemo.fraseHero.en.startsWith('[DEMO]')).toBe(true);
  });

  it('todas las imágenes tienen texto alternativo en ambos idiomas y el archivo existe', () => {
    const imagenes: Imagen[] = [
      configuracionDemo.imagenHero,
      ...configuracionDemo.tradiciones.elementos.map((e) => e.imagen),
      ...venuesDemo.flatMap((v) => [v.media.imagenHero, ...v.media.galeria]),
      ...proveedoresDemo.flatMap((p) => p.imagenes),
    ];
    for (const imagen of imagenes) {
      expect(imagen.alt.en.length).toBeGreaterThan(0);
      expect(imagen.alt.es?.length ?? 0).toBeGreaterThan(0);
      expect(existsSync(join(process.cwd(), 'public', imagen.url))).toBe(true);
    }
  });

  it('los venues básicos no tienen entrevista y los demás sí (D-015)', () => {
    for (const venue of venuesDemo) {
      expect(Boolean(venue.entrevista)).toBe(venue.nivelListado !== 'basico');
    }
  });
});

describe('capa de contenido', () => {
  it('devuelve tarjetas, destacados editoriales e historias ordenadas', async () => {
    expect(await obtenerVenuesTarjeta()).toHaveLength(6);
    const destacados = await obtenerVenuesDestacados();
    expect(destacados.every((v) => v.destacado)).toBe(true);
    const historias = await obtenerHistoriasRecientes();
    expect(historias.map((h) => h.fechaPublicacion)).toEqual(
      [...historias.map((h) => h.fechaPublicacion)].sort().reverse(),
    );
  });

  it('venues similares excluyen al propio venue y priorizan la región', async () => {
    const venue = await obtenerVenue('demo-hacienda-ejemplo-norte');
    expect(venue).not.toBeNull();
    const similares = await obtenerVenuesSimilares(venue!);
    expect(similares.map((v) => v.slug)).not.toContain('demo-hacienda-ejemplo-norte');
    expect(similares[0]?.slug).toBe('demo-hacienda-ejemplo-del-cenote');
  });

  it('un slug inexistente devuelve null', async () => {
    expect(await obtenerVenue('no-existe')).toBeNull();
  });
});
