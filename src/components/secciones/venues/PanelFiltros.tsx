import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { TIPOS_VENUE } from '@/lib/contenido/tipos';
import {
  alternar,
  type FiltrosVenues,
  OPCIONES_CATERING,
  RANGOS_CAPACIDAD,
  RANGOS_INVERSION,
} from '@/lib/venues/filtros';
import { ChipFiltro } from './ChipFiltro';

export interface OpcionRegion {
  slug: string;
  nombre: string;
}

function Grupo({ titulo, nota, children }: { titulo: string; nota?: string; children: ReactNode }) {
  return (
    <fieldset className="border-t border-piedra pt-5">
      <legend className="float-left mb-3 w-full text-xs font-semibold tracking-[0.16em] uppercase">
        {titulo}
      </legend>
      <div className="clear-left flex flex-wrap gap-2">{children}</div>
      {nota && <p className="mt-2 text-xs text-tinta-suave">{nota}</p>}
    </fieldset>
  );
}

/** Controles de filtro; se muestran en la barra lateral (escritorio) o en el panel (móvil). */
export function PanelFiltros({
  filtros,
  regiones,
  alCambiar,
}: {
  filtros: FiltrosVenues;
  regiones: OpcionRegion[];
  alCambiar: (cambio: Partial<FiltrosVenues>) => void;
}) {
  const t = useTranslations('Venues');
  const tt = useTranslations('Tipos');

  return (
    <div className="flex flex-col gap-6">
      <Grupo titulo={t('grupos.region')}>
        {regiones.map((region) => (
          <ChipFiltro
            key={region.slug}
            activo={filtros.regiones.includes(region.slug)}
            alPulsar={() => alCambiar({ regiones: alternar(filtros.regiones, region.slug) })}
          >
            {region.nombre}
          </ChipFiltro>
        ))}
      </Grupo>

      <Grupo titulo={t('grupos.tipo')}>
        {TIPOS_VENUE.map((tipo) => (
          <ChipFiltro
            key={tipo}
            activo={filtros.tipos.includes(tipo)}
            alPulsar={() => alCambiar({ tipos: alternar(filtros.tipos, tipo) })}
          >
            {tt(tipo)}
          </ChipFiltro>
        ))}
      </Grupo>

      <Grupo titulo={t('grupos.capacidad')} nota={t('notaRangos')}>
        {RANGOS_CAPACIDAD.map((rango) => (
          <ChipFiltro
            key={rango.id}
            activo={filtros.capacidades.includes(rango.id)}
            alPulsar={() => alCambiar({ capacidades: alternar(filtros.capacidades, rango.id) })}
          >
            {t(`rangosCapacidad.${rango.id}`)}
          </ChipFiltro>
        ))}
      </Grupo>

      <Grupo titulo={t('grupos.hospedaje')}>
        <ChipFiltro
          activo={filtros.hospedaje}
          alPulsar={() => alCambiar({ hospedaje: !filtros.hospedaje })}
        >
          {t('hospedajeEnSitio')}
        </ChipFiltro>
      </Grupo>

      <Grupo titulo={t('grupos.catering')}>
        {OPCIONES_CATERING.map((opcion) => (
          <ChipFiltro
            key={opcion}
            activo={filtros.catering.includes(opcion)}
            alPulsar={() => alCambiar({ catering: alternar(filtros.catering, opcion) })}
          >
            {opcion === 'propio' ? t('cateringPropio') : t('cateringExterno')}
          </ChipFiltro>
        ))}
      </Grupo>

      <Grupo titulo={t('grupos.inversion')} nota={t('notaRangos')}>
        {RANGOS_INVERSION.map((rango) => (
          <ChipFiltro
            key={rango.id}
            activo={filtros.inversiones.includes(rango.id)}
            alPulsar={() => alCambiar({ inversiones: alternar(filtros.inversiones, rango.id) })}
          >
            {t(`rangosInversion.${rango.id}`)}
          </ChipFiltro>
        ))}
      </Grupo>
    </div>
  );
}
