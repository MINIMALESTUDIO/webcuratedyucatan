import type { CategoriaProveedor, IconoCategoria } from '@/lib/contenido/tipos';
import { texto } from './ayudantes';

// Categorías de la sección 6 de docs/PROMPT.md, en su orden: [slug, inglés, español, icono].
const lista: Array<[string, string, string, IconoCategoria]> = [
  ['planners', 'Wedding planners', 'Wedding planners', 'planner'],
  ['foto-y-video', 'Photo & video', 'Foto y video', 'camara'],
  ['flores', 'Flowers', 'Flores', 'flor'],
  ['mobiliario-y-renta', 'Furniture & rentals', 'Mobiliario y renta', 'silla'],
  ['musica', 'Music', 'Música', 'musica'],
  ['banquetes', 'Catering', 'Banquetes', 'banquete'],
  ['belleza', 'Beauty', 'Belleza', 'belleza'],
  ['transporte', 'Transportation', 'Transporte', 'transporte'],
  ['hospedaje', 'Lodging', 'Hospedaje', 'hospedaje'],
];

export const categoriasDemo: CategoriaProveedor[] = lista.map(([slug, en, es, icono], i) => ({
  _id: `categoria-${slug}`,
  _type: 'categoriaProveedor',
  nombre: texto(en, es),
  slug,
  icono,
  orden: i + 1,
}));

export function categoriaPorSlug(slug: string): CategoriaProveedor {
  const categoria = categoriasDemo.find((c) => c.slug === slug);
  if (!categoria) throw new Error(`Categoría DEMO inexistente: ${slug}`);
  return categoria;
}
