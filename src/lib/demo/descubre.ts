import type {
  CategoriaDescubre,
  CategoriaDescubreResumen,
  DescubreYucatan,
  Imagen,
  TextoLocalizado,
} from '@/lib/contenido/tipos';
import { bloquesIngles, HORIZONTAL, imagenDemo, texto, VERTICAL } from './ayudantes';

/*
 * Discover Yucatán: portada y sus seis páginas de categoría (D-048).
 *
 * Copy real de 01_WEB/02_DISCOVER YUCATAN (Drive, 2026-10-02): la entradilla de la portada y la
 * microdescripción de cada categoría salen de "00 — ESTRUCTURA GENERAL"; el hero, las secciones
 * y "Continue exploring" de cada página, de su "ESTRUCTURA Y CONTENIDO". Se quitaron las notas
 * internas del documento (comentarios en español sobre la investigación, "Texto pegado").
 * Solo en inglés, como el documento: el español cae al inglés (D-008), salvo el nombre de cada
 * categoría.
 *
 * Siguen en [DEMO] las fotos: las carpetas MEDIA solo traen la lista de fotos necesarias.
 */

const en = (valor: string): TextoLocalizado => ({ en: valor });

export const descubreDemo: DescubreYucatan = {
  _id: 'descubreYucatan',
  _type: 'descubreYucatan',
  titulo: texto('Discover Yucatán', 'Descubre Yucatán'),
  entradilla: en(
    'Beyond the celebration lies a destination with a character entirely its own. Discover the architecture, traditions, flavors, landscapes and experiences that make Yucatán unlike anywhere else.',
  ),
  imagenPrincipal: imagenDemo(
    'descubre-hero.jpg',
    2400,
    1500,
    '[DEMO] Placeholder photo of Yucatán',
    '[DEMO] Foto de relleno de Yucatán',
  ),
};

interface SeccionFicha {
  titulo: string;
  parrafos: string[];
}

interface DatosCategoria {
  slug: string;
  titulo: [en: string, es: string];
  resumen: string;
  titular: string;
  entradilla: string;
  secciones: SeccionFicha[];
  relacionadas: [string, string, string];
}

/** Fotos de relleno por categoría: descubre-<slug>-1.jpg … -4.jpg (scripts/generar-imagenes-demo). */
const MEDIDAS_FOTOS = [HORIZONTAL, VERTICAL, HORIZONTAL, VERTICAL];

function fotosSeccion(slug: string, indice: number, titulo: string): Imagen[] {
  return [0, 1].map((k) => {
    const numero = ((indice * 2 + k) % MEDIDAS_FOTOS.length) + 1;
    const [ancho, alto] = MEDIDAS_FOTOS[numero - 1]!;
    return {
      ...imagenDemo(
        `descubre-${slug}-${numero}.jpg`,
        ancho,
        alto,
        `[DEMO] Placeholder photo for "${titulo}"`,
        `[DEMO] Foto de relleno para «${titulo}»`,
      ),
      _key: `${slug}-s${indice + 1}-i${k + 1}`,
    };
  });
}

