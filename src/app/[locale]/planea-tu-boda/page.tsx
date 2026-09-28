import { metadatosPendiente, PaginaPendiente } from '@/components/secciones/PaginaPendiente';

export const generateMetadata = metadatosPendiente;

// Ruta fuera del piloto (D-029).
export default function Pagina() {
  return <PaginaPendiente seccion="planeaTuBoda" />;
}
