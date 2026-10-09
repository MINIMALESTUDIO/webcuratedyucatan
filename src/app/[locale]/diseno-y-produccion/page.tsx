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
import { Icono } from '@/components/ui/Icono';
import { ImagenContenido } from '@/components/ui/ImagenContenido';
import { Sobretitulo } from '@/components/ui/Sobretitulo';
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
 * Design & Production (D-052): tres marcas especializadas (Minimal, Más que Ayer y Otro Cielo)
 * con una visión compartida. Hero → introducción → una sección por marca → experiencia en
 * destino → cierre con solicitud de información.
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
        <Contenedor
          ancho="lectura"
          className="flex flex-col items-center pt-14 text-center sm:pt-20"
        >
          <Sobretitulo>{t('titulo')}</Sobretitulo>
          <h1 className="mt-5 text-titulo-1">{localizar(diseno.titular, idioma)}</h1>
          <p className="mt-6 text-destacado text-tinta-suave">
            {localizar(diseno.entradilla, idioma)}
          </p>
          <p className="mt-8 font-marca text-xs tracking-[0.3em] uppercase">
            {diseno.marcas.map((marca) => marca.nombre).join(' · ')}
          </p>
        </Contenedor>
      </section>

      <section aria-labelledby="introduccion" className="py-seccion">
        <Contenedor ancho="lectura">
          <h2 id="introduccion" className="text-center text-titulo-2">
            {localizar(diseno.introduccion.titulo, idioma)}
          </h2>
          <TextoEnriquecido
            valor={localizarBloques(diseno.introduccion.texto, idioma)}
            className="mt-10 text-tinta-suave"
          />
        </Contenedor>
      </section>

      {diseno.marcas.map((marca, i) => {
        const id = `marca-${marca._key}`;
        return (
          <section
            key={marca._key}
            aria-labelledby={id}
            className="border-t border-linea py-seccion"
          >
            <Contenedor className="grid items-start gap-10 lg:grid-cols-12 lg:gap-16">
              <div className={cx('lg:col-span-7', i % 2 === 1 && 'lg:order-2')}>
                <Mosaico
                  imagenes={marca.imagenes}
                  origen={{
                    id: diseno._id,
                    tipo: 'disenoProduccion',
                    arreglo: `marcas[_key=="${marca._key}"].imagenes`,
                  }}
                />
              </div>
              <div className="lg:col-span-5">
                <Sobretitulo>{localizar(marca.categoria, idioma)}</Sobretitulo>
                <h2 id={id} className="mt-4 titulo-nombre text-nombre">
                  {marca.nombre}
                </h2>
                <p className="mt-4 text-destacado text-tinta-suave italic">
                  {localizar(marca.titular, idioma)}
                </p>
                <TextoEnriquecido
                  valor={localizarBloques(marca.descripcion, idioma)}
                  className="mt-8 text-tinta-suave"
                />
                {marca.servicios.length > 0 && (
                  <div className="mt-10 border-t border-linea pt-6">
                    <h3 className="etiqueta font-texto text-tinta-suave">{t('servicios')}</h3>
                    <ul className="mt-4 flex flex-col gap-2 text-sm">
                      {marca.servicios.map((servicio) => (
                        <li key={servicio._key}>{localizar(servicio.texto, idioma)}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {marca.notasCurated && (
                  <div className="mt-10 border-t border-linea pt-6">
                    <h3 className="etiqueta font-texto text-tinta-suave">{t('notas')}</h3>
                    <TextoEnriquecido
                      valor={localizarBloques(marca.notasCurated, idioma)}
                      className="mt-4 text-sm"
                    />
                  </div>
                )}
                {marca.sitioWeb && (
                  <a
                    href={marca.sitioWeb}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="enlace-accion mt-10"
                  >
                    {t('descubrir', { marca: marca.nombre })}
                    <Icono nombre="externo" className="size-4" />
                    <span className="sr-only">{t('externo')}</span>
                  </a>
                )}
              </div>
            </Contenedor>
          </section>
        );
      })}

      <section aria-labelledby="destino" className="bg-papel-calido py-seccion">
        <Contenedor ancho="lectura" className="text-center">
          <Sobretitulo>{localizar(diseno.experienciaDestino.sobretitulo, idioma)}</Sobretitulo>
          <h2 id="destino" className="mt-4 text-titulo-2">
            {localizar(diseno.experienciaDestino.titulo, idioma)}
          </h2>
          <TextoEnriquecido
            valor={localizarBloques(diseno.experienciaDestino.texto, idioma)}
            className="mt-10 text-left text-tinta-suave"
          />
        </Contenedor>
      </section>

      <section aria-labelledby="cierre-diseno" className="py-seccion">
        <Contenedor ancho="lectura" className="flex flex-col items-center text-center">
          <h2 id="cierre-diseno" className="text-titulo-2">
            {localizar(diseno.cierre.titulo, idioma)}
          </h2>
          <p className="mt-6 text-tinta-suave">{localizar(diseno.cierre.texto, idioma)}</p>
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
