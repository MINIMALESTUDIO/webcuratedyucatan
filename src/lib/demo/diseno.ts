import type { DisenoProduccion } from '@/lib/contenido/tipos';
import { bloques, HORIZONTAL, imagenDemo, lista, serieDemo, texto, VERTICAL } from './ayudantes';

/*
 * Minimal como Curated Design & Production Partner (documento de estructura, sección 10).
 * El nombre, el lema y las áreas son del documento; los textos son [DEMO].
 */
const AREAS: Array<[clave: string, en: string, es: string]> = [
  ['mobiliario', 'Furniture', 'Mobiliario'],
  ['mesa', 'Tabletop', 'Mesa'],
  ['floral', 'Floral Design', 'Diseño floral'],
  ['decoracion', 'Décor', 'Decoración'],
  ['produccion', 'Production', 'Producción'],
];

export const disenoDemo: DisenoProduccion = {
  _id: 'disenoProduccion',
  _type: 'disenoProduccion',
  nombre: 'Minimal 4.0',
  lema: texto('Curated Design & Production Partner', 'Partner curado de diseño y producción'),
  descripcion: bloques(
    'diseno',
    [
      '[DEMO] Sample introduction to Minimal and how it works with planners on design and production.',
      '[DEMO] A second paragraph explains the areas it covers, from furniture to production, as one team.',
    ],
    [
      '[DEMO] Presentación de ejemplo de Minimal y de cómo trabaja con planners en diseño y producción.',
      '[DEMO] Un segundo párrafo explica las áreas que cubre, del mobiliario a la producción, como un solo equipo.',
    ],
  ),
  imagenPrincipal: imagenDemo(
    'diseno-hero.jpg',
    2400,
    1500,
    '[DEMO] Placeholder photo of a Minimal set design',
    '[DEMO] Foto de relleno de un montaje de Minimal',
  ),
  areas: AREAS.map(([clave, en, es]) => ({
    _key: `area-${clave}`,
    nombre: texto(en, es),
    descripcion: texto(
      `[DEMO] Sample description of ${en} and a recent project.`,
      `[DEMO] Descripción de ejemplo de ${es} y de un proyecto reciente.`,
    ),
    imagenes: serieDemo(`diseno-${clave}`, [HORIZONTAL, VERTICAL], en),
  })),
  servicios: lista('diseno-servicio', [
    ['[DEMO] Concept and design direction', '[DEMO] Concepto y dirección de diseño'],
    ['[DEMO] Furniture and tabletop', '[DEMO] Mobiliario y mesa'],
    ['[DEMO] Installation and production', '[DEMO] Montaje y producción'],
  ]),
  estilo: texto(
    '[DEMO] Sample style: clean lines, natural materials and a sense of place.',
    '[DEMO] Estilo de ejemplo: líneas limpias, materiales naturales y sentido del lugar.',
  ),
  experiencia: texto(
    '[DEMO] Sample text about experience with destination weddings and international planners.',
    '[DEMO] Texto de ejemplo sobre su experiencia con bodas destino y planners internacionales.',
  ),
  ciudadBase: 'Mérida',
  cobertura: texto('[DEMO] Yucatán and the Riviera Maya', '[DEMO] Yucatán y la Riviera Maya'),
  sitioWeb: 'https://example.com',
  instagram: 'https://www.instagram.com/',
};
