import type { ComponentPropsWithoutRef, ElementType } from 'react';
import { cx } from '@/lib/utilidades';

type Props<T extends ElementType> = {
  como?: T;
  /** `lectura` limita el ancho a una columna de lectura cómoda. */
  ancho?: 'contenido' | 'lectura';
} & ComponentPropsWithoutRef<T>;

/** Ancho máximo y márgenes laterales consistentes (el contenido no se estira sin límite). */
export function Contenedor<T extends ElementType = 'div'>({
  como,
  ancho = 'contenido',
  className,
  ...resto
}: Props<T>) {
  const Elemento = como ?? 'div';
  return (
    <Elemento
      className={cx(
        'mx-auto w-full px-margen',
        ancho === 'lectura' ? 'max-w-lectura' : 'max-w-contenido',
        className,
      )}
      {...resto}
    />
  );
}
