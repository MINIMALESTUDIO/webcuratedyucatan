import type {
  EstiloFotografia,
  Proveedor,
  ProveedorResumen,
  TipoProveedor,
} from '@/lib/contenido/tipos';
import { bloques, HORIZONTAL, imagenDemo, lista, serieDemo, texto, VERTICAL } from './ayudantes';

/*
 * Selección curada de Catering y Photography (3 a 5 por sección, documento de estructura,
 * secciones 8 y 9). Todos los nombres y textos son [DEMO].
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
    orden: d.numero,
  };
}

export const proveedoresDemo: Proveedor[] = [
  proveedorDemo({
    tipo: 'catering',
    numero: 1,
    nombre: '[DEMO] Cocina Ejemplo',
    slug: 'demo-cocina-ejemplo',
    especialidad: ['[DEMO] Contemporary Yucatecan cuisine', '[DEMO] Cocina yucateca contemporánea'],
    resumen: [
      '[DEMO] Regional ingredients in long-table dinners.',
      '[DEMO] Ingredientes regionales en cenas de mesa larga.',
    ],
  }),
  proveedorDemo({
    tipo: 'catering',
    numero: 2,
    nombre: '[DEMO] Banquetes Ejemplo',
    slug: 'demo-banquetes-ejemplo',
    especialidad: ['[DEMO] Large-scale hacienda banquets', '[DEMO] Banquetes grandes en haciendas'],
    resumen: [
      '[DEMO] Logistics for celebrations of up to 800 guests.',
      '[DEMO] Logística para celebraciones de hasta 800 invitados.',
    ],
  }),
  proveedorDemo({
    tipo: 'catering',
    numero: 3,
    nombre: '[DEMO] Mesa Ejemplo',
    slug: 'demo-mesa-ejemplo',
    especialidad: ['[DEMO] Chef-led tasting menus', '[DEMO] Menús de degustación de autor'],
    resumen: [
      '[DEMO] Intimate dinners for welcome parties.',
      '[DEMO] Cenas íntimas para fiestas de bienvenida.',
    ],
  }),
  proveedorDemo({
    tipo: 'catering',
    numero: 4,
    nombre: '[DEMO] Barra Ejemplo',
    slug: 'demo-barra-ejemplo',
    especialidad: ['[DEMO] Mixology and bar service', '[DEMO] Mixología y servicio de barra'],
    resumen: [
      '[DEMO] Signature cocktails with local botanicals.',
      '[DEMO] Coctelería de autor con botánicos locales.',
    ],
  }),
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
