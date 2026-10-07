import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { obtenerProveedores } from '@/lib/contenido';
import { alternativas } from '@/lib/seo/metadatos';
import { ListadoProveedores } from '@/components/secciones/proveedores/ListadoProveedores';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/catering'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'Metadatos' });
  return {
    title: t('cateringTitulo'),
    description: t('cateringDescripcion'),
    alternates: alternativas('/catering', locale),
  };
}

export default async function Pagina() {
  return <ListadoProveedores tipo="catering" proveedores={await obtenerProveedores('catering')} />;
}
