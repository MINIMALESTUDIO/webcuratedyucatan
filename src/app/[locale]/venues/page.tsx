import type { Metadata } from 'next';
import { Suspense } from 'react';
import { hasLocale } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { obtenerRegiones, obtenerVenuesTarjeta } from '@/lib/contenido';
import { localizar } from '@/lib/i18n/localizar';
import { alternativas } from '@/lib/seo/metadatos';
import { FILTROS_VACIOS } from '@/lib/venues/filtros';
import { Contenedor } from '@/components/ui/Contenedor';
import { Migas } from '@/components/ui/Migas';
import { ListadoVenues } from '@/components/secciones/venues/ListadoVenues';
import { ListadoVenuesConUrl } from '@/components/secciones/venues/ListadoVenuesConUrl';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/venues'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'Metadatos' });
  return {
    title: t('venuesTitulo'),
    description: t('venuesDescripcion'),
    alternates: alternativas('/venues', locale),
  };
}

export default async function PaginaVenues() {
  const t = await getTranslations('Venues');
  const tn = await getTranslations('Navegacion');
  const idioma = await getLocale();
  const [venues, regiones] = await Promise.all([obtenerVenuesTarjeta(), obtenerRegiones()]);
  const opcionesRegion = regiones.map((region) => ({
    slug: region.slug,
    nombre: localizar(region.nombre, idioma),
  }));

  return (
    <>
      <Contenedor className="pt-6 pb-10 sm:pb-14">
        <Migas elementos={[{ etiqueta: tn('inicio'), href: '/' }, { etiqueta: t('titulo') }]} />
        <h1 className="mt-6 text-titulo-1">{t('titulo')}</h1>
        <p className="mt-4 max-w-2xl text-destacado text-tinta-suave">{t('entradilla')}</p>
      </Contenedor>
      <Contenedor className="pb-seccion">
        {/*
          La página se genera estática con todos los venues; los filtros de la URL se aplican
          en el cliente. El fallback es el listado completo, así el HTML inicial ya tiene contenido.
        */}
        <Suspense
          fallback={
            <ListadoVenues venues={venues} regiones={opcionesRegion} filtros={FILTROS_VACIOS} />
          }
        >
          <ListadoVenuesConUrl venues={venues} regiones={opcionesRegion} />
        </Suspense>
      </Contenedor>
    </>
  );
}
