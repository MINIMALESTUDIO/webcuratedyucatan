'use client';

// Cliente: lee de la URL desde dónde se llegó (un partner, Minimal) para dejar marcado
// "Looking for". La página es estática; sin parámetros, el formulario queda vacío.
import { useSearchParams } from 'next/navigation';
import { BUSQUEDAS, type Busqueda, ORIGENES_SOLICITUD } from '@/lib/validacion/opciones';
import { FormularioSolicitud } from './FormularioSolicitud';

export function FormularioSolicitudConUrl() {
  const params = useSearchParams();
  const pedidos = (params.get('buscando') ?? '').split(',');
  const buscando = BUSQUEDAS.filter((b): b is Busqueda => pedidos.includes(b));
  const origen = ORIGENES_SOLICITUD.find((o) => o === params.get('origen')) ?? 'general';
  const slug = params.get('slug')?.slice(0, 200) || undefined;

  return (
    <FormularioSolicitud
      key={params.toString()}
      origen={origen}
      origenSlug={slug}
      buscandoInicial={buscando}
    />
  );
}
