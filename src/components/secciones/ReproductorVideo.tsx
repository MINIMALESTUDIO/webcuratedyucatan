'use client';

// Cliente: carga el iframe de YouTube solo cuando la persona da play (sección 10) y
// reinicia el reproductor en el segundo de cada capítulo.
import Image from 'next/image';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { formatearTiempo } from '@/lib/formato';
import { cx } from '@/lib/utilidades';
import { Icono } from '@/components/ui/Icono';

interface CapituloLocalizado {
  titulo: string;
  segundoInicio: number;
}

interface Props {
  youtubeId: string;
  titulo: string;
  capitulos?: CapituloLocalizado[];
  /** Tamaños de la miniatura según el ancho de la columna. */
  sizes: string;
}

export function ReproductorVideo({ youtubeId, titulo, capitulos = [], sizes }: Props) {
  const t = useTranslations('Venue.entrevista');
  const idioma = useLocale();
  // `clave` cambia en cada clic para volver a montar el iframe aunque se repita el capítulo.
  const [reproduccion, setReproduccion] = useState<{ inicio: number; clave: number } | null>(null);

  const reproducir = (inicio: number) =>
    setReproduccion((anterior) => ({ inicio, clave: (anterior?.clave ?? 0) + 1 }));

  const src = reproduccion
    ? `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&start=${reproduccion.inicio}&rel=0&playsinline=1&hl=${idioma}&cc_lang_pref=${idioma}`
    : null;

  return (
    <div>
      <div className="relative aspect-video overflow-hidden bg-tinta">
        {src && reproduccion ? (
          <iframe
            key={reproduccion.clave}
            src={src}
            title={t('tituloIframe', { titulo })}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 size-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => reproducir(0)}
            className="group absolute inset-0 foco-claro"
          >
            <Image
              src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
              alt=""
              fill
              sizes={sizes}
              className="object-cover"
            />
            <span className="absolute inset-0 bg-tinta/30 transition-colors duration-300 group-hover:bg-tinta/15" />
            <span className="absolute top-1/2 left-1/2 flex size-18 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-almagre text-cal shadow-lg transition-transform duration-300 group-hover:scale-105">
              <Icono nombre="play" className="size-8 translate-x-0.5" />
            </span>
            <span className="sr-only">{t('reproducir', { titulo })}</span>
          </button>
        )}
      </div>

      {capitulos.length > 0 && (
        <div className="mt-6">
          <h3 className="font-texto text-xs font-semibold tracking-[0.16em] uppercase">
            {t('capitulos')}
          </h3>
          <ol className="mt-2 divide-y divide-cal/15 border-y border-cal/15">
            {capitulos.map((capitulo) => {
              const tiempo = formatearTiempo(capitulo.segundoInicio);
              const activo = reproduccion?.inicio === capitulo.segundoInicio;
              return (
                <li key={capitulo.segundoInicio}>
                  <button
                    type="button"
                    onClick={() => reproducir(capitulo.segundoInicio)}
                    aria-current={activo ? 'true' : undefined}
                    aria-label={t('irACapitulo', { tiempo, titulo: capitulo.titulo })}
                    className={cx(
                      'flex min-h-12 w-full items-baseline gap-4 py-3 text-left foco-claro hover:text-piedra',
                      activo && 'text-piedra',
                    )}
                  >
                    <span className="w-14 shrink-0 text-sm text-piedra tabular-nums">{tiempo}</span>
                    <span className={cx(activo && 'underline underline-offset-4')}>
                      {capitulo.titulo}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}
