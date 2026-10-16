import type { DisenoProduccion, ElementoLista } from '@/lib/contenido/tipos';
import { bloquesIngles, HORIZONTAL, imagenDemo, serieDemo, VERTICAL } from './ayudantes';

/*
 * Design & Production (D-052, D-056): copy real de 01_WEB/06_DESIGN & PRODUCTION — MINIMAL
 * (Drive, revisado el 2026-10-16), solo en inglés (D-008). Dos marcas: Minimal y Más que Ayer;
 * Otro Cielo salió del documento y del sitio. Las fotos son [DEMO] y ninguna marca trae aún
 * enlace para "Discover".
 */

const en = (valor: string) => ({ en: valor });

function servicios(clave: string, nombres: string[]): ElementoLista[] {
  return nombres.map((nombre, i) => ({ _key: `${clave}-servicio-${i + 1}`, texto: en(nombre) }));
}

export const disenoDemo: DisenoProduccion = {
  _id: 'disenoProduccion',
  _type: 'disenoProduccion',
  titular: en('Two disciplines. One shared vision.'),
  entradilla: en(
    'Furniture, event production and floral design come together through two specialized brands, each with its own identity and approach to transforming a celebration.',
  ),
  imagenPrincipal: imagenDemo(
    'diseno-hero.jpg',
    2400,
    1500,
    '[DEMO] Placeholder photo for Design & Production',
    '[DEMO] Foto de relleno para Design & Production',
  ),
  introduccion: {
    titulo: en('Designed to work together.'),
    texto: bloquesIngles('diseno-intro', [
      'Minimal and Más que Ayer are two specialized brands united by a shared approach to design, detail and the transformation of spaces.',
      'Minimal focuses on furniture and spatial production, while Más que Ayer specializes in floral design and production.',
      'Each brand can work independently or come together within the same project, allowing furniture, spatial elements and florals to become part of one cohesive visual language.',
    ]),
  },
  marcas: [
    {
      _key: 'minimal',
      nombre: 'Minimal',
      categoria: en('Furniture & Event Production'),
      titular: en('Spaces built around the experience.'),
      descripcion: bloquesIngles('minimal-about', [
        'Minimal specializes in furniture rental and the creation of spaces for weddings, social events, brand experiences, conventions and corporate productions.',
        'Its evolving collection of contemporary furniture, materials, forms and styles becomes a creative resource for planners, designers and producers, while its production capabilities allow the team to develop custom pieces and spatial solutions when a project requires something beyond the existing collection.',
      ]),
      servicios: servicios('minimal', [
        'Furniture Rental',
        'Tables, Tabletop, Chairs, Lounges & Bars',
        'Specialty Furniture & Design Pieces',
        'Spatial Configuration & Construction',
        'Custom Furniture & Elements',
        'Structures & Environmental Elements',
        'Logistics, Installation & Dismantling',
        'Event Production & Technical Support',
      ]),
      notasCurated: bloquesIngles('minimal-notas', [
        'Minimal approaches furniture as part of the design of an event rather than simply as inventory available for rent.',
        'Its combination of a carefully evolving collection, design sensibility, fabrication capabilities and operational experience allows the team to work across different scales — from supplying individual pieces to developing custom production solutions around a creative concept.',
      ]),
      imagenes: serieDemo('diseno-mobiliario', [HORIZONTAL, VERTICAL], 'Minimal'),
    },
    {
      _key: 'mas-que-ayer',
      nombre: 'Más que Ayer',
      categoria: en('Floral Design'),
      titular: en('Floral design as a way of shaping space.'),
      descripcion: bloquesIngles('mas-que-ayer-about', [
        'Más que Ayer is a floral design and production studio whose approach goes beyond traditional floristry.',
        'Flowers, foliage, textures, volume and color become materials for creating compositions that respond to the architecture, furniture and atmosphere of each celebration.',
        'Every project is developed individually, interpreting the vision of the planner, designer or client to create a floral proposal with an identity of its own.',
      ]),
      servicios: [],
      notasCurated: bloquesIngles('mas-que-ayer-notas', [
        'For Más que Ayer, flowers are not simply decorative elements. They become part of the spatial experience — transforming environments, creating emotion and contributing to the distinct character of each event.',
      ]),
      imagenes: serieDemo('diseno-floral', [HORIZONTAL, VERTICAL], 'Más que Ayer'),
    },
  ],
  experienciaDestino: {
    sobretitulo: en('Destination Events'),
    titulo: en('Local knowledge. Creative collaboration.'),
    texto: bloquesIngles('diseno-destino', [
      'Based across Mérida and Cancún, the teams work throughout Yucatán, Quintana Roo and the main destinations of the Yucatán Peninsula, including Riviera Maya and Tulum.',
      'Experienced in destination weddings and collaborations with national and international planners, designers, producers and creative teams, they are accustomed to working from concepts, moodboards, renders and established creative direction.',
      'Their role can range from resolving a single discipline to becoming part of a broader creative and production team.',
    ]),
  },
  cierre: {
    titulo: en('One vision, expressed through every detail.'),
    texto: en(
      'Furniture, spatial production and floral design can stand independently or come together to create a cohesive and considered environment.',
    ),
  },
};
