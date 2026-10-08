import 'server-only';

/**
 * Normaliza la URL pública: sin espacios ni "/" final, y con https:// si falta el protocolo.
 * En Hostinger la variable se cargó una vez sin protocolo y `new URL()` tumbó el build.
 */
export function normalizarUrlSitio(valor: string | undefined): string {
  const limpio = (valor ?? '').trim().replace(/\/+$/, '');
  if (!limpio) return 'http://localhost:3000';
  return /^https?:\/\//i.test(limpio) ? limpio : `https://${limpio}`;
}

/** URL pública del sitio sin "/" final. */
export function urlSitio(): string {
  return normalizarUrlSitio(process.env.NEXT_PUBLIC_SITE_URL);
}

/** El sitio solo se deja indexar con SITIO_INDEXABLE=true (D-028). Se lee en el build. */
export function sitioIndexable(): boolean {
  return process.env.SITIO_INDEXABLE === 'true';
}
