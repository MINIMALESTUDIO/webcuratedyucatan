'use client';

// Cliente: la URL es la única fuente de verdad de los filtros. Se actualiza con
// history.replaceState, que Next integra con useSearchParams: la URL se puede compartir y se
// conserva al volver desde una ficha (D-026).
import { useSearchParams } from 'next/navigation';
import type { VenueTarjeta } from '@/lib/contenido/tipos';
import { escribirFiltros, type FiltrosVenues, leerFiltros } from '@/lib/venues/filtros';
import { ListadoVenues, type OpcionColeccionVisual } from './ListadoVenues';
import type { OpcionRegion } from './PanelFiltros';

export function ListadoVenuesConUrl({
  venues,
  colecciones,
  regiones,
}: {
  venues: VenueTarjeta[];
  colecciones: OpcionColeccionVisual[];
  regiones: OpcionRegion[];
}) {
  const params = useSearchParams();
  const filtros = leerFiltros(params, {
    colecciones: colecciones.map((c) => c.slug),
    regiones: regiones.map((r) => r.slug),
  });

  function alCambiar(nuevos: FiltrosVenues) {
    const query = escribirFiltros(nuevos);
    window.history.replaceState(null, '', query ? `?${query}` : window.location.pathname);
  }

  return (
    <ListadoVenues
      venues={venues}
      colecciones={colecciones}
      regiones={regiones}
      filtros={filtros}
      alCambiar={alCambiar}
    />
  );
}
