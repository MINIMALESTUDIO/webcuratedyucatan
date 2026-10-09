import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { stegaClean } from 'next-sanity';
import { hasLocale } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import {
  obtenerCategoriaDescubre,
  obtenerCategoriasDescubre,
  obtenerSlugsCategoriasDescubre,
} from '@/lib/contenido';
import { localizar, localizarBloques } from '@/lib/i18n/localizar';
import { alternativas } from '@/lib/seo/metadatos';
import { cx } from '@/lib/utilidades';
import { Contenedor } from '@/components/ui/Contenedor';
import { ImagenContenido } from '@/components/ui/ImagenContenido';
import { Migas } from '@/components/ui/Migas';
import { Sobretitulo } from '@/components/ui/Sobretitulo';
import { Mosaico } from '@/components/secciones/Mosaico';
import { TextoEnriquecido } from '@/components/secciones/TextoEnriquecido';
import { NavegacionCategorias } from '@/components/secciones/descubre/NavegacionCategorias';
import { TarjetaCategoria } from '@/components/secciones/descubre/TarjetaCategoria';

export async function generateStaticParams() {
  const slugs = await obtenerSlugsCategoriasDescubre();
  return slugs.map((categoria) => ({ categoria }));
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/descubre-yucatan/[categoria]'>): Promise<Metadata> {
  const { locale, categoria: slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const categoria = await obtenerCategoriaDescubre(slug);
  if (!categoria) return {};
  const tn = await getTranslations({ locale, namespace: 'Navegacion' });
  const titulo = stegaClean(localizar(categoria.titulo, locale));
  return {
    title: stegaClean(
      categoria.seo?.titulo
        ? localizar(categoria.seo.titulo, locale)
        : `${titulo} · ${tn('descubre')}`,
    ),
    description: stegaClean(localizar(categoria.seo?.descripcion ?? categoria.entradilla, locale)),
    alternates: alternativas(
      { pathname: '/descubre-yucatan/[categoria]', params: { categoria: slug } },
      locale,
    ),
    openGraph: { images: [{ url: categoria.imagenPrincipal.url }] },
  };
}

/**
 * Página individual de Discover Yucatán (D-048): hero, secciones editoriales que alternan
 * imagen y texto, y "Continue exploring". Arriba, la ruta de regreso a la portada y las demás
 * categorías.
 */
export default async function PaginaCategoria({
  params,
}: PageProps<'/[locale]/descubre-yucatan/[categoria]'>) {
  const { categoria: slug } = await params;
  const categoria = await obtenerCategoriaDescubre(slug);
  if (!categoria) notFound();

  const [categorias, t, tn, idioma] = await Promise.all([
    obtenerCategoriasDescubre(),
    getTranslations('Descubre'),
    getTranslations('Navegacion'),
    getLocale(),
  ]);
  const titulo = localizar(categoria.titulo, idioma);

  return (
    <>
      <Contenedor className="flex flex-col gap-2 py-2 lg:flex-row lg:items-center lg:justify-between">
        <Migas
          elementos={[
            { etiqueta: tn('inicio'), href: '/' },
            { etiqueta: tn('descubre'), href: '/descubre-yucatan' },
            { etiqueta: titulo },
          ]}
        />
        <NavegacionCategorias categorias={categorias} actual={categoria.slug} />
      </Contenedor>

      <section className="relative isolate flex min-h-[70svh] items-center justify-center overflow-hidden bg-tinta text-papel">
        <ImagenContenido
          imagen={categoria.imagenHero ?? categoria.imagenPrincipal}
          edicion={{
            id: categoria._id,
            tipo: 'categoriaDescubre',
            ruta: categoria.imagenHero ? 'imagenHero' : 'imagenPrincipal',
          }}
          sizes="100vw"
          preload
          className="-z-20 object-cover"
        />
        <div className="velo absolute inset-0 -z-10" aria-hidden="true" />
        <div className="flex max-w-4xl flex-col items-center px-margen py-28 text-center">
          {/* Mismo estilo que Sobretitulo, en blanco sobre la foto. */}
          <p className="font-marca text-xs tracking-[0.24em] text-papel uppercase">
            {tn('descubre')} / {titulo}
          </p>
          <h1 className="mt-6 text-titulo-1 text-papel">{localizar(categoria.titular, idioma)}</h1>
        </div>
      </section>

      <Contenedor ancho="lectura" className="py-seccion text-center">
        <p className="text-destacado">{localizar(categoria.entradilla, idioma)}</p>
      </Contenedor>

      {categoria.secciones.map((seccion, i) => (
        <section
          key={seccion._key}
          aria-labelledby={`titulo-${seccion._key}`}
          className="border-t border-linea py-seccion"
        >
          <Contenedor className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
            <div className={cx('lg:col-span-7', i % 2 === 1 && 'lg:order-2')}>
              <Mosaico
                imagenes={seccion.imagenes}
                origen={{
                  id: categoria._id,
                  tipo: 'categoriaDescubre',
                  arreglo: `secciones[_key=="${seccion._key}"].imagenes`,
                }}
              />
            </div>
            <div className={seccion.imagenes.length > 0 ? 'lg:col-span-5' : 'lg:col-span-8'}>
              <h2 id={`titulo-${seccion._key}`} className="text-titulo-1">
                {localizar(seccion.titulo, idioma)}
              </h2>
              <TextoEnriquecido
                valor={localizarBloques(seccion.texto, idioma)}
                className="mt-8 text-tinta-suave"
              />
            </div>
          </Contenedor>
        </section>
      ))}

      {categoria.relacionadas.length > 0 && (
        <section aria-labelledby="continua" className="bg-papel-calido py-seccion">
          <Contenedor>
            <div className="flex flex-col items-center text-center">
              <Sobretitulo>{tn('descubre')}</Sobretitulo>
              <h2 id="continua" className="mt-4 text-titulo-2">
                {t('continua')}
              </h2>
            </div>
            <ul className="mt-14 grid gap-x-8 gap-y-12 md:grid-cols-3">
              {categoria.relacionadas.map((relacionada) => (
                <li key={relacionada._id}>
                  <TarjetaCategoria categoria={relacionada} />
                </li>
              ))}
            </ul>
          </Contenedor>
        </section>
      )}
    </>
  );
}
