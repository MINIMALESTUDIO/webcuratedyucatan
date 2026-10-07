import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { alternar, ENTORNOS, type FiltrosVenues, RANGOS_CAPACIDAD } from '@/lib/venues/filtros';
import { ChipFiltro } from './ChipFiltro';

export interface OpcionRegion {
  slug: string;
  nombre: string;
}

export interface OpcionColeccion {
  slug: string;
  nombre: string;
}

function Grupo({ titulo, nota, children }: { titulo: string; nota?: string; children: ReactNode }) {
  return (
    <fieldset className="border-t border-linea pt-5">
      <legend className="etiqueta float-left mb-4 w-full">{titulo}</legend>
      <div className="clear-left flex flex-wrap gap-2">{children}</div>
      {nota && <p className="mt-2 text-xs text-tinta-suave">{nota}</p>}
    </fieldset>
  );
}

/** Controles del panel de filtros: Style, Capacity, Accommodation, Location e Indoor / Outdoor. */
export function PanelFiltros({
  filtros,
  colecciones,
  regiones,
  alCambiar,
}: {
  filtros: FiltrosVenues;
  colecciones: OpcionColeccion[];
  regiones: OpcionRegion[];
  alCambiar: (cambio: Partial<FiltrosVenues>) => void;
}) {
  const t = useTranslations('Venues');

  return (
    <div className="flex flex-col gap-7">
      <Grupo titulo={t('grupos.estilo')}>
        {colecciones.map((coleccion) => (
          <ChipFiltro
            key={coleccion.slug}
            activo={filtros.colecciones.includes(coleccion.slug)}
            alPulsar={() =>
              alCambiar({ colecciones: alternar(filtros.colecciones, coleccion.slug) })
            }
          >
            {coleccion.nombre}
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

      <Grupo titulo={t('grupos.ubicacion')}>
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

      <Grupo titulo={t('grupos.entorno')}>
        {ENTORNOS.map((entorno) => (
          <ChipFiltro
            key={entorno}
            activo={filtros.entornos.includes(entorno)}
            alPulsar={() => alCambiar({ entornos: alternar(filtros.entornos, entorno) })}
          >
            {t(`entornos.${entorno}`)}
          </ChipFiltro>
        ))}
      </Grupo>
    </div>
  );
}
