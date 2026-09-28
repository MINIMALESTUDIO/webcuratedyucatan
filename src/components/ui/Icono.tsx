import type { ReactNode } from 'react';
import type { IconoCategoria } from '@/lib/contenido/tipos';
import { cx } from '@/lib/utilidades';

/*
 * Iconos SVG propios de trazo fino (sin librería de iconos). Siempre decorativos:
 * el texto accesible lo aporta el control que los contiene.
 */

type IconoInterfaz =
  | 'menu'
  | 'cerrar'
  | 'flechaDerecha'
  | 'flechaIzquierda'
  | 'play'
  | 'pausa'
  | 'corazon'
  | 'filtros'
  | 'mapa'
  | 'avion'
  | 'externo';

export type NombreIcono = IconoInterfaz | IconoCategoria;

const TRAZOS: Record<NombreIcono, ReactNode> = {
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  cerrar: <path d="M6 6l12 12M18 6 6 18" />,
  flechaDerecha: <path d="M4 12h15M13 6l6 6-6 6" />,
  flechaIzquierda: <path d="M20 12H5M11 6l-6 6 6 6" />,
  play: <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" stroke="none" />,
  pausa: <path d="M8.5 5.5v13M15.5 5.5v13" strokeWidth={2.5} />,
  corazon: (
    <path d="M12 20s-7.5-4.6-7.5-10.2A4.1 4.1 0 0 1 12 7.4a4.1 4.1 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20z" />
  ),
  filtros: <path d="M4 7h9M17 7h3M4 17h3M11 17h9M15 5v4M9 15v4" />,
  mapa: (
    <>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.2" />
    </>
  ),
  avion: <path d="M3 13.5 21 7l-4.5 12-4-5.5L3 13.5zM12.5 13.5 21 7" />,
  externo: <path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" />,
  // Categorías de proveedores
  planner: (
    <>
      <rect x="5.5" y="4.5" width="13" height="16" rx="1" />
      <path d="M9 3.5h6v3H9zM8.5 11h7M8.5 14.5h7M8.5 18h4" />
    </>
  ),
  camara: (
    <>
      <path d="M3.5 8.5h3.8l1.7-2.5h6l1.7 2.5h3.8V19h-17z" />
      <circle cx="12" cy="13.2" r="3.4" />
    </>
  ),
  flor: (
    <>
      <path d="M12 12v9M12 17c-1.6-1.8-4.2-2-6-1.2 1.2 2 3.9 2.7 6 1.2zM12 19c1.6-1.8 4.2-2 6-1.2-1.2 2-3.9 2.7-6 1.2z" />
      <path d="M12 12c-2.6 0-4.5-1.9-4.5-4.4C8.8 8.3 10 8.6 12 10c2-1.4 3.2-1.7 4.5-2.4 0 2.5-1.9 4.4-4.5 4.4zM12 10V4.5" />
    </>
  ),
  silla: <path d="M8 3.5v8.5h8V3.5M6.5 12h11v3h-11zM7.5 15v6M16.5 15v6" />,
  musica: (
    <>
      <path d="M9 17.5V6l10-2v11.5" />
      <circle cx="6.5" cy="17.5" r="2.5" />
      <circle cx="16.5" cy="15.5" r="2.5" />
    </>
  ),
  banquete: <path d="M3.5 17h17M5.5 17a6.5 6.5 0 0 1 13 0M12 10.5V8.5M10.5 8.5h3M3 20.5h18" />,
  belleza: (
    <>
      <circle cx="12" cy="9" r="5" />
      <path d="M12 14v6.5M9.5 20.5h5" />
    </>
  ),
  transporte: (
    <>
      <path d="M4.5 16.5v-5l2.2-5h10.6l2.2 5v5zM4.5 11.5h15" />
      <circle cx="8" cy="16.5" r="1.8" />
      <circle cx="16" cy="16.5" r="1.8" />
    </>
  ),
  hospedaje: <path d="M3.5 18.5v-12M3.5 13.5h17v5M20.5 18.5v-2M7 10.5h4v3H7z" />,
};

export function Icono({ nombre, className }: { nombre: NombreIcono; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cx('size-5 shrink-0', className)}
    >
      {TRAZOS[nombre]}
    </svg>
  );
}
