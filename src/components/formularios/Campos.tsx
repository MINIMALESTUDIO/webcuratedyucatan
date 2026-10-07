import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';
import { cx } from '@/lib/utilidades';

/*
 * Campos de formulario accesibles: etiqueta visible, error asociado con aria-describedby,
 * aria-invalid y texto de 16 px (sin zoom en iOS, definido en globales.css). Sin color de
 * interfaz: el error se marca con borde grueso y texto, no solo con color (WCAG 1.4.1).
 */

function clasesControl(error?: string) {
  return cx(
    'min-h-12 w-full border bg-papel px-4 py-3 text-tinta placeholder:text-tinta-suave',
    error ? 'border-2 border-tinta' : 'border-linea hover:border-tinta-suave',
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
    <label htmlFor={id} className="text-sm font-medium">
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
        <p id={`${id}-error`} className="text-sm font-semibold">
          <span aria-hidden="true">— </span>
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
    <div className={cx('flex flex-col gap-2', className)}>
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
    <div className={cx('flex flex-col gap-2', className)}>
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
          className="mt-0.5 size-5 shrink-0 accent-tinta"
          {...resto}
        />
        <span>{etiqueta}</span>
      </label>
      {error && (
        <p id={`${id}-error`} className="text-sm font-semibold">
          <span aria-hidden="true">— </span>
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Grupo de opciones con aspecto de chip. Son radios o casillas nativos (teclado, lector de
 * pantalla y envío del formulario sin JavaScript extra), ocultos visualmente.
 */
export function CampoOpciones({
  id,
  nombre,
  etiqueta,
  opciones,
  multiple = false,
  seleccionInicial = [],
  error,
  ayuda,
  className,
}: {
  id: string;
  nombre: string;
  etiqueta: string;
  opciones: Array<{ valor: string; etiqueta: string }>;
  multiple?: boolean;
  seleccionInicial?: readonly string[];
  error?: string;
  ayuda?: string;
  className?: string;
}) {
  return (
    <fieldset
      aria-describedby={describir(id, error, ayuda)}
      className={cx('flex flex-col gap-3', className)}
    >
      <legend className="mb-3 text-sm font-medium">{etiqueta}</legend>
      <div className="flex flex-wrap gap-2">
        {opciones.map((opcion) => (
          <label key={opcion.valor} className="relative cursor-pointer">
            <input
              type={multiple ? 'checkbox' : 'radio'}
              name={nombre}
              value={opcion.valor}
              defaultChecked={seleccionInicial.includes(opcion.valor)}
              className="peer sr-only"
            />
            <span className="inline-flex min-h-11 items-center border border-linea px-4 text-sm transition-colors duration-300 peer-checked:border-tinta peer-checked:bg-tinta peer-checked:text-papel peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-tinta hover:border-tinta">
              {opcion.etiqueta}
            </span>
          </label>
        ))}
      </div>
      <Mensajes id={id} error={error} ayuda={ayuda} />
    </fieldset>
  );
}
