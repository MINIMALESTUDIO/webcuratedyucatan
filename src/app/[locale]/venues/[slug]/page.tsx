import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { stegaClean } from 'next-sanity';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { getPathname } from '@/i18n/navigation';
import {
  obtenerSlugActual,
  obtenerSlugsVenues,
  obtenerVenue,
  obtenerVenuesSimilares,
} from '@/lib/contenido';
import { localizar } from '@/lib/i18n/localizar';
import { alternativas } from '@/lib/seo/metadatos';
import { Contenedor } from '@/components/ui/Contenedor';
import { Migas } from '@/components/ui/Migas';
import { BarraCtaMovil } from '@/components/secciones/venue/BarraCtaMovil';
import { FichaTecnica } from '@/components/secciones/venue/FichaTecnica';
import { Galeria } from '@/components/secciones/venue/Galeria';
import { HeroVenue } from '@/components/secciones/venue/HeroVenue';
import {
  DescripcionVenue,
  SeccionCitas,
  SeccionDisponibilidad,
  SeccionEntrevista,
  SeccionEspacios,
  SeccionProveedores,
  SeccionSimilares,
} from '@/components/secciones/venue/SeccionesVenue';

// Todas las fichas se generan en el build (D-024).
export async function generateStaticParams() {
  const slugs = await obtenerSlugsVenues();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/venues/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const venue = await obtenerVenue(slug);
  if (!venue) return {};
  return {
    // En modo borrador los textos llevan stega: se limpian para el <title> y la descripción.
    title: stegaClean(venue.seo?.titulo ? localizar(venue.seo.titulo, locale) : venue.nombre),
    description: stegaClean(localizar(venue.seo?.descripcion ?? venue.resumen, locale)),
    alternates: alternativas({ pathname: '/venues/[slug]', params: { slug } }, locale),
    openGraph: { images: [{ url: venue.media.imagenHero.url, width: 1200, height: 750 }] },
  };
}

export default async function PaginaVenue({ params }: PageProps<'/[locale]/venues/[slug]'>) {
  const { slug } = await params;
  const venue = await obtenerVenue(slug);
  if (!venue) {
    // Slug cambiado en Sanity: redirección permanente 308 al vigente (D-020).
    const slugActual = await obtenerSlugActual(slug);
    if (slugActual) {
      const { locale } = await params;
      permanentRedirect(
        getPathname({
          href: { pathname: '/venues/[slug]', params: { slug: slugActual } },
          locale: locale as (typeof routing.locales)[number],
        }),
      );
    }
    notFound();
  }

  const [similares, tn, tv] = await Promise.all([
    obtenerVenuesSimilares(venue),
    getTranslations('Navegacion'),
    getTranslations('Venues'),
  ]);

  // El espacio para la barra fija móvil lo reserva globales.css (body:has([data-barra-fija])),
  // así tampoco tapa el pie.
  return (
    <>
      <Contenedor className="py-2">
        <Migas
          elementos={[
            { etiqueta: tn('inicio'), href: '/' },
            { etiqueta: tv('titulo'), href: '/venues' },
            { etiqueta: venue.nombre },
          ]}
        />
      </Contenedor>
      <HeroVenue venue={venue} />

      <section className="py-seccion">
        <Contenedor className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <DescripcionVenue venue={venue} />
          </div>
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <FichaTecnica ficha={venue.fichaTecnica} venueId={venue._id} />
            </div>
          </div>
        </Contenedor>
      </section>

      <SeccionEntrevista venue={venue} />
      <SeccionEspacios venue={venue} />
      <Galeria imagenes={venue.media.galeria} venueId={venue._id} />
      <SeccionCitas venue={venue} />
      <SeccionProveedores venue={venue} />
      <SeccionDisponibilidad venue={venue} />
      <SeccionSimilares venues={similares} />
      <BarraCtaMovil />
    </>
  );
}
