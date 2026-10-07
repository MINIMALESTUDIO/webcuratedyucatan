import type { ConfiguracionSitio } from '@/lib/contenido/tipos';
import { imagenDemo, texto } from './ayudantes';

/*
 * Singleton configuracionSitio: textos e imágenes del inicio (documento de estructura,
 * sección 4).
 *
 * Copy real tomado de 01_WEB/01_HOME (Drive, 2026-10-01) para los bloques que no requieren
 * páginas o fichas adicionales: hero, "What is Curated?", la entradilla de "Discover Yucatán",
 * "Explore Curated" y el cierre "Plan your event". Las traducciones al español son nuestras.
 *
 * Los bloques que salen de otros documentos:
 * - "Featured Venues": los venues marcados como destacados, que son los cuatro del documento
 *   (src/lib/demo/venues.ts, 2026-10-02);
 * - los temas de "Discover Yucatán": las seis categorías con página propia
 *   (src/lib/demo/descubre.ts, D-048).
 */

// Microdescripción de cada área, tal como aparece en 01_WEB/01_HOME/04 — EXPLORE CURATED.
const AREAS = [
  [
    'venues',
    'venues',
    'Discover remarkable settings for celebrations across Yucatán.',
    'Descubre escenarios excepcionales para celebraciones en Yucatán.',
  ],
  [
    'catering',
    'catering',
    'Explore the flavors and culinary talent behind celebrations in Yucatán.',
    'Explora los sabores y el talento culinario detrás de las celebraciones en Yucatán.',
  ],
  [
    'fotografia',
    'fotografia',
    'Discover photographers with a distinct point of view and a story to tell.',
    'Descubre fotógrafos con una mirada propia y una historia que contar.',
  ],
  [
    'diseno-produccion',
    'diseno',
    'Explore the creative direction, design and production that bring celebrations to life.',
    'Explora la dirección creativa, el diseño y la producción que dan vida a las celebraciones.',
  ],
] as const;

export const configuracionDemo: ConfiguracionSitio = {
  _id: 'configuracionSitio',
  _type: 'configuracionSitio',
  lema: texto(
    'An editorial guide to destination weddings, remarkable venues and local talent in Yucatán.',
    'Una guía editorial de bodas de destino, venues excepcionales y talento local en Yucatán.',
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
      'Curated Yucatán is an editorial destination guide created for those looking to celebrate in Yucatán. We bring together the places, local talent and essential insight that make the destination easier to discover, understand and navigate — all through a carefully curated point of view.',
      'Curated Yucatán es una guía editorial del destino, creada para quienes buscan celebrar en Yucatán. Reunimos los lugares, el talento local y la información esencial que hacen más fácil descubrir, entender y recorrer el destino, todo desde una mirada cuidadosamente curada.',
    ),
  },
  descubre: {
    texto: texto(
      'There is more to Yucatán than the celebration itself. Discover the culture, flavors, stories and landscapes that give this destination its unmistakable sense of place.',
      'Yucatán es mucho más que el escenario de una celebración. Descubre la cultura, los sabores, las historias y los paisajes que le dan a este destino su carácter inconfundible.',
    ),
  },
  exploraCurated: {
    texto: texto(
      'Start bringing your celebration to life. Explore a curated selection of venues and local talent across Yucatán.',
      'Empieza a darle vida a tu celebración. Explora una selección curada de venues y talento local en Yucatán.',
    ),
    areas: AREAS.map(([destino, archivo, en, es]) => ({
      _key: `area-${destino}`,
      destino,
      texto: texto(en, es),
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
      "Tell us what you're planning and what you're looking for. We'll help connect you with the places and local talent that fit your celebration.",
      'Cuéntanos qué estás planeando y qué buscas. Te ayudamos a conectar con los lugares y el talento local que van con tu celebración.',
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
