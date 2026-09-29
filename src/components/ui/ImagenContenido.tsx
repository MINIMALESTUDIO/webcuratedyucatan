'use client';

// Cliente: el loader del CDN de Sanity es una función y no puede pasar del servidor al cliente.
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { imageLoader } from 'next-sanity/image';
import type { Imagen } from '@/lib/contenido/tipos';
import { localizar } from '@/lib/i18n/localizar';
import { atributoEdicion, type OrigenEdicion } from '@/lib/sanity/edicion';

interface Props {
  imagen: Imagen;
  /** Tamaños reales de presentación para que next/image elija el archivo correcto. */
  sizes: string;
  /** Solo la imagen principal de cada página se precarga (sección 10). */
  preload?: boolean;
  className?: string;
  /** Campo de Sanity que se abre al hacer clic en la imagen en "Editar en la página". */
  edicion?: OrigenEdicion;
  /**
   * Imagen dentro de un control cuyo texto ya dice lo mismo (opciones de Find Your Yucatán,
   * colecciones): alt vacío para no repetir el nombre accesible.
   */
  decorativa?: boolean;
}

/**
 * Imagen de contenido con texto alternativo en el idioma de la página. Ocupa el contenedor
 * (que debe tener posición relativa y proporción definida, para evitar saltos de diseño).
 * Las imágenes de Sanity se redimensionan en su CDN (sin trabajo en el servidor, D-025); las
 * locales pasan por el optimizador de Next.
 */
export function ImagenContenido({
  imagen,
  sizes,
  preload = false,
  className,
  edicion,
  decorativa = false,
}: Props) {
  const idioma = useLocale();
  const deSanity = imagen.url.startsWith('https://cdn.sanity.io/');
  return (
    <Image
      src={imagen.url}
      alt={decorativa ? '' : localizar(imagen.alt, idioma)}
      fill
      sizes={sizes}
      preload={preload}
      // `preload` no sube la prioridad de la petición: sin esto la imagen principal compite
      // con fuentes y scripts y el LCP se retrasa.
      fetchPriority={preload ? 'high' : undefined}
      loader={deSanity ? imageLoader : undefined}
      className={className ?? 'object-cover'}
      style={
        imagen.hotspot
          ? { objectPosition: `${imagen.hotspot.x * 100}% ${imagen.hotspot.y * 100}%` }
          : undefined
      }
      data-sanity={atributoEdicion(edicion)}
    />
  );
}
