import type { Metadata } from 'next';
import { Suspense } from 'react';
import { hasLocale } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { obtenerColecciones, obtenerRegiones, obtenerVenuesTarjeta } from '@/lib/contenido';
import { localizar } from '@/lib/i18n/localizar';
import { alternativas } from '@/lib/seo/metadatos';
import { FILTROS_VACIOS } from '@/lib/venues/filtros';
import { Contenedor } from '@/components/ui/Contenedor';
import { EncabezadoSeccion } from '@/components/secciones/EncabezadoSeccion';
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
  const idioma = await getLocale();
  const [venues, colecciones, regiones] = await Promise.all([
    obtenerVenuesTarjeta(),
    obtenerColecciones(),
    obtenerRegiones(),
  ]);
  const opcionesColeccion = colecciones.map((c) => ({
    _id: c._id,
    slug: c.slug,
    nombre: localizar(c.nombre, idioma),
    lema: localizar(c.lema, idioma),
    imagen: c.imagen,
  }));
  const opcionesRegion = regiones.map((r) => ({
    slug: r.slug,
    nombre: localizar(r.nombre, idioma),
  }));

  return (
    <>
      <Contenedor className="pt-16 pb-14 sm:pt-20">
        <EncabezadoSeccion nivel="h1" titulo={t('titulo')} entradilla={t('entradilla')} />
      </Contenedor>
      <Contenedor className="pb-seccion">
        {/*
          La página se genera estática con todos los venues; los filtros de la URL se aplican
          en el cliente. El fallback es el listado completo, así el HTML inicial ya tiene contenido.
        */}
        <Suspense
          fallback={
            <ListadoVenues
              venues={venues}
              colecciones={opcionesColeccion}
              regiones={opcionesRegion}
              filtros={FILTROS_VACIOS}
            />
          }
        >
          <ListadoVenuesConUrl
            venues={venues}
            colecciones={opcionesColeccion}
            regiones={opcionesRegion}
          />
        </Suspense>
      </Contenedor>
    </>
  );
}
