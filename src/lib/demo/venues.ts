import type {
  AtributoVenue,
  Entorno,
  InteriorExterior,
  TextoLocalizado,
  Venue,
} from '@/lib/contenido/tipos';
import { bloquesIngles, HORIZONTAL, imagenDemo, serieDemo, VERTICAL } from './ayudantes';
import { coleccionPorSlug } from './colecciones';
import { regionesDemo } from './regiones';

/*
 * Los 18 venues de "FICHAS DE VENUES" (Drive, 01_WEB/03_VENUES), revisada el 2 oct 2026.
 *
 * Copy real, sin traducir: nombre, dirección, datos rápidos, About, espacios y Curated Notes se
 * copian tal cual de la ficha, solo en inglés (el español usa el respaldo a inglés, D-008).
 * El resumen de los cuatro destacados es la "Short description" de Home > Featured Venues; el
 * de los demás es la primera frase de su About.
 *
 * Sigue siendo [DEMO]: las fotos (la carpeta FOTOS VENUES está vacía), que reutilizan los seis
 * juegos de marcadores de public/demo. Los venues no tienen película hasta tener los videos de
 * la serie.
 *
 * Derivado de la ficha (D-047), editable en Sanity: el tipo interior / exterior de cada espacio,
 * los atributos de "What matters most?" y la región del filtro "Location".
 */

interface EspacioFicha {
  nombre: string;
  tipo: InteriorExterior;
  capacidad?: number;
  descripcion?: string;
}

interface DatosFicha {
  nombre: string;
  slug: string;
  coleccion: 'contemporary' | 'organic' | 'timeless';
  region: 'merida' | 'alrededores-de-merida';
  localidad: string;
  direccion?: string;
  destacado?: boolean;
  resumen: string;
  about: string[];
  capacidadMax: number;
  /** "Capacity" de la ficha cuando distingue banquete y cóctel. */
  capacidadDetalle?: string;
  hospedaje: {
    tiene: boolean;
    habitaciones?: number;
    huespedes?: number;
    texto?: string;
  };
  minutos?: number;
  km?: number;
  estilo: string;
  interiorExterior: string;
  /** Solo cuando los espacios con nombre no reflejan el "Indoor / Outdoor" de la ficha. */
  entorno?: Entorno;
  espacios: EspacioFicha[];
  nota: string;
  atributos: AtributoVenue[];
}

const MEDIDAS_GALERIA = [HORIZONTAL, VERTICAL, HORIZONTAL, HORIZONTAL, VERTICAL];
/** Juegos de marcadores disponibles en public/demo (venue-1 … venue-6). */
const JUEGOS_MARCADORES = 6;

const en = (valor: string): TextoLocalizado => ({ en: valor });

function venueDeFicha(d: DatosFicha, indice: number): Venue {
  const region = regionesDemo.find((r) => r.slug === d.region);
  if (!region) throw new Error(`Región inexistente: ${d.region}`);
  const { nombre, slug, resultado } = coleccionPorSlug(d.coleccion);
  const juego = (indice % JUEGOS_MARCADORES) + 1;
  const galeria = serieDemo(`venue-${juego}-galeria`, MEDIDAS_GALERIA, d.nombre);

  return {
    _id: `venue-${d.slug}`,
    _type: 'venue',
    nombre: d.nombre,
    slug: d.slug,
    publicado: true,
    destacado: d.destacado ?? false,
    coleccion: { nombre, slug, resultado },
    region: { nombre: region.nombre, slug: region.slug },
    localidad: d.localidad,
    direccion: d.direccion,
    resumen: en(d.resumen),
    descripcion: bloquesIngles(`venue-${d.slug}`, d.about),
    fichaTecnica: {
      capacidadMax: d.capacidadMax,
      capacidadDetalle: d.capacidadDetalle ? en(d.capacidadDetalle) : undefined,
      hospedaje: {
        tieneHospedaje: d.hospedaje.tiene,
        habitaciones: d.hospedaje.habitaciones,
        huespedesMax: d.hospedaje.huespedes,
        descripcion: d.hospedaje.texto ? en(d.hospedaje.texto) : undefined,
      },
      minutosCentroMerida: d.minutos,
      kmCentroMerida: d.km,
      estilo: en(d.estilo),
      interiorExterior: en(d.interiorExterior),
      entorno: d.entorno,
    },
    espacios: d.espacios.map((e, i) => {
      const foto = galeria[i % galeria.length];
      return {
        _key: `espacio-${i + 1}`,
        nombre: en(e.nombre),
        descripcion: e.descripcion ? en(e.descripcion) : undefined,
        interiorExterior: e.tipo,
        capacidad: e.capacidad,
        imagenes: foto ? [foto] : [],
      };
    }),
    notasCurated: [{ _key: 'nota-1', texto: en(d.nota) }],
    atributos: d.atributos,
    media: {
      imagenHero: imagenDemo(
        `venue-${juego}-hero.jpg`,
        2400,
        1500,
        `[DEMO] Placeholder main photo of ${d.nombre}`,
        `[DEMO] Foto principal de relleno de ${d.nombre}`,
      ),
      galeria,
    },
  };
}