const fichas: DatosCategoria[] = [
  {
    slug: 'architecture',
    titulo: ['Architecture', 'Arquitectura'],
    resumen: 'A distinctive architectural language shaped by history, climate and place.',
    titular: 'Architecture shaped by time, climate and place.',
    entradilla:
      'In Yucatán, architecture tells its story in layers. Maya geometry, colonial courtyards, grand haciendas and contemporary spaces coexist in a landscape where buildings have always responded to history, material and climate.',
    secciones: [
      {
        titulo: 'A language built in layers',
        parrafos: [
          'Yucatán’s architectural identity cannot be traced to a single period. Ancient Maya building traditions, Spanish colonial planning, European influences from the henequén era and contemporary Mexican design have each left their mark on the region.',
          'Rather than existing separately, these layers often appear side by side. In Mérida, colonial streets lead toward Porfirian mansions and later Neomaya landmarks, while contemporary projects continue to reinterpret local proportions, materials and ways of living.',
        ],
      },
      {
        titulo: 'Designed for the climate',
        parrafos: [
          'Long before mechanical cooling became part of everyday life, architecture in Yucatán was already responding to heat, sunlight and air.',
          'High ceilings allow warm air to rise. Courtyards bring light and vegetation into the center of a home. Shaded arcades offer protection from the sun, while doors, shutters and interconnected spaces encourage air to move naturally through the building.',
          'Here, climate is not separate from architecture. It has helped shape it.',
        ],
      },
      {
        titulo: 'Materials of the peninsula',
        parrafos: [
          'Stone, lime, wood and handmade surfaces give Yucatán much of its architectural texture.',
          'Local limestone has shaped buildings across centuries, while lime finishes, tropical hardwoods, patterned cement tiles and traditional stonework introduce surfaces that feel inseparable from the region.',
          'Their beauty often lies in what time adds to them — softened color, weathered stone and the patina of materials allowed to age naturally.',
        ],
      },
      {
        titulo: 'Behind the façade',
        parrafos: [
          'Some of Yucatán’s most memorable spaces reveal themselves gradually.',
          'Along the streets of Mérida, seemingly simple façades can open into tall rooms, shaded corridors, unexpected courtyards and gardens hidden from view. Moving through them becomes part of the architectural experience — from street to interior, from sunlight to shadow, from enclosed rooms to open air.',
          'Architecture here is often something you discover one space at a time.',
        ],
      },
      {
        titulo: 'The hacienda landscape',
        parrafos: [
          'Beyond Mérida, historic haciendas form another chapter of Yucatán’s architectural landscape.',
          'Developed across centuries and transformed dramatically during the henequén era, these estates brought together residences, gardens and industrial structures within a single architectural complex. Grand houses, arcades, chapels, machine rooms and stone chimneys still reveal traces of the different lives these places once held.',
          'Today, many have been restored and adapted to new uses, allowing their architecture to become part of Yucatán’s contemporary story.',
        ],
      },
      {
        titulo: 'Still evolving',
        parrafos: [
          'Yucatán’s architectural identity is not frozen in the past.',
          'Contemporary architects continue to work with the same questions that have shaped buildings here for generations: how to create shade, encourage airflow, connect interior and exterior spaces and build with materials that belong to the landscape.',
          'The result is an architectural language that continues to evolve without losing its relationship to place.',
        ],
      },
    ],
    relacionadas: ['culture', 'history', 'experiences'],
  },
  {
    slug: 'culture',
    titulo: ['Culture', 'Cultura'],
    resumen: 'Traditions, artistry and a way of life deeply rooted in Yucatán.',
    titular: 'A culture that is lived, not simply remembered.',
    entradilla:
      'In Yucatán, heritage is part of everyday life. Maya language, regional music, embroidered dress and traditions passed across generations continue to shape a culture with an identity distinctly its own.',
    secciones: [
      {
        titulo: 'A living Maya heritage',
        parrafos: [
          'Maya heritage in Yucatán does not belong only to archaeological sites or history books. It remains present in language, family traditions, clothing and everyday life across the peninsula.',
          'Generations continue to carry knowledge, customs and forms of expression forward, allowing ancient roots and contemporary life to exist side by side.',
        ],
      },
      {
        titulo: 'A language still spoken',
        parrafos: [
          'Yucatec Maya remains a living language across the peninsula, spoken alongside Spanish and carried from one generation to the next.',
          'Its presence extends beyond conversation. Centuries of coexistence have also left a distinctive imprint on the Spanish spoken in Yucatán, contributing to expressions, rhythms and vocabulary that belong specifically to the region.',
          'Language here is more than communication. It is part of cultural continuity.',
        ],
      },
      {
        titulo: 'Worn across generations',
        parrafos: [
          'Embroidery is one of the most visible expressions of Yucatecan identity.',
          'The hipil remains part of everyday dress for many Maya women, while the more elaborate terno is associated with formal and festive occasions. Floral embroidery, color and detailed needlework transform clothing into something more than ornament: a visible expression of memory, identity and continuity.',
        ],
      },
      {
        titulo: 'The sound of Yucatán',
        parrafos: [
          'Music gives Yucatán another language of its own.',
          'Jarana brings rhythm, movement and community into plazas and celebrations, while trova yucateca carries a more intimate tradition of melody and poetry.',
          'Different in character but equally rooted in regional identity, both remain part of Yucatán’s cultural landscape today.',
        ],
      },
      {
        titulo: 'Culture in the public square',
        parrafos: [
          'In Yucatán, culture often moves beyond institutions and into public life.',
          'Plazas become gathering places for music, dance and community traditions. In Mérida, evenings can bring trova and regional performances into the city’s historic squares, while towns across the state continue to gather around local festivities and traditions.',
          'For visitors, some of the most meaningful encounters with Yucatecan culture happen simply by being present.',
        ],
      },
      {
        titulo: 'Tradition, still evolving',
        parrafos: [
          'Tradition in Yucatán is not static.',
          'Music continues to be performed, Maya is written and spoken, embroidery passes between generations and new voices continue to express regional identity through contemporary life.',
          'What makes Yucatecan culture distinctive is not simply what has been preserved, but the way it continues to be lived.',
        ],
      },
      {
        titulo: 'Experience with curiosity',
        parrafos: [
          'The most meaningful way to encounter Yucatán’s culture is to recognize it as something living.',
          'Listen, observe and allow traditions to exist on their own terms. What may be unfamiliar to a visitor is part of everyday identity for the people who call Yucatán home.',
        ],
      },
    ],
    relacionadas: ['gastronomy', 'history', 'experiences'],
  },
  {
    slug: 'gastronomy',
    titulo: ['Gastronomy', 'Gastronomía'],
    resumen: 'Flavors shaped by heritage, local ingredients and generations of tradition.',
    titular: 'A cuisine shaped by fire, time and place.',
    entradilla:
      'Yucatán has a culinary language entirely its own. Rooted in Maya traditions and transformed through centuries of cultural exchange, its cuisine brings together native ingredients, ancestral techniques and flavors found nowhere quite the same.',
    secciones: [
      {
        titulo: 'A cuisine built in layers',
        parrafos: [
          'Like the destination itself, Yucatán’s cuisine has been shaped by layers of history.',
          'Maya foundations remain at its core, from corn and native chiles to techniques such as nixtamalization and underground cooking. Spanish ingredients arrived centuries later, while maritime trade across the Caribbean introduced new flavors and products that were gradually absorbed into the region’s culinary identity.',
          'The result is not simply a mixture of influences, but a cuisine that became distinctly Yucatecan.',
        ],
      },
      {
        titulo: 'The flavors of the peninsula',
        parrafos: [
          'Some ingredients appear again and again across the Yucatecan table.',
          'Corn forms its foundation. Achiote brings an unmistakable earthy red color, while sour orange introduces brightness and acidity. Habanero adds both heat and aroma, and recados — complex blends of spices, chiles and herbs — create some of the cuisine’s most recognizable flavors.',
          'Together, these ingredients create a palette that can move from citrus and spice to smoke, earthiness and intense heat.',
        ],
      },
      {
        titulo: 'Cooked with earth and fire',
        parrafos: [
          'Some of Yucatán’s most distinctive flavors begin long before a dish reaches the table.',
          'The pib, an underground cooking method with pre-Hispanic roots, uses heated stones and earth to slowly cook food wrapped in leaves. Other techniques rely on open flame and charring to transform chiles, vegetables and spices before they become marinades, recados or salsas.',
          'Fire, smoke and time are not simply part of the process. They are part of the flavor.',
        ],
      },
      {
        titulo: 'Dishes that tell a story',
        parrafos: [
          'Yucatecan cuisine reveals itself through dishes that bring together ingredients and techniques in completely different ways.',
          'Cochinita pibil combines achiote, sour orange and slow cooking. Relleno negro builds depth from deeply charred chiles and spices. Papadzules pair corn tortillas with pumpkin seed sauce, while panuchos and salbutes turn masa into two distinctly different textures.',
          'Each tells a different part of the same culinary story.',
        ],
      },
      {
        titulo: 'From morning to night',
        parrafos: [
          'Food in Yucatán belongs as much to everyday life as it does to the restaurant table.',
          'Morning can begin with cochinita or lechón tucked into tacos and tortas. Markets fill with prepared foods and ingredients, while panuchos and salbutes offer another expression of the region’s street food culture. Later, a marquesita brings together a crisp shell, sweetness and the unexpected saltiness of shredded Edam cheese.',
          'To understand Yucatán through food is also to experience when, where and how people eat it.',
        ],
      },
      {
        titulo: 'Mérida at the table',
        parrafos: [
          'Mérida offers many ways to enter Yucatán’s food culture.',
          'Traditional markets bring together produce, recados, prepared dishes and everyday ingredients under one roof. Cantinas create another rhythm around drinks and botanas, while contemporary dining continues to reinterpret regional ingredients and culinary traditions.',
          'The city allows old and new ways of eating to coexist — sometimes only a few streets apart.',
        ],
      },
      {
        titulo: 'Taste the destination',
        parrafos: [
          'Yucatán is a destination experienced as much through aroma, texture and flavor as through what can be seen.',
          'Smoke from an underground pib, the acidity of sour orange, the warmth of recados, the heat of habanero and the contrast between crisp and tender textures create a sensory identity that belongs unmistakably to the peninsula.',
          'Here, tasting the food becomes another way of understanding the place.',
        ],
      },
    ],
    relacionadas: ['history', 'nature', 'experiences'],
  },
  {
    slug: 'history',
    titulo: ['History', 'Historia'],
    resumen: 'Stories from the past that continue to shape Yucatán today.',
    titular: 'A history still visible in the landscape.',
    entradilla:
      'Across Yucatán, history is rarely confined to the past. Ancient Maya cities, colonial streets, former henequén estates and living communities reveal a destination shaped by centuries of change, conflict, adaptation and continuity.',
    secciones: [
      {
        titulo: 'Before Yucatán had its present name',
        parrafos: [
          'Long before the arrival of the Spanish, the peninsula was home to complex Maya societies connected through cities, agriculture, political alliances and extensive trade networks.',
          'Places such as Uxmal, Chichén Itzá, Mayapán and Ek Balam belonged to different moments of this long history. Political centers rose, transformed and declined, while populations and networks continued to reorganize across the peninsula.',
          'The Maya world did not simply disappear. It changed.',
        ],
      },
      {
        titulo: 'Conquest and transformation',
        parrafos: [
          'The Spanish conquest of Yucatán was neither immediate nor uncontested. It unfolded across decades of campaigns and resistance before colonial rule became established across much of the peninsula.',
          'Mérida was founded in 1542 on the site of the Maya city of T’hó, beginning another transformation of the region’s political and urban landscape. Colonial institutions, Christianity and new systems of labor and tribute reshaped life, while Maya communities continued to adapt and preserve forms of local organization.',
        ],
      },
      {
        titulo: 'A region with an identity of its own',
        parrafos: [
          'Geography was not the only thing that set Yucatán apart. During the nineteenth century, political tensions between regional federalism and centralized government in Mexico led the peninsula through periods of autonomy and separation.',
          'Yucatán declared itself independent from Mexico more than once before its final reincorporation in 1848. These episodes reveal a region whose distinctive identity was also political — shaped by distance, local interests and a complicated relationship with the rest of the country.',
        ],
      },
      {
        titulo: 'Conflict beneath the landscape',
        parrafos: [
          'The nineteenth century was also marked by one of the most consequential conflicts in the peninsula’s history.',
          'Beginning in 1847, the Caste War grew from profound tensions surrounding land, labor, taxation and political power. Maya communities faced the expansion of private estates onto communal lands, exploitative labor systems and growing social inequality.',
          'The conflict continued for decades, reshaping communities and political relationships across the peninsula.',
        ],
      },
      {
        titulo: 'The age of green gold',
        parrafos: [
          'By the late nineteenth century, another transformation was reshaping Yucatán.',
          'Global demand for henequén fiber connected the peninsula to international markets and generated enormous wealth. Haciendas expanded, rail networks crossed the countryside and Mérida changed as prosperous families invested in new residences and infrastructure.',
          'But the prosperity was profoundly unequal. Much of the industry depended on Maya and other rural laborers bound to haciendas through restrictive systems of debt and control.',
        ],
      },
      {
        titulo: 'After the boom',
        parrafos: [
          'The henequén economy eventually lost the position that had transformed Yucatán.',
          'Political reforms changed labor systems, while synthetic fibers and international competition gradually reduced global demand. Estates that had once operated as agricultural and industrial centers entered periods of decline, abandonment or reinvention.',
          'Their remains still appear throughout the landscape — from machinery and chimneys to restored haciendas given entirely new purposes.',
        ],
      },
      {
        titulo: 'History you can still see',
        parrafos: [
          'Travel through Yucatán today and these periods rarely feel completely separate.',
          'Ancient Maya structures remain across the peninsula. Colonial streets continue to organize the centers of cities and towns. Former henequén estates, machine houses and chimneys survive in the countryside, while Mérida carries traces of different eras within the same urban landscape.',
          'History here is not contained within a single monument. It appears in layers.',
        ],
      },
      {
        titulo: 'A story that continues',
        parrafos: [
          'Understanding Yucatán’s history also means recognizing that its oldest cultural roots remain part of its present.',
          'Maya communities, language and traditions continue across the peninsula today. Centuries of conquest, resistance, adaptation and cultural exchange did not erase that identity — they became part of a much longer story that is still unfolding.',
          'The past helps explain Yucatán. It does not define where its story ends.',
        ],
      },
    ],
    relacionadas: ['architecture', 'culture', 'nature'],
  },
  {
    slug: 'nature',
    titulo: ['Nature', 'Naturaleza'],
    resumen: 'Landscapes and natural settings that reveal another side of the destination.',
    titular: 'A landscape shaped above and below the surface.',
    entradilla:
      'Yucatán reveals its natural character through contrasts. Limestone and dry forest stretch across the interior, freshwater moves through an extraordinary world beneath the surface, and wetlands, mangroves and lagoons transform the landscape as the peninsula reaches the Gulf of Mexico.',
    secciones: [
      {
        titulo: 'A landscape built on limestone',
        parrafos: [
          'Much of Yucatán rests on a vast platform of porous limestone, creating a landscape that appears remarkably flat above ground while hiding an intricate geography below it.',
          'Rainwater moves easily through the rock rather than forming major rivers on the surface. Over time, water dissolves and reshapes the limestone, creating caves, underground passages and openings that connect the visible landscape with the world beneath it.',
        ],
      },
      {
        titulo: 'The world beneath the surface',
        parrafos: [
          'Some of Yucatán’s most extraordinary landscapes cannot be seen from the surface.',
          'Beneath the limestone lies an interconnected system of caves and groundwater. Where sections of rock have dissolved or collapsed, openings reveal the water below: the cenotes that have become one of the peninsula’s most recognizable natural features.',
          'They are not isolated pools, but visible entrances into a much larger underground landscape.',
        ],
      },
      {
        titulo: 'Water, stone and deep time',
        parrafos: [
          'The geology beneath Yucatán carries a story that reaches far beyond human history.',
          'Around the buried Chicxulub impact crater, fractures in the limestone helped shape a remarkable semicircular concentration of cenotes known as the Ring of Cenotes.',
          'What appears today as a landscape of water and stone is connected to a geological event that transformed the planet approximately 66 million years ago.',
        ],
      },
      {
        titulo: 'A forest that changes with the seasons',
        parrafos: [
          'The interior of Yucatán is shaped by seasonal tropical forest, where the landscape can change dramatically throughout the year.',
          'During the wetter months, vegetation becomes dense and green. As the dry season progresses, many plants lose their leaves and the limestone beneath them becomes increasingly visible.',
          'The transformation is part of the natural rhythm of the peninsula — the same landscape revealing entirely different characters as the seasons change.',
        ],
      },
      {
        titulo: 'Where the land meets the Gulf',
        parrafos: [
          'Travel north and west toward the Gulf of Mexico and Yucatán changes again.',
          'Dry interior landscapes give way to coastal dunes, mangroves, wetlands, lagoons and estuaries. Fresh and salt water meet across environments where changing water levels and salinity create ecosystems entirely different from those found inland.',
          'Places such as Celestún and Ría Lagartos reveal another side of the peninsula — expansive, open and defined by water.',
        ],
      },
      {
        titulo: 'Life between water and land',
        parrafos: [
          'Yucatán’s changing environments support an equally varied natural life.',
          'Coastal wetlands provide habitat for large populations of birds, including the flamingos closely associated with places such as Celestún and Ría Lagartos. Inland forests and underground water systems support entirely different species, some adapted to environments found nowhere else.',
          'The diversity reflects the landscape itself: forest, stone, freshwater, mangrove and sea existing within the same peninsula.',
        ],
      },
      {
        titulo: 'A landscape in motion',
        parrafos: [
          'Nature in Yucatán is never entirely static.',
          'Dry months expose stone and transform vegetation, summer rains return color and water to the landscape, and the cooler nortes bring another rhythm to the Gulf coast.',
          'To experience Yucatán at different moments of the year is to encounter different versions of the same place.',
        ],
      },
      {
        titulo: 'A landscape worth protecting',
        parrafos: [
          'The systems that make Yucatán distinctive are also deeply connected.',
          'Groundwater, cenotes, forests, wetlands and mangroves depend on environments increasingly affected by urban growth, development and pollution. Protected areas across the state help conserve important ecosystems, but their future also depends on understanding their vulnerability.',
          'Discovering the landscape means recognizing not only its beauty, but its fragility.',
        ],
      },
    ],
    relacionadas: ['gastronomy', 'culture', 'experiences'],
  },
  {
    slug: 'experiences',
    titulo: ['Experiences', 'Experiencias'],
    resumen: 'Ways to experience Yucatán beyond the celebration.',
    titular: 'The best way to discover Yucatán is to experience it.',
    entradilla:
      'Some places are understood through what you see. Others reveal themselves through what you experience. In Yucatán, the destination comes to life in its streets, markets, landscapes, flavors and everyday rituals — often in the moments you never planned.',
    secciones: [
      {
        titulo: 'Slow down',
        parrafos: [
          'Yucatán rewards a slower way of traveling.',
          'Instead of moving quickly from one landmark to the next, leave room to walk, observe and stay a little longer. Sit in a plaza as the evening begins, wander through a neighborhood without a strict route or return to a place at a different hour and watch its rhythm change.',
          'Sometimes discovering the destination begins by doing less.',
        ],
      },
      {
        titulo: 'Experience Mérida beyond the landmarks',
        parrafos: [
          'Mérida reveals much of its character away from the obvious landmarks.',
          'Traditional neighborhoods such as Santiago, Santa Ana, La Ermita and San Sebastián each move at their own pace, shaped by markets, plazas, churches, food stands and the routines of the people who live around them.',
          'Walk through them in the morning and return after sunset. The architecture may remain the same, but the experience rarely does.',
        ],
      },
      {
        titulo: 'Enter through the market',
        parrafos: [
          'Markets offer one of the most immediate ways to encounter everyday Yucatán.',
          'Ingredients arrive from the countryside, familiar dishes are prepared alongside market stalls and conversations unfold around food, produce and daily routines. In Mérida and towns across the state, they connect what grows in the region with the way people actually eat.',
          'Come hungry, but also curious.',
        ],
      },
      {
        titulo: 'Go beyond Mérida',
        parrafos: [
          'The character of Yucatán changes as you move beyond its capital.',
          'Historic towns, smaller communities and rural landscapes offer another perspective on the peninsula. Valladolid and Izamal reveal different rhythms of urban life, while communities across the interior keep culinary, textile and cultural traditions connected to everyday life.',
          'The journey between places becomes part of understanding the destination.',
        ],
      },
      {
        titulo: 'Meet the people behind the tradition',
        parrafos: [
          'Some traditions become more meaningful when you understand the hands and knowledge behind them.',
          'Across Yucatán, community initiatives continue to preserve embroidery, textiles, music and other forms of cultural expression while allowing them to evolve through new generations.',
          'Approach these encounters as opportunities to listen and learn rather than simply observe.',
        ],
      },
      {
        titulo: 'Read the landscape differently',
        parrafos: [
          'A cenote, a mangrove, an archaeological site or a former henequén estate becomes more meaningful when you understand what shaped it.',
          'Take time to notice what remains: stone, water, machinery, vegetation, pathways and traces of earlier ways of living and working.',
          'Experiencing Yucatán is not only about reaching a place. It is about learning how to read it.',
        ],
      },
      {
        titulo: 'Travel with curiosity',
        parrafos: [
          'The places that make Yucatán remarkable are also places people live in, care for and protect.',
          'Respect boundaries at archaeological sites, move carefully through natural environments and approach local traditions without treating them as performances created for visitors.',
          'Curiosity makes a destination more interesting. Respect makes the experience more meaningful.',
        ],
      },
      {
        titulo: 'Leave room for the unplanned',
        parrafos: [
          'Not every memorable experience in Yucatán needs a reservation or an itinerary.',
          'It might be music drifting across a plaza, breakfast in a market, an unexpected conversation or simply watching a neighborhood change as afternoon becomes evening.',
          'Leave enough space in the journey for Yucatán to surprise you.',
        ],
      },
    ],
    relacionadas: ['architecture', 'gastronomy', 'nature'],
  },
];

