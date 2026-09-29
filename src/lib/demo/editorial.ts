import type {
  Articulo,
  BloqueTexto,
  BloquesLocalizados,
  DescubreYucatan,
  PaginaEditorial,
} from '@/lib/contenido/tipos';
import { bloques, HORIZONTAL, imagenDemo, serieDemo, texto, VERTICAL } from './ayudantes';

// --- Curated Journal -------------------------------------------------------------------

/** Cuerpo de artículo DEMO con subtítulo, para mostrar el ritmo de lectura. */
function cuerpoDemo(prefijo: string): BloquesLocalizados {
  const subtitulo = (idioma: string, textoSub: string): BloqueTexto => ({
    _type: 'block',
    _key: `${prefijo}-${idioma}-h2`,
    style: 'h2',
    children: [{ _type: 'span', _key: `${prefijo}-${idioma}-h2-s`, text: textoSub }],
  });
  const base = bloques(
    prefijo,
    [
      '[DEMO] This is sample text for a Curated Journal article. The real article will be written by the editorial team.',
      '[DEMO] A second paragraph shows how longer reading feels: generous line spacing, a comfortable measure and room for photography.',
      '[DEMO] A third paragraph closes the section before a subheading.',
    ],
    [
      '[DEMO] Este es un texto de ejemplo para un artículo del Curated Journal. El artículo real lo escribirá el equipo editorial.',
      '[DEMO] Un segundo párrafo muestra cómo se siente una lectura larga: interlineado generoso, una medida cómoda y espacio para la fotografía.',
      '[DEMO] Un tercer párrafo cierra la sección antes de un subtítulo.',
    ],
  );
  const cierre = bloques(
    `${prefijo}-cierre`,
    ['[DEMO] Closing paragraph with a practical recommendation for planners.'],
    ['[DEMO] Párrafo de cierre con una recomendación práctica para planners.'],
  );
  return {
    en: [...base.en, subtitulo('en', '[DEMO] A subheading'), ...cierre.en],
    es: [...(base.es ?? []), subtitulo('es', '[DEMO] Un subtítulo'), ...(cierre.es ?? [])],
  };
}

// Títulos planeados en el documento de estructura (sección 11); los textos son [DEMO].
const ARTICULOS: Array<[slug: string, en: string, es: string, fecha: string, minutos: number]> = [
  [
    'why-yucatan-for-a-destination-wedding',
    'Why Yucatán for a Destination Wedding?',
    '¿Por qué Yucatán para una boda destino?',
    '2026-09-20',
    6,
  ],
  [
    'a-wedding-planners-guide-to-merida',
    "A Wedding Planner's Guide to Mérida",
    'Guía de Mérida para wedding planners',
    '2026-09-10',
    8,
  ],
  [
    'planning-a-hacienda-wedding',
    'Planning a Hacienda Wedding: What You Need to Know',
    'Planear una boda en hacienda: lo que necesitas saber',
    '2026-08-28',
    7,
  ],
  [
    'best-time-to-get-married-in-yucatan',
    'When Is the Best Time to Get Married in Yucatán?',
    '¿Cuál es la mejor época para casarse en Yucatán?',
    '2026-08-12',
    5,
  ],
  [
    'how-to-build-a-wedding-weekend-in-yucatan',
    'How to Build a Wedding Weekend in Yucatán',
    'Cómo armar un fin de semana de boda en Yucatán',
    '2026-07-30',
    6,
  ],
];

export const articulosDemo: Articulo[] = ARTICULOS.map(([slug, en, es, fecha, minutos], i) => ({
  _id: `articulo-${slug}`,
  _type: 'articulo',
  titulo: texto(en, es),
  slug,
  imagenPortada: imagenDemo(
    `articulo-${i + 1}.jpg`,
    ...HORIZONTAL,
    `[DEMO] Placeholder photo for "${en}"`,
    `[DEMO] Foto de relleno para «${es}»`,
  ),
  extracto: texto(
    '[DEMO] A short excerpt that invites the reader to open the article.',
    '[DEMO] Un extracto breve que invita a abrir el artículo.',
  ),
  fechaPublicacion: fecha,
  tiempoLectura: minutos,
  cuerpo: cuerpoDemo(`articulo-${i + 1}`),
}));

// --- Discover Yucatán --------------------------------------------------------------------

// Secciones y etiquetas del documento de estructura (sección 5); los textos son [DEMO].
const SECCIONES_DESCUBRE: Array<
  [ancla: string, en: string, es: string, etEn: string, etEs: string]
> = [
  [
    'merida',
    'Mérida',
    'Mérida',
    'City · Architecture · Gastronomy · Lifestyle',
    'Ciudad · Arquitectura · Gastronomía · Estilo de vida',
  ],
  [
    'haciendas',
    'Haciendas',
    'Haciendas',
    'History · Architecture · Character',
    'Historia · Arquitectura · Características',
  ],
  ['cultura', 'Culture', 'Cultura', '', ''],
  ['gastronomia', 'Gastronomy', 'Gastronomía', '', ''],
  [
    'naturaleza',
    'Nature',
    'Naturaleza',
    'Cenotes · Coast · Vegetation',
    'Cenotes · Costa · Vegetación',
  ],
  [
    'experiencias',
    'Experiences',
    'Experiencias',
    'To complement a wedding weekend',
    'Para complementar un fin de semana de boda',
  ],
];

