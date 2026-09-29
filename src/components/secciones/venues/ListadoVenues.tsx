'use client';

// Cliente: filtra los venues de la página y abre el panel de filtros (D-040).
import { useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import type { Imagen, VenueTarjeta } from '@/lib/contenido/tipos';
import {
  alternar,
  contarFiltrosActivos,
  FILTROS_VACIOS,
  type FiltrosVenues,
  filtrarVenues,
  ordenarVenues,
} from '@/lib/venues/filtros';
import { cx } from '@/lib/utilidades';
import { Boton, BotonEnlace } from '@/components/ui/Boton';
import { Icono } from '@/components/ui/Icono';
import { ImagenContenido } from '@/components/ui/ImagenContenido';
import { TarjetaVenue } from '../TarjetaVenue';
import { type OpcionColeccion, type OpcionRegion, PanelFiltros } from './PanelFiltros';

export interface OpcionColeccionVisual extends OpcionColeccion {
  _id: string;
  lema: string;
  imagen: Imagen;
}

interface Props {
  venues: VenueTarjeta[];
  colecciones: OpcionColeccionVisual[];
  regiones: OpcionRegion[];
  filtros: FiltrosVenues;
  /** Sin esta función (versión prerenderizada) los controles no hacen nada hasta hidratar. */
  alCambiar?: (filtros: FiltrosVenues) => void;
}

/**
 * Listado con filtros limpios y progresivos (documento de estructura, sección 6): las tres
 * colecciones como entrada visual, un solo botón de filtros y los filtros activos como chips.
 */
export function ListadoVenues({ venues, colecciones, regiones, filtros, alCambiar }: Props) {
  const t = useTranslations('Venues');
  const tc = useTranslations('Comun');
  const idioma = useLocale();
  const panel = useRef<HTMLDialogElement>(null);

  const resultados = ordenarVenues(filtrarVenues(venues, filtros), idioma);
  const activos = contarFiltrosActivos(filtros);
  const cambiar = (cambio: Partial<FiltrosVenues>) => alCambiar?.({ ...filtros, ...cambio });
  const limpiar = () => alCambiar?.(FILTROS_VACIOS);

  // Chips de los filtros activos del panel, para quitarlos sin abrirlo.
  const chips: Array<{ clave: string; etiqueta: string; quitar: () => void }> = [
    ...filtros.capacidades.map((id) => ({
      clave: `capacidad-${id}`,
      etiqueta: t(`rangosCapacidad.${id}`),
      quitar: () => cambiar({ capacidades: alternar(filtros.capacidades, id) }),
    })),
    ...(filtros.hospedaje
      ? [
          {
            clave: 'hospedaje',
            etiqueta: t('hospedajeEnSitio'),
            quitar: () => cambiar({ hospedaje: false }),
          },
        ]
      : []),
    ...filtros.regiones.map((slug) => ({
      clave: `region-${slug}`,
      etiqueta: regiones.find((r) => r.slug === slug)?.nombre ?? slug,
      quitar: () => cambiar({ regiones: alternar(filtros.regiones, slug) }),
    })),
    ...filtros.entornos.map((entorno) => ({
      clave: `entorno-${entorno}`,
      etiqueta: t(`entornos.${entorno}`),
      quitar: () => cambiar({ entornos: alternar(filtros.entornos, entorno) }),
    })),
  ];

  return (
    <div data-interactivo={alCambiar ? 'si' : 'no'}>
      <section aria-labelledby="colecciones">
        <h2 id="colecciones" className="sr-only">
          {t('colecciones')}
        </h2>
        <ul className="-mx-margen flex snap-x snap-mandatory gap-2 overflow-x-auto px-margen pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
          {colecciones.map((coleccion) => {
            const activa = filtros.colecciones.includes(coleccion.slug);
            const atenuada = filtros.colecciones.length > 0 && !activa;
            return (
              <li key={coleccion.slug} className="w-[78%] shrink-0 snap-center sm:w-auto">
                <button
                  type="button"
                  aria-pressed={activa}
                  onClick={() => cambiar({ colecciones: activa ? [] : [coleccion.slug] })}
                  className="group flex w-full flex-col text-left"
                >
                  <span
                    className={cx(
                      'relative block aspect-[4/3] w-full overflow-hidden bg-arena transition-opacity duration-500',
                      atenuada && 'opacity-55',
                    )}
                  >
                    <ImagenContenido
                      imagen={coleccion.imagen}
                      decorativa
                      edicion={{ id: coleccion._id, tipo: 'coleccion', ruta: 'imagen' }}
                      sizes="(min-width: 640px) 33vw, 78vw"
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
                    />
                  </span>
                  <span
                    className={cx(
                      'mt-4 font-marca text-sm tracking-[0.2em] uppercase underline-offset-8',
                      activa && 'underline',
                    )}
                  >
                    {coleccion.nombre}
                  </span>
                  <span className="mt-1 text-sm text-tinta-suave italic">{coleccion.lema}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-y border-linea py-3">
        <p aria-live="polite" className="etiqueta">
          {t('resultados', { cantidad: resultados.length })}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          {(activos > 0 || filtros.colecciones.length > 0) && (
            <Boton variante="texto" onClick={limpiar}>
              {t('limpiar')}
            </Boton>
          )}
          <button
            type="button"
            onClick={() => panel.current?.showModal()}
            aria-haspopup="dialog"
            className="etiqueta inline-flex min-h-11 items-center gap-2 border border-tinta px-4"
          >
            <Icono nombre="filtros" />
            {t('abrirFiltros', { cantidad: activos })}
          </button>
        </div>
      </div>

      {chips.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label={t('filtros')}>
          {chips.map((chip) => (
            <li key={chip.clave}>
              <button
                type="button"
                onClick={chip.quitar}
                className="inline-flex min-h-11 items-center gap-2 bg-papel-calido px-3 text-sm hover:bg-arena"
              >
                {chip.etiqueta}
                <Icono nombre="cerrar" className="size-4" />
                <span className="sr-only">({tc('cerrar')})</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {resultados.length > 0 ? (
        <ul className="mt-12 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {resultados.map((venue) => (
            <li key={venue._id} className="flex">
              <TarjetaVenue
                venue={venue}
                nivel="h2"
                sizes="(min-width: 1280px) 400px, (min-width: 640px) 45vw, 100vw"
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-12 flex flex-col items-center gap-4 border border-linea px-6 py-16 text-center">
          <h2 className="text-titulo-3">{t('vacioTitulo')}</h2>
          <p className="max-w-md text-tinta-suave">{t('vacioTexto')}</p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Boton variante="secundario" onClick={limpiar}>
              {t('limpiar')}
            </Boton>
            <BotonEnlace href="/planea-tu-evento" variante="primario">
              {t('vacioPlanea')}
            </BotonEnlace>
          </div>
        </div>
      )}

      {/* Panel de filtros: sube desde abajo en móvil y entra por la derecha en escritorio.
          <dialog> aporta foco atrapado y cierre con Escape. */}
      <dialog
        ref={panel}
        aria-label={t('filtros')}
        className="fixed inset-x-0 top-auto bottom-0 m-0 max-h-[88dvh] w-full max-w-none translate-y-full overflow-y-auto bg-papel p-0 text-tinta transition-all transition-discrete duration-300 open:translate-y-0 starting:open:translate-y-full lg:inset-y-0 lg:right-0 lg:left-auto lg:h-dvh lg:max-h-none lg:w-[26rem] lg:translate-x-full lg:translate-y-0 lg:open:translate-x-0 lg:starting:open:translate-x-full lg:starting:open:translate-y-0"
      >
        <div className="flex min-h-full flex-col">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-linea bg-papel px-margen py-2">
            <p className="font-marca text-sm tracking-[0.2em] uppercase">{t('filtros')}</p>
            <button
              type="button"
              onClick={() => panel.current?.close()}
              className="-mr-2 inline-flex size-11 items-center justify-center"
            >
              <Icono nombre="cerrar" className="size-6" />
              <span className="sr-only">{tc('cerrar')}</span>
            </button>
          </div>
          <div className="flex-1 px-margen py-6">
            <PanelFiltros
              filtros={filtros}
              colecciones={colecciones}
              regiones={regiones}
              alCambiar={cambiar}
            />
          </div>
          <div className="sticky bottom-0 flex items-center gap-3 border-t border-linea bg-papel px-margen pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <Boton
              variante="secundario"
              onClick={limpiar}
              disabled={activos === 0 && filtros.colecciones.length === 0}
              className="flex-1 disabled:opacity-40"
            >
              {t('limpiar')}
            </Boton>
            <Boton variante="primario" onClick={() => panel.current?.close()} className="flex-1">
              {t('verResultados', { cantidad: resultados.length })}
            </Boton>
          </div>
        </div>
      </dialog>
    </div>
  );
}
