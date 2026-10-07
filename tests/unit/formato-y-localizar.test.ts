import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  formatearFecha,
  formatearNumero,
  formatearTiempo,
  formatearUSD,
  urlGoogleMaps,
} from '@/lib/formato';
import { localizar, localizarBloques } from '@/lib/i18n/localizar';

describe('formato', () => {
  it('números según el idioma', () => {
    expect(formatearNumero(1500, 'en')).toBe('1,500');
    expect(formatearNumero(1500, 'es')).toBe('1,500');
  });

  it('USD con código de moneda y sin decimales', () => {
    expect(formatearUSD(25_000, 'en').replace(/\s/g, ' ')).toBe('USD 25,000');
    expect(formatearUSD(25_000, 'es').replace(/\s/g, ' ')).toBe('USD 25,000');
  });

  it('fechas largas sin desfase por zona horaria', () => {
    expect(formatearFecha('2026-08-20', 'en')).toBe('August 20, 2026');
    expect(formatearFecha('2026-08-20', 'es')).toBe('20 de agosto de 2026');
  });

  it('marcas de tiempo de video', () => {
    expect(formatearTiempo(0)).toBe('0:00');
    expect(formatearTiempo(95)).toBe('1:35');
    expect(formatearTiempo(640)).toBe('10:40');
    expect(formatearTiempo(3723)).toBe('1:02:03');
  });

  it('enlace a Google Maps sin llave de API', () => {
    expect(urlGoogleMaps(20.97, -89.62)).toBe(
      'https://www.google.com/maps/search/?api=1&query=20.97,-89.62',
    );
  });
});

describe('localizar', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('devuelve el idioma pedido', () => {
    expect(localizar({ en: 'Hello', es: 'Hola' }, 'es')).toBe('Hola');
  });

  it('usa el inglés si falta la traducción y avisa solo en desarrollo', () => {
    const aviso = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.stubEnv('NODE_ENV', 'production');
    expect(localizar({ en: 'Hello' }, 'es')).toBe('Hello');
    expect(aviso).not.toHaveBeenCalled();

    vi.stubEnv('NODE_ENV', 'development');
    expect(localizar({ en: 'Hello' }, 'es')).toBe('Hello');
    expect(aviso).toHaveBeenCalledOnce();
  });

  it('bloques con respaldo al inglés', () => {
    const bloque = {
      _type: 'block' as const,
      _key: 'k',
      style: 'normal' as const,
      children: [{ _type: 'span' as const, _key: 's', text: 'Texto' }],
    };
    expect(localizarBloques({ en: [bloque], es: [] }, 'es')).toEqual([bloque]);
    expect(localizarBloques(undefined, 'en')).toEqual([]);
  });
});
