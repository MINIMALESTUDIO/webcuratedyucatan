import type { Coleccion } from '@/lib/contenido/tipos';
import { imagenDemo, texto } from './ayudantes';

/*
 * Las tres colecciones de "Estructura y dirección web" (sección 6). Nombres y lemas son del
 * documento; las descripciones son [DEMO]. Es un supuesto registrado en D-039: el libro
 * (volumen II) usa dos estilos; cambiar la taxonomía es editar estos documentos en Sanity.
 */
function coleccion(
  orden: number,
  slug: string,
  nombre: string,
  lema: [en: string, es: string],
  resultado: [en: string, es: string],
): Coleccion {
  return {
    _id: `coleccion-${slug}`,
    _type: 'coleccion',
    nombre: texto(nombre, nombre),
    slug,
    lema: texto(...lema),
    descripcion: texto(
      `[DEMO] Sample description of ${nombre}: the kind of places, light and atmosphere that define this collection.`,
      `[DEMO] Descripción de ejemplo de ${nombre}: el tipo de lugares, la luz y la atmósfera que definen esta colección.`,
    ),
    resultado: texto(...resultado),
    imagen: imagenDemo(
      `coleccion-${slug}.jpg`,
      1200,
      1500,
      `[DEMO] Placeholder photo for ${nombre}`,
      `[DEMO] Foto de relleno de ${nombre}`,
    ),
    orden,
  };
}

export const coleccionesDemo: Coleccion[] = [
  coleccion(
    1,
    'contemporary',
    'Contemporary Sanctuaries',
    ['Architecture, light and landscape.', 'Arquitectura, luz y paisaje.'],
    ['Contemporary', 'Contemporáneo'],
  ),
  coleccion(
    2,
    'organic',
    'Organic Estates',
    ['Nature, texture and authenticity.', 'Naturaleza, textura y autenticidad.'],
    ['Organic', 'Orgánico'],
  ),
  coleccion(
    3,
    'timeless',
    'Timeless Venues',
    ['Heritage and elegance.', 'Herencia y elegancia.'],
    ['Timeless', 'Atemporal'],
  ),
];

export function coleccionPorSlug(slug: string): Coleccion {
  const encontrada = coleccionesDemo.find((c) => c.slug === slug);
  if (!encontrada) throw new Error(`Colección DEMO inexistente: ${slug}`);
  return encontrada;
}
