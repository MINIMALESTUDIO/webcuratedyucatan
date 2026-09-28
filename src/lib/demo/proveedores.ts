import type { Proveedor, ProveedorResumen } from '@/lib/contenido/tipos';
import { bloques, imagenDemo, texto } from './ayudantes';
import { categoriaPorSlug } from './categorias';
import { regionesDemo } from './regiones';

const todasLasRegiones = regionesDemo.map(({ nombre, slug }) => ({ nombre, slug }));

function proveedorDemo(
  numero: number,
  nombre: string,
  slug: string,
  categoria: string,
  resumenEn: string,
  resumenEs: string,
): Proveedor {
  const { nombre: nombreCategoria, slug: slugCategoria, icono } = categoriaPorSlug(categoria);
  return {
    _id: `proveedor-${slug}`,
    _type: 'proveedor',
    nombre,
    slug,
    categoria: { nombre: nombreCategoria, slug: slugCategoria, icono },
    resumen: texto(resumenEn, resumenEs),
    descripcion: bloques(
      `proveedor-${numero}`,
      ['[DEMO] Sample description. The real text comes from the vendor profile in Sanity.'],
      ['[DEMO] Descripción de ejemplo. El texto real vendrá de la ficha del proveedor en Sanity.'],
    ),
    imagenes: [
      imagenDemo(
        `proveedor-${numero}.jpg`,
        1200,
        900,
        `[DEMO] Placeholder photo of ${nombre}`,
        `[DEMO] Foto de relleno de ${nombre}`,
      ),
    ],
    regionesQueCubre: todasLasRegiones,
    destacado: numero <= 3,
  };
}

export const proveedoresDemo: Proveedor[] = [
  proveedorDemo(
    1,
    '[DEMO] Estudio de Planeación Ejemplo',
    'demo-estudio-de-planeacion',
    'planners',
    '[DEMO] Wedding planning and coordination for the whole weekend.',
    '[DEMO] Planeación y coordinación de boda para todo el fin de semana.',
  ),
  proveedorDemo(
    2,
    '[DEMO] Foto Ejemplo',
    'demo-foto-ejemplo',
    'foto-y-video',
    '[DEMO] Documentary wedding photography and short films.',
    '[DEMO] Fotografía documental de bodas y cortometrajes.',
  ),
  proveedorDemo(
    3,
    '[DEMO] Flores Ejemplo',
    'demo-flores-ejemplo',
    'flores',
    '[DEMO] Floral design with seasonal and local flowers.',
    '[DEMO] Diseño floral con flores locales y de temporada.',
  ),
  proveedorDemo(
    4,
    '[DEMO] Renta Ejemplo',
    'demo-renta-ejemplo',
    'mobiliario-y-renta',
    '[DEMO] Furniture, tableware and lighting rentals.',
    '[DEMO] Renta de mobiliario, vajilla e iluminación.',
  ),
  proveedorDemo(
    5,
    '[DEMO] Trío Ejemplo',
    'demo-trio-ejemplo',
    'musica',
    '[DEMO] Live music for ceremonies and cocktail hours.',
    '[DEMO] Música en vivo para ceremonias y cócteles.',
  ),
  proveedorDemo(
    6,
    '[DEMO] Banquetes Ejemplo',
    'demo-banquetes-ejemplo',
    'banquetes',
    '[DEMO] Catering with Yucatecan and international menus.',
    '[DEMO] Banquetes con menús yucatecos e internacionales.',
  ),
];

export function resumenProveedor(slug: string): ProveedorResumen {
  const p = proveedoresDemo.find((proveedor) => proveedor.slug === slug);
  if (!p) throw new Error(`Proveedor DEMO inexistente: ${slug}`);
  const imagen = p.imagenes[0];
  if (!imagen) throw new Error(`Proveedor DEMO sin imagen: ${slug}`);
  return {
    _id: p._id,
    nombre: p.nombre,
    slug: p.slug,
    categoria: p.categoria,
    resumen: p.resumen,
    imagen,
  };
}
