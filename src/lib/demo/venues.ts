import type {
  Capitulo,
  FichaTecnica,
  InteriorExterior,
  NivelListado,
  TipoVenue,
  Venue,
} from '@/lib/contenido/tipos';
import { bloques, galeriaDemo, imagenDemo, texto } from './ayudantes';
import { resumenProveedor } from './proveedores';
import { regionesDemo } from './regiones';

/*
 * Seis venues ficticios. Nombres, textos y cifras son [DEMO] (regla 3 de docs/PROMPT.md).
 * Los venues con nivel "video" o "destacado" traen entrevista; los "basico", no (D-015).
 */

// Video público de Google for Developers usado en la documentación de la API de YouTube
// (22 min). Sirve para probar el reproductor y los capítulos hasta tener IDs reales (D-007).
const VIDEO_MUESTRA = 'M7lc1UVf-VE';

const capitulosMuestra: Capitulo[] = [
  { _key: 'c1', titulo: texto('Introduction', 'Introducción'), segundoInicio: 0 },
  {
    _key: 'c2',
    titulo: texto('The place and its story', 'El lugar y su historia'),
    segundoInicio: 95,
  },
  {
    _key: 'c3',
    titulo: texto('Ceremony and reception spaces', 'Espacios para ceremonia y recepción'),
    segundoInicio: 310,
  },
  {
    _key: 'c4',
    titulo: texto('Planning a wedding weekend', 'Cómo planear un fin de semana de boda'),
    segundoInicio: 640,
  },
  { _key: 'c5', titulo: texto('Advice for couples', 'Consejos para parejas'), segundoInicio: 1020 },
];

interface EspacioDemo {
  en: string;
  es: string;
  tipo: InteriorExterior;
  ceremonia?: number;
  coctel?: number;
  banquete?: number;
  /** Índice de la foto de la galería que ilustra el espacio. */
  foto: number;
}

interface DatosVenueDemo {
  numero: number;
  nombre: string;
  slug: string;
  region: string;
  tipos: TipoVenue[];
  destacado: boolean;
  nivelListado: NivelListado;
  resumen: [en: string, es: string];
  ficha: FichaTecnica;
  espacios: EspacioDemo[];
  proveedores: string[];
}

