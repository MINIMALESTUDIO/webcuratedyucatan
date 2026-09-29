'use client';

// Cliente: carga el iframe de YouTube solo cuando la persona da play (sección 10) y
// reinicia el reproductor en el segundo de cada capítulo.
import Image from 'next/image';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { formatearTiempo } from '@/lib/formato';
import { atributoEdicion, type OrigenEdicion } from '@/lib/sanity/edicion';
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
  /** Campo de Sanity del video, para editarlo desde la página. */
  edicion?: OrigenEdicion;
}

export function ReproductorVideo({ youtubeId, titulo, capitulos = [], sizes, edicion }: Props) {
  const t = useTranslations('Venue.pelicula');
  const idioma = useLocale();
  // `clave` cambia en cada clic para volver a montar el iframe aunque se repita el capítulo.
  const [reproduccion, setReproduccion] = useState<{ inicio: number; clave: number } | null>(null);

  const reproducir = (inicio: number) =>
    setReproduccion((anterior) => ({ inicio, clave: (anterior?.clave ?? 0) + 1 }));

  const src = reproduccion
    ? `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&start=${reproduccion.inicio}&rel=0&playsinline=1&hl=${idioma}&cc_lang_pref=${idioma}`
    : null;

  return (
    <div data-sanity={atributoEdicion(edicion)}>
      <div className="relative aspect-video overflow-hidden bg-arena">
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
            <span className="velo absolute inset-0 transition-opacity duration-500 group-hover:opacity-70" />
            <span className="absolute top-1/2 left-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-papel text-papel transition-transform duration-500 group-hover:scale-105">
              <Icono nombre="play" className="size-7 translate-x-0.5" />
            </span>
            <span className="sr-only">{t('reproducir', { titulo })}</span>
          </button>
        )}
      </div>

      {capitulos.length > 0 && (
        <div className="mt-8">
          <h3 className="etiqueta font-texto">{t('capitulos')}</h3>
          <ol className="mt-3 divide-y divide-linea border-y border-linea">
            {capitulos.map((capitulo) => {
              const tiempo = formatearTiempo(capitulo.segundoInicio);
              const activo = reproduccion?.inicio === capitulo.segundoInicio;
              return (
                <li key={capitulo.segundoInicio}>
                  {/* El nombre accesible es el texto visible con un prefijo solo para lectores de
                      pantalla ("Reproducir desde 1:35 …"): sin aria-label (WCAG 2.5.3). */}
                  <button
                    type="button"
                    onClick={() => reproducir(capitulo.segundoInicio)}
                    aria-current={activo ? 'true' : undefined}
                    className={cx(
                      'flex min-h-12 w-full items-baseline gap-4 py-3 text-left text-sm hover:underline',
                      activo && 'font-semibold',
                    )}
                  >
                    <span className="sr-only">{t('reproducirDesde')} </span>
                    <span className="w-14 shrink-0 text-tinta-suave tabular-nums">{tiempo}</span>
                    <span>{capitulo.titulo}</span>
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
