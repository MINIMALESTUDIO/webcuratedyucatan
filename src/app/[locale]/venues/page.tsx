import type { Metadata } from 'next';
import { Suspense } from 'react';
import { hasLocale } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import {
  obtenerColecciones,
  obtenerConfiguracionSitio,
  obtenerRegiones,
  obtenerVenuesTarjeta,
} from '@/lib/contenido';
import { localizar } from '@/lib/i18n/localizar';
import { alternativas } from '@/lib/seo/metadatos';
import { FILTROS_VACIOS } from '@/lib/venues/filtros';
import { clasesBoton } from '@/components/ui/Boton';
import { Contenedor } from '@/components/ui/Contenedor';
import { Icono } from '@/components/ui/Icono';
import { ImagenContenido } from '@/components/ui/ImagenContenido';
import { Sobretitulo } from '@/components/ui/Sobretitulo';
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
  const [venues, colecciones, regiones, configuracion] = await Promise.all([
    obtenerVenuesTarjeta(),
    obtenerColecciones(),
    obtenerRegiones(),
    obtenerConfiguracionSitio(),
  ]);
  const serie = configuracion.lugarDeTuHistoria;
  const opcionesColeccion = colecciones.map((c) => ({
    _id: c._id,
    slug: c.slug,
    nombre: localizar(c.nombre, idioma),
    lema: localizar(c.lema, idioma),
    imagen: c.imagen,
  }));
  // Solo las ubicaciones con algún venue: una opción sin resultados no ayuda a filtrar.
  const opcionesRegion = regiones
    .filter((r) => venues.some((v) => v.region.slug === r.slug))
    .map((r) => ({
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

      {serie && (
        <section aria-labelledby="serie" className="border-t border-linea py-seccion">
          <Contenedor
            className={
              serie.imagen ? 'grid items-center gap-10 lg:grid-cols-12 lg:gap-16' : undefined
            }
          >
            {serie.imagen && (
              <div className="relative aspect-[3/2] overflow-hidden bg-arena lg:col-span-7">
                <ImagenContenido
                  imagen={serie.imagen}
                  edicion={{
                    id: configuracion._id,
                    tipo: 'configuracionSitio',
                    ruta: 'lugarDeTuHistoria.imagen',
                  }}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                />
              </div>
            )}
            <div
              className={
                serie.imagen
                  ? 'lg:col-span-5'
                  : 'mx-auto flex max-w-2xl flex-col items-center text-center'
              }
            >
              {serie.sobretitulo && (
                <Sobretitulo>{localizar(serie.sobretitulo, idioma)}</Sobretitulo>
              )}
              <h2 id="serie" className="mt-4 text-titulo-1">
                {localizar(serie.titulo, idioma)}
              </h2>
              <p className="mt-6 text-tinta-suave">{localizar(serie.texto, idioma)}</p>
              <a
                href={serie.enlace}
                target="_blank"
                rel="noopener noreferrer"
                className={clasesBoton('primario', 'mt-10')}
              >
                {t('serie.cta')}
                <Icono nombre="externo" className="size-4" />
                <span className="sr-only">{t('serie.externo')}</span>
              </a>
            </div>
          </Contenedor>
        </section>
      )}
    </>
  );
}