function venueDemo(d: DatosVenueDemo): Venue {
  const region = regionesDemo.find((r) => r.slug === d.region);
  if (!region) throw new Error(`Región DEMO inexistente: ${d.region}`);
  const galeria = galeriaDemo(d.numero, d.nombre);
  const conEntrevista = d.nivelListado !== 'basico';

  return {
    _id: `venue-${d.slug}`,
    _type: 'venue',
    nombre: d.nombre,
    slug: d.slug,
    destacado: d.destacado,
    nivelListado: d.nivelListado,
    publicado: true,
    region: { nombre: region.nombre, slug: region.slug },
    tipos: d.tipos,
    resumen: texto(...d.resumen),
    descripcion: bloques(
      `venue-${d.numero}`,
      [
        `[DEMO] This is sample text for ${d.nombre}. The real description will come from the printed publication and the venue interview.`,
        '[DEMO] A second paragraph shows the reading rhythm: history of the place, the atmosphere of each space and what makes it special for a wedding weekend.',
      ],
      [
        `[DEMO] Este es un texto de ejemplo para ${d.nombre}. La descripción real vendrá de la publicación impresa y de la entrevista con el venue.`,
        '[DEMO] Un segundo párrafo muestra el ritmo de lectura: la historia del lugar, el ambiente de cada espacio y lo que lo hace especial para un fin de semana de boda.',
      ],
    ),
    fichaTecnica: d.ficha,
    media: {
      imagenHero: imagenDemo(
        `venue-${d.numero}-hero.jpg`,
        2400,
        1500,
        `[DEMO] Placeholder main photo of ${d.nombre}`,
        `[DEMO] Foto principal de relleno de ${d.nombre}`,
      ),
      galeria,
    },
    entrevista: conEntrevista
      ? {
          youtubeId: VIDEO_MUESTRA,
          titulo: texto(
            '[DEMO] Sample video: YouTube Developers Live',
            '[DEMO] Video de muestra: YouTube Developers Live',
          ),
          capitulos: capitulosMuestra,
          esDemo: true,
        }
      : undefined,
    citasDestacadas: [
      {
        _key: 'cita-1',
        texto: texto(
          '[DEMO] A highlighted quote from the interview will appear here, in the voice of the venue.',
          '[DEMO] Aquí aparecerá una cita destacada de la entrevista, con la voz del venue.',
        ),
        autor: '[DEMO] Nombre Apellido',
        cargo: texto('Venue director', 'Dirección del venue'),
      },
      {
        _key: 'cita-2',
        texto: texto(
          '[DEMO] A second quote, shorter, about what couples usually ask for.',
          '[DEMO] Una segunda cita, más corta, sobre lo que suelen pedir las parejas.',
        ),
        autor: '[DEMO] Nombre Apellido',
        cargo: texto('Events coordinator', 'Coordinación de eventos'),
      },
    ],
    espacios: d.espacios.map((e, i) => {
      const foto = galeria[e.foto];
      return {
        _key: `espacio-${i + 1}`,
        nombre: texto(e.en, e.es),
        descripcion: texto(
          '[DEMO] Short description of the space and how it is usually set up.',
          '[DEMO] Descripción breve del espacio y de cómo suele montarse.',
        ),
        interiorExterior: e.tipo,
        capacidadCeremonia: e.ceremonia,
        capacidadCoctel: e.coctel,
        capacidadBanquete: e.banquete,
        imagenes: foto ? [foto] : [],
      };
    }),
    proveedoresRecomendados: d.proveedores.map(resumenProveedor),
  };
}

