import type { Metadata, Viewport } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { sanityConfigurado } from '@/lib/sanity/configuracion';
import { EdicionVisual } from '@/components/edicion/EdicionVisual';
import { clasesTipograficas } from '@/estilos/tipografia';
import { sitioIndexable, urlSitio } from '@/lib/sitio';
import { elegir } from '@/lib/utilidades';
import { Encabezado } from '@/components/secciones/Encabezado';
import { Pie } from '@/components/secciones/Pie';
import '@/estilos/globales.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'Metadatos' });
  return {
    metadataBase: new URL(urlSitio()),
    title: { default: t('tituloSitio'), template: `%s · ${t('tituloSitio')}` },
    description: t('descripcionSitio'),
    robots: sitioIndexable() ? undefined : { index: false, follow: false },
    openGraph: {
      siteName: t('tituloSitio'),
      locale: locale === 'es' ? 'es_MX' : 'en_US',
      type: 'website',
    },
  };
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  colorScheme: 'light',
};

// Namespaces de mensajes que usan los componentes de cliente.
const MENSAJES_CLIENTE = [
  'Comun',
  'Navegacion',
  'Inicio',
  'Venues',
  'Venue',
  'Proveedores',
  'Encuentra',
  'Formularios',
] as const;

// Layout raíz: el segmento [locale] es un parámetro raíz (next/root-params).
export default async function LayoutRaiz({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const mensajes = await getMessages();
  const t = await getTranslations('Comun');
  // La edición visual solo se carga en modo borrador (desde "Editar en la página" del Studio):
  // los visitantes no descargan su código (D-034). Al editar, VisualEditing refresca la página
  // desde el servidor, que lee los borradores con su token.
  const vistaPrevia = sanityConfigurado() && (await draftMode()).isEnabled;

  return (
    <html lang={locale} className={clasesTipograficas}>
      <body className="bg-papel text-tinta">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-tinta focus:px-4 focus:py-3 focus:text-papel"
        >
          {t('saltarAlContenido')}
        </a>
        <NextIntlClientProvider messages={elegir(mensajes, MENSAJES_CLIENTE)}>
          <Encabezado />
          <main id="contenido">{children}</main>
          <Pie />
          {vistaPrevia && <EdicionVisual />}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
