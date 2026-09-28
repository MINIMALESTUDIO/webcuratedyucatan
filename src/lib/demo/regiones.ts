import type { Region } from '@/lib/contenido/tipos';
import { imagenDemo, texto } from './ayudantes';

// Tres de las regiones de la sección 6 (los nombres son del documento; las descripciones son [DEMO]).
export const regionesDemo: Region[] = [
  {
    _id: 'region-merida-centro',
    _type: 'region',
    nombre: texto('Downtown Mérida', 'Mérida centro'),
    slug: 'merida-centro',
    descripcion: texto(
      '[DEMO] Colonial homes and courtyards a few blocks from the main square.',
      '[DEMO] Casonas coloniales y patios a unas cuadras de la plaza principal.',
    ),
    imagen: imagenDemo(
      'region-merida-centro.jpg',
      1200,
      1500,
      '[DEMO] Placeholder photo of downtown Mérida',
      '[DEMO] Foto de relleno de Mérida centro',
    ),
    orden: 1,
  },
  {
    _id: 'region-haciendas',
    _type: 'region',
    nombre: texto('Haciendas', 'Haciendas'),
    slug: 'haciendas',
    descripcion: texto(
      '[DEMO] Restored haciendas surrounded by gardens, within driving distance of Mérida.',
      '[DEMO] Haciendas restauradas entre jardines, a poca distancia de Mérida.',
    ),
    imagen: imagenDemo(
      'region-haciendas.jpg',
      1200,
      1500,
      '[DEMO] Placeholder photo of a hacienda region',
      '[DEMO] Foto de relleno de la región de haciendas',
    ),
    orden: 2,
  },
  {
    _id: 'region-costa',
    _type: 'region',
    nombre: texto('The coast', 'Costa'),
    slug: 'costa',
    descripcion: texto(
      '[DEMO] Beach houses and clubs on the Gulf of Mexico coast.',
      '[DEMO] Casas y clubes de playa en la costa del Golfo de México.',
    ),
    imagen: imagenDemo(
      'region-costa.jpg',
      1200,
      1500,
      '[DEMO] Placeholder photo of the coast',
      '[DEMO] Foto de relleno de la costa',
    ),
    orden: 3,
  },
];