function resumenDe(d: DatosCategoria, orden: number): CategoriaDescubreResumen {
  return {
    _id: `categoria-${d.slug}`,
    titulo: texto(...d.titulo),
    slug: d.slug,
    orden,
    resumen: en(d.resumen),
    imagenPrincipal: imagenDemo(
      `descubre-${d.slug}-hero.jpg`,
      2400,
      1500,
      `[DEMO] Placeholder photo for ${d.titulo[0]}`,
      `[DEMO] Foto de relleno para ${d.titulo[1]}`,
    ),
  };
}

const resumenes = fichas.map((d, i) => resumenDe(d, i + 1));

export const categoriasDescubreDemo: CategoriaDescubre[] = fichas.map((d, i) => ({
  ...resumenes[i]!,
  _type: 'categoriaDescubre',
  titular: en(d.titular),
  entradilla: en(d.entradilla),
  secciones: d.secciones.map((seccion, j) => ({
    _key: `${d.slug}-s${j + 1}`,
    titulo: en(seccion.titulo),
    texto: bloquesIngles(`${d.slug}-s${j + 1}`, seccion.parrafos),
    imagenes: fotosSeccion(d.slug, j, seccion.titulo),
  })),
  relacionadas: d.relacionadas.map((slug) => {
    const relacionada = resumenes.find((r) => r.slug === slug);
    if (!relacionada) throw new Error(`Categoría relacionada inexistente: ${slug}`);
    return relacionada;
  }),
}));
