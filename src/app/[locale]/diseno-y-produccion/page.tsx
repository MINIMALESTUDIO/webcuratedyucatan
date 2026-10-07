import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { obtenerDisenoProduccion } from '@/lib/contenido';
import { localizar, localizarBloques } from '@/lib/i18n/localizar';
import { alternativas } from '@/lib/seo/metadatos';
import { cx } from '@/lib/utilidades';
import { BotonEnlace } from '@/components/ui/Boton';
import { Contenedor } from '@/components/ui/Contenedor';
import { ImagenContenido } from '@/components/ui/ImagenContenido';
import { Sobretitulo } from '@/components/ui/Sobretitulo';
import { EncabezadoSeccion } from '@/components/secciones/EncabezadoSeccion';
import { Mosaico } from '@/components/secciones/Mosaico';
import { TextoEnriquecido } from '@/components/secciones/TextoEnriquecido';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/diseno-y-produccion'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'Metadatos' });
  const tn = await getTranslations({ locale, namespace: 'Navegacion' });
  return {
    title: tn('diseno'),
    description: t('disenoDescripcion'),
    alternates: alternativas('/diseno-y-produccion', locale),
  };
}

/**
 * Design & Production (documento de estructura, sección 10): Minimal no se presenta como parte
 * de un directorio, sino como "Curated Design & Production Partner", con cada área que cubre.
 */
export default async function PaginaDiseno() {
  const [diseno, t, idioma] = await Promise.all([
    obtenerDisenoProduccion(),
    getTranslations('Diseno'),
    getLocale(),
  ]);

  return (
    <>
      <section>
        <div className="relative h-[52svh] min-h-72 overflow-hidden bg-arena lg:h-[64svh]">
          <ImagenContenido
            imagen={diseno.imagenPrincipal}
            edicion={{ id: diseno._id, tipo: 'disenoProduccion', ruta: 'imagenPrincipal' }}
            sizes="100vw"
            preload
          />
        </div>
        <Contenedor className="flex flex-col items-center pt-14 text-center sm:pt-20">
          <Sobretitulo>{t('titulo')}</Sobretitulo>
          <h1 className="mt-5 text-titulo-1 tracking-[0.3em]">{diseno.nombre}</h1>
          <p className="mt-5 text-destacado text-tinta-suave italic">
            {localizar(diseno.lema, idioma)}
          </p>
        </Contenedor>
      </section>

      <section className="py-seccion">
        <Contenedor className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <TextoEnriquecido
            valor={localizarBloques(diseno.descripcion, idioma)}
            className="text-destacado lg:col-span-7"
          />
          <dl className="flex flex-col gap-8 lg:col-span-5">
            {[
              [t('estilo'), localizar(diseno.estilo, idioma)],
              [t('experiencia'), localizar(diseno.experiencia, idioma)],
              [t('cobertura', { ciudad: diseno.ciudadBase }), localizar(diseno.cobertura, idioma)],
            ].map(([etiqueta, valor]) => (
              <div key={etiqueta} className="border-t border-linea pt-6">
                <dt className="etiqueta text-tinta-suave">{etiqueta}</dt>
                <dd className="mt-3 text-sm">{valor}</dd>
              </div>
            ))}
            {diseno.servicios.length > 0 && (
              <div className="border-t border-linea pt-6">
                <dt className="etiqueta text-tinta-suave">{t('servicios')}</dt>
                <dd className="mt-3">
                  <ul className="flex flex-col gap-2 text-sm">
                    {diseno.servicios.map((servicio) => (
                      <li key={servicio._key}>{localizar(servicio.texto, idioma)}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
          </dl>
        </Contenedor>
      </section>

      <section aria-labelledby="areas" className="border-t border-linea py-seccion">
        <Contenedor>
          <EncabezadoSeccion id="areas" titulo={t('areas')} />
          <ol className="mt-16 flex flex-col gap-24">
            {diseno.areas.map((area, i) => (
              <li key={area._key} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
                <div className={cx('lg:col-span-7', i % 2 === 1 && 'lg:order-2')}>
                  <Mosaico
                    imagenes={area.imagenes}
                    origen={{
                      id: diseno._id,
                      tipo: 'disenoProduccion',
                      arreglo: `areas[_key=="${area._key}"].imagenes`,
                    }}
                  />
                </div>
                <div className="lg:col-span-5">
                  <span className="font-marca text-xs tracking-[0.2em] text-tinta-suave">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-3 text-titulo-2">{localizar(area.nombre, idioma)}</h3>
                  <p className="mt-5 text-tinta-suave">{localizar(area.descripcion, idioma)}</p>
                </div>
              </li>
            ))}
          </ol>
        </Contenedor>
      </section>

      <section aria-labelledby="planea-diseno" className="bg-papel-calido py-seccion">
        <Contenedor ancho="lectura" className="flex flex-col items-center text-center">
          <h2 id="planea-diseno" className="text-titulo-2">
            {t('cta')}
          </h2>
          <p className="mt-6 text-tinta-suave">{t('ctaTexto')}</p>
          <BotonEnlace
            href={{
              pathname: '/planea-tu-evento',
              query: { buscando: 'diseno-produccion', origen: 'diseno' },
            }}
            variante="primario"
            className="mt-10"
          >
            {t('cta')}
          </BotonEnlace>
        </Contenedor>
      </section>
    </>
  );
}
