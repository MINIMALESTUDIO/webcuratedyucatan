import type { ReactNode } from 'react';
import { cx } from '@/lib/utilidades';
import { Sobretitulo } from '@/components/ui/Sobretitulo';

interface Props {
  sobretitulo?: string;
  titulo: string;
  entradilla?: string;
  /** Enlace o botón que acompaña al título (p. ej. "View all"). */
  accion?: ReactNode;
  id?: string;
  className?: string;
  /** Centrado, como los títulos del libro, o alineado a la izquierda con la acción a un lado. */
  alineacion?: 'centro' | 'izquierda';
  /** Nivel del título según la jerarquía de la página. */
  nivel?: 'h1' | 'h2';
}

export function EncabezadoSeccion({
  sobretitulo,
  titulo,
  entradilla,
  accion,
  id,
  className,
  alineacion = 'centro',
  nivel = 'h2',
}: Props) {
  const Titulo = nivel;
  const centro = alineacion === 'centro';
  return (
    <div
      className={cx(
        centro
          ? 'mx-auto flex max-w-2xl flex-col items-center text-center'
          : 'flex flex-col gap-6 md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div className={centro ? 'flex flex-col items-center' : 'max-w-2xl'}>
        {sobretitulo && <Sobretitulo className="mb-4">{sobretitulo}</Sobretitulo>}
        <Titulo id={id} className={nivel === 'h1' ? 'text-titulo-1' : 'text-titulo-2'}>
          {titulo}
        </Titulo>
        {entradilla && <p className="mt-6 text-destacado text-tinta-suave">{entradilla}</p>}
      </div>
      {accion && <div className={centro ? 'mt-8' : 'shrink-0'}>{accion}</div>}
    </div>
  );
}
