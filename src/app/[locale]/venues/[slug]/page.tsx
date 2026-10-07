import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { stegaClean } from 'next-sanity';
import { hasLocale } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';
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
import { DatosClave } from '@/components/secciones/venue/DatosClave';
import { Galeria } from '@/components/secciones/venue/Galeria';
import { HeroVenue } from '@/components/secciones/venue/HeroVenue';
import {
  SeccionEspacios,
  SeccionNotas,
  SeccionPelicula,
  SeccionSimilares,
  SeccionSolicitud,
  SobreVenue,
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

/**
 * Perfil de venue con la estructura base del documento (sección 7): Hero, Quick facts, About,
 * Spaces, Curated Notes, Gallery y Request information. Se suman la película de la serie
 * "El Lugar de Tu Historia" (libro) y más venues de la misma colección.
 */
export default async function PaginaVenue({ params }: PageProps<'/[locale]/venues/[slug]'>) {
  const { slug } = await params;
  const venue = await obtenerVenue(slug);
  if (!venue) {
    // Slug cambiado en Sanity: redirección permanente 308 al vigente (D-020).
    const slugActual = await obtenerSlugActual('venue', slug);
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

  const [similares, tn, tv, idioma] = await Promise.all([
    obtenerVenuesSimilares(venue),
    getTranslations('Navegacion'),
    getTranslations('Venues'),
    getLocale(),
  ]);

  // El espacio para la barra fija móvil lo reserva globales.css (body:has([data-barra-fija])).
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
      <DatosClave venue={venue} />
      <SobreVenue venue={venue} />
      <SeccionPelicula venue={venue} />
      <SeccionEspacios venue={venue} />
      <SeccionNotas venue={venue} />
      <Galeria
        imagenes={venue.media.galeria}
        origen={{ id: venue._id, tipo: 'venue', arreglo: 'media.galeria' }}
      />
      <SeccionSolicitud venue={venue} />
      <SeccionSimilares venues={similares} coleccion={localizar(venue.coleccion.nombre, idioma)} />
      <BarraCtaMovil />
    </>
  );
}
