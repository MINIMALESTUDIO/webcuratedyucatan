import type { ComponentProps, ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { cx } from '@/lib/utilidades';

export type VarianteBoton = 'primario' | 'secundario' | 'claro' | 'texto';

const BASE =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-suave px-6 text-sm font-semibold tracking-wide transition-colors duration-200';

const VARIANTES: Record<VarianteBoton, string> = {
  primario: 'bg-almagre text-cal hover:bg-almagre-oscuro',
  secundario: 'border border-tinta text-tinta hover:bg-tinta hover:text-cal',
  claro: 'border border-cal text-cal hover:bg-cal/15 foco-claro',
  texto: 'min-h-11 px-0 text-almagre underline decoration-1 underline-offset-4 hover:decoration-2',
};

export function clasesBoton(variante: VarianteBoton = 'primario', className?: string): string {
  return cx(BASE, VARIANTES[variante], className);
}

type PropsBoton = ComponentProps<'button'> & { variante?: VarianteBoton };

export function Boton({ variante, className, type = 'button', ...resto }: PropsBoton) {
  return <button type={type} className={clasesBoton(variante, className)} {...resto} />;
}

type PropsEnlace = ComponentProps<typeof Link> & { variante?: VarianteBoton };

/** Enlace interno con aspecto de botón (respeta las rutas traducidas). */
export function BotonEnlace({ variante, className, ...resto }: PropsEnlace) {
  return <Link className={clasesBoton(variante, className)} {...resto} />;
}

/** Enlace a un ancla de la misma página (p. ej. "#disponibilidad"). */
export function BotonAncla({
  href,
  variante,
  className,
  children,
}: {
  href: `#${string}`;
  variante?: VarianteBoton;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a href={href} className={clasesBoton(variante, className)}>
      {children}
    </a>
  );
}
