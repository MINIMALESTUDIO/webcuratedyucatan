import type { Episodio, Guia, HistoriaResumen } from '@/lib/contenido/tipos';
import { imagenDemo, texto } from './ayudantes';

export const episodioDemo: Episodio = {
  _id: 'episodio-demo-1',
  _type: 'episodio',
  titulo: texto(
    '[DEMO] Sample episode: YouTube Developers Live',
    '[DEMO] Episodio de muestra: YouTube Developers Live',
  ),
  // Video público de la documentación de la API de YouTube; no es contenido del canal (D-007).
  youtubeId: 'M7lc1UVf-VE',
  descripcion: texto(
    '[DEMO] The latest channel episode will appear here, with a short description.',
    '[DEMO] Aquí aparecerá el último episodio del canal, con una descripción breve.',
  ),
  capitulos: [],
  fechaPublicacion: '2026-09-01',
  esDemo: true,
};

export const guiaDemo: Guia = {
  _id: 'guia-demo',
  _type: 'guia',
  edicion: '2027',
  portada: imagenDemo(
    'guia-portada.jpg',
    1200,
    1600,
    '[DEMO] Placeholder cover of the guide',
    '[DEMO] Portada de relleno de la guía',
  ),
  archivoPDF: { en: '[PENDIENTE]' },
  paginasMuestra: [],
  descripcion: texto(
    '[DEMO] Sample description of the downloadable guide: venues, vendors, seasons and paperwork.',
    '[DEMO] Descripción de ejemplo de la guía descargable: venues, proveedores, temporadas y trámites.',
  ),
  activa: true,
};

export const historiasDemo: HistoriaResumen[] = [
  {
    _id: 'historia-demo-1',
    titulo: texto('[DEMO] Sample real wedding story', '[DEMO] Historia de boda real de ejemplo'),
    slug: 'demo-historia-boda-real',
    tipo: 'boda-real',
    imagenPortada: imagenDemo(
      'historia-1.jpg',
      1600,
      1067,
      '[DEMO] Placeholder photo',
      '[DEMO] Foto de relleno',
    ),
    extracto: texto(
      '[DEMO] A short excerpt that invites readers to open the story.',
      '[DEMO] Un extracto breve que invita a abrir la historia.',
    ),
    fechaPublicacion: '2026-08-20',
    tiempoLectura: 6,
  },
  {
    _id: 'historia-demo-2',
    titulo: texto('[DEMO] Sample planning article', '[DEMO] Artículo de planeación de ejemplo'),
    slug: 'demo-articulo-planeacion',
    tipo: 'articulo',
    imagenPortada: imagenDemo(
      'historia-2.jpg',
      1600,
      1067,
      '[DEMO] Placeholder photo',
      '[DEMO] Foto de relleno',
    ),
    extracto: texto(
      '[DEMO] A short excerpt about planning a wedding weekend in Yucatán.',
      '[DEMO] Un extracto breve sobre cómo planear un fin de semana de boda en Yucatán.',
    ),
    fechaPublicacion: '2026-08-05',
    tiempoLectura: 8,
  },
  {
    _id: 'historia-demo-3',
    titulo: texto('[DEMO] Sample list article', '[DEMO] Lista de ejemplo'),
    slug: 'demo-lista',
    tipo: 'lista',
    imagenPortada: imagenDemo(
      'historia-3.jpg',
      1600,
      1067,
      '[DEMO] Placeholder photo',
      '[DEMO] Foto de relleno',
    ),
    extracto: texto(
      '[DEMO] A short excerpt for a list-style article.',
      '[DEMO] Un extracto breve para un artículo tipo lista.',
    ),
    fechaPublicacion: '2026-07-18',
    tiempoLectura: 4,
  },
];