export const venuesDemo: Venue[] = [
  venueDemo({
    numero: 1,
    nombre: '[DEMO] Hacienda Ejemplo Norte',
    slug: 'demo-hacienda-ejemplo-norte',
    region: 'haciendas',
    tipos: ['hacienda'],
    destacado: true,
    nivelListado: 'destacado',
    resumen: [
      '[DEMO] A restored hacienda with a main house, gardens and a chapel. Sample summary text.',
      '[DEMO] Hacienda restaurada con casa principal, jardines y capilla. Resumen de ejemplo.',
    ],
    ficha: {
      capacidadCeremoniaMax: 400,
      capacidadCoctelMax: 500,
      capacidadBanqueteMax: 350,
      hospedaje: { tieneHospedaje: true, habitaciones: 12, huespedesMax: 28 },
      catering: 'ambos',
      horarioLimiteMusica: texto('2:00 a.m.', '2:00 a. m.'),
      minutosAeropuertoMID: 35,
      minutosCentroMerida: 30,
      inversionDesdeUSD: 25000,
      mejorTemporada: texto('November to April', 'Noviembre a abril'),
      ubicacion: { lat: 20.83, lng: -89.58 },
    },
    espacios: [
      {
        en: 'Main garden',
        es: 'Jardín principal',
        tipo: 'exterior',
        ceremonia: 400,
        coctel: 500,
        banquete: 350,
        foto: 0,
      },
      { en: 'Chapel', es: 'Capilla', tipo: 'interior', ceremonia: 120, foto: 1 },
      {
        en: 'Machine room',
        es: 'Casa de máquinas',
        tipo: 'mixto',
        coctel: 200,
        banquete: 150,
        foto: 2,
      },
    ],
    proveedores: ['demo-estudio-de-planeacion', 'demo-flores-ejemplo', 'demo-banquetes-ejemplo'],
  }),
  venueDemo({
    numero: 2,
    nombre: '[DEMO] Casona Ejemplo Centro',
    slug: 'demo-casona-ejemplo-centro',
    region: 'merida-centro',
    tipos: ['ciudad-colonial', 'boutique'],
    destacado: true,
    nivelListado: 'video',
    resumen: [
      '[DEMO] A colonial home with a courtyard and rooftop, a short walk from the main square.',
      '[DEMO] Casona colonial con patio y terraza, a unos pasos de la plaza principal.',
    ],
    ficha: {
      capacidadCeremoniaMax: 150,
      capacidadCoctelMax: 200,
      capacidadBanqueteMax: 120,
      hospedaje: { tieneHospedaje: true, habitaciones: 8, huespedesMax: 18 },
      catering: 'externo',
      horarioLimiteMusica: texto('11:00 p.m.', '11:00 p. m.'),
      minutosAeropuertoMID: 20,
      minutosCentroMerida: 5,
      inversionDesdeUSD: 15000,
      mejorTemporada: texto('October to March', 'Octubre a marzo'),
      ubicacion: { lat: 20.9674, lng: -89.6237 },
    },
    espacios: [
      {
        en: 'Central courtyard',
        es: 'Patio central',
        tipo: 'exterior',
        ceremonia: 150,
        coctel: 200,
        banquete: 120,
        foto: 0,
      },
      { en: 'Rooftop terrace', es: 'Terraza', tipo: 'exterior', coctel: 100, foto: 3 },
    ],
    proveedores: ['demo-foto-ejemplo', 'demo-renta-ejemplo', 'demo-trio-ejemplo'],
  }),
  venueDemo({
    numero: 3,
    nombre: '[DEMO] Casa de Playa Ejemplo',
    slug: 'demo-casa-de-playa-ejemplo',
    region: 'costa',
    tipos: ['playa'],
    destacado: false,
    nivelListado: 'video',
    resumen: [
      '[DEMO] A beach house on the Gulf coast for ceremonies at sunset. Sample summary text.',
      '[DEMO] Casa de playa en la costa del Golfo para ceremonias al atardecer. Resumen de ejemplo.',
    ],
    ficha: {
      capacidadCeremoniaMax: 200,
      capacidadCoctelMax: 250,
      capacidadBanqueteMax: 180,
      hospedaje: { tieneHospedaje: true, habitaciones: 10, huespedesMax: 24 },
      catering: 'propio',
      horarioLimiteMusica: texto('1:00 a.m.', '1:00 a. m.'),
      minutosAeropuertoMID: 50,
      minutosCentroMerida: 45,
      inversionDesdeUSD: 20000,
      mejorTemporada: texto('March to May', 'Marzo a mayo'),
      ubicacion: { lat: 21.28, lng: -89.66 },
    },
    espacios: [
      {
        en: 'Beachfront',
        es: 'Frente de playa',
        tipo: 'exterior',
        ceremonia: 200,
        coctel: 250,
        banquete: 180,
        foto: 0,
      },
      { en: 'Palapa lounge', es: 'Palapa', tipo: 'mixto', coctel: 120, foto: 2 },
    ],
    proveedores: ['demo-estudio-de-planeacion', 'demo-foto-ejemplo', 'demo-trio-ejemplo'],
  }),
  venueDemo({
    numero: 4,
    nombre: '[DEMO] Hacienda Ejemplo del Cenote',
    slug: 'demo-hacienda-ejemplo-del-cenote',
    region: 'haciendas',
    tipos: ['hacienda', 'cenote-selva'],
    destacado: true,
    nivelListado: 'destacado',
    resumen: [
      '[DEMO] A hacienda with a private cenote and jungle trails. Sample summary text.',
      '[DEMO] Hacienda con cenote privado y senderos en la selva. Resumen de ejemplo.',
    ],
    ficha: {
      capacidadCeremoniaMax: 300,
      capacidadCoctelMax: 350,
      capacidadBanqueteMax: 250,
      hospedaje: { tieneHospedaje: false },
      catering: 'externo',
      horarioLimiteMusica: texto('1:00 a.m.', '1:00 a. m.'),
      minutosAeropuertoMID: 55,
      minutosCentroMerida: 50,
      inversionDesdeUSD: 18000,
      mejorTemporada: texto('November to March', 'Noviembre a marzo'),
      ubicacion: { lat: 20.72, lng: -89.42 },
    },
    espacios: [
      {
        en: 'Cenote terrace',
        es: 'Terraza del cenote',
        tipo: 'exterior',
        ceremonia: 120,
        coctel: 150,
        foto: 1,
      },
      {
        en: 'Main courtyard',
        es: 'Patio principal',
        tipo: 'exterior',
        ceremonia: 300,
        coctel: 350,
        banquete: 250,
        foto: 0,
      },
      { en: 'Arcade', es: 'Arquería', tipo: 'mixto', banquete: 180, foto: 3 },
    ],
    proveedores: ['demo-flores-ejemplo', 'demo-renta-ejemplo', 'demo-banquetes-ejemplo'],
  }),
  venueDemo({
    numero: 5,
    nombre: '[DEMO] Patio Boutique Ejemplo',
    slug: 'demo-patio-boutique-ejemplo',
    region: 'merida-centro',
    tipos: ['boutique'],
    destacado: false,
    nivelListado: 'basico',
    resumen: [
      '[DEMO] An intimate courtyard for small weddings and welcome dinners. Sample summary text.',
      '[DEMO] Patio íntimo para bodas pequeñas y cenas de bienvenida. Resumen de ejemplo.',
    ],
    ficha: {
      capacidadCeremoniaMax: 80,
      capacidadCoctelMax: 100,
      capacidadBanqueteMax: 70,
      hospedaje: { tieneHospedaje: false },
      catering: 'ambos',
      horarioLimiteMusica: texto('10:00 p.m.', '10:00 p. m.'),
      minutosAeropuertoMID: 20,
      minutosCentroMerida: 5,
      inversionDesdeUSD: 8000,
      mejorTemporada: texto('Year-round', 'Todo el año'),
      ubicacion: { lat: 20.97, lng: -89.62 },
    },
    espacios: [
      {
        en: 'Courtyard',
        es: 'Patio',
        tipo: 'exterior',
        ceremonia: 80,
        coctel: 100,
        banquete: 70,
        foto: 0,
      },
      { en: 'Salon', es: 'Salón', tipo: 'interior', banquete: 50, foto: 2 },
    ],
    proveedores: ['demo-estudio-de-planeacion', 'demo-trio-ejemplo', 'demo-banquetes-ejemplo'],
  }),
  venueDemo({
    numero: 6,
    nombre: '[DEMO] Club de Playa Ejemplo',
    slug: 'demo-club-de-playa-ejemplo',
    region: 'costa',
    tipos: ['playa', 'otro'],
    destacado: false,
    nivelListado: 'basico',
    resumen: [
      '[DEMO] A beach club for large receptions by the sea. Sample summary text.',
      '[DEMO] Club de playa para recepciones grandes junto al mar. Resumen de ejemplo.',
    ],
    ficha: {
      capacidadCeremoniaMax: 450,
      capacidadCoctelMax: 600,
      capacidadBanqueteMax: 420,
      hospedaje: { tieneHospedaje: false },
      catering: 'propio',
      horarioLimiteMusica: texto('2:00 a.m.', '2:00 a. m.'),
      minutosAeropuertoMID: 50,
      minutosCentroMerida: 45,
      mejorTemporada: texto('April to June', 'Abril a junio'),
      ubicacion: { lat: 21.29, lng: -89.7 },
    },
    espacios: [
      {
        en: 'Beach deck',
        es: 'Terraza de playa',
        tipo: 'exterior',
        ceremonia: 450,
        coctel: 600,
        banquete: 420,
        foto: 0,
      },
      { en: 'Lounge', es: 'Lounge', tipo: 'mixto', coctel: 200, foto: 3 },
    ],
    proveedores: ['demo-foto-ejemplo', 'demo-renta-ejemplo', 'demo-banquetes-ejemplo'],
  }),
];
