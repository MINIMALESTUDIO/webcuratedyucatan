import type { ReactNode } from 'react';
import { cx } from '@/lib/utilidades';

/*
 * Iconos SVG propios de trazo fino (sin librería de iconos). Siempre decorativos:
 * el texto accesible lo aporta el control que los contiene.
 */

export type NombreIcono =
  | 'menu'
  | 'cerrar'
  | 'flechaDerecha'
  | 'flechaIzquierda'
  | 'play'
  | 'pausa'
  | 'filtros'
  | 'externo';

const TRAZOS: Record<NombreIcono, ReactNode> = {
  menu: <path d="M4 8h16M4 16h16" />,
  cerrar: <path d="M6 6l12 12M18 6 6 18" />,
  flechaDerecha: <path d="M4 12h15M13 6l6 6-6 6" />,
  flechaIzquierda: <path d="M20 12H5M11 6l-6 6 6 6" />,
  play: <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" stroke="none" />,
  pausa: <path d="M8.5 5.5v13M15.5 5.5v13" strokeWidth={2} />,
  filtros: <path d="M4 7h9M17 7h3M4 17h3M11 17h9M15 5v4M9 15v4" />,
  externo: <path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" />,
};

export function Icono({ nombre, className }: { nombre: NombreIcono; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
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
