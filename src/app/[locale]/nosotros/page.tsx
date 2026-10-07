import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { stegaClean } from 'next-sanity';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { obtenerPaginaEditorial } from '@/lib/contenido';
import { localizar } from '@/lib/i18n/localizar';
import { alternativas } from '@/lib/seo/metadatos';
import { PaginaEditorialVista } from '@/components/secciones/PaginaEditorialVista';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/nosotros'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const pagina = await obtenerPaginaEditorial('nosotros');
  if (!pagina) return {};
  return {
    title: stegaClean(localizar(pagina.seo?.titulo ?? pagina.titulo, locale)),
    description: pagina.seo?.descripcion
      ? stegaClean(localizar(pagina.seo.descripcion, locale))
      : undefined,
    alternates: alternativas('/nosotros', locale),
  };
}

export default async function Pagina() {
  const pagina = await obtenerPaginaEditorial('nosotros');
  if (!pagina) notFound();
  return <PaginaEditorialVista pagina={pagina} />;
}
