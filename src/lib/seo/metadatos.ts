import 'server-only';
import type { Metadata } from 'next';
import { getPathname } from '@/i18n/navigation';
import { type Idioma, routing } from '@/i18n/routing';
import { urlSitio } from '@/lib/sitio';

type Destino = Parameters<typeof getPathname>[0]['href'];

/** URL canónica y alternativas por idioma (hreflang), con inglés como x-default. */
export function alternativas(href: Destino, idioma: Idioma): Metadata['alternates'] {
  const url = (locale: Idioma) => `${urlSitio()}${getPathname({ href, locale })}`;
  const idiomas = Object.fromEntries(routing.locales.map((locale) => [locale, url(locale)]));
  return {
    canonical: url(idioma),
    languages: { ...idiomas, 'x-default': url(routing.defaultLocale) },
  };
}
