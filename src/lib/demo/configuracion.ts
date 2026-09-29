import type { ConfiguracionSitio } from '@/lib/contenido/tipos';
import { imagenDemo, texto } from './ayudantes';

/*
 * Singleton configuracionSitio: textos e imágenes del inicio (documento de estructura,
 * sección 4). El lema y los temas son del documento; los demás textos son [DEMO].
 */

// Temas de "Discover Yucatán" en el inicio y la sección de la página a la que llevan.
const TEMAS: Array<[clave: string, en: string, es: string, ancla: string]> = [
  ['arquitectura', 'Architecture', 'Arquitectura', 'merida'],
  ['cultura', 'Culture', 'Cultura', 'cultura'],
  ['gastronomia', 'Gastronomy', 'Gastronomía', 'gastronomia'],
  ['historia', 'History', 'Historia', 'haciendas'],
  ['naturaleza', 'Nature', 'Naturaleza', 'naturaleza'],
  ['haciendas', 'Haciendas', 'Haciendas', 'haciendas'],
  ['experiencias', 'Experiences', 'Experiencias', 'experiencias'],
];

const AREAS = [
  ['venues', 'venues'],
  ['catering', 'catering'],
  ['fotografia', 'fotografia'],
  ['diseno-produccion', 'diseno'],
] as const;

export const configuracionDemo: ConfiguracionSitio = {
  _id: 'configuracionSitio',
  _type: 'configuracionSitio',
  lema: texto(
    'Your insider guide to celebrating in Yucatán.',
    'Tu guía experta para celebrar en Yucatán.',
  ),
  imagenHero: imagenDemo(
    'inicio-hero.jpg',
    2400,
    1500,
    '[DEMO] Placeholder photo for the home page',
    '[DEMO] Foto de relleno para el inicio',
  ),
  // Sin video en el piloto: el hero muestra solo la imagen. Tope: 2 MB escritorio, 1 MB móvil (D-014).
  videoHero: undefined,
  queEsCurated: {
    texto: texto(
      '[DEMO] A short explanation of Curated Yucatán: a platform to discover Yucatán, explore its venues and partners, and connect to start planning an event.',
      '[DEMO] Una explicación breve de Curated Yucatán: una plataforma para descubrir Yucatán, explorar sus venues y aliados, y conectar para empezar a planear un evento.',
    ),
  },
  descubre: {
    texto: texto(
      '[DEMO] Sample text introducing the destination through its architecture, culture and landscapes.',
      '[DEMO] Texto de ejemplo que presenta el destino a través de su arquitectura, cultura y paisajes.',
    ),
    temas: TEMAS.map(([clave, en, es, ancla]) => ({
      _key: `tema-${clave}`,
      titulo: texto(en, es),
      imagen: imagenDemo(
        `tema-${clave}.jpg`,
        1200,
        1500,
        `[DEMO] Placeholder photo: ${en}`,
        `[DEMO] Foto de relleno: ${es}`,
      ),
      ancla,
    })),
  },
  exploraCurated: {
    texto: texto(
      '[DEMO] Four areas, one curated selection.',
      '[DEMO] Cuatro áreas, una sola selección curada.',
    ),
    areas: AREAS.map(([destino, archivo]) => ({
      _key: `area-${destino}`,
      destino,
      texto: texto(
        '[DEMO] One line that describes this area of the collection.',
        '[DEMO] Una línea que describe esta área de la colección.',
      ),
      imagen: imagenDemo(
        `explora-${archivo}.jpg`,
        1600,
        1200,
        `[DEMO] Placeholder photo for ${destino}`,
        `[DEMO] Foto de relleno para ${destino}`,
      ),
    })),
  },
  planea: {
    texto: texto(
      '[DEMO] From exploring to planning: tell us about your event and we will guide you to the right places and partners.',
      '[DEMO] De explorar a planear: cuéntanos de tu evento y te guiamos hacia los lugares y aliados adecuados.',
    ),
    imagen: imagenDemo(
      'inicio-planea.jpg',
      2400,
      1400,
      '[DEMO] Placeholder photo for Plan your event',
      '[DEMO] Foto de relleno para Planea tu evento',
    ),
  },
  redes: {},
};
