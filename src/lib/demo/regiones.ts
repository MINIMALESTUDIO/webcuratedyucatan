import type { Region } from '@/lib/contenido/tipos';
import { texto } from './ayudantes';

// Ubicaciones para el filtro "Location" y las tarjetas.
export const regionesDemo: Region[] = [
  {
    _id: 'region-merida',
    _type: 'region',
    nombre: texto('Mérida', 'Mérida'),
    slug: 'merida',
    orden: 1,
  },
  {
    _id: 'region-alrededores-de-merida',
    _type: 'region',
    nombre: texto('Around Mérida', 'Alrededores de Mérida'),
    slug: 'alrededores-de-merida',
    orden: 2,
  },
  {
    _id: 'region-costa',
    _type: 'region',
    nombre: texto('The coast', 'Costa'),
    slug: 'costa',
    orden: 3,
  },
];
