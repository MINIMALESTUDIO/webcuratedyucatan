import Image from 'next/image';
import { useLocale } from 'next-intl';
import type { Imagen } from '@/lib/contenido/tipos';
import { localizar } from '@/lib/i18n/localizar';

interface Props {
  imagen: Imagen;
  /** Tamaños reales de presentación para que next/image elija el archivo correcto. */
  sizes: string;
  /** Solo la imagen principal de cada página se precarga (sección 10). */
  preload?: boolean;
  className?: string;
}

/**
 * Imagen de contenido con texto alternativo en el idioma de la página. Ocupa el contenedor
 * (que debe tener posición relativa y proporción definida, para evitar saltos de diseño).
 */
export function ImagenContenido({ imagen, sizes, preload = false, className }: Props) {
  const idioma = useLocale();
  return (
    <Image
      src={imagen.url}
      alt={localizar(imagen.alt, idioma)}
      fill
      sizes={sizes}
      preload={preload}
      className={className ?? 'object-cover'}
    />
  );
}
