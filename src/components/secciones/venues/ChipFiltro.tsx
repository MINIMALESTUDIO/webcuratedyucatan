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
        'inline-flex min-h-11 items-center gap-2 border px-4 text-sm transition-colors duration-300',
        activo ? 'border-tinta bg-tinta text-papel' : 'border-linea text-tinta hover:border-tinta',
      )}
    >
      {children}
    </button>
  );
}
