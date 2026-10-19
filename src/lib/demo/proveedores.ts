import type {
  EstiloFotografia,
  Proveedor,
  ProveedorResumen,
  TipoProveedor,
} from '@/lib/contenido/tipos';
import { bloquesIngles, HORIZONTAL, imagenDemo, serieDemo, VERTICAL } from './ayudantes';

/*
 * Selección curada de Catering y Photography (documento de estructura, secciones 8 y 9), solo
 * con partners reales del Drive: 4 de catering, y Gabo Preciado y Gaber Studio en fotografía.
 * Los fotógrafos [DEMO] se retiraron al llegar la segunda ficha real (D-057).
 */

// --- Partners reales (Drive, 01_WEB/04_CATERING y 05_PHOTOGRAPHY, 2026-10-08) -------------
//
// Copy tal cual de cada ficha, solo en inglés (D-008). Los datos marcados "NO MOSTRAR COMO
// CONTENIDO EDITORIAL" (teléfonos y correos comerciales) no van aquí: los correos viven en
// privado.contactosLeads (D-012). Las fotos reales se cargan en Sanity (D-051); aquí quedan
// los marcadores [DEMO].

interface ServicioFicha {
  titulo: string;
  detalle: string;
}

interface DatosPartner {
  tipo: TipoProveedor;
  numero: number;
  /** Juego de marcadores [DEMO] (public/demo/<tipo>-<n>*.jpg) mientras no hay fotos. */
  marcador: number;
  nombre: string;
  slug: string;
  especialidad: string;
  resumen: string;
  about: string[];
  servicios: ServicioFicha[];
  notas: string[];
  estilo?: string;
  estilosFotografia?: EstiloFotografia[];
  ciudadBase: string;
  cobertura: string;
  experiencia: string;
  sitioWeb?: string;
  instagram?: string;
}

const en = (valor: string) => ({ en: valor });

function partnerReal(d: DatosPartner): Proveedor {
  const prefijo = `${d.tipo}-${d.marcador}`;
  return {
    _id: `proveedor-${d.slug}`,
    _type: 'proveedor',
    tipo: d.tipo,
    nombre: d.nombre,
    slug: d.slug,
    especialidad: en(d.especialidad),
    resumen: en(d.resumen),
    descripcion: bloquesIngles(`${d.slug}-about`, d.about),
    servicios: d.servicios.map((s, i) => ({
      _key: `${d.slug}-servicio-${i + 1}`,
      texto: en(s.titulo),
      detalle: en(s.detalle),
    })),
    estilo: d.estilo ? en(d.estilo) : undefined,
    estilosFotografia: d.estilosFotografia ?? [],
    notasCurated: bloquesIngles(`${d.slug}-notas`, d.notas),
    ciudadBase: d.ciudadBase,
    cobertura: en(d.cobertura),
    experiencia: en(d.experiencia),
    sitioWeb: d.sitioWeb,
    instagram: d.instagram,
    imagenPrincipal: imagenDemo(
      `${prefijo}.jpg`,
      1600,
      1200,
      `[DEMO] Placeholder photo of ${d.nombre}`,
      `[DEMO] Foto de relleno de ${d.nombre}`,
    ),
    galeria: serieDemo(`${prefijo}-galeria`, [VERTICAL, HORIZONTAL, VERTICAL], d.nombre),
    orden: d.numero,
  };
}

