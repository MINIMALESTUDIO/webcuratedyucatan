import type {
  BloquesLocalizados,
  BloqueTexto,
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

/** Galería de cinco imágenes DEMO de un venue (mezcla de horizontales y verticales). */
export function galeriaDemo(numeroVenue: number, nombre: string): Imagen[] {
  const medidas: Array<[number, number]> = [
    [1600, 1067],
    [1067, 1600],
    [1600, 1067],
    [1600, 1067],
    [1067, 1600],
  ];
  return medidas.map(([ancho, alto], i) =>
    imagenDemo(
      `venue-${numeroVenue}-galeria-${i + 1}.jpg`,
      ancho,
      alto,
      `[DEMO] Placeholder photo ${i + 1} of ${nombre}`,
      `[DEMO] Foto de relleno ${i + 1} de ${nombre}`,
    ),
  );
}
