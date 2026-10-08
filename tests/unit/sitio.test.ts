import { describe, expect, it } from 'vitest';
import { normalizarUrlSitio } from '@/lib/sitio';

describe('normalizarUrlSitio', () => {
  it('agrega https:// si falta el protocolo (caso real de Hostinger)', () => {
    expect(normalizarUrlSitio('ivory-kingfisher-466902.hostingersite.com')).toBe(
      'https://ivory-kingfisher-466902.hostingersite.com',
    );
  });

  it('respeta el protocolo y quita espacios y "/" finales', () => {
    expect(normalizarUrlSitio(' https://curatedyucatan.com/ ')).toBe('https://curatedyucatan.com');
    expect(normalizarUrlSitio('http://localhost:3000//')).toBe('http://localhost:3000');
  });

  it('sin valor usa localhost', () => {
    expect(normalizarUrlSitio(undefined)).toBe('http://localhost:3000');
    expect(normalizarUrlSitio('   ')).toBe('http://localhost:3000');
  });

  it('el resultado siempre es una URL válida', () => {
    for (const valor of ['ejemplo.com', 'https://ejemplo.com/', undefined]) {
      expect(() => new URL(normalizarUrlSitio(valor))).not.toThrow();
    }
  });
});
