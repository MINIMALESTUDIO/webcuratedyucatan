import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { obtenerDescubreYucatan } from '@/lib/contenido';
import { localizar, localizarBloques } from '@/lib/i18n/localizar';
import { alternativas } from '@/lib/seo/metadatos';
import { cx } from '@/lib/utilidades';
import { BotonEnlace } from '@/components/ui/Boton';
import { Contenedor } from '@/components/ui/Contenedor';
import { ImagenContenido } from '@/components/ui/ImagenContenido';
import { Sobretitulo } from '@/components/ui/Sobretitulo';
import { Mosaico } from '@/components/secciones/Mosaico';
import { TextoEnriquecido } from '@/components/secciones/TextoEnriquecido';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/descubre-yucatan'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'Metadatos' });
  const tn = await getTranslations({ locale, namespace: 'Navegacion' });
  return {
    title: tn('descubre'),
    description: t('descubreDescripcion'),
    alternates: alternativas('/descubre-yucatan', locale),
  };
}

/**
 * Discover Yucatán (documento de estructura, sección 5): presenta y vende el destino antes que
 * los servicios. Editorial y muy visual; termina conectando con Explore venues.
 */
export default async function PaginaDescubre() {
  const [descubre, t, idioma] = await Promise.all([
    obtenerDescubreYucatan(),
    getTranslations('Descubre'),
    getLocale(),
  ]);

  return (
    <>
      <section className="relative isolate flex min-h-[70svh] items-center justify-center overflow-hidden bg-tinta text-papel">
        <ImagenContenido
          imagen={descubre.imagenPrincipal}
          edicion={{ id: descubre._id, tipo: 'descubreYucatan', ruta: 'imagenPrincipal' }}
          sizes="100vw"
          preload
          className="-z-20 object-cover"
        />
        <div className="velo absolute inset-0 -z-10" aria-hidden="true" />
        <div className="flex flex-col items-center px-margen py-28 text-center">
          <h1 className="text-display tracking-[0.2em] text-papel">
            {localizar(descubre.titulo, idioma)}
          </h1>
        </div>
      </section>

      <Contenedor ancho="lectura" className="py-seccion text-center">
        <p className="text-destacado">{localizar(descubre.entradilla, idioma)}</p>
        <nav aria-label={localizar(descubre.titulo, idioma)} className="mt-10">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-1">
            {descubre.secciones.map((seccion) => (
              <li key={seccion._key}>
                <a href={`#${seccion.ancla}`} className="enlace-accion">
                  {localizar(seccion.titulo, idioma)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Contenedor>

      {descubre.secciones.map((seccion, i) => {
        const etiquetas = localizar(seccion.etiquetas, idioma);
        return (
          <section
            key={seccion._key}
            id={seccion.ancla}
            aria-labelledby={`titulo-${seccion.ancla}`}
            className="border-t border-linea py-seccion"
          >
            <Contenedor className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
              <div className={cx('lg:col-span-7', i % 2 === 1 && 'lg:order-2')}>
                <Mosaico
                  imagenes={seccion.imagenes}
                  origen={{
                    id: descubre._id,
                    tipo: 'descubreYucatan',
                    arreglo: `secciones[_key=="${seccion._key}"].imagenes`,
                  }}
                />
              </div>
              <div className="lg:col-span-5">
                {etiquetas && <Sobretitulo>{etiquetas}</Sobretitulo>}
                <h2 id={`titulo-${seccion.ancla}`} className="mt-4 text-titulo-1">
                  {localizar(seccion.titulo, idioma)}
                </h2>
                <TextoEnriquecido
                  valor={localizarBloques(seccion.texto, idioma)}
                  className="mt-8 text-tinta-suave"
                />
              </div>
            </Contenedor>
          </section>
        );
      })}

      <section aria-labelledby="explora-venues" className="bg-papel-calido py-seccion">
        <Contenedor ancho="lectura" className="flex flex-col items-center text-center">
          <h2 id="explora-venues" className="text-titulo-2">
            {t('cta')}
          </h2>
          <p className="mt-6 text-tinta-suave">{t('ctaTexto')}</p>
          <BotonEnlace href="/venues" variante="primario" className="mt-10">
            {t('cta')}
          </BotonEnlace>
        </Contenedor>
      </section>
    </>
  );
}
