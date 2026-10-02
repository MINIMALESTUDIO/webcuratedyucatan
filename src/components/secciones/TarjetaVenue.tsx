import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { VenueTarjeta } from '@/lib/contenido/tipos';
import { formatearNumero } from '@/lib/formato';
import { localizar } from '@/lib/i18n/localizar';
import { ImagenContenido } from '@/components/ui/ImagenContenido';

interface Props {
  venue: VenueTarjeta;
  /** Nivel del título según la jerarquía de la página. */
  nivel?: 'h2' | 'h3';
  sizes?: string;
}

/**
 * Tarjeta de venue (documento de estructura, sección 6): imagen, nombre, ubicación, capacidad y
 * estilo. Sin caja: la foto respira y los datos van debajo, como en el libro. Toda la tarjeta
 * es clicable mediante un único enlace en el título (patrón de enlace extendido).
 */
export function TarjetaVenue({
  venue,
  nivel = 'h3',
  sizes = '(min-width: 1280px) 400px, (min-width: 640px) 45vw, 100vw',
}: Props) {
  const t = useTranslations('Venues.tarjeta');
  const tc = useTranslations('Comun');
  const idioma = useLocale();
  const Titulo = nivel;

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden bg-arena">
        <ImagenContenido
          imagen={venue.imagen}
          edicion={{ id: venue._id, tipo: 'venue', ruta: 'media.imagenHero' }}
          sizes={sizes}
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-6 flex flex-1 flex-col items-center gap-2 text-center">
        <p className="etiqueta text-tinta-suave">{localizar(venue.coleccion.nombre, idioma)}</p>
        <Titulo className="titulo-nombre text-[clamp(1.25rem,1.05rem+0.7vw,1.625rem)] leading-tight">
          <Link
            href={{ pathname: '/venues/[slug]', params: { slug: venue.slug } }}
            className="after:absolute after:inset-0"
          >
            {venue.nombre}
          </Link>
        </Titulo>
        <p className="text-sm text-tinta-suave">
          {venue.localidad}
          {venue.minutosCentroMerida !== undefined &&
            ` · ${t('minutos', { minutos: venue.minutosCentroMerida })}`}
        </p>
        <p className="text-sm">
          {tc('invitados', { cantidad: formatearNumero(venue.capacidadMax, idioma) })}
        </p>
        <span aria-hidden="true" className="enlace-accion mt-2">
          {t('explorar')}
        </span>
      </div>
    </article>
  );
}
