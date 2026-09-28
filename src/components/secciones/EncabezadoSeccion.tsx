import type { ReactNode } from 'react';
import { cx } from '@/lib/utilidades';
import { Sobretitulo } from '@/components/ui/Sobretitulo';

interface Props {
  sobretitulo?: string;
  titulo: string;
  entradilla?: string;
  /** Enlace o botón que acompaña al título (p. ej. "Ver todos"). */
  accion?: ReactNode;
  id?: string;
  className?: string;
  tono?: 'oscuro' | 'claro';
}

export function EncabezadoSeccion({
  sobretitulo,
  titulo,
  entradilla,
  accion,
  id,
  className,
  tono = 'oscuro',
}: Props) {
  return (
    <div
      className={cx('flex flex-col gap-6 md:flex-row md:items-end md:justify-between', className)}
    >
      <div className="max-w-2xl">
        {sobretitulo && (
          <Sobretitulo className={tono === 'claro' ? 'text-piedra' : undefined}>
            {sobretitulo}
          </Sobretitulo>
        )}
        <h2 id={id} className="mt-3 text-titulo-1">
          {titulo}
        </h2>
        {entradilla && (
          <p
            className={cx(
              'mt-4 text-destacado',
              tono === 'claro' ? 'text-piedra' : 'text-tinta-suave',
            )}
          >
            {entradilla}
          </p>
        )}
      </div>
      {accion && <div className="shrink-0">{accion}</div>}
    </div>
  );
}
