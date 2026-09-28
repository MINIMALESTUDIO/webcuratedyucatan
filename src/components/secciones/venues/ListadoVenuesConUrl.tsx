'use client';

// Cliente: la URL es la única fuente de verdad de los filtros. Se actualiza con
// history.replaceState, que Next integra con useSearchParams: la URL se puede compartir y se
// conserva al volver desde una ficha (D-026).
import { useSearchParams } from 'next/navigation';
import type { VenueTarjeta } from '@/lib/contenido/tipos';
import { escribirFiltros, type FiltrosVenues, leerFiltros } from '@/lib/venues/filtros';
import { ListadoVenues } from './ListadoVenues';
import type { OpcionRegion } from './PanelFiltros';

export function ListadoVenuesConUrl({
  venues,
  regiones,
}: {
  venues: VenueTarjeta[];
  regiones: OpcionRegion[];
}) {
  const params = useSearchParams();
  const filtros = leerFiltros(
    params,
    regiones.map((region) => region.slug),
  );

  function alCambiar(nuevos: FiltrosVenues) {
    const query = escribirFiltros(nuevos);
    window.history.replaceState(null, '', query ? `?${query}` : window.location.pathname);
  }

  return (
    <ListadoVenues venues={venues} regiones={regiones} filtros={filtros} alCambiar={alCambiar} />
  );
}
