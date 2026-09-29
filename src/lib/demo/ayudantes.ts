import type {
  BloquesLocalizados,
  BloqueTexto,
  ElementoLista,
  Imagen,
  TextoLocalizado,
} from '@/lib/contenido/tipos';

/** Texto bilingüe. */
export function texto(en: string, es: string): TextoLocalizado {
  return { en, es };
}

/** Imagen de relleno generada por scripts/generar-imagenes-demo.mjs (D-025). */
export function imagenDemo(
  archivo: string,
  ancho: number,
  alto: number,
  altEn: string,
  altEs: string,
): Imagen {
  return { url: `/demo/${archivo}`, ancho, alto, alt: { en: altEn, es: altEs }, esDemo: true };
}

function aBloques(prefijo: string, parrafos: string[]): BloqueTexto[] {
  return parrafos.map((parrafo, i) => ({
    _type: 'block',
    _key: `${prefijo}-${i}`,
    style: 'normal',
    children: [{ _type: 'span', _key: `${prefijo}-${i}-s`, text: parrafo }],
  }));
}

/** Texto enriquecido bilingüe a partir de párrafos. */
export function bloques(prefijo: string, en: string[], es: string[]): BloquesLocalizados {
  return { en: aBloques(`${prefijo}-en`, en), es: aBloques(`${prefijo}-es`, es) };
}

/** Lista bilingüe con claves estables. */
export function lista(
  prefijo: string,
  elementos: Array<[en: string, es: string]>,
): ElementoLista[] {
  return elementos.map(([en, es], i) => ({ _key: `${prefijo}-${i + 1}`, texto: texto(en, es) }));
}

type Medida = [ancho: number, alto: number];
export const HORIZONTAL: Medida = [1600, 1067];
export const VERTICAL: Medida = [1200, 1500];

/** Serie de imágenes DEMO numeradas: `${prefijo}-1.jpg`, `${prefijo}-2.jpg`… */
export function serieDemo(prefijo: string, medidas: Medida[], nombre: string): Imagen[] {
  return medidas.map(([ancho, alto], i) => ({
    ...imagenDemo(
      `${prefijo}-${i + 1}.jpg`,
      ancho,
      alto,
      `[DEMO] Placeholder photo ${i + 1} of ${nombre}`,
      `[DEMO] Foto de relleno ${i + 1} de ${nombre}`,
    ),
    _key: `${prefijo}-${i + 1}`,
  }));
}
