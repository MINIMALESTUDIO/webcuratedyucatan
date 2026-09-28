import 'server-only';

/** URL pública del sitio sin "/" final. */
export function urlSitio(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
}

/** El sitio solo se deja indexar con SITIO_INDEXABLE=true (D-028). Se lee en el build. */
export function sitioIndexable(): boolean {
  return process.env.SITIO_INDEXABLE === 'true';
}
