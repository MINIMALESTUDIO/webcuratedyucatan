import { notFound } from 'next/navigation';

// Cualquier ruta desconocida dentro de un idioma muestra el 404 de [locale]/not-found.tsx.
export default function RutaDesconocida() {
  notFound();
}
