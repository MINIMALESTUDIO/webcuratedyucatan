import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { VenueTarjeta } from '@/lib/contenido/tipos';
import { formatearNumero } from '@/lib/formato';
import { localizar } from '@/lib/i18n/localizar';
import { Icono } from '@/components/ui/Icono';
import { ImagenContenido } from '@/components/ui/ImagenContenido';

interface Props {
  venue: VenueTarjeta;
  /** Nivel del título según la jerarquía de la página. */
  nivel?: 'h2' | 'h3';
  sizes?: string;
}

/**
 * Tarjeta de venue. Toda la tarjeta es clicable mediante un único enlace en el título
 * (patrón de enlace extendido), accesible con teclado y lector de pantalla.
 */
export function TarjetaVenue({
  venue,
  nivel = 'h3',
  sizes = '(min-width: 1280px) 400px, (min-width: 640px) 45vw, 100vw',
}: Props) {
  const t = useTranslations('Venues.tarjeta');
  const tt = useTranslations('Tipos');
  const idioma = useLocale();
  const Titulo = nivel;

  return (
    <article className="group relative flex flex-col">
      <div className="arco relative aspect-[4/5] overflow-hidden bg-piedra">
        <ImagenContenido
          imagen={venue.imagen}
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        {venue.tieneEntrevista && (
          <span className="absolute bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 bg-tinta/85 px-3 py-1.5 text-xs font-semibold text-cal">
            <Icono nombre="play" className="size-3.5" />
            {t('entrevista')}
          </span>
        )}
      </div>
      <div className="mt-5 flex flex-1 flex-col gap-2">
        <p className="text-xs font-semibold tracking-[0.14em] text-tinta-suave uppercase">
          {localizar(venue.region.nombre, idioma)} ·{' '}
          {venue.tipos.map((tipo) => tt(tipo)).join(', ')}
        </p>
        <Titulo className="text-titulo-3">
          <Link
            href={{ pathname: '/venues/[slug]', params: { slug: venue.slug } }}
            className="after:absolute after:inset-0 group-hover:text-almagre"
          >
            {venue.nombre}
          </Link>
        </Titulo>
        <p className="line-clamp-2 text-sm text-tinta-suave">{localizar(venue.resumen, idioma)}</p>
        <dl className="mt-auto flex flex-wrap gap-x-5 gap-y-1 pt-2 text-sm">
          <div className="flex gap-1.5">
            <dt className="text-tinta-suave">{t('banquete')}</dt>
            <dd className="font-semibold tabular-nums">
              {t('invitados', { cantidad: formatearNumero(venue.capacidadBanqueteMax, idioma) })}
            </dd>
          </div>
          <div className="flex gap-1.5">
            <dt className="text-tinta-suave">{t('hospedaje')}</dt>
            <dd className="font-semibold">
              {venue.tieneHospedaje && venue.habitaciones
                ? t('habitaciones', { cantidad: venue.habitaciones })
                : t('sinHospedaje')}
            </dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
