import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { ArticuloResumen } from '@/lib/contenido/tipos';
import { formatearFecha } from '@/lib/formato';
import { localizar } from '@/lib/i18n/localizar';
import { ImagenContenido } from '@/components/ui/ImagenContenido';

/** Artículo del Curated Journal: fotografía, título y acceso al artículo. */
export function TarjetaArticulo({
  articulo,
  nivel = 'h3',
}: {
  articulo: ArticuloResumen;
  nivel?: 'h2' | 'h3';
}) {
  const t = useTranslations('Journal');
  const idioma = useLocale();
  const Titulo = nivel;

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[3/2] overflow-hidden bg-arena">
        <ImagenContenido
          imagen={articulo.imagenPortada}
          edicion={{ id: articulo._id, tipo: 'articulo', ruta: 'imagenPortada' }}
          sizes="(min-width: 1280px) 400px, (min-width: 768px) 30vw, 100vw"
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <p className="etiqueta mt-5 text-tinta-suave">
        <time dateTime={articulo.fechaPublicacion}>
          {formatearFecha(articulo.fechaPublicacion, idioma)}
        </time>{' '}
        · {t('minutosLectura', { minutos: articulo.tiempoLectura })}
      </p>
      <Titulo className="mt-3 text-titulo-3 tracking-[0.1em]">
        <Link
          href={{ pathname: '/journal/[slug]', params: { slug: articulo.slug } }}
          className="after:absolute after:inset-0"
        >
          {localizar(articulo.titulo, idioma)}
        </Link>
      </Titulo>
      <span aria-hidden="true" className="enlace-accion mt-3 self-start">
        {t('leer')}
      </span>
    </article>
  );
}
