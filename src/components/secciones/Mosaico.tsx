import type { Imagen } from '@/lib/contenido/tipos';
import { rutaElemento } from '@/lib/sanity/edicion';
import { cx } from '@/lib/utilidades';
import { ImagenContenido } from '@/components/ui/ImagenContenido';

/**
 * Composición de fotos rectangulares con filetes blancos finos, como las páginas de fotos del
 * libro. Con una foto, a lo ancho; con dos o más, las dos primeras en proporción 3:2.
 */
export function Mosaico({
  imagenes,
  origen,
  className,
}: {
  imagenes: Imagen[];
  /** Documento y arreglo de Sanity, para editar cada foto desde la página. */
  origen?: { id: string; tipo: string; arreglo: string };
  className?: string;
}) {
  if (imagenes.length === 0) return null;
  const edicion = (imagen: Imagen) =>
    origen && imagen._key
      ? { id: origen.id, tipo: origen.tipo, ruta: rutaElemento(origen.arreglo, imagen._key) }
      : undefined;

  if (imagenes.length === 1) {
    const [imagen] = imagenes as [Imagen];
    return (
      <div className={cx('relative aspect-[3/2] overflow-hidden bg-arena', className)}>
        <ImagenContenido
          imagen={imagen}
          edicion={edicion(imagen)}
          sizes="(min-width: 1280px) 1200px, 100vw"
        />
      </div>
    );
  }

  return (
    <div className={cx('grid grid-cols-5 gap-2', className)}>
      {imagenes.slice(0, 2).map((imagen, i) => (
        <div
          key={imagen._key ?? imagen.url}
          className={cx(
            'relative aspect-[3/4] overflow-hidden bg-arena',
            i === 0 ? 'col-span-3' : 'col-span-2',
          )}
        >
          <ImagenContenido
            imagen={imagen}
            edicion={edicion(imagen)}
            sizes={i === 0 ? '(min-width: 1280px) 720px, 60vw' : '(min-width: 1280px) 480px, 40vw'}
          />
        </div>
      ))}
    </div>
  );
}
