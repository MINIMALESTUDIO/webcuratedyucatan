import type {
  EstiloFotografia,
  Proveedor,
  ProveedorResumen,
  TipoProveedor,
} from '@/lib/contenido/tipos';
import {
  bloques,
  bloquesIngles,
  HORIZONTAL,
  imagenDemo,
  lista,
  serieDemo,
  texto,
  VERTICAL,
} from './ayudantes';

/*
 * Selección curada de Catering y Photography (3 a 5 por sección, documento de estructura,
 * secciones 8 y 9). Catering: los 4 partners reales del Drive. Photography: Gabo Preciado
 * (real) y fotógrafos [DEMO] hasta que lleguen más fichas.
 */

interface DatosProveedorDemo {
  tipo: TipoProveedor;
  numero: number;
  nombre: string;
  slug: string;
  especialidad: [en: string, es: string];
  resumen: [en: string, es: string];
  estilosFotografia?: EstiloFotografia[];
}

const SERVICIOS: Record<TipoProveedor, Array<[string, string]>> = {
  catering: [
    ['[DEMO] Plated dinners and family-style menus', '[DEMO] Cenas servidas y menús al centro'],
    ['[DEMO] Welcome dinners and rehearsal dinners', '[DEMO] Cenas de bienvenida y de ensayo'],
    ['[DEMO] Bar and mixology', '[DEMO] Barra y mixología'],
  ],
  fotografia: [
    ['[DEMO] Full wedding weekend coverage', '[DEMO] Cobertura de todo el fin de semana'],
    ['[DEMO] Editorial portraits', '[DEMO] Retratos editoriales'],
    ['[DEMO] Short films', '[DEMO] Cortometrajes'],
  ],
};

function proveedorDemo(d: DatosProveedorDemo): Proveedor {
  const prefijo = `${d.tipo}-${d.numero}`;
  return {
    _id: `proveedor-${d.slug}`,
    _type: 'proveedor',
    tipo: d.tipo,
    nombre: d.nombre,
    slug: d.slug,
    especialidad: texto(...d.especialidad),
    resumen: texto(...d.resumen),
    descripcion: bloques(
      prefijo,
      [
        `[DEMO] Sample description of ${d.nombre}. The real text will come from the partner profile in Sanity.`,
        '[DEMO] A second paragraph describes the team, its approach and the kind of celebrations it works on.',
      ],
      [
        `[DEMO] Descripción de ejemplo de ${d.nombre}. El texto real vendrá de su ficha en Sanity.`,
        '[DEMO] Un segundo párrafo describe al equipo, su enfoque y el tipo de celebraciones en las que trabaja.',
      ],
    ),
    servicios: lista(`${prefijo}-servicio`, SERVICIOS[d.tipo]),
    estilo: texto(
      '[DEMO] Sample style or differentiator, in one or two sentences.',
      '[DEMO] Estilo o diferenciador de ejemplo, en una o dos frases.',
    ),
    estilosFotografia: d.estilosFotografia ?? [],
    ciudadBase: 'Mérida',
    cobertura: texto('[DEMO] Yucatán and the Riviera Maya', '[DEMO] Yucatán y la Riviera Maya'),
    experiencia: texto(
      '[DEMO] Sample text about experience with destination weddings and international events.',
      '[DEMO] Texto de ejemplo sobre su experiencia en bodas destino y eventos internacionales.',
    ),
    sitioWeb: 'https://example.com',
    instagram: 'https://www.instagram.com/',
    imagenPrincipal: imagenDemo(
      `${prefijo}.jpg`,
      1600,
      1200,
      `[DEMO] Placeholder photo of ${d.nombre}`,
      `[DEMO] Foto de relleno de ${d.nombre}`,
    ),
    galeria: serieDemo(`${prefijo}-galeria`, [VERTICAL, HORIZONTAL, VERTICAL], d.nombre),
    // Después de los partners reales.
    orden: d.numero + 10,
  };
}

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
];

export const proveedoresDemo: Proveedor[] = [
  ...partnersReales,
  proveedorDemo({
    tipo: 'fotografia',
    numero: 1,
    nombre: '[DEMO] Estudio Ejemplo',
    slug: 'demo-estudio-ejemplo',
    especialidad: ['[DEMO] Editorial wedding photography', '[DEMO] Fotografía editorial de bodas'],
    resumen: [
      '[DEMO] Architecture and portraits in natural light.',
      '[DEMO] Arquitectura y retrato con luz natural.',
    ],
    estilosFotografia: ['editorial', 'fine-art'],
  }),
  proveedorDemo({
    tipo: 'fotografia',
    numero: 2,
    nombre: '[DEMO] Luz Ejemplo',
    slug: 'demo-luz-ejemplo',
    especialidad: ['[DEMO] Documentary photography', '[DEMO] Fotografía documental'],
    resumen: [
      '[DEMO] Candid moments of the whole weekend.',
      '[DEMO] Momentos espontáneos de todo el fin de semana.',
    ],
    estilosFotografia: ['documental'],
  }),
  proveedorDemo({
    tipo: 'fotografia',
    numero: 3,
    nombre: '[DEMO] Cine Ejemplo',
    slug: 'demo-cine-ejemplo',
    especialidad: ['[DEMO] Wedding films', '[DEMO] Películas de boda'],
    resumen: [
      '[DEMO] Short films with a cinematic language.',
      '[DEMO] Cortometrajes con lenguaje cinematográfico.',
    ],
    estilosFotografia: ['cinematografico'],
  }),
  proveedorDemo({
    tipo: 'fotografia',
    numero: 4,
    nombre: '[DEMO] Grano Ejemplo',
    slug: 'demo-grano-ejemplo',
    especialidad: [
      '[DEMO] Film and fine art photography',
      '[DEMO] Fotografía en película y fine art',
    ],
    resumen: [
      '[DEMO] Analog photography with a timeless finish.',
      '[DEMO] Fotografía analógica con acabado atemporal.',
    ],
    estilosFotografia: ['fine-art', 'editorial'],
  }),
];

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
