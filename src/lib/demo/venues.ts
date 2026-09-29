import type {
  AtributoVenue,
  Capitulo,
  FichaTecnica,
  InteriorExterior,
  Venue,
} from '@/lib/contenido/tipos';
import { bloques, HORIZONTAL, imagenDemo, serieDemo, texto, VERTICAL } from './ayudantes';
import { coleccionPorSlug } from './colecciones';
import { regionesDemo } from './regiones';

/*
 * Seis venues ficticios, dos por colección. Nombres, textos y cifras son [DEMO] (regla 3 de
 * docs/PROMPT.md). Las localidades son municipios reales solo como referencia de ubicación.
 */

// Video público de Google for Developers usado en la documentación de la API de YouTube.
// Sirve para probar el reproductor y los capítulos hasta tener los videos de la serie (D-007).
const VIDEO_MUESTRA = 'M7lc1UVf-VE';

const capitulosMuestra: Capitulo[] = [
  { _key: 'c1', titulo: texto('Introduction', 'Introducción'), segundoInicio: 0 },
  {
    _key: 'c2',
    titulo: texto('The place and its story', 'El lugar y su historia'),
    segundoInicio: 95,
  },
  { _key: 'c3', titulo: texto('Spaces and light', 'Espacios y luz'), segundoInicio: 310 },
  { _key: 'c4', titulo: texto('Planning notes', 'Notas de planeación'), segundoInicio: 640 },
];

interface EspacioDemo {
  en: string;
  es: string;
  tipo: InteriorExterior;
  capacidad?: number;
  /** Índice de la foto de la galería que ilustra el espacio. */
  foto: number;
}

interface DatosVenueDemo {
  numero: number;
  nombre: string;
  slug: string;
  coleccion: string;
  region: string;
  localidad: string;
  destacado: boolean;
  conPelicula: boolean;
  resumen: [en: string, es: string];
  ficha: FichaTecnica;
  espacios: EspacioDemo[];
  atributos: AtributoVenue[];
}

const MEDIDAS_GALERIA = [HORIZONTAL, VERTICAL, HORIZONTAL, HORIZONTAL, VERTICAL];

function venueDemo(d: DatosVenueDemo): Venue {
  const region = regionesDemo.find((r) => r.slug === d.region);
  if (!region) throw new Error(`Región DEMO inexistente: ${d.region}`);
  const { nombre, slug, resultado } = coleccionPorSlug(d.coleccion);
  const galeria = serieDemo(`venue-${d.numero}-galeria`, MEDIDAS_GALERIA, d.nombre);

  return {
    _id: `venue-${d.slug}`,
    _type: 'venue',
    nombre: d.nombre,
    slug: d.slug,
    publicado: true,
    destacado: d.destacado,
    coleccion: { nombre, slug, resultado },
    region: { nombre: region.nombre, slug: region.slug },
    localidad: d.localidad,
    resumen: texto(...d.resumen),
    descripcion: bloques(
      `venue-${d.numero}`,
      [
        `[DEMO] This is sample text for ${d.nombre}. The editorial description will come from the verified venue profile.`,
        '[DEMO] A second paragraph shows the reading rhythm: the history of the place, the character of its architecture and the atmosphere it offers a celebration.',
      ],
      [
        `[DEMO] Este es un texto de ejemplo para ${d.nombre}. La descripción editorial vendrá de la ficha verificada del venue.`,
        '[DEMO] Un segundo párrafo muestra el ritmo de lectura: la historia del lugar, el carácter de su arquitectura y la atmósfera que ofrece a una celebración.',
      ],
    ),
    fichaTecnica: d.ficha,
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
        capacidad: e.capacidad,
        imagenes: foto ? [foto] : [],
      };
    }),
    notasCurated: [
      {
        _key: 'nota-1',
        titulo: texto('[DEMO] Vendor access', '[DEMO] Acceso de proveedores'),
        texto: texto(
          '[DEMO] Sample note for planners about load-in times and access for production teams.',
          '[DEMO] Nota de ejemplo para planners sobre horarios de montaje y acceso de producción.',
        ),
      },
      {
        _key: 'nota-2',
        titulo: texto('[DEMO] Sound and timing', '[DEMO] Sonido y horarios'),
        texto: texto(
          '[DEMO] Sample note about music curfews and the best time of day for the ceremony.',
          '[DEMO] Nota de ejemplo sobre horarios de música y el mejor momento del día para la ceremonia.',
        ),
      },
      {
        _key: 'nota-3',
        titulo: texto('[DEMO] Guest logistics', '[DEMO] Logística de invitados'),
        texto: texto(
          '[DEMO] Sample note about transportation, parking and nearby accommodation.',
          '[DEMO] Nota de ejemplo sobre transporte, estacionamiento y hospedaje cercano.',
        ),
      },
    ],
    atributos: d.atributos,
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
    pelicula: d.conPelicula
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
  };
}

