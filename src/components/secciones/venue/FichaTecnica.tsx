import type { ReactNode } from 'react';
import { getLocale, getTranslations } from 'next-intl/server';
import type { FichaTecnica as DatosFicha } from '@/lib/contenido/tipos';
import { formatearNumero, formatearUSD, urlGoogleMaps } from '@/lib/formato';
import { localizar } from '@/lib/i18n/localizar';
import { Icono } from '@/components/ui/Icono';

function Fila({ etiqueta, children }: { etiqueta: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-tinta/15 py-3">
      <dt className="text-sm text-tinta-suave">{etiqueta}</dt>
      <dd className="text-right font-semibold tabular-nums">{children}</dd>
    </div>
  );
}

/** Datos estandarizados del venue (sección 6): base para comparadores futuros. */
export async function FichaTecnica({ ficha }: { ficha: DatosFicha }) {
  const t = await getTranslations('Venue.ficha');
  const tc = await getTranslations('Catering');
  const tcomun = await getTranslations('Comun');
  const idioma = await getLocale();
  const invitados = (cantidad: number) =>
    t('invitados', { cantidad: formatearNumero(cantidad, idioma) });
  const minutos = (valor: number) => tcomun('minutos', { minutos: formatearNumero(valor, idioma) });

  return (
    <aside aria-labelledby="ficha-tecnica" className="bg-piedra p-6 sm:p-8">
      <h2 id="ficha-tecnica" className="text-titulo-3">
        {t('titulo')}
      </h2>

      <h3 className="mt-6 font-texto text-xs font-semibold tracking-[0.16em] uppercase">
        {t('capacidad')}
      </h3>
      <dl className="mt-2">
        <Fila etiqueta={t('ceremonia')}>{invitados(ficha.capacidadCeremoniaMax)}</Fila>
        <Fila etiqueta={t('coctel')}>{invitados(ficha.capacidadCoctelMax)}</Fila>
        <Fila etiqueta={t('banquete')}>{invitados(ficha.capacidadBanqueteMax)}</Fila>
      </dl>

      <dl className="mt-6">
        <Fila etiqueta={t('hospedaje')}>
          {ficha.hospedaje.tieneHospedaje && ficha.hospedaje.habitaciones
            ? t('habitacionesHuespedes', {
                habitaciones: ficha.hospedaje.habitaciones,
                huespedes: ficha.hospedaje.huespedesMax ?? 0,
              })
            : t('sinHospedaje')}
        </Fila>
        <Fila etiqueta={t('catering')}>{tc(ficha.catering)}</Fila>
        <Fila etiqueta={t('musica')}>{localizar(ficha.horarioLimiteMusica, idioma)}</Fila>
        <Fila etiqueta={t('inversion')}>
          {ficha.inversionDesdeUSD
            ? formatearUSD(ficha.inversionDesdeUSD, idioma)
            : t('sinInversion')}
        </Fila>
        <Fila etiqueta={t('temporada')}>{localizar(ficha.mejorTemporada, idioma)}</Fila>
      </dl>

      <h3 className="mt-6 font-texto text-xs font-semibold tracking-[0.16em] uppercase">
        {t('traslados')}
      </h3>
      <dl className="mt-2">
        <Fila etiqueta={t('aeropuerto')}>{minutos(ficha.minutosAeropuertoMID)}</Fila>
        <Fila etiqueta={t('centro')}>{minutos(ficha.minutosCentroMerida)}</Fila>
      </dl>

      <a
        href={urlGoogleMaps(ficha.ubicacion.lat, ficha.ubicacion.lng)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-almagre underline underline-offset-4"
      >
        <Icono nombre="mapa" />
        {t('mapa')}
        <Icono nombre="externo" className="size-4" />
      </a>
      <p className="mt-3 text-xs text-tinta-suave">{t('notaDemo')}</p>
    </aside>
  );
}
