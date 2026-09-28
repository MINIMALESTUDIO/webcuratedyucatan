'use client';

// Cliente: visor de imágenes. En móvil las miniaturas se deslizan con scroll-snap; el visor
// (<dialog> modal) admite deslizar, flechas del teclado, botones y Escape.
import { type KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Imagen } from '@/lib/contenido/tipos';
import { cx } from '@/lib/utilidades';
import { Icono } from '@/components/ui/Icono';
import { ImagenContenido } from '@/components/ui/ImagenContenido';
import { Contenedor } from '@/components/ui/Contenedor';

export function Galeria({ imagenes }: { imagenes: Imagen[] }) {
  const t = useTranslations('Venue.galeria');
  const tc = useTranslations('Comun');
  const dialogo = useRef<HTMLDialogElement>(null);
  const pista = useRef<HTMLUListElement>(null);
  const disparador = useRef<HTMLButtonElement | null>(null);
  const indiceInicial = useRef(0);
  const [abierta, setAbierta] = useState(false);
  const [actual, setActual] = useState(0);
  const total = imagenes.length;

  // Al abrir: muestra el diálogo y sitúa la pista en la imagen elegida, sin animación.
  useEffect(() => {
    if (!abierta) return;
    dialogo.current?.showModal();
    const elemento = pista.current;
    if (elemento) elemento.scrollLeft = indiceInicial.current * elemento.clientWidth;
  }, [abierta]);

  function abrir(indice: number, boton: HTMLButtonElement) {
    disparador.current = boton;
    indiceInicial.current = indice;
    setActual(indice);
    setAbierta(true);
  }

  function alCerrar() {
    setAbierta(false);
    disparador.current?.focus();
  }

  function irA(indice: number) {
    const elemento = pista.current;
    if (!elemento) return;
    const destino = Math.min(total - 1, Math.max(0, indice));
    elemento.scrollTo({ left: destino * elemento.clientWidth, behavior: 'smooth' });
  }

  function alDesplazar() {
    const elemento = pista.current;
    if (elemento) setActual(Math.round(elemento.scrollLeft / elemento.clientWidth));
  }

  function alTeclear(evento: KeyboardEvent<HTMLDialogElement>) {
    if (evento.key === 'ArrowRight') {
      evento.preventDefault();
      irA(actual + 1);
    } else if (evento.key === 'ArrowLeft') {
      evento.preventDefault();
      irA(actual - 1);
    }
  }

  return (
    <section aria-labelledby="galeria" className="pb-seccion">
      <Contenedor>
        <h2 id="galeria" className="text-titulo-2">
          {t('titulo')}
        </h2>
        {/* Móvil: tira deslizable. Escritorio: mosaico de 4 columnas con la primera foto grande. */}
        <ul className="-mx-margen mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-margen pb-2 lg:mx-0 lg:grid lg:auto-rows-[15rem] lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:px-0">
          {imagenes.map((imagen, i) => (
            <li
              key={imagen.url}
              className={cx(
                'w-[78%] shrink-0 snap-center sm:w-[44%] lg:w-auto',
                i === 0 && 'lg:col-span-2 lg:row-span-2',
              )}
            >
              <button
                type="button"
                onClick={(evento) => abrir(i, evento.currentTarget)}
                className="group relative block aspect-[4/5] w-full overflow-hidden bg-piedra lg:aspect-auto lg:h-full"
              >
                <ImagenContenido
                  imagen={imagen}
                  sizes={
                    i === 0
                      ? '(min-width: 1280px) 640px, (min-width: 1024px) 50vw, (min-width: 640px) 44vw, 78vw'
                      : '(min-width: 1280px) 320px, (min-width: 1024px) 25vw, (min-width: 640px) 44vw, 78vw'
                  }
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <span className="sr-only">{t('abrir', { numero: i + 1, total })}</span>
              </button>
            </li>
          ))}
        </ul>
      </Contenedor>

      {abierta && (
        <dialog
          ref={dialogo}
          aria-label={t('visor')}
          onClose={alCerrar}
          onKeyDown={alTeclear}
          className="m-0 h-dvh max-h-none w-full max-w-none bg-tinta p-0 text-cal"
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-margen py-2">
              <p aria-live="polite" className="text-sm tabular-nums">
                {t('contador', { actual: actual + 1, total })}
              </p>
              <button
                type="button"
                onClick={() => dialogo.current?.close()}
                className="-mr-2 inline-flex size-11 items-center justify-center foco-claro"
              >
                <Icono nombre="cerrar" className="size-6" />
                <span className="sr-only">{tc('cerrar')}</span>
              </button>
            </div>
            <ul
              ref={pista}
              onScroll={alDesplazar}
              className="flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto [scrollbar-width:none]"
            >
              {imagenes.map((imagen) => (
                <li key={imagen.url} className="relative h-full w-full shrink-0 snap-center">
                  <ImagenContenido imagen={imagen} sizes="100vw" className="object-contain" />
                </li>
              ))}
            </ul>
            <div className="flex justify-center gap-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={() => irA(actual - 1)}
                disabled={actual === 0}
                className="inline-flex size-12 items-center justify-center rounded-full border border-cal/40 foco-claro disabled:opacity-30"
              >
                <Icono nombre="flechaIzquierda" />
                <span className="sr-only">{tc('anterior')}</span>
              </button>
              <button
                type="button"
                onClick={() => irA(actual + 1)}
                disabled={actual === total - 1}
                className="inline-flex size-12 items-center justify-center rounded-full border border-cal/40 foco-claro disabled:opacity-30"
              >
                <Icono nombre="flechaDerecha" />
                <span className="sr-only">{tc('siguiente')}</span>
              </button>
            </div>
          </div>
        </dialog>
      )}
    </section>
  );
}
