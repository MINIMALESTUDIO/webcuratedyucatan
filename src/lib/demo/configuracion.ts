import type { ConfiguracionSitio } from '@/lib/contenido/tipos';
import { imagenDemo, texto } from './ayudantes';

// Singleton configuracionSitio (sección 6). Todos los textos y cifras son [DEMO].
export const configuracionDemo: ConfiguracionSitio = {
  _id: 'configuracionSitio',
  _type: 'configuracionSitio',
  fraseHero: texto(
    '[DEMO] Weddings in Yucatán, curated.',
    '[DEMO] Bodas en Yucatán, con curaduría.',
  ),
  subtituloHero: texto(
    '[DEMO] Haciendas, colonial homes, beaches and cenotes, visited and filmed by our team.',
    '[DEMO] Haciendas, casonas coloniales, playas y cenotes, visitados y filmados por nuestro equipo.',
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
  porQueYucatan: {
    titulo: texto(
      '[DEMO] A destination with its own pace',
      '[DEMO] Un destino con su propio ritmo',
    ),
    entradilla: texto(
      '[DEMO] Sample introduction. The final text will explain why couples choose Yucatán.',
      '[DEMO] Entradilla de ejemplo. El texto final explicará por qué las parejas eligen Yucatán.',
    ),
    puntos: [
      {
        _key: 'p1',
        titulo: texto('[DEMO] Easy to reach', '[DEMO] Fácil de llegar'),
        texto: texto(
          '[DEMO] Sample text about flights and travel times to Mérida.',
          '[DEMO] Texto de ejemplo sobre vuelos y tiempos de traslado a Mérida.',
        ),
      },
      {
        _key: 'p2',
        titulo: texto('[DEMO] Architecture with history', '[DEMO] Arquitectura con historia'),
        texto: texto(
          '[DEMO] Sample text about haciendas and colonial homes.',
          '[DEMO] Texto de ejemplo sobre haciendas y casonas coloniales.',
        ),
      },
      {
        _key: 'p3',
        titulo: texto('[DEMO] Nature for every moment', '[DEMO] Naturaleza para cada momento'),
        texto: texto(
          '[DEMO] Sample text about cenotes, jungle and coast for the whole weekend.',
          '[DEMO] Texto de ejemplo sobre cenotes, selva y costa para todo el fin de semana.',
        ),
      },
    ],
  },
  sello: {
    titulo: texto('[DEMO] What "curated" means', '[DEMO] Qué significa "curated"'),
    texto: texto(
      '[DEMO] Sample text about the selection process behind every venue and vendor.',
      '[DEMO] Texto de ejemplo sobre el proceso de selección de cada venue y proveedor.',
    ),
    pasos: [
      {
        _key: 's1',
        titulo: texto('[DEMO] We visit', '[DEMO] Visitamos'),
        texto: texto(
          '[DEMO] Sample description of the step.',
          '[DEMO] Descripción de ejemplo del paso.',
        ),
      },
      {
        _key: 's2',
        titulo: texto('[DEMO] We film', '[DEMO] Filmamos'),
        texto: texto(
          '[DEMO] Sample description of the step.',
          '[DEMO] Descripción de ejemplo del paso.',
        ),
      },
      {
        _key: 's3',
        titulo: texto('[DEMO] We select', '[DEMO] Seleccionamos'),
        texto: texto(
          '[DEMO] Sample description of the step.',
          '[DEMO] Descripción de ejemplo del paso.',
        ),
      },
      {
        _key: 's4',
        titulo: texto('[DEMO] We connect', '[DEMO] Conectamos'),
        texto: texto(
          '[DEMO] Sample description of the step.',
          '[DEMO] Descripción de ejemplo del paso.',
        ),
      },
    ],
  },
  tradiciones: {
    titulo: texto(
      '[DEMO] Traditions to bring into your wedding',
      '[DEMO] Tradiciones para tu boda',
    ),
    entradilla: texto(
      '[DEMO] Sample introduction about Yucatecan traditions couples can include.',
      '[DEMO] Entradilla de ejemplo sobre tradiciones yucatecas que las parejas pueden incluir.',
    ),
    elementos: [
      {
        _key: 't1',
        titulo: texto('[DEMO] Jarana', '[DEMO] Jarana'),
        texto: texto(
          '[DEMO] Sample text about the tradition.',
          '[DEMO] Texto de ejemplo sobre la tradición.',
        ),
        imagen: imagenDemo(
          'tradicion-1.jpg',
          1200,
          1500,
          '[DEMO] Placeholder photo',
          '[DEMO] Foto de relleno',
        ),
      },
      {
        _key: 't2',
        titulo: texto('[DEMO] Terno and guayabera', '[DEMO] Terno y guayabera'),
        texto: texto(
          '[DEMO] Sample text about the tradition.',
          '[DEMO] Texto de ejemplo sobre la tradición.',
        ),
        imagen: imagenDemo(
          'tradicion-2.jpg',
          1200,
          1500,
          '[DEMO] Placeholder photo',
          '[DEMO] Foto de relleno',
        ),
      },
      {
        _key: 't3',
        titulo: texto('[DEMO] Yucatecan cuisine', '[DEMO] Cocina yucateca'),
        texto: texto(
          '[DEMO] Sample text about the tradition.',
          '[DEMO] Texto de ejemplo sobre la tradición.',
        ),
        imagen: imagenDemo(
          'tradicion-3.jpg',
          1200,
          1500,
          '[DEMO] Placeholder photo',
          '[DEMO] Foto de relleno',
        ),
      },
    ],
  },
  metricas: { venuesVisitados: 24, horasEntrevista: 60, edicionesImpresas: 2 },
  // [PENDIENTE] Enlaces reales de Instagram y YouTube y correo de contacto.
  redes: {},
  correoContacto: undefined,
};
