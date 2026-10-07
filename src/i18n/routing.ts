import { defineRouting } from 'next-intl/routing';

/**
 * Rutas del sitio: mapa general de "Estructura y dirección web" (sección 18, D-038).
 * - Inglés sin prefijo y español con /es (`as-needed`, D-004).
 * - Sin redirección automática por el idioma del navegador (`localeDetection: false`).
 * - Las claves son las rutas internas en español (nombres de carpeta en src/app/[locale]);
 *   los valores son las URL públicas de cada idioma. Las URL en inglés son estables porque
 *   los QR de LOVE MÉXICO apuntan a ellas (Home y Find Your Yucatán).
 */
export const routing = defineRouting({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeDetection: false,
  pathnames: {
    '/': '/',
    '/descubre-yucatan': { en: '/discover-yucatan', es: '/descubre-yucatan' },
    '/descubre-yucatan/[categoria]': {
      en: '/discover-yucatan/[categoria]',
      es: '/descubre-yucatan/[categoria]',
    },
    '/venues': '/venues',
    '/venues/[slug]': '/venues/[slug]',
    '/catering': '/catering',
    '/catering/[slug]': '/catering/[slug]',
    '/fotografia': { en: '/photography', es: '/fotografia' },
    '/fotografia/[slug]': { en: '/photography/[slug]', es: '/fotografia/[slug]' },
    '/diseno-y-produccion': { en: '/design-production', es: '/diseno-y-produccion' },
    '/journal': '/journal',
    '/journal/[slug]': '/journal/[slug]',
    '/nosotros': { en: '/about', es: '/nosotros' },
    '/encuentra-tu-yucatan': { en: '/find-your-yucatan', es: '/encuentra-tu-yucatan' },
    '/planea-tu-evento': { en: '/plan-your-event', es: '/planea-tu-evento' },
    '/privacidad': { en: '/privacy', es: '/privacidad' },
  },
});

export type Idioma = (typeof routing.locales)[number];
export type RutaInterna = keyof typeof routing.pathnames;
