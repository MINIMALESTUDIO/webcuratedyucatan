import type { ComponentProps, ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { cx } from '@/lib/utilidades';

/**
 * Variantes (D-037): sin color de interfaz, como el libro.
 * - primario: carbón sólido con texto blanco.
 * - secundario: línea de carbón.
 * - claro: blanco sólido con texto carbón, para usar sobre fotografía (contraste fijo).
 * - texto: enlace de acción en mayúsculas con filete.
 */
export type VarianteBoton = 'primario' | 'secundario' | 'claro' | 'texto';

const BASE =
  'inline-flex min-h-12 items-center justify-center gap-3 px-7 text-xs font-semibold tracking-[0.18em] uppercase transition-colors duration-300';

const VARIANTES: Record<VarianteBoton, string> = {
  primario: 'bg-tinta text-papel hover:bg-tinta/85',
  secundario: 'border border-tinta text-tinta hover:bg-tinta hover:text-papel',
  claro: 'bg-papel text-tinta hover:bg-papel-calido foco-claro',
  texto: 'enlace-accion min-h-11 px-0 text-tinta',
};

export function clasesBoton(variante: VarianteBoton = 'primario', className?: string): string {
  return variante === 'texto'
    ? cx(VARIANTES.texto, className)
    : cx(BASE, VARIANTES[variante], className);
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

/** Enlace a un ancla de la misma página (p. ej. "#solicitud"). */
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
