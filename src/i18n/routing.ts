import { defineRouting } from 'next-intl/routing';

/**
 * Rutas del sitio (sección 4 de docs/PROMPT.md, decisión D-004).
 * - Inglés sin prefijo y español con /es (`as-needed`).
 * - Sin redirección automática por el idioma del navegador (`localeDetection: false`).
 * - Las claves son las rutas internas en español (nombres de carpeta en src/app/[locale]);
 *   los valores son las URL públicas de cada idioma.
 */
export const routing = defineRouting({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeDetection: false,
  pathnames: {
    '/': '/',
    '/venues': '/venues',
    '/venues/[slug]': '/venues/[slug]',
    '/proveedores': { en: '/vendors', es: '/proveedores' },
    '/proveedores/[slug]': { en: '/vendors/[slug]', es: '/proveedores/[slug]' },
    '/fin-de-semana': { en: '/wedding-weekend', es: '/fin-de-semana' },
    '/planea-tu-boda': { en: '/plan-your-wedding', es: '/planea-tu-boda' },
    '/venue-tours': '/venue-tours',
    '/guia': { en: '/guide', es: '/guia' },
    '/historias': { en: '/stories', es: '/historias' },
    '/historias/[slug]': { en: '/stories/[slug]', es: '/historias/[slug]' },
    '/asesoria': { en: '/planning-assistance', es: '/asesoria' },
    '/aliados': { en: '/partners', es: '/aliados' },
    '/mi-lista': { en: '/shortlist', es: '/mi-lista' },
    '/mi-lista/[id]': { en: '/shortlist/[id]', es: '/mi-lista/[id]' },
    '/privacidad': { en: '/privacy', es: '/privacidad' },
  },
});

export type Idioma = (typeof routing.locales)[number];
export type RutaInterna = keyof typeof routing.pathnames;
