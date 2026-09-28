'use client';

// Cliente: filtra y ordena los venues de la página y abre el panel de filtros en móvil (D-026).
import { useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import type { VenueTarjeta } from '@/lib/contenido/tipos';
import {
  contarFiltrosActivos,
  FILTROS_VACIOS,
  type FiltrosVenues,
  filtrarVenues,
  ORDENES,
  type OrdenVenues,
  ordenarVenues,
} from '@/lib/venues/filtros';
import { Boton, BotonEnlace } from '@/components/ui/Boton';
import { Icono } from '@/components/ui/Icono';
import { TarjetaVenue } from '../TarjetaVenue';
import { type OpcionRegion, PanelFiltros } from './PanelFiltros';

interface Props {
  venues: VenueTarjeta[];
  regiones: OpcionRegion[];
  filtros: FiltrosVenues;
  /** Sin esta función (versión prerenderizada) los controles no hacen nada hasta hidratar. */
  alCambiar?: (filtros: FiltrosVenues) => void;
}

export function ListadoVenues({ venues, regiones, filtros, alCambiar }: Props) {
  const t = useTranslations('Venues');
  const tc = useTranslations('Comun');
  const idioma = useLocale();
  const panel = useRef<HTMLDialogElement>(null);

  const resultados = ordenarVenues(filtrarVenues(venues, filtros), filtros.orden, idioma);
  const activos = contarFiltrosActivos(filtros);

  const cambiar = (cambio: Partial<FiltrosVenues>) => alCambiar?.({ ...filtros, ...cambio });
  const limpiar = () => alCambiar?.({ ...FILTROS_VACIOS, orden: filtros.orden });

  return (
    <div
      data-interactivo={alCambiar ? 'si' : 'no'}
      className="grid gap-10 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12"
    >
      <aside aria-label={t('filtros')} className="hidden lg:block">
        <div className="sticky top-24 flex flex-col gap-4">
          <PanelFiltros filtros={filtros} regiones={regiones} alCambiar={cambiar} />
          {activos > 0 && (
            <Boton variante="texto" onClick={limpiar} className="self-start">
              {t('limpiar')}
            </Boton>
          )}
        </div>
      </aside>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-piedra pb-4">
          <p aria-live="polite" className="text-sm font-semibold">
            {t('resultados', { cantidad: resultados.length })}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => panel.current?.showModal()}
              aria-haspopup="dialog"
              className="inline-flex min-h-11 items-center gap-2 border border-tinta px-4 text-sm font-semibold lg:hidden"
            >
              <Icono nombre="filtros" />
              {t('abrirFiltros', { cantidad: activos })}
            </button>
            <label className="flex items-center gap-2 text-sm">
              <span className="text-tinta-suave">{t('ordenarPor')}</span>
              <select
                value={filtros.orden}
                onChange={(evento) => cambiar({ orden: evento.target.value as OrdenVenues })}
                className="min-h-11 rounded-suave border border-tinta-suave bg-cal px-3"
              >
                {ORDENES.map((orden) => (
                  <option key={orden} value={orden}>
                    {t(`orden.${orden}`)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {resultados.length > 0 ? (
          <ul className="mt-8 grid gap-12 sm:grid-cols-2 lg:gap-10 xl:grid-cols-3">
            {resultados.map((venue) => (
              <li key={venue._id} className="flex">
                <TarjetaVenue
                  venue={venue}
                  nivel="h2"
                  sizes="(min-width: 1280px) 300px, (min-width: 640px) 45vw, 100vw"
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-8 flex flex-col items-start gap-4 bg-piedra p-8">
            <h2 className="text-titulo-3">{t('vacioTitulo')}</h2>
            <p className="text-tinta-suave">{t('vacioTexto')}</p>
            <div className="flex flex-wrap gap-3">
              <Boton variante="primario" onClick={limpiar}>
                {t('limpiar')}
              </Boton>
              <BotonEnlace href="/asesoria" variante="secundario">
                {t('vacioAsesoria')}
              </BotonEnlace>
            </div>
          </div>
        )}
      </div>

      {/* Móvil: panel que sube desde abajo. <dialog> aporta foco atrapado y cierre con Escape. */}
      <dialog
        ref={panel}
        aria-label={t('filtros')}
        className="fixed inset-x-0 top-auto bottom-0 m-0 max-h-[88dvh] w-full max-w-none translate-y-full overflow-y-auto rounded-t-2xl bg-cal p-0 text-tinta transition-all transition-discrete duration-300 open:translate-y-0 starting:open:translate-y-full lg:hidden"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-piedra bg-cal px-margen py-2">
          <p className="font-titulo text-titulo-3">{t('filtros')}</p>
          <button
            type="button"
            onClick={() => panel.current?.close()}
            className="-mr-2 inline-flex size-11 items-center justify-center"
          >
            <Icono nombre="cerrar" className="size-6" />
            <span className="sr-only">{tc('cerrar')}</span>
          </button>
        </div>
        <div className="px-margen py-6">
          <PanelFiltros filtros={filtros} regiones={regiones} alCambiar={cambiar} />
        </div>
        <div className="sticky bottom-0 flex items-center gap-3 border-t border-piedra bg-cal px-margen pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Boton
            variante="secundario"
            onClick={limpiar}
            disabled={activos === 0}
            className="flex-1 disabled:opacity-50"
          >
            {t('limpiar')}
          </Boton>
          <Boton variante="primario" onClick={() => panel.current?.close()} className="flex-1">
            {t('verResultados', { cantidad: resultados.length })}
          </Boton>
        </div>
      </dialog>
    </div>
  );
}
