import type { CSSProperties } from 'react';
import { Ibarra_Real_Nova, Source_Sans_3 } from 'next/font/google';

/*
 * Tipografía del sitio (D-005). Opción B aprobada: Ibarra Real Nova (títulos) y
 * Source Sans 3 (interfaz y datos), ambas variables y autohospedadas por next/font.
 *
 * Este es el único archivo que hay que tocar para cambiar de tipografía. Para la opción A:
 *
 *   import { Bodoni_Moda, Manrope } from 'next/font/google';
 *
 *   export const fuenteTitulo = Bodoni_Moda({
 *     subsets: ['latin'], axes: ['opsz'], display: 'swap', variable: '--fuente-titulo',
 *   });
 *   export const fuenteTituloItalica = Bodoni_Moda({
 *     subsets: ['latin'], style: 'italic', axes: ['opsz'], display: 'swap', preload: false,
 *     variable: '--fuente-titulo-italica',
 *   });
 *   export const fuenteTexto = Manrope({ subsets: ['latin'], display: 'swap', variable: '--fuente-texto' });
 *
 * y en `ajustesTipograficos`: '--peso-titulo': '500', '--peso-display': '400',
 * '--tracking-titulo': '-0.01em'.
 */

export const fuenteTitulo = Ibarra_Real_Nova({
  subsets: ['latin'],
  display: 'swap',
  variable: '--fuente-titulo',
});

// La itálica solo aparece en citas y entradillas: se carga aparte y sin precarga para no
// competir con la imagen principal de la página.
export const fuenteTituloItalica = Ibarra_Real_Nova({
  subsets: ['latin'],
  style: 'italic',
  display: 'swap',
  preload: false,
  variable: '--fuente-titulo-italica',
});

export const fuenteTexto = Source_Sans_3({
  subsets: ['latin'],
  display: 'swap',
  variable: '--fuente-texto',
});

/** Ajustes finos de la familia elegida, disponibles como variables CSS. */
export const ajustesTipograficos = {
  '--peso-titulo': '500',
  '--peso-display': '400',
  '--tracking-titulo': '-0.005em',
} as CSSProperties;

/** Clases que declaran las variables de las dos familias en <html>. */
export const clasesTipograficas = `${fuenteTitulo.variable} ${fuenteTituloItalica.variable} ${fuenteTexto.variable}`;
