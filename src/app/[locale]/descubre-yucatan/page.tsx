import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { obtenerCategoriasDescubre, obtenerDescubreYucatan } from '@/lib/contenido';
import { localizar } from '@/lib/i18n/localizar';
import { alternativas } from '@/lib/seo/metadatos';
import { cx } from '@/lib/utilidades';
import { BotonEnlace } from '@/components/ui/Boton';
import { Contenedor } from '@/components/ui/Contenedor';
import { ImagenContenido } from '@/components/ui/ImagenContenido';
import { Sobretitulo } from '@/components/ui/Sobretitulo';
import { NavegacionCategorias } from '@/components/secciones/descubre/NavegacionCategorias';

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
 * Es la portada de la sección: cada categoría lleva a su página individual (D-048).
 */
export default async function PaginaDescubre() {
  const [descubre, categorias, t, idioma] = await Promise.all([
    obtenerDescubreYucatan(),
    obtenerCategoriasDescubre(),
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
        <div className="mt-10">
          <NavegacionCategorias categorias={categorias} />
        </div>
      </Contenedor>

      {categorias.map((categoria, i) => {
        const titulo = localizar(categoria.titulo, idioma);
        return (
          <section
            key={categoria._id}
            id={categoria.slug}
            aria-labelledby={`titulo-${categoria.slug}`}
            className="border-t border-linea py-seccion"
          >
            {/* El bloque completo es clickeable: el enlace del botón lo cubre (documento, 03). */}
            <Contenedor className="group relative grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
              <div
                className={cx(
                  'relative aspect-[3/2] overflow-hidden bg-arena lg:col-span-7',
                  i % 2 === 1 && 'lg:order-2',
                )}
              >
                <ImagenContenido
                  imagen={categoria.imagenPrincipal}
                  edicion={{
                    id: categoria._id,
                    tipo: 'categoriaDescubre',
                    ruta: 'imagenPrincipal',
                  }}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
                />
              </div>
              <div className="lg:col-span-5">
                <Sobretitulo>{String(i + 1).padStart(2, '0')}</Sobretitulo>
                <h2 id={`titulo-${categoria.slug}`} className="mt-4 text-titulo-1">
                  {titulo}
                </h2>
                <p className="mt-8 text-tinta-suave">{localizar(categoria.resumen, idioma)}</p>
                <BotonEnlace
                  href={{
                    pathname: '/descubre-yucatan/[categoria]',
                    params: { categoria: categoria.slug },
                  }}
                  variante="texto"
                  className="mt-8 after:absolute after:inset-0"
                >
                  {t('descubrir', { categoria: titulo })}
                </BotonEnlace>
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
