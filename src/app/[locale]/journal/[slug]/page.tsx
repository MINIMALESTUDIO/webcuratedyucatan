import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { stegaClean } from 'next-sanity';
import { hasLocale } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { obtenerArticulo, obtenerArticulos, obtenerSlugsArticulos } from '@/lib/contenido';
import { formatearFecha } from '@/lib/formato';
import { localizar, localizarBloques } from '@/lib/i18n/localizar';
import { alternativas } from '@/lib/seo/metadatos';
import { Contenedor } from '@/components/ui/Contenedor';
import { ImagenContenido } from '@/components/ui/ImagenContenido';
import { Migas } from '@/components/ui/Migas';
import { EncabezadoSeccion } from '@/components/secciones/EncabezadoSeccion';
import { TarjetaArticulo } from '@/components/secciones/TarjetaArticulo';
import { TextoEnriquecido } from '@/components/secciones/TextoEnriquecido';

export async function generateStaticParams() {
  const slugs = await obtenerSlugsArticulos();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/journal/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const articulo = await obtenerArticulo(slug);
  if (!articulo) return {};
  return {
    title: stegaClean(localizar(articulo.seo?.titulo ?? articulo.titulo, locale)),
    description: stegaClean(localizar(articulo.seo?.descripcion ?? articulo.extracto, locale)),
    alternates: alternativas({ pathname: '/journal/[slug]', params: { slug } }, locale),
    openGraph: { type: 'article', images: [{ url: articulo.imagenPortada.url }] },
  };
}

export default async function PaginaArticulo({ params }: PageProps<'/[locale]/journal/[slug]'>) {
  const { slug } = await params;
  const articulo = await obtenerArticulo(slug);
  if (!articulo) notFound();

  const [recientes, t, tn, idioma] = await Promise.all([
    obtenerArticulos(4),
    getTranslations('Journal'),
    getTranslations('Navegacion'),
    getLocale(),
  ]);
  const mas = recientes.filter((a) => a.slug !== slug).slice(0, 3);
  const titulo = localizar(articulo.titulo, idioma);

  return (
    <>
      <Contenedor className="py-2">
        <Migas
          elementos={[
            { etiqueta: tn('inicio'), href: '/' },
            { etiqueta: tn('journal'), href: '/journal' },
            { etiqueta: titulo },
          ]}
        />
      </Contenedor>
      <article>
        <Contenedor
          ancho="lectura"
          className="flex flex-col items-center pt-10 pb-14 text-center sm:pt-14"
        >
          <p className="etiqueta text-tinta-suave">
            <time dateTime={articulo.fechaPublicacion}>
              {formatearFecha(articulo.fechaPublicacion, idioma)}
            </time>{' '}
            · {t('minutosLectura', { minutos: articulo.tiempoLectura })}
          </p>
          <h1 className="mt-6 text-titulo-1">{titulo}</h1>
          <p className="mt-6 text-destacado text-tinta-suave italic">
            {localizar(articulo.extracto, idioma)}
          </p>
        </Contenedor>
        <Contenedor>
          <div className="relative aspect-[16/9] overflow-hidden bg-arena">
            <ImagenContenido
              imagen={articulo.imagenPortada}
              edicion={{ id: articulo._id, tipo: 'articulo', ruta: 'imagenPortada' }}
              sizes="(min-width: 1280px) 1200px, 100vw"
              preload
            />
          </div>
        </Contenedor>
        <Contenedor ancho="lectura" className="py-seccion">
          <TextoEnriquecido
            valor={localizarBloques(articulo.cuerpo, idioma)}
            className="text-destacado"
          />
        </Contenedor>
      </article>
      {mas.length > 0 && (
        <section aria-labelledby="mas-journal" className="border-t border-linea py-seccion">
          <Contenedor>
            <EncabezadoSeccion id="mas-journal" titulo={t('mas')} />
            <ul className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-3">
              {mas.map((otro) => (
                <li key={otro._id} className="flex">
                  <TarjetaArticulo articulo={otro} />
                </li>
              ))}
            </ul>
          </Contenedor>
        </section>
      )}
    </>
  );
}
