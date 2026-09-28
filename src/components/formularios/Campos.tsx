import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';
import { cx } from '@/lib/utilidades';

/*
 * Campos de formulario accesibles: etiqueta visible, error asociado con aria-describedby,
 * aria-invalid y texto de 16 px (sin zoom en iOS, definido en globales.css).
 */

function clasesControl(error?: string) {
  return cx(
    'min-h-12 w-full rounded-suave border bg-cal px-3.5 py-2.5 text-tinta placeholder:text-tinta-suave',
    error ? 'border-almagre border-2' : 'border-tinta-suave',
  );
}

function describir(id: string, error?: string, ayuda?: string): string | undefined {
  const ids = [error ? `${id}-error` : null, ayuda ? `${id}-ayuda` : null].filter(Boolean);
  return ids.length ? ids.join(' ') : undefined;
}

interface Base {
  id: string;
  etiqueta: string;
  error?: string;
  ayuda?: string;
  /** Texto "(opcional)" traducido; si existe, el campo se marca como opcional. */
  opcional?: string;
  className?: string;
}

function Etiqueta({ id, etiqueta, opcional }: Pick<Base, 'id' | 'etiqueta' | 'opcional'>) {
  return (
    <label htmlFor={id} className="text-sm font-semibold">
      {etiqueta}
      {opcional && <span className="font-normal text-tinta-suave"> ({opcional})</span>}
    </label>
  );
}

function Mensajes({ id, error, ayuda }: Pick<Base, 'id' | 'error' | 'ayuda'>) {
  return (
    <>
      {ayuda && (
        <p id={`${id}-ayuda`} className="text-xs text-tinta-suave">
          {ayuda}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm font-semibold text-almagre">
          {error}
        </p>
      )}
    </>
  );
}

export function CampoTexto({
  id,
  etiqueta,
  error,
  ayuda,
  opcional,
  className,
  ...resto
}: Base & Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'className'>) {
  return (
    <div className={cx('flex flex-col gap-1.5', className)}>
      <Etiqueta id={id} etiqueta={etiqueta} opcional={opcional} />
      <input
        id={id}
        name={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describir(id, error, ayuda)}
        className={clasesControl(error)}
        {...resto}
      />
      <Mensajes id={id} error={error} ayuda={ayuda} />
    </div>
  );
}

export function CampoAreaTexto({
  id,
  etiqueta,
  error,
  ayuda,
  opcional,
  className,
  ...resto
}: Base & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'className'>) {
  return (
    <div className={cx('flex flex-col gap-1.5', className)}>
      <Etiqueta id={id} etiqueta={etiqueta} opcional={opcional} />
      <textarea
        id={id}
        name={id}
        rows={4}
        aria-invalid={error ? true : undefined}
        aria-describedby={describir(id, error, ayuda)}
        className={cx(clasesControl(error), 'resize-y')}
        {...resto}
      />
      <Mensajes id={id} error={error} ayuda={ayuda} />
    </div>
  );
}

export function CampoCasilla({
  id,
  etiqueta,
  error,
  className,
  ...resto
}: Omit<Base, 'etiqueta' | 'opcional' | 'ayuda'> & {
  etiqueta: ReactNode;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'className' | 'type'>) {
  return (
    <div className={cx('flex flex-col gap-1', className)}>
      <label htmlFor={id} className="flex min-h-11 cursor-pointer items-start gap-3 py-1 text-sm">
        <input
          id={id}
          name={id}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-0.5 size-5 shrink-0 accent-almagre"
          {...resto}
        />
        <span>{etiqueta}</span>
      </label>
      {error && (
        <p id={`${id}-error`} className="text-sm font-semibold text-almagre">
          {error}
        </p>
      )}
    </div>
  );
}
