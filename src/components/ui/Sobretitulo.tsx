import type { ReactNode } from 'react';
import { cx } from '@/lib/utilidades';

/** Microetiqueta que antecede a un título, como "VENUE OVERVIEW" en el libro. */
export function Sobretitulo({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cx('font-marca text-xs tracking-[0.24em] text-tinta-suave uppercase', className)}>
      {children}
    </p>
  );
}
