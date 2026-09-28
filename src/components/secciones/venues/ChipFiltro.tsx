import type { ReactNode } from 'react';
import { cx } from '@/lib/utilidades';

/** Chip de filtro: botón conmutable con estado anunciado (aria-pressed) y área táctil de 44 px. */
export function ChipFiltro({
  activo,
  alPulsar,
  children,
}: {
  activo: boolean;
  alPulsar: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={activo}
      onClick={alPulsar}
      className={cx(
        'inline-flex min-h-11 items-center gap-2 border px-3.5 text-sm transition-colors',
        activo
          ? 'border-tinta bg-tinta text-cal'
          : 'border-tinta-suave text-tinta hover:border-tinta',
      )}
    >
      {activo && (
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          className="size-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 8.5l3 3 7-7" />
        </svg>
      )}
      {children}
    </button>
  );
}
