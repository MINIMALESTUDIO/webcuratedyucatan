import * as rootParams from 'next/root-params';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

/**
 * Configuración de next-intl por petición. En Next 16.3+ el idioma se lee del segmento raíz
 * [locale] con next/root-params, lo que permite generar las páginas de forma estática.
 */
export default getRequestConfig(async ({ locale }) => {
  let idioma = locale;
  if (!idioma) {
    const valor = await rootParams.locale();
    if (!hasLocale(routing.locales, valor)) notFound();
    idioma = valor;
  }

  return {
    locale: idioma,
    messages: (await import(`./mensajes/${idioma}.json`)).default,
  };
});