export const venuesDemo: Venue[] = [
  venueDemo({
    numero: 1,
    nombre: '[DEMO] Hacienda Ejemplo Norte',
    slug: 'demo-hacienda-ejemplo-norte',
    coleccion: 'timeless',
    region: 'alrededores-de-merida',
    localidad: 'Tixkokob',
    destacado: true,
    conPelicula: true,
    resumen: [
      '[DEMO] A restored hacienda with a main house, gardens and a chapel. Sample summary text.',
      '[DEMO] Hacienda restaurada con casa principal, jardines y capilla. Resumen de ejemplo.',
    ],
    ficha: {
      capacidadMax: 500,
      hospedaje: { tieneHospedaje: true, habitaciones: 12, huespedesMax: 28 },
      minutosCentroMerida: 30,
      kmCentroMerida: 24,
    },
    espacios: [
      { en: 'Main garden', es: 'Jardín principal', tipo: 'exterior', capacidad: 500, foto: 0 },
      { en: 'Chapel', es: 'Capilla', tipo: 'interior', capacidad: 120, foto: 1 },
      { en: 'Machine room', es: 'Casa de máquinas', tipo: 'mixto', capacidad: 200, foto: 2 },
    ],
    atributos: ['arquitectura', 'privacidad'],
  }),
  venueDemo({
    numero: 2,
    nombre: '[DEMO] Casona Ejemplo Centro',
    slug: 'demo-casona-ejemplo-centro',
    coleccion: 'timeless',
    region: 'merida',
    localidad: 'Mérida',
    destacado: true,
    conPelicula: true,
    resumen: [
      '[DEMO] A colonial home with a courtyard and rooftop, a short walk from the main square.',
      '[DEMO] Casona colonial con patio y terraza, a unos pasos de la plaza principal.',
    ],
    ficha: {
      capacidadMax: 200,
      hospedaje: { tieneHospedaje: true, habitaciones: 8, huespedesMax: 18 },
      minutosCentroMerida: 5,
      kmCentroMerida: 2,
    },
    espacios: [
      { en: 'Central courtyard', es: 'Patio central', tipo: 'exterior', capacidad: 200, foto: 0 },
      { en: 'Salon', es: 'Salón', tipo: 'interior', capacidad: 80, foto: 3 },
    ],
    atributos: ['arquitectura', 'ubicacion', 'gastronomia'],
  }),
  venueDemo({
    numero: 3,
    nombre: '[DEMO] Casa de Playa Ejemplo',
    slug: 'demo-casa-de-playa-ejemplo',
    coleccion: 'contemporary',
    region: 'costa',
    localidad: 'Progreso',
    destacado: false,
    conPelicula: false,
    resumen: [
      '[DEMO] A contemporary beach house on the Gulf coast for ceremonies at sunset.',
      '[DEMO] Casa de playa contemporánea en la costa del Golfo para ceremonias al atardecer.',
    ],
    ficha: {
      capacidadMax: 250,
      hospedaje: { tieneHospedaje: true, habitaciones: 10, huespedesMax: 24 },
      minutosCentroMerida: 45,
      kmCentroMerida: 38,
    },
    espacios: [
      { en: 'Beachfront', es: 'Frente de playa', tipo: 'exterior', capacidad: 250, foto: 0 },
      { en: 'Pavilion', es: 'Pabellón', tipo: 'mixto', capacidad: 120, foto: 2 },
    ],
    atributos: ['naturaleza', 'privacidad'],
  }),
  venueDemo({
    numero: 4,
    nombre: '[DEMO] Hacienda Ejemplo del Cenote',
    slug: 'demo-hacienda-ejemplo-del-cenote',
    coleccion: 'organic',
    region: 'alrededores-de-merida',
    localidad: 'Homún',
    destacado: true,
    conPelicula: true,
    resumen: [
      '[DEMO] A hacienda with a private cenote and jungle trails. Sample summary text.',
      '[DEMO] Hacienda con cenote privado y senderos en la selva. Resumen de ejemplo.',
    ],
    ficha: {
      capacidadMax: 350,
      hospedaje: { tieneHospedaje: false },
      minutosCentroMerida: 60,
      kmCentroMerida: 52,
    },
    espacios: [
      { en: 'Cenote terrace', es: 'Terraza del cenote', tipo: 'exterior', capacidad: 150, foto: 1 },
      { en: 'Main courtyard', es: 'Patio principal', tipo: 'exterior', capacidad: 350, foto: 0 },
      { en: 'Arcade', es: 'Arquería', tipo: 'mixto', capacidad: 180, foto: 3 },
    ],
    atributos: ['naturaleza', 'privacidad'],
  }),
  venueDemo({
    numero: 5,
    nombre: '[DEMO] Estudio Ejemplo Contemporáneo',
    slug: 'demo-estudio-ejemplo-contemporaneo',
    coleccion: 'contemporary',
    region: 'merida',
    localidad: 'Mérida',
    destacado: true,
    conPelicula: false,
    resumen: [
      '[DEMO] A contemporary space of stone, light and gardens in the city. Sample summary text.',
      '[DEMO] Un espacio contemporáneo de piedra, luz y jardines en la ciudad. Resumen de ejemplo.',
    ],
    ficha: {
      capacidadMax: 180,
      hospedaje: { tieneHospedaje: false },
      minutosCentroMerida: 15,
      kmCentroMerida: 9,
    },
    espacios: [
      { en: 'Gallery', es: 'Galería', tipo: 'interior', capacidad: 120, foto: 1 },
      { en: 'Garden', es: 'Jardín', tipo: 'exterior', capacidad: 180, foto: 0 },
    ],
    atributos: ['arquitectura', 'gastronomia', 'ubicacion'],
  }),
  venueDemo({
    numero: 6,
    nombre: '[DEMO] Finca Ejemplo del Bosque',
    slug: 'demo-finca-ejemplo-del-bosque',
    coleccion: 'organic',
    region: 'alrededores-de-merida',
    localidad: 'Acanceh',
    destacado: false,
    conPelicula: false,
    resumen: [
      '[DEMO] An estate surrounded by vegetation, with open-air spaces and a small inn.',
      '[DEMO] Una finca rodeada de vegetación, con espacios al aire libre y una pequeña posada.',
    ],
    ficha: {
      capacidadMax: 400,
      hospedaje: { tieneHospedaje: true, habitaciones: 6, huespedesMax: 14 },
      minutosCentroMerida: 45,
      kmCentroMerida: 30,
    },
    espacios: [
      { en: 'Clearing', es: 'Claro del bosque', tipo: 'exterior', capacidad: 400, foto: 0 },
      { en: 'Stone patio', es: 'Patio de piedra', tipo: 'exterior', capacidad: 150, foto: 2 },
    ],
    atributos: ['naturaleza', 'gastronomia'],
  }),
];
