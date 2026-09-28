import type { ReactNode } from 'react';
import { cx } from '@/lib/utilidades';

/** Texto pequeño en versalitas que antecede a un título. */
export function Sobretitulo({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cx('text-xs font-semibold tracking-[0.16em] text-almagre uppercase', className)}>
      {children}
    </p>
  );
}