export const descubreDemo: DescubreYucatan = {
  _id: 'descubreYucatan',
  _type: 'descubreYucatan',
  titulo: texto('Discover Yucatán', 'Descubre Yucatán'),
  entradilla: texto(
    '[DEMO] Sample introduction: the destination before the services — its cities, estates, culture, cuisine and landscapes.',
    '[DEMO] Entradilla de ejemplo: el destino antes que los servicios — sus ciudades, haciendas, cultura, cocina y paisajes.',
  ),
  imagenPrincipal: imagenDemo(
    'descubre-hero.jpg',
    2400,
    1500,
    '[DEMO] Placeholder photo of Yucatán',
    '[DEMO] Foto de relleno de Yucatán',
  ),
  secciones: SECCIONES_DESCUBRE.map(([ancla, en, es, etEn, etEs]) => ({
    _key: `seccion-${ancla}`,
    ancla,
    titulo: texto(en, es),
    etiquetas: texto(etEn, etEs),
    texto: bloques(
      `descubre-${ancla}`,
      [
        `[DEMO] Sample editorial text about ${en}. The final text will come from the Curated Yucatán editorial team.`,
        '[DEMO] A second paragraph adds detail and a practical note for planners.',
      ],
      [
        `[DEMO] Texto editorial de ejemplo sobre ${es}. El texto final lo escribirá el equipo editorial de Curated Yucatán.`,
        '[DEMO] Un segundo párrafo agrega detalle y una nota práctica para planners.',
      ],
    ),
    imagenes: serieDemo(`descubre-${ancla}`, [HORIZONTAL, VERTICAL], en),
  })),
};

// --- Páginas editoriales -------------------------------------------------------------------

// Preguntas del documento de estructura (sección 12); las respuestas son [DEMO].
const PREGUNTAS_NOSOTROS: Array<[en: string, es: string]> = [
  ['What is Curated Yucatán?', '¿Qué es Curated Yucatán?'],
  ['Why does it exist?', '¿Por qué existe?'],
  ['Who is it for?', '¿Para quién fue creado?'],
  ['What problem does it solve?', '¿Qué problema resuelve?'],
  [
    'How does it help an international wedding professional?',
    '¿Cómo ayuda a un wedding professional internacional?',
  ],
];

export const paginasDemo: PaginaEditorial[] = [
  {
    _id: 'pagina-nosotros',
    _type: 'paginaEditorial',
    titulo: texto('About Curated', 'Nosotros'),
    entradilla: texto(
      '[DEMO] Yucatán is the protagonist. Curated is the guide. Sample introduction.',
      '[DEMO] Yucatán es el protagonista. Curated es la guía. Entradilla de ejemplo.',
    ),
    imagen: imagenDemo(
      'nosotros.jpg',
      ...HORIZONTAL,
      '[DEMO] Placeholder photo for About Curated',
      '[DEMO] Foto de relleno para Nosotros',
    ),
    secciones: [
      ...PREGUNTAS_NOSOTROS.map(([en, es], i) => ({
        _type: 'seccionTexto' as const,
        _key: `pregunta-${i + 1}`,
        titulo: texto(en, es),
        texto: bloques(
          `nosotros-${i + 1}`,
          ['[DEMO] Sample answer in one or two short paragraphs.'],
          ['[DEMO] Respuesta de ejemplo en uno o dos párrafos cortos.'],
        ),
      })),
      {
        _type: 'seccionTexto',
        _key: 'minimal',
        titulo: texto('Curated and Minimal', 'Curated y Minimal'),
        texto: bloques(
          'nosotros-minimal',
          [
            '[DEMO] Sample text explaining, with transparency, that Minimal takes part as Curated Partner in Design & Production.',
          ],
          [
            '[DEMO] Texto de ejemplo que explica con transparencia que Minimal participa como Curated Partner en Design & Production.',
          ],
        ),
      },
      {
        _type: 'seccionLlamado',
        _key: 'llamado',
        titulo: texto('Start planning with Curated', 'Empieza a planear con Curated'),
        texto: texto(
          '[DEMO] Tell us about your event and we will connect you with the right places and partners.',
          '[DEMO] Cuéntanos de tu evento y te conectamos con los lugares y aliados adecuados.',
        ),
        destino: 'planea-tu-evento',
      },
    ],
  },
  {
    _id: 'pagina-privacidad',
    _type: 'paginaEditorial',
    titulo: texto('Privacy notice', 'Aviso de privacidad'),
    secciones: [
      {
        _type: 'seccionTexto',
        _key: 'pendiente',
        texto: bloques(
          'privacidad',
          [
            '[PENDIENTE] The legal text of the privacy notice will be provided by the project owner.',
          ],
          [
            '[PENDIENTE] El texto legal del aviso de privacidad lo proporcionará el responsable del proyecto.',
          ],
        ),
      },
    ],
  },
];
