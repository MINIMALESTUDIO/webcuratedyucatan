import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

/*
 * El codificador propio de data-sanity (src/lib/sanity/edicion.ts) debe producir exactamente lo
 * mismo que createDataAttribute de next-sanity, que no se carga en el navegador (D-034).
 */

async function cargar() {
  vi.resetModules();
  vi.stubEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', 'abc123');
  vi.stubEnv('NEXT_PUBLIC_SANITY_DATASET', 'production');
  vi.stubEnv('NEXT_PUBLIC_SANITY_STUDIO_URL', 'https://curatedyucatan.sanity.studio');
  const propio = await import('@/lib/sanity/edicion');
  const { createDataAttribute } = await import('next-sanity');
  return { ...propio, createDataAttribute };
}

describe('atributoEdicion', () => {
  // La primera importación de next-sanity tarda varios segundos en frío: se precalienta aquí
  // con un tope amplio para que no cuente dentro del tiempo de cada caso.
  beforeAll(async () => {
    await import('next-sanity');
  }, 60_000);

  afterEach(() => vi.unstubAllEnvs());

  const casos: Array<[string, string, string]> = [
    ['campo simple', 'media.imagenHero', 'media.imagenHero'],
    ['elemento por clave', 'media.galeria:k1', 'media.galeria[_key=="k1"]'],
    ['elemento por índice', 'imagenes:0', 'imagenes[0]'],
    ['clave anidada', 'espacios:e1.imagenes:i2', 'espacios[_key=="e1"].imagenes[_key=="i2"]'],
  ];

  for (const [nombre, rutaPropia, rutaOficial] of casos) {
    it(`coincide con createDataAttribute: ${nombre}`, async () => {
      const { atributoEdicion, createDataAttribute } = await cargar();
      const oficial = createDataAttribute({
        projectId: 'abc123',
        dataset: 'production',
        baseUrl: 'https://curatedyucatan.sanity.studio',
        id: 'drafts.venue-1',
        type: 'venue',
        path: rutaOficial,
      }).toString();
      expect(atributoEdicion({ id: 'drafts.venue-1', tipo: 'venue', ruta: rutaPropia })).toBe(
        oficial,
      );
    });
  }

  it('rutaElemento arma la ruta con clave, índice o sin clave', async () => {
    const { rutaElemento } = await cargar();
    expect(rutaElemento('media.galeria', 'k1')).toBe('media.galeria:k1');
    expect(rutaElemento('imagenes', 0)).toBe('imagenes:0');
    expect(rutaElemento('tradiciones.elementos', 't1', '.imagen')).toBe(
      'tradiciones.elementos:t1.imagen',
    );
    expect(rutaElemento('media.galeria', undefined)).toBe('media.galeria');
  });

  it('sin proyecto de Sanity (modo DEMO) no agrega atributo', async () => {
    vi.resetModules();
    vi.stubEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', '');
    const { atributoEdicion } = await import('@/lib/sanity/edicion');
    expect(
      atributoEdicion({ id: 'venue-1', tipo: 'venue', ruta: 'media.imagenHero' }),
    ).toBeUndefined();
  });
});
