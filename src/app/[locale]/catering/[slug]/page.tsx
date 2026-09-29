import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { stegaClean } from 'next-sanity';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { getPathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { obtenerProveedor, obtenerSlugActual, obtenerSlugsProveedores } from '@/lib/contenido';
import { localizar } from '@/lib/i18n/localizar';
import { alternativas } from '@/lib/seo/metadatos';
import { Contenedor } from '@/components/ui/Contenedor';
import { Migas } from '@/components/ui/Migas';
import { PerfilProveedor } from '@/components/secciones/proveedores/PerfilProveedor';

export async function generateStaticParams() {
  const slugs = await obtenerSlugsProveedores('catering');
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/catering/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const proveedor = await obtenerProveedor('catering', slug);
  if (!proveedor) return {};
  return {
    title: stegaClean(
      proveedor.seo?.titulo ? localizar(proveedor.seo.titulo, locale) : proveedor.nombre,
    ),
    description: stegaClean(localizar(proveedor.seo?.descripcion ?? proveedor.resumen, locale)),
    alternates: alternativas({ pathname: '/catering/[slug]', params: { slug } }, locale),
  };
}

export default async function Pagina({ params }: PageProps<'/[locale]/catering/[slug]'>) {
  const { slug, locale } = await params;
  const proveedor = await obtenerProveedor('catering', slug);
  if (!proveedor) {
    // Slug cambiado en Sanity: redirección permanente 308 al vigente (D-020).
    const slugActual = await obtenerSlugActual('proveedor', slug);
    if (slugActual) {
      permanentRedirect(
        getPathname({
          href: { pathname: '/catering/[slug]', params: { slug: slugActual } },
          locale: locale as (typeof routing.locales)[number],
        }),
      );
    }
    notFound();
  }
  const tn = await getTranslations('Navegacion');

  return (
    <>
      <Contenedor className="py-2">
        <Migas
          elementos={[
            { etiqueta: tn('inicio'), href: '/' },
            { etiqueta: tn('catering'), href: '/catering' },
            { etiqueta: proveedor.nombre },
          ]}
        />
      </Contenedor>
      <PerfilProveedor proveedor={proveedor} />
    </>
  );
}
