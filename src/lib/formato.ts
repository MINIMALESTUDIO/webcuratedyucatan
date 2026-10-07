import type { Idioma } from '@/lib/contenido/tipos';

/** Configuración regional de Intl para cada idioma del sitio. */
const REGION_INTL: Record<Idioma, string> = { en: 'en-US', es: 'es-MX' };

export function formatearNumero(valor: number, idioma: Idioma): string {
  return new Intl.NumberFormat(REGION_INTL[idioma]).format(valor);
}

/**
 * Montos en USD con el código de moneda visible ("USD 25,000"), porque el símbolo $ es
 * ambiguo para el público de Canadá y de México.
 */
export function formatearUSD(valor: number, idioma: Idioma): string {
  return new Intl.NumberFormat(REGION_INTL[idioma], {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'code',
    maximumFractionDigits: 0,
  }).format(valor);
}

/** Fecha ISO (AAAA-MM-DD) en formato largo del idioma, sin desfase de zona horaria. */
export function formatearFecha(fechaISO: string, idioma: Idioma): string {
  return new Intl.DateTimeFormat(REGION_INTL[idioma], {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(`${fechaISO}T00:00:00Z`));
}

/** Segundos a marca de tiempo de video: 95 → "1:35", 3723 → "1:02:03". */
export function formatearTiempo(segundos: number): string {
  const total = Math.max(0, Math.floor(segundos));
  const horas = Math.floor(total / 3600);
  const minutos = Math.floor((total % 3600) / 60);
  const resto = String(total % 60).padStart(2, '0');
  return horas > 0
    ? `${horas}:${String(minutos).padStart(2, '0')}:${resto}`
    : `${minutos}:${resto}`;
}

/** Enlace a Google Maps a partir de un geopunto, sin llave de API (D-019). */
export function urlGoogleMaps(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}
