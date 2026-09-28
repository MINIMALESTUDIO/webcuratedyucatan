import type { ReactNode } from 'react';
import { cx } from '@/lib/utilidades';

/** Etiqueta estática (región, tipo, interior o exterior). */
export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        'inline-flex items-center border border-current px-2.5 py-1 text-xs font-semibold tracking-[0.08em] uppercase',
        className,
      )}
    >
      {children}
    </span>
  );
}
