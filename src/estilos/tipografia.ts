import { Cinzel, Montserrat, Questrial } from 'next/font/google';

/*
 * Tipografía del sitio (D-036): las familias del libro impreso Curated Yucatán, autohospedadas
 * por next/font.
 * - Questrial: sustituto libre (OFL) de Century Gothic, que es comercial. Es la voz de marca:
 *   logotipo, títulos de sección y etiquetas, en mayúsculas espaciadas. Medido contra Century
 *   Gothic: 99 % del ancho, misma altura de x y la misma "O" redonda.
 * - Cinzel: solo nombres propios de venues y partners, como en el libro.
 * - Montserrat: cuerpo, interfaz, formularios y datos.
 *
 * Este es el único archivo que hay que tocar para cambiar de familias.
 */

export const fuenteMarca = Questrial({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--fuente-marca',
});

// Los nombres propios solo aparecen en fichas y tarjetas: sin precarga para no competir con la
// imagen principal de la página.
export const fuenteNombre = Cinzel({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--fuente-nombre',
});

export const fuenteTexto = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--fuente-texto',
});

// La itálica (lemas y entradillas) se carga aparte y sin precarga para no competir con la
// imagen principal; globales.css la asigna a .italic, em, i y blockquote.
export const fuenteTextoItalica = Montserrat({
  subsets: ['latin'],
  style: 'italic',
  display: 'swap',
  preload: false,
  variable: '--fuente-texto-italica',
});

/** Clases que declaran las variables de las familias en <html>. */
export const clasesTipograficas = [fuenteMarca, fuenteNombre, fuenteTexto, fuenteTextoItalica]
  .map((fuente) => fuente.variable)
  .join(' ');