const partnersReales: Proveedor[] = [
  partnerReal({
    tipo: 'catering',
    numero: 1,
    marcador: 1,
    nombre: 'Bravo Catering',
    slug: 'bravo-catering',
    especialidad: 'Fine Dining Catering & Event Management',
    resumen:
      'Bravo Catering specializes in fine dining experiences and signature catering for weddings and exclusive events throughout Yucatán.',
    about: [
      'Bravo Catering specializes in fine dining experiences and signature catering for weddings and exclusive events throughout Yucatán.',
      'Led by Chef Christian Bravo, its culinary approach combines technical excellence with high-quality local ingredients, creating personalized menus designed around each celebration.',
      'From the gastronomic concept to dining service and catering logistics, Bravo Catering brings together cuisine, presentation and a rigorous service protocol to deliver a complete event experience.',
    ],
    servicios: [
      {
        titulo: 'Fine Dining Catering',
        detalle: 'Signature cuisine and high-end catering for weddings and exclusive events.',
      },
      {
        titulo: 'Bespoke Menu Curation',
        detalle:
          'Personalized menus developed around the style and requirements of each celebration.',
      },
      {
        titulo: 'Full-Service Dining',
        detalle: 'Complete dining service designed to accompany the gastronomic experience.',
      },
      {
        titulo: 'Catering Logistics',
        detalle:
          'Operational and logistical coordination of catering services throughout the event.',
      },
    ],
    notas: [
      'Bravo Catering’s approach places gastronomy at the center of the event experience, combining the culinary direction of Chef Christian Bravo with carefully selected local ingredients and precise service standards.',
      'Its experience with destination weddings and high-profile events makes it particularly suited to national and international clients looking for a refined gastronomic experience in Yucatán.',
    ],
    ciudadBase: 'Mérida',
    cobertura: 'Yucatán',
    experiencia: 'Destination Weddings · Exclusive Events · International Celebrations',
    sitioWeb: 'https://bravocatering.com.mx/public/inicio',
    instagram: 'https://www.instagram.com/bravocatering.mx/',
  }),
  partnerReal({
    tipo: 'catering',
    numero: 2,
    marcador: 2,
    nombre: 'Experiences Banquetes',
    slug: 'experiences-banquetes',
    especialidad: 'Catering & Gastronomic Experiences',
    resumen:
      'Based in Mérida, Experiences Banquetes specializes in catering and gastronomic experiences for weddings, social celebrations and corporate events throughout the Yucatán Peninsula.',
    about: [
      'Based in Mérida, Experiences Banquetes specializes in catering and gastronomic experiences for weddings, social celebrations and corporate events throughout the Yucatán Peninsula.',
      'Its culinary approach combines high-quality ingredients, creativity and careful presentation, with the intention of making gastronomy one of the defining moments of each celebration. Alongside its signature culinary proposals, Experiences Banquetes offers regional and vegan menus, allowing the experience to adapt to different tastes and event requirements.',
      'From the food itself to presentation and service, attention to quality remains at the center of its approach.',
    ],
    servicios: [
      {
        titulo: 'Wedding & Event Catering',
        detalle:
          'Catering services for destination weddings, social celebrations and corporate events.',
      },
      {
        titulo: 'Bespoke Gastronomic Experiences',
        detalle: 'Culinary proposals designed around the style and needs of each celebration.',
      },
      {
        titulo: 'Regional & Vegan Menus',
        detalle: 'Regional cuisine and vegan menu options available for different event formats.',
      },
      {
        titulo: 'Furniture & Tabletop',
        detalle: 'Furniture, tableware and linen rental to complement the event service.',
      },
    ],
    notas: [
      'Experiences Banquetes places particular emphasis on flavor, ingredient quality and presentation, approaching catering as an important part of the overall guest experience.',
      'Its ability to provide regional and vegan menus adds flexibility for destination celebrations with different culinary preferences, while its coverage throughout the Yucatán Peninsula allows the team to work across different locations in the region.',
    ],
    ciudadBase: 'Mérida',
    cobertura: 'Yucatán Peninsula',
    experiencia: 'Destination Weddings · Social Events · Corporate Events',
    instagram: 'https://www.instagram.com/experiences_banquetes/',
  }),
  partnerReal({
    tipo: 'catering',
    numero: 3,
    marcador: 3,
    nombre: 'Margo Amalia',
    slug: 'margo-amalia',
    especialidad: 'Catering & Event Planning',
    resumen:
      'Founded by siblings Loris and Adrián Marcos, Margo Amalia brings together gastronomy, hospitality and event production to create celebrations shaped around each client.',
    about: [
      'Founded by siblings Loris and Adrián Marcos, Margo Amalia brings together gastronomy, hospitality and event production to create celebrations shaped around each client.',
      'Adrián leads the culinary direction, while Loris specializes in the organization, coordination and production of events. Together, their approach connects food, design and service within a single experience, with particular attention to presentation, personalization and the way guests experience a celebration.',
      'Based in Mérida, Margo Amalia works across the Yucatán Peninsula and has experience producing destination events for hosts and guests arriving from different cities and countries.',
    ],
    servicios: [
      {
        titulo: 'Catering & Bespoke Menus',
        detalle:
          'Customized catering and gastronomic experiences for weddings, social celebrations and corporate events.',
      },
      {
        titulo: 'Event Planning & Coordination',
        detalle: 'Planning, supplier coordination, logistics and event-day execution.',
      },
      {
        titulo: 'Design & Production',
        detalle: 'Event design, production, table styling and ambience.',
      },
      {
        titulo: 'Tabletop & Furniture',
        detalle:
          'Furniture, tableware and glassware setup according to the concept of each celebration.',
      },
      {
        titulo: 'Culinary Experiences',
        detalle:
          'Themed gastronomic experiences, food stations, coffee breaks and corporate breakfasts.',
      },
      { titulo: 'Chef Services', detalle: 'Chef services available for events throughout Mexico.' },
    ],
    notas: [
      'Margo Amalia’s strength lies in its integrated approach to gastronomy and event production. Rather than treating catering as an isolated service, the team considers food, presentation, logistics and guest experience as interconnected parts of the celebration.',
      'Its flexibility across catering, coordination and production makes it particularly relevant for destination events that require several services to work together under one vision.',
    ],
    ciudadBase: 'Mérida',
    cobertura: 'Yucatán Peninsula · Chef services available throughout Mexico',
    experiencia: 'Destination Weddings · Social Events · Corporate Events',
    instagram: 'https://www.instagram.com/margoamalia.catering_mx/',
  }),
  partnerReal({
    tipo: 'catering',
    numero: 4,
    marcador: 4,
    nombre: 'Ritualia',
    slug: 'ritualia',
    especialidad: 'Catering · Mixology · Local Event Production',
    resumen:
      'Ritualia is a local partner in Yucatán for wedding planners and creative teams producing destination weddings and events across the region.',
    about: [
      'Ritualia is a local partner in Yucatán for wedding planners and creative teams producing destination weddings and events across the region.',
      'With more than 30 years of experience in events, food and beverage, the team works behind each project to transform a planner’s vision into a locally executed experience. From catering and mixology to production, logistics and vendor coordination, Ritualia brings together the operational elements required to produce a celebration in Yucatán while respecting the planner’s creative direction.',
      'With knowledge of the region’s venues, suppliers and event logistics, Ritualia works as an extension of the planning team on the ground—providing local expertise so creative teams can remain focused on the experience they are designing.',
    ],
    servicios: [
      {
        titulo: 'Catering & Menu Design',
        detalle: 'Customized catering and menu development for destination weddings and events.',
      },
      {
        titulo: 'Mixology & Gastromixology',
        detalle: 'Signature bars, mixology and gastronomic concepts combining food and beverage.',
      },
      {
        titulo: 'Local Event Production',
        detalle:
          'Local production, logistics and operational planning for events throughout Yucatán.',
      },
      {
        titulo: 'Vendor Sourcing & Coordination',
        detalle:
          'Sourcing and coordination of local suppliers according to the needs and creative direction of each project.',
      },
      {
        titulo: 'Furniture & Tableware',
        detalle:
          'Furniture and tableware solutions integrated into the event’s operational requirements.',
      },
      {
        titulo: 'Layouts & Operational Planning',
        detalle: 'Layouts and logistical planning designed around the venue and event format.',
      },
      {
        titulo: 'Tastings',
        detalle: 'Tastings to develop and refine the gastronomic experience before the event.',
      },
      {
        titulo: 'On-Site Coordination',
        detalle: 'Operational coordination, supervision and execution throughout the event.',
      },
    ],
    notas: [
      'Ritualia is particularly relevant for destination planners looking for an experienced local counterpart in Yucatán.',
      'Rather than replacing the planner’s creative role, the team works as an extension of it, contributing regional knowledge, vendor relationships and operational support while respecting the established creative direction.',
      'Its combination of catering, mixology, production and logistics allows several components of a destination event to be coordinated locally through the same team.',
    ],
    ciudadBase: 'Yucatán',
    cobertura: 'Mérida · Haciendas · Yucatán Coast · Yucatán Peninsula',
    experiencia: '30+ years in events, food & beverage',
    instagram: 'https://www.instagram.com/ritualiamx_/',
  }),
  partnerReal({
    tipo: 'fotografia',
    numero: 5,
    marcador: 1,
    nombre: 'Gabo Preciado Fotografía',
    slug: 'gabo-preciado-fotografia',
    especialidad: 'Destination Wedding Photography',
    resumen:
      'With 16 years of experience documenting weddings, Gabo Preciado specializes in destination celebrations across Yucatán and the Mexican Caribbean.',
    about: [
      'With 16 years of experience documenting weddings, Gabo Preciado specializes in destination celebrations across Yucatán and the Mexican Caribbean.',
      'His approach combines documentary storytelling with an editorial perspective, capturing spontaneous moments while maintaining a refined visual language. Professionalism, creativity and reliability define his work, allowing each celebration to be documented naturally while preserving the atmosphere, people and details that make it distinct.',
      'With more than 100 weddings documented, his experience extends across Yucatán, Campeche and Quintana Roo.',
    ],
    servicios: [
      {
        titulo: 'Wedding Photography',
        detalle: 'Photography coverage for weddings and destination celebrations.',
      },
      {
        titulo: 'Wedding Video',
        detalle:
          'Video coverage designed to complement the photographic documentation of the celebration.',
      },
    ],
    notas: [
      'Gabo Preciado’s combination of documentary, candid and editorial photography makes his work particularly suited to couples looking for imagery that feels natural while maintaining a polished visual point of view.',
      'His experience with more than 100 weddings and destination celebrations across the Yucatán Peninsula also brings familiarity with the region and its wedding environments.',
    ],
    estilo: 'Documentary · Editorial · Candid',
    estilosFotografia: ['documental', 'editorial'],
    ciudadBase: 'Mérida',
    cobertura: 'Yucatán · Campeche · Quintana Roo',
    experiencia: '16 years · 100+ weddings documented',
    sitioWeb: 'http://www.gabopreciado.com/',
    instagram: 'https://www.instagram.com/gabopreciado/',
  }),
  partnerReal({
    tipo: 'fotografia',
    numero: 6,
    marcador: 2,
    nombre: 'Gaber Studio',
    slug: 'gaber-studio',
    especialidad: 'Destination Wedding Photography & Videography',
    resumen:
      'Gaber Studio is a creative photography and videography studio based in Mérida, Yucatán, specializing in documenting weddings and celebrations through thoughtful visual storytelling.',
    about: [
      'Gaber Studio is a creative photography and videography studio based in Mérida, Yucatán, specializing in documenting weddings and celebrations through thoughtful visual storytelling.',
      'Their approach combines an editorial, natural and contemporary aesthetic with careful attention to composition, light and spontaneous moments. Through creativity and attention to detail, the team captures the essence of each celebration, creating authentic and timeless visual memories.',
      'With experience in destination weddings and international celebrations, Gaber Studio has documented events across Mexico, the United States and Europe.',
    ],
    servicios: [
      {
        titulo: 'Wedding & Event Photography',
        detalle: 'Photography coverage for weddings and destination celebrations.',
      },
      {
        titulo: 'Wedding Videography',
        detalle:
          'Video production capturing the atmosphere, emotions and meaningful moments of each celebration.',
      },
      { titulo: 'Social Media Content', detalle: 'Content creation for social media.' },
      {
        titulo: 'Social & Corporate Events',
        detalle: 'Photography and video coverage for social and corporate celebrations.',
      },
    ],
    notas: [
      "Gaber Studio's editorial and contemporary approach makes their work particularly suited to couples seeking elegant, natural and authentic imagery that reflects the atmosphere and emotions of their celebration.",
      'Their experience documenting destination weddings across Mexico and internationally brings a versatile perspective to capturing celebrations in different settings and destinations.',
    ],
    estilo: 'Editorial · Natural · Contemporary · Timeless',
    estilosFotografia: ['editorial'],
    ciudadBase: 'Mérida',
    cobertura: 'Yucatán · Cancún · Mexico City · National & International Destinations',
    experiencia: 'Destination weddings · International celebrations',
    sitioWeb: 'https://www.gaberstudio.com/',
    instagram: 'https://www.instagram.com/gaberstudio/',
  }),
];

export const proveedoresDemo: Proveedor[] = partnersReales;

export function resumenProveedor(p: Proveedor): ProveedorResumen {
  return {
    _id: p._id,
    tipo: p.tipo,
    nombre: p.nombre,
    slug: p.slug,
    especialidad: p.especialidad,
    resumen: p.resumen,
    estilosFotografia: p.estilosFotografia,
    imagen: p.imagenPrincipal,
  };
}