const CEREMONIA_SIMBOLICA = 'Setting for a symbolic civil ceremony.';

const fichas: DatosFicha[] = [
  // --- 01 — Contemporary Sanctuaries --------------------------------------------------
  {
    nombre: 'Hacienda Chablé',
    slug: 'hacienda-chable',
    coleccion: 'contemporary',
    region: 'alrededores-de-merida',
    localidad: 'Chocholá',
    direccion: 'Tablaje 642, San Antonio Chablé, 97816 Chocholá, Yucatán',
    destacado: true,
    resumen:
      'A sanctuary where Mayan roots, restored architecture and contemporary design coexist.',
    about: [
      'Hacienda Chablé emerges as a sanctuary of reconnection where Mayan roots and refined design coexist in harmony. Amid ceiba-lined paths and birdsong, every detail invites serenity and gratitude.',
      'Designed by Paulina Morán, its award-winning architecture (Prix Versailles) blends restored stonework, clean lines, and natural textures, bridging tradition with contemporary elegance.',
      'A wedding here becomes a ritual of simplicity and truth, an ode to Yucatán’s timeless beauty.',
    ],
    capacidadMax: 400,
    hospedaje: {
      tiene: true,
      texto:
        'Casitas (2–4 guests), Family Villa (3–6 guests), Presidential & Royal Villa (4–8 guests), and residences',
    },
    minutos: 43,
    km: 39.2,
    estilo: 'Contemporary sanctuary rooted in restored Yucatecan architecture',
    interiorExterior: 'Outdoor reception spaces with accommodation on site',
    espacios: [
      {
        nombre: 'Arco Rojo Garden',
        tipo: 'exterior',
        capacidad: 400,
        descripcion: 'Banquet / main reception.',
      },
      { nombre: 'Cocktail Reception', tipo: 'exterior', capacidad: 200 },
    ],
    nota: 'On-site accommodation allows the property to work particularly well for destination celebrations that extend beyond the wedding day. Its combination of restored architecture and contemporary design gives it a distinctly refined character.',
    atributos: ['arquitectura', 'naturaleza'],
  },
  {
    nombre: 'Hacienda San Antonio Hool',
    slug: 'hacienda-san-antonio-hool',
    coleccion: 'contemporary',
    region: 'merida',
    localidad: 'Mérida',
    direccion: 'Calle 6 S/N por Calle 3, San Antonio Hool, C.P. 97302, Mérida, Yucatán, México',
    destacado: true,
    resumen:
      'A 17th-century hacienda where history, lush gardens and the convenience of the city come together.',
    about: [
      'A 17th-century treasure where history and elegance meet. Built in 1683, carefully restored to preserve its original charm while integrating modern comfort and refined details.',
      'Located within Mérida, San Antonio Hool combines colonial architecture, lush gardens, and effortless logistics—offering the intimacy of a secluded hacienda with the convenience of the city.',
      'It’s a venue for brides who value authenticity, flow, and soul, where every celebration feels timeless and deeply personal.',
    ],
    capacidadMax: 700,
    hospedaje: { tiene: true, habitaciones: 8 },
    minutos: 27,
    km: 14.6,
    estilo: '17th-century colonial hacienda',
    interiorExterior: 'Indoor and outdoor spaces',
    espacios: [
      { nombre: 'Main Garden', tipo: 'exterior', capacidad: 700 },
      { nombre: 'Machine Room', tipo: 'interior', capacidad: 200 },
      {
        nombre: 'Chapel',
        tipo: 'mixto',
        capacidad: 120,
        descripcion: '50 guests indoors / up to 120 outdoors.',
      },
      { nombre: 'Main House Terrace', tipo: 'exterior' },
    ],
    nota: 'One of its main advantages for destination celebrations is its location within Mérida: it offers the atmosphere and architectural character of a historic hacienda while remaining comparatively close to the city.',
    atributos: ['arquitectura', 'ubicacion'],
  },
  {
    nombre: 'Hacienda Xcanatún',
    slug: 'hacienda-xcanatun',
    coleccion: 'contemporary',
    region: 'merida',
    localidad: 'Xcanatún, Mérida',
    direccion: 'Calle 20 S/N x 19 y 19A, Comisaría Xcanatún, Mérida, Yucatán, Mexico',
    resumen:
      'Once an 18th-century henequen estate, Hacienda Xcanatún is now a refined boutique resort where history and modern luxury meet.',
    about: [
      'Once an 18th-century henequen estate, Hacienda Xcanatún is now a refined boutique resort where history and modern luxury meet.',
      'Its restored architecture, lush gardens, and contemporary suites create a tranquil atmosphere rooted in Yucatán’s heritage.',
      'With its acclaimed restaurant, Casa de Piedra, serene spa, and expansive grounds, Xcanatún offers couples a celebration defined by authenticity, sophistication, and effortless elegance.',
    ],
    capacidadMax: 300,
    capacidadDetalle: 'Banquet up to 280 guests / Cocktail up to 300 guests',
    hospedaje: { tiene: true, habitaciones: 54 },
    minutos: 25,
    km: 17.9,
    estilo: 'Restored 18th-century henequen estate with contemporary hospitality',
    interiorExterior: 'Outdoor event space with resort facilities',
    espacios: [
      {
        nombre: 'Jardín Potreros',
        tipo: 'exterior',
        capacidad: 300,
        descripcion: 'Banquet up to 280 guests / cocktail up to 300 guests.',
      },
    ],
    nota: 'The combination of event space, 54 on-site rooms, restaurant and resort facilities makes Xcanatún particularly suitable for celebrations where accommodation and the guest experience are intended to remain within the same property.',
    atributos: ['gastronomia', 'arquitectura'],
  },
  {
    nombre: 'Hacienda Tekik de Regil',
    slug: 'hacienda-tekik-de-regil',
    coleccion: 'contemporary',
    region: 'alrededores-de-merida',
    localidad: 'Tekik de Regil',
    direccion: 'C. 52 263, San Mateo, Tekik de Regil, Yucatán, Mexico',
    resumen:
      'Hacienda Tekik de Regil, a historic henequen estate near Mérida, embodies centuries of Yucatán’s colonial heritage.',
    about: [
      'Hacienda Tekik de Regil, a historic henequen estate near Mérida, embodies centuries of Yucatán’s colonial heritage.',
      'Its neoclassical architecture, grand main house with monumental columned facade, Greco-Roman chapel, and serene courtyards create a setting of majestic elegance.',
      'Restored with care, Tekik blends history, scale, and intimacy—offering couples a timeless backdrop where every wedding becomes a celebration of culture, grandeur, and memory.',
    ],
    capacidadMax: 1000,
    hospedaje: { tiene: true, habitaciones: 2 },
    minutos: 37,
    km: 22,
    estilo: 'Historic henequen estate with neoclassical architecture',
    interiorExterior: 'Indoor and outdoor spaces',
    espacios: [
      {
        nombre: 'Chapel',
        tipo: 'interior',
        descripcion:
          'Greco-Roman classical elements inspired by the Temple of La Madeleine in Paris.',
      },
      { nombre: 'Machine House', tipo: 'interior', descripcion: CEREMONIA_SIMBOLICA },
      { nombre: 'Corridors', tipo: 'mixto', descripcion: CEREMONIA_SIMBOLICA },
    ],
    nota: 'Its scale allows for large-format celebrations, while the chapel, Machine House and corridors provide distinct settings for different moments of an event. The architectural character is one of the property’s defining elements.',
    atributos: ['arquitectura'],
  },

  // --- 02 — Organic Estates -------------------------------------------------------------
  {
    nombre: 'Hacienda Sac Chich',
    slug: 'hacienda-sac-chich',
    coleccion: 'organic',
    region: 'alrededores-de-merida',
    localidad: 'Sac Chich, Acanceh',
    direccion: 'Calle 16, Sac Chich, Acanceh, Yucatán 97380',
    destacado: true,
    resumen: 'Where restored colonial architecture meets award-winning contemporary design.',
    about: [
      'Amid Yucatán’s emerald fields, where henequen once thrived, Hacienda Sac Chich stands as a dialogue between past and present.',
      'Built around 1800, its restored walls preserve the character of the original estate, while Casa Sisal introduces a contemporary architectural language that remains deeply connected to its surroundings. Designed by Salvador Reyes Ríos and Josefina Larraín, the property brings colonial architecture and award-winning contemporary design together within a landscape shaped by gardens and tropical vegetation.',
      'Here, architecture, nature and history coexist effortlessly, creating an intimate setting with a distinctly modern point of view.',
    ],
    capacidadMax: 150,
    hospedaje: { tiene: true, habitaciones: 8, huespedes: 21 },
    minutos: 47,
    km: 29.9,
    estilo: 'Colonial architecture with contemporary design',
    interiorExterior: 'Primarily outdoor spaces, including gardens, patios and rooftop areas',
    espacios: [
      { nombre: 'Gardens', tipo: 'exterior' },
      { nombre: 'Rooftop lounge', tipo: 'exterior' },
      { nombre: 'Open-air patios', tipo: 'exterior', descripcion: 'Surrounded by greenery.' },
    ],
    nota: 'Sac Chich is particularly distinctive for the contrast between its restored historic architecture and Casa Sisal’s contemporary design. Its relatively intimate event capacity and on-site accommodation make the property well suited to celebrations centered around architecture, nature and privacy.',
    atributos: ['arquitectura', 'naturaleza', 'privacidad'],
  },
  {
    nombre: 'Hacienda San Pedro Ochil',
    slug: 'hacienda-san-pedro-ochil',
    coleccion: 'organic',
    region: 'alrededores-de-merida',
    localidad: 'Abalá',
    direccion: 'Hacienda Ochil, Abalá, Yucatán, Mexico',
    resumen:
      'A 16th-century colonial hacienda blending Moorish and neoclassical architecture, Hacienda San Pedro Ochil is a setting shaped by history, texture and character.',
    about: [
      'A 16th-century colonial hacienda blending Moorish and neoclassical architecture, Hacienda San Pedro Ochil is a setting shaped by history, texture and character.',
      'Hidden among henequen fields and century-old palms, its amphitheater, tiled corridors and iconic structures create a cinematic backdrop where the architecture remains an essential part of the experience.',
      'Its variety of historic and open-air spaces allows each celebration to unfold naturally throughout the property, creating an atmosphere that feels unmistakably rooted in Yucatán.',
    ],
    capacidadMax: 800,
    hospedaje: { tiene: false, texto: 'Not specified' },
    minutos: 44,
    km: 44.4,
    estilo: 'Historic colonial hacienda with Moorish and neoclassical influences',
    interiorExterior: 'Gardens, courtyards and historic event spaces',
    espacios: [
      { nombre: 'Gardens', tipo: 'exterior' },
      { nombre: 'Courtyards', tipo: 'exterior' },
      { nombre: 'Amphitheater', tipo: 'exterior' },
      { nombre: 'Tiled corridors', tipo: 'mixto' },
    ],
    nota: 'Ochil offers multiple visually distinct environments within the same property. Its gardens, courtyards, amphitheater and architectural corridors can support different moments of a celebration without relying on a single central event space.',
    atributos: ['arquitectura'],
  },
  {
    nombre: 'Hacienda Yaxcopoil',
    slug: 'hacienda-yaxcopoil',
    coleccion: 'organic',
    region: 'alrededores-de-merida',
    localidad: 'Yaxcopoil',
    direccion: 'Yaxcopoil, Yucatán, Mexico, CP 97396',
    resumen:
      'Meaning “place of the green poplars” in Maya, Hacienda Yaxcopoil stands as a powerful expression of Yucatán’s historic hacienda landscape.',
    about: [
      'Meaning “place of the green poplars” in Maya, Hacienda Yaxcopoil stands as a powerful expression of Yucatán’s historic hacienda landscape.',
      'Its colonial and neoclassical architecture, framed by poplars and laurels, preserves the character of an estate shaped by centuries of regional history. Architectural spaces and surrounding vegetation come together to create a setting that feels monumental without losing its connection to the landscape.',
      'For celebrations, Yaxcopoil offers the opportunity to experience Yucatán through architecture, history and nature within one of the region’s distinctive historic settings.',
    ],
    capacidadMax: 800,
    hospedaje: {
      tiene: true,
      habitaciones: 2,
      texto: '1 room for the bride and groom + 1 room for the wedding planners',
    },
    minutos: 38,
    km: 33.1,
    estilo: 'Colonial and neoclassical historic hacienda',
    interiorExterior: 'Indoor and outdoor spaces',
    // La ficha solo nombra la capilla; banquete y cóctel (800) son formatos, no espacios.
    entorno: 'ambos',
    espacios: [{ nombre: 'Chapel', tipo: 'interior', capacidad: 100 }],
    nota: 'Its capacity allows for large celebrations, while the chapel and different ceremony configurations create flexibility for the progression of an event.',
    atributos: ['arquitectura', 'naturaleza'],
  },
  {
    nombre: 'Hacienda Itzincab de Cámara',
    slug: 'hacienda-itzincab-de-camara',
    coleccion: 'organic',
    region: 'alrededores-de-merida',
    localidad: 'Tecoh',
    direccion: 'Carretera Ramal Itzincab, 97822 Tecoh (Nueva España), Yucatán',
    resumen:
      'Hidden within the Yucatecan landscape, Hacienda Itzincab de Cámara brings together Maya heritage, historic architecture and nature.',
    about: [
      'Hidden within the Yucatecan landscape, Hacienda Itzincab de Cámara brings together Maya heritage, historic architecture and nature.',
      'Built in the 16th century atop an ancient Maya site, the property preserves an original pyramid that creates a direct connection between the estate and the history of the land on which it stands.',
      'Restored in 1997, its neoclassical and colonial architecture sits among lush vegetation, creating a secluded and atmospheric setting for celebrations centered around history, nature and a strong sense of place.',
    ],
    capacidadMax: 250,
    hospedaje: { tiene: true, huespedes: 14, texto: 'Up to 14 guests' },
    minutos: 50,
    km: 34.4,
    estilo: 'Colonial and neoclassical hacienda surrounded by nature',
    interiorExterior: 'Historic architecture and outdoor natural settings',
    espacios: [],
    nota: 'Its relatively intimate capacity, on-site accommodation and secluded natural setting distinguish Itzincab from larger hacienda venues. The preserved Maya pyramid is also a defining element of the property’s historical identity.',
    atributos: ['naturaleza', 'privacidad'],
  },
  {
    nombre: 'Hacienda Chuntuac',
    slug: 'hacienda-chuntuac',
    coleccion: 'organic',
    region: 'alrededores-de-merida',
    localidad: 'Molas',
    direccion: 'Calle 21 #130, Fraccionamiento Chuntuac, 97315 Molas, Yucatán',
    resumen: 'Built in 1620, Hacienda Chuntuac is one of the historic estates of Yucatán.',
    about: [
      'Built in 1620, Hacienda Chuntuac is one of the historic estates of Yucatán. Surrounded by the vegetation of the Cuxtal Nature Reserve, its Moorish arches and serene gardens give the property a character closely connected to both architecture and landscape.',
      'Once a cattle hacienda and later part of Yucatán’s henequen history, Chuntuac preserves the character of its past while functioning today as a setting for contemporary celebrations.',
      'Its combination of historic architecture, gardens and natural surroundings creates an atmosphere that feels secluded despite its proximity to Mérida.',
    ],
    capacidadMax: 400,
    hospedaje: { tiene: true, habitaciones: 4, huespedes: 12 },
    minutos: 38,
    km: 21.6,
    estilo: 'Historic hacienda with Moorish architectural elements',
    interiorExterior: 'Gardens, terraces and historic architectural spaces',
    espacios: [
      { nombre: 'Gardens', tipo: 'exterior' },
      { nombre: 'Terraces', tipo: 'exterior' },
    ],
    nota: 'The property’s location within the Cuxtal Nature Reserve and its Moorish architectural elements are central to its identity. Its combination of event capacity and on-site rooms also allows part of the wedding party to remain within the property.',
    atributos: ['naturaleza', 'arquitectura', 'ubicacion'],
  },
  {
    nombre: 'Hacienda Dzibikak',
    slug: 'hacienda-dzibikak',
    coleccion: 'organic',
    region: 'alrededores-de-merida',
    localidad: 'Dzibikak, Umán',
    direccion: 'Carretera Umán–Hunucmá Km 5, Dzibikak, Umán, Yucatán 97393',
    resumen:
      'Hacienda Dzibikak brings together the atmosphere of a historic Yucatecan estate with the functionality required for contemporary celebrations.',
    about: [
      'Hacienda Dzibikak brings together the atmosphere of a historic Yucatecan estate with the functionality required for contemporary celebrations.',
      'Formerly Hacienda de San Gerónimo de Dzibikak, the property underwent an extensive transformation that restored its architecture and returned life to a place shaped by the region’s past. Today, serene pathways, expansive grounds and restored structures create a setting that balances historic character with contemporary use.',
      'Its scale makes Dzibikak particularly versatile, while its architecture and landscape preserve the sense of place that defines Yucatán’s historic estates.',
    ],
    capacidadMax: 2000,
    hospedaje: { tiene: true, habitaciones: 6, huespedes: 20 },
    minutos: 34,
    km: 21.4,
    estilo: 'Restored historic Yucatecan hacienda',
    interiorExterior: 'Expansive grounds and restored architectural spaces',
    espacios: [],
    nota: 'With capacity for up to 2,000 guests, Dzibikak is one of the larger venues in the Curated collection. Its expansive grounds allow for large-format celebrations, while its six-room accommodation component provides limited on-site lodging for key guests.',
    atributos: ['arquitectura'],
  },

  // --- 03 — Timeless Venues ---------------------------------------------------------------
  {
    nombre: 'Hacienda Xtepén',
    slug: 'hacienda-xtepen',
    coleccion: 'timeless',
    region: 'alrededores-de-merida',
    localidad: 'Xtepén',
    direccion: 'Comisaría de Xtepén, Tab. Cat. 3493, 97390 Xtepén, Yucatán',
    resumen:
      'Meaning “black butterfly” in Maya, Hacienda Xtepén is a living canvas of history and rebirth.',
    about: [
      'Meaning “black butterfly” in Maya, Hacienda Xtepén is a living canvas of history and rebirth.',
      'Founded in the 17th century, the estate reflects the legacy of Yucatán’s henequen era. Following a meticulous restoration, its grand main house, former machine room, century-old chapel and original murals preserve the character of the property while discreet modern comforts allow it to function for contemporary celebrations.',
      'Colonial architecture and natural surroundings come together across spaces capable of hosting everything from intimate ceremonies to large-scale events, creating an experience deeply connected to Yucatán’s heritage.',
    ],
    capacidadMax: 2000,
    hospedaje: { tiene: true, habitaciones: 8 },
    minutos: 30,
    km: 24,
    estilo: 'Restored 17th-century colonial hacienda',
    interiorExterior: 'Indoor and outdoor spaces',
    espacios: [
      { nombre: 'Main House', tipo: 'mixto', capacidad: 300 },
      {
        nombre: 'Gardens / Main Garden',
        tipo: 'exterior',
        capacidad: 2000,
        descripcion: '50–2,000 guests.',
      },
      { nombre: 'Air-conditioned Hall', tipo: 'interior', capacidad: 150 },
      { nombre: 'Chapel', tipo: 'interior', capacidad: 120 },
    ],
    nota: 'Xtepén offers an unusually broad range of capacities within one property. Its air-conditioned hall provides an indoor alternative, while the gardens accommodate large-format celebrations. The historic chapel, main house and former machine room allow different moments of an event to unfold across distinct settings.',
    atributos: ['arquitectura', 'naturaleza'],
  },
  {
    nombre: 'Hacienda San Diego Cutz',
    slug: 'hacienda-san-diego-cutz',
    coleccion: 'timeless',
    region: 'alrededores-de-merida',
    localidad: 'Yucatán',
    direccion: 'Hacienda San Diego Cutz, Yucatán, Mexico',
    destacado: true,
    resumen:
      'A restored colonial estate where historic grandeur meets expansive gardens and timeless elegance.',
    about: [
      'A colonial estate once dedicated to henequen and cattle production, Hacienda San Diego Cutz reflects the scale and architectural character of Yucatán’s historic haciendas.',
      'Meticulously restored, the property combines its historical identity with the functionality required for contemporary events. Expansive gardens, covered terraces, elegant interior halls and a chapel create a sequence of distinct settings throughout the estate.',
      'Its scale and variety of spaces allow celebrations to move naturally between architecture and landscape, transforming the property into a versatile setting for events of different formats.',
    ],
    capacidadMax: 1600,
    hospedaje: { tiene: true, habitaciones: 5, texto: '1 master suite + 4 additional rooms' },
    minutos: 30,
    km: 20.2,
    estilo: 'Restored colonial hacienda',
    interiorExterior: 'Gardens, covered terraces and interior halls',
    espacios: [
      { nombre: 'Expansive gardens', tipo: 'exterior' },
      { nombre: 'Covered terraces', tipo: 'mixto' },
      { nombre: 'Interior halls', tipo: 'interior' },
      { nombre: 'Chapel', tipo: 'interior' },
    ],
    nota: 'San Diego Cutz combines substantial event capacity with both covered and open-air spaces. This variety gives planners flexibility when designing the progression of a celebration and provides alternatives within the same property for ceremonies, cocktails and receptions.',
    atributos: ['arquitectura'],
  },
  {
    nombre: 'Hacienda Santa Rosa de Lima',
    slug: 'hacienda-santa-rosa-de-lima',
    coleccion: 'timeless',
    region: 'alrededores-de-merida',
    localidad: 'Santa Rosa',
    direccion: 'Carretera Mérida Campeche Lote Desviación, 97800 Santa Rosa, Yucatán',
    resumen:
      'Originally built in the 17th century and restored in 1996, Hacienda Santa Rosa de Lima brings together colonial architecture and the landscape of the Yucatán countryside.',
    about: [
      'Originally built in the 17th century and restored in 1996, Hacienda Santa Rosa de Lima brings together colonial architecture and the landscape of the Yucatán countryside.',
      'Its distinctive sky-blue main house and abundant gardens recall the character of the region’s historic haciendas while preserving a strong connection to the surrounding landscape. The property’s architecture, gardens and quiet atmosphere create a setting rooted in both history and nature.',
      'With multiple event areas and on-site accommodation, Santa Rosa offers the scale and versatility required for destination celebrations while maintaining the character of a historic Yucatecan estate.',
    ],
    capacidadMax: 2000,
    capacidadDetalle: 'Up to 1,500 guests for banquet / 2,000 for cocktail',
    hospedaje: { tiene: true, habitaciones: 11 },
    estilo: 'Restored 17th-century colonial hacienda',
    interiorExterior: '2 covered areas + 4 outdoor areas',
    espacios: [
      { nombre: 'Covered areas', tipo: 'mixto', descripcion: '2 covered event areas.' },
      { nombre: 'Outdoor areas', tipo: 'exterior', descripcion: '4 outdoor event areas.' },
    ],
    nota: 'Santa Rosa combines one of the larger capacities in the collection with six different event areas. The mix of covered and outdoor spaces provides flexibility for different stages of a celebration, while the 11 guest rooms allow a select group to stay on the property.',
    atributos: ['arquitectura', 'naturaleza'],
  },
  {
    nombre: 'Casa Faller',
    slug: 'casa-faller',
    coleccion: 'timeless',
    region: 'merida',
    localidad: 'Itzimná, Mérida',
    direccion: 'Av. Pérez Ponce 403, Itzimná, Mérida, Yucatán, Mexico',
    resumen:
      'In the heart of Mérida, Casa Faller brings together Moorish-inspired architecture, historic character and a collection of serene gardens.',
    about: [
      'In the heart of Mérida, Casa Faller brings together Moorish-inspired architecture, historic character and a collection of serene gardens.',
      'Its distinctive architecture and iconic lake tree give the property a sense of identity that feels intimate despite its considerable event capacity. Interior rooms transition naturally toward the surrounding gardens, allowing celebrations to unfold between the house and landscape.',
      'Set within Itzimná, Casa Faller offers a distinctly urban interpretation of a Yucatán celebration—historic, atmospheric and closely connected to the city.',
    ],
    capacidadMax: 900,
    hospedaje: { tiene: false },
    minutos: 15,
    km: 4.2,
    estilo: 'Historic Mérida residence with Moorish-inspired architecture',
    interiorExterior: 'Interior spaces and multiple gardens',
    espacios: [
      { nombre: 'Front Garden', tipo: 'exterior', capacidad: 300 },
      { nombre: 'Side Garden', tipo: 'exterior', capacidad: 600 },
      {
        nombre: 'Inside the house',
        tipo: 'interior',
        capacidad: 80,
        descripcion: 'Symbolic ceremony, up to 80 guests seated and standing.',
      },
    ],
    nota: 'Unlike the haciendas outside Mérida, Casa Faller offers a historic setting within the city itself. Its multiple gardens allow planners to divide a celebration into different environments, while the interior of the house provides an intimate option for symbolic ceremonies.',
    atributos: ['arquitectura', 'ubicacion'],
  },
  {
    nombre: 'Casona 333',
    slug: 'casona-333',
    coleccion: 'timeless',
    region: 'merida',
    localidad: 'Centro, Mérida',
    direccion: 'Calle 60 #333 x Calle 35 & Av. Colón, Centro, Mérida, Yucatán, Mexico',
    resumen:
      'In the heart of Mérida, Casona 333 brings historical character into a distinctly contemporary setting.',
    about: [
      'In the heart of Mérida, Casona 333 brings historical character into a distinctly contemporary setting.',
      'Restored in 2024, the property reimagines a traditional Mérida mansion as an open-air venue designed for modern celebrations. Its two principal areas—the intimate courtyard and expansive main garden—offer contrasting scales while maintaining a cohesive architectural identity.',
      'Surrounded by the cultural energy and historic streets of central Mérida, Casona 333 feels like an urban oasis where architecture, design and celebration meet.',
    ],
    capacidadMax: 750,
    hospedaje: { tiene: false },
    estilo: 'Restored historic casona with contemporary character',
    interiorExterior: 'Outdoor event spaces',
    espacios: [
      { nombre: 'Patio Íntimo', tipo: 'exterior', capacidad: 240 },
      { nombre: 'Main Garden', tipo: 'exterior', capacidad: 750 },
    ],
    nota: 'Casona 333 offers two clearly differentiated event environments within central Mérida. Patio Íntimo works for smaller moments or ceremonies, while the Main Garden provides the scale required for larger receptions. Its city location also distinguishes it from the hacienda venues outside Mérida.',
    atributos: ['arquitectura', 'ubicacion'],
  },
  {
    nombre: 'Hacienda San José Cholul',
    slug: 'hacienda-san-jose-cholul',
    coleccion: 'timeless',
    region: 'alrededores-de-merida',
    localidad: 'Tixkokob',
    direccion: 'Km 30 Carretera Tixkokob-Tekanto, 97470 Tixkokob, Yucatán',
    resumen:
      'Hacienda San José Cholul is a secluded 19th-century estate surrounded by lush vegetation and towering trees.',
    about: [
      'Hacienda San José Cholul is a secluded 19th-century estate surrounded by lush vegetation and towering trees.',
      'Its preserved walls and arches retain the character of another era, allowing the architecture and landscape to remain at the center of the experience. Rather than feeling overly transformed, the property maintains a quiet sense of authenticity that gives it a distinctive presence.',
      'With expansive event capacity, a historic chapel and on-site accommodation, San José Cholul combines the atmosphere of a secluded Yucatecan estate with the practical elements required for a destination celebration.',
    ],
    capacidadMax: 1700,
    capacidadDetalle: 'Up to 1,200 guests for banquet / 1,700 for cocktail',
    hospedaje: { tiene: true, habitaciones: 15 },
    minutos: 59,
    km: 40.6,
    estilo: 'Preserved 19th-century historic hacienda',
    interiorExterior: 'Historic architectural spaces and outdoor areas',
    // La ficha solo nombra la capilla; banquete y cóctel son formatos, no espacios.
    entorno: 'ambos',
    espacios: [{ nombre: 'Chapel', tipo: 'interior', capacidad: 200 }],
    nota: 'San José Cholul can accommodate large celebrations while retaining the atmosphere of a secluded historic estate. Its chapel and 15 on-site rooms are particularly useful for destination weddings where several parts of the celebration are intended to take place within the same property.',
    atributos: ['privacidad', 'naturaleza', 'arquitectura'],
  },
  {
    nombre: 'Hacienda San Antonio Millet',
    slug: 'hacienda-san-antonio-millet',
    coleccion: 'timeless',
    region: 'alrededores-de-merida',
    localidad: 'Tixkokob',
    direccion: 'Hacienda San Antonio Millet, Tixkokob, Yucatán, Mexico',
    resumen:
      'Hacienda San Antonio Millet reflects the refinement and architectural character associated with Yucatán’s historic estates.',
    about: [
      'Hacienda San Antonio Millet reflects the refinement and architectural character associated with Yucatán’s historic estates.',
      'Dating to the 18th century, its neoclassical and Yucatecan colonial architecture incorporates French influences and has been restored with respect for the property’s original identity. Gardens, historic architecture and the distinctive Salón de los Arcos create an atmosphere defined by proportion, serenity and a strong connection to the past.',
      'The result is a venue that balances architectural presence with understated elegance, offering a timeless setting for celebrations surrounded by the Yucatecan landscape.',
    ],
    capacidadMax: 800,
    hospedaje: { tiene: false, texto: 'Not specified' },
    minutos: 48,
    km: 25.8,
    estilo: 'Neoclassical and Yucatecan colonial architecture',
    interiorExterior: 'Gardens and covered event space',
    espacios: [
      { nombre: 'Salón de los Arcos', tipo: 'mixto', descripcion: 'Covered event space.' },
      { nombre: 'Gardens', tipo: 'exterior', descripcion: 'Outdoor event areas.' },
      {
        nombre: 'Chapel',
        tipo: 'interior',
        capacidad: 30,
        descripcion: 'Non-consecrated chapel.',
      },
    ],
    nota: 'The Salón de los Arcos gives the property a covered alternative alongside its gardens, providing planners with greater flexibility. The non-consecrated chapel and multiple ceremony locations also allow different event formats to be developed within the same property.',
    atributos: ['arquitectura'],
  },
  {
    nombre: 'Hacienda San Juan Opichén',
    slug: 'hacienda-san-juan-opichen',
    coleccion: 'timeless',
    region: 'merida',
    localidad: 'Mérida',
    resumen:
      'Dating to 1779, Hacienda San Juan Opichén is a restored historic estate whose architecture brings together Mexican colonial character and French-inspired details.',
    about: [
      'Dating to 1779, Hacienda San Juan Opichén is a restored historic estate whose architecture brings together Mexican colonial character and French-inspired details.',
      'Its different gardens and architectural spaces create a sequence of environments that can accommodate both intimate moments and larger celebrations. The property’s restored character preserves its historic identity while allowing its spaces to function for contemporary events.',
      'Within Mérida, San Juan Opichén offers the atmosphere of a traditional hacienda with the practical advantage of remaining connected to the city.',
    ],
    capacidadMax: 550,
    hospedaje: { tiene: false, texto: 'Not specified' },
    estilo: 'Restored colonial architecture with French influences',
    interiorExterior: 'Covered and outdoor event spaces',
    espacios: [
      { nombre: 'Garden', tipo: 'exterior', descripcion: 'Main reception area.' },
      {
        nombre: 'Chapel',
        tipo: 'mixto',
        capacidad: 120,
        descripcion: 'Up to 32 guests inside / 120 guests using the corridors.',
      },
      {
        nombre: 'Machine Room',
        tipo: 'interior',
        capacidad: 80,
        descripcion: 'Air-conditioned.',
      },
      {
        nombre: 'Lake & Bridge Garden',
        tipo: 'exterior',
        capacidad: 200,
        descripcion: 'Ceremonies.',
      },
      {
        nombre: 'Jardín de las Musas',
        tipo: 'exterior',
        capacidad: 200,
        descripcion: 'Ceremonies.',
      },
    ],
    nota: 'San Juan Opichén provides a particularly varied collection of ceremony and reception environments. Its air-conditioned Machine Room adds an indoor option, while the chapel, Lake & Bridge Garden and Jardín de las Musas allow planners to create different experiences throughout the property.',
    atributos: ['arquitectura', 'ubicacion'],
  },
];

export const venuesDemo: Venue[] = fichas.map(venueDeFicha);
