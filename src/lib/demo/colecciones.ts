import type { Coleccion } from '@/lib/contenido/tipos';
import { imagenDemo, texto } from './ayudantes';

/*
 * Las tres colecciones de "Estructura y dirección web" (sección 6). Nombres y lemas son del
 * documento; la descripción es el texto de cada resultado de Find Your Yucatán (Drive, D-058).
 * Es un supuesto registrado en D-039: el libro
 * (volumen II) usa dos estilos; cambiar la taxonomía es editar estos documentos en Sanity.
 */
function coleccion(
  orden: number,
  slug: string,
  nombre: string,
  lema: [en: string, es: string],
  resultado: [en: string, es: string],
  descripcion: [en: string, es: string],
): Coleccion {
  return {
    _id: `coleccion-${slug}`,
    _type: 'coleccion',
    nombre: texto(nombre, nombre),
    slug,
    lema: texto(...lema),
    descripcion: texto(...descripcion),
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
    [
      'You’re drawn to refined spaces where architecture, design and modern hospitality shape the experience.',
      'Te atraen los espacios refinados, donde la arquitectura, el diseño y la hospitalidad moderna dan forma a la experiencia.',
    ],
  ),
  coleccion(
    2,
    'organic',
    'Organic Estates',
    ['Nature, texture and authenticity.', 'Naturaleza, textura y autenticidad.'],
    ['Organic', 'Orgánico'],
    [
      'You’re drawn to spaces where architecture and nature exist in harmony, creating celebrations that feel intimate, grounded and connected to their surroundings.',
      'Te atraen los espacios donde la arquitectura y la naturaleza conviven en armonía, para celebraciones íntimas, serenas y conectadas con su entorno.',
    ],
  ),
  coleccion(
    3,
    'timeless',
    'Timeless Venues',
    ['Heritage and elegance.', 'Herencia y elegancia.'],
    ['Timeless', 'Atemporal'],
    [
      'You’re drawn to places where history, architecture and a sense of permanence shape the celebration. We’ve selected three venues that reflect your vision.',
      'Te atraen los lugares donde la historia, la arquitectura y una sensación de permanencia dan forma a la celebración. Seleccionamos tres venues que reflejan tu visión.',
    ],
  ),
];

export function coleccionPorSlug(slug: string): Coleccion {
  const encontrada = coleccionesDemo.find((c) => c.slug === slug);
  if (!encontrada) throw new Error(`Colección DEMO inexistente: ${slug}`);
  return encontrada;
}
