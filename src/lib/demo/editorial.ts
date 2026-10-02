import type {
  Articulo,
  BloqueTexto,
  BloquesLocalizados,
  PaginaEditorial,
} from '@/lib/contenido/tipos';
import { bloques, HORIZONTAL, imagenDemo, texto } from './ayudantes';

// --- Curated Journal -------------------------------------------------------------------

/**
 * Los 6 artículos de 07_CURATED JOURNAL/ARTICULOS_CURATED JOURNAL (Drive, 2026-10-01). Es texto
 * real del equipo editorial: no lleva [DEMO]. Se quitaron las marcas internas del documento
 * ("Texto pegado") y queda en inglés —el idioma del documento—; el español sigue pendiente de
 * traducción y mientras tanto el sitio muestra el inglés (D-008).
 * La portada de cada artículo sigue siendo una foto de relleno: el documento no trae fotografías.
 */
interface SeccionArticulo {
  /** Sin título en el primer bloque de cada artículo. */
  titulo?: string;
  parrafos: string[];
}

function bloqueTexto(clave: string, estilo: 'h2' | 'normal', contenido: string): BloqueTexto {
  return {
    _type: 'block',
    _key: clave,
    style: estilo,
    children: [{ _type: 'span', _key: `${clave}-s`, text: contenido }],
  };
}

/** Cuerpo en inglés a partir de secciones con subtítulo opcional. */
function cuerpoArticulo(prefijo: string, secciones: SeccionArticulo[]): BloquesLocalizados {
  const en: BloqueTexto[] = [];
  secciones.forEach((seccion, i) => {
    if (seccion.titulo) en.push(bloqueTexto(`${prefijo}-h${i}`, 'h2', seccion.titulo));
    seccion.parrafos.forEach((parrafo, j) =>
      en.push(bloqueTexto(`${prefijo}-p${i}-${j}`, 'normal', parrafo)),
    );
  });
  return { en };
}

/** Minutos de lectura a partir del cuerpo, igual que la consulta GROQ (~1000 caracteres/min). */
function tiempoLecturaDe(secciones: SeccionArticulo[]): number {
  const caracteres = secciones
    .flatMap((s) => [s.titulo, ...s.parrafos])
    .filter((t): t is string => Boolean(t))
    .join(' ').length;
  return caracteres > 1000 ? Math.round(caracteres / 1000) : 1;
}

interface DatosArticulo {
  slug: string;
  titulo: string;
  extracto: string;
  fecha: string;
  secciones: SeccionArticulo[];
}

const ARTICULOS: DatosArticulo[] = [
  {
    slug: 'why-yucatan-for-a-destination-wedding',
    titulo: 'Why Yucatán for a Destination Wedding?',
    extracto:
      'Historic architecture, living culture, remarkable landscapes and a distinctive sense of place make Yucatán more than a setting for a wedding — they make it part of the celebration.',
    fecha: '2026-09-29',
    secciones: [
      {
        parrafos: [
          'There are destinations you choose because they are beautiful.',
          'And then there are destinations that become part of the story.',
          'Yucatán belongs to the latter.',
          "Here, a destination wedding can unfold across centuries-old architecture, tropical gardens and the streets of Mérida. Guests can discover cenotes, encounter Maya heritage, experience one of Mexico's most distinctive regional cuisines and spend several days exploring a place with an identity entirely its own.",
          'The result is something larger than a wedding away from home.',
          'It is an opportunity to create a celebration that could only happen here.',
        ],
      },
      {
        titulo: 'A Sense of Place You Can Feel',
        parrafos: [
          'Yucatán carries its history visibly.',
          "Maya heritage remains an essential part of the region's cultural identity, while later periods introduced haciendas, colonial architecture and historic towns that have shaped another layer of its landscape.",
          'Those worlds coexist throughout the destination.',
          'For a wedding, that means the surroundings do much more than provide a backdrop. Architecture, vegetation, materials, light and history can become part of the atmosphere before a single design element is introduced.',
          'The destination already has a point of view.',
        ],
      },
      {
        titulo: 'Haciendas Made for More Than a Single Moment',
        parrafos: [
          'Few settings are as closely associated with celebrations in Yucatán as its historic haciendas.',
          "Once connected to the agricultural and henequen history of the region, many of these properties have been restored and given new life. Across Yucatán, haciendas remain an important part of the state's architectural landscape.",
          'What makes them especially interesting for weddings is not simply their beauty, but the variety of spaces they can contain.',
          'Gardens, courtyards, terraces, historic interiors and open-air areas allow a celebration to evolve throughout the property rather than remain in a single room.',
          'A ceremony can feel completely different from dinner.',
          'Dinner can transform into dancing.',
          'And guests can discover the venue gradually as the celebration unfolds.',
        ],
      },
      {
        titulo: 'A Destination Beyond the Wedding Day',
        parrafos: [
          "One of Yucatán's greatest advantages is everything that can happen around the wedding itself.",
          "Guests can spend time in Mérida, explore archaeological sites, swim in cenotes, visit historic towns, discover the Yucatecan coast or experience the landscapes surrounding the state's haciendas. Yucatán's official tourism resources highlight this combination of Maya archaeological heritage, cenotes, historic towns, coastline, gastronomy and haciendas throughout the state.",
          'That changes the way a destination wedding can be planned.',
          'Instead of asking guests to travel for a single evening, couples can build an entire wedding weekend around the destination.',
          'A welcome gathering might introduce everyone to Mérida.',
          'The following day might be intentionally unstructured, giving guests time to explore.',
          'The wedding can take place somewhere entirely different.',
          'And the weekend can end over a relaxed meal before everyone travels home.',
          'The celebration becomes part of the journey rather than the only reason for it.',
        ],
      },
      {
        titulo: 'Food Is Part of the Destination',
        parrafos: [
          'To understand Yucatán, you have to taste it.',
          'Achiote, sour orange, habanero, pumpkin seed, corn and other regional ingredients form part of a culinary tradition shaped by Maya heritage and centuries of cultural exchange. Dishes such as cochinita pibil, sopa de lima, queso relleno and panuchos are among the expressions of that identity.',
          'That gives couples another way to connect their celebration to the destination.',
          'Food does not have to exist separately from the story of the wedding. A menu, welcome dinner or informal gathering can become an introduction to Yucatán itself.',
          "Mérida's culinary identity has also received international recognition: the city joined UNESCO's Creative Cities Network in the field of gastronomy in 2019.",
          'For guests arriving from somewhere else, the wedding weekend can therefore become a culinary experience as much as a celebration.',
        ],
      },
      {
        titulo: 'Nature Changes the Experience',
        parrafos: [
          'Beyond its architecture and cities, Yucatán has another defining element: its natural landscape.',
          "Cenotes are among the region's most distinctive features. The state's tourism authority describes thousands of registered cenotes across Yucatán, formed within the peninsula's limestone landscape.",
          'There is also the Gulf Coast, tropical vegetation and a landscape that changes considerably as you travel across the state.',
          'Not every part of that landscape needs to become a wedding venue.',
          'Sometimes its greatest value is simply giving guests something extraordinary to discover while they are here.',
          'A swim in a cenote, a day exploring the region or an afternoon near the coast can become as much a part of the memory of the weekend as the wedding itself.',
        ],
      },
      {
        titulo: 'Mérida Gives the Celebration a Center',
        parrafos: [
          'At the heart of many Yucatán wedding weekends is Mérida.',
          'The city gives guests a place to arrive, stay, eat, walk and experience the destination before venturing farther into the state.',
          'Its historic center, cultural life, architecture and culinary scene make it more than a logistical base. Mérida maintains an active calendar of cultural traditions and events alongside museums, public spaces, gastronomy and historic architecture.',
          'That creates an interesting balance for destination weddings.',
          'Couples can celebrate in a setting that feels removed from the city while still building other parts of the weekend around an urban destination with its own identity.',
        ],
      },
      {
        titulo: 'The Luxury of Experiencing Somewhere Different',
        parrafos: [
          'What makes Yucatán compelling is not one venue, one landscape or one type of celebration.',
          'It is the combination.',
          'Historic architecture and contemporary hospitality.',
          'Maya heritage and modern creative talent.',
          'Cities and haciendas.',
          'Cenotes and coastline.',
          'Traditional flavors and contemporary kitchens.',
          'Celebrations here have the opportunity to draw from all of them without losing the character of the destination.',
          'And perhaps that is the most important reason to choose Yucatán.',
          'A destination wedding should feel like more than transporting a wedding to another location.',
          'It should give people the feeling that they have arrived somewhere.',
          'In Yucatán, the destination becomes part of the celebration.',
        ],
      },
    ],
  },
  {
    slug: 'the-wedding-planners-guide-to-merida',
    titulo: "The Wedding Planner's Guide to Mérida",
    extracto:
      "How to use Yucatán's capital as the starting point for a destination wedding weekend that feels connected to the place.",
    fecha: '2026-09-15',
    secciones: [
      {
        parrafos: [
          'For a destination wedding in Yucatán, Mérida can be much more than the city guests fly into.',
          'It can be where the celebration begins.',
          'Historic streets, distinctive architecture, regional cuisine and a strong cultural identity make the city a natural starting point for guests discovering Yucatán for the first time.',
          'And for wedding planners, Mérida can provide something equally valuable: a central base from which an entire destination experience can unfold.',
          'The key is not trying to fit everything into the itinerary.',
          'It is knowing what deserves a place in it.',
        ],
      },
      {
        titulo: 'Start the Wedding Before the Wedding',
        parrafos: [
          'When guests travel for a destination celebration, their experience begins long before the ceremony.',
          'Their first dinner, their walk through the city, the hotel they arrive at and even the first thing they taste can shape their impression of the weekend.',
          'Mérida gives planners an opportunity to make those first moments intentional.',
          'Rather than treating the city simply as the place where guests sleep before traveling to a venue, think of it as the opening chapter of the celebration.',
          'A welcome drink, dinner or relaxed gathering can introduce guests to Yucatán without immediately asking them to follow a packed itinerary.',
          'Sometimes, simply allowing them to arrive and experience the city is enough.',
        ],
      },
      {
        titulo: 'Let Mérida Be Mérida',
        parrafos: [
          'One of the easiest mistakes when planning a destination wedding is creating an experience that could have happened anywhere.',
          'Mérida already has its own visual language.',
          'Historic façades, colorful streets, traditional neighborhoods and the grand residences along Paseo de Montejo create a setting that does not need to be reinvented.',
          "The same applies to the city's culture.",
          'Instead of adding references to Yucatán simply as decoration, planners can encourage guests to experience the destination itself.',
          'Walk through the historic center.',
          'Spend an afternoon discovering its architecture.',
          'Sit down for a long dinner.',
          'Listen to the city.',
          'A strong sense of place often comes from experiencing what is already there.',
        ],
      },
      {
        titulo: 'Make Food Part of the Itinerary',
        parrafos: [
          'In Yucatán, food deserves more than a passing mention.',
          'Cochinita pibil, sopa de lima, panuchos, salbutes, relleno negro and other regional dishes are part of a culinary identity shaped over generations.',
          'For a wedding weekend, gastronomy can become one of the easiest ways to introduce guests to the destination.',
          'That does not mean every meal needs to become an organized event.',
          'One evening might be carefully planned for the entire group, while another afternoon can be left open for guests to explore on their own.',
          'The goal is not to keep everyone constantly entertained.',
          'It is to give them reasons to remember where they are.',
        ],
      },
      {
        titulo: 'Think Beyond a Single Venue',
        parrafos: [
          'Mérida can be the center of the weekend without being the setting for every part of it.',
          'That is one of the advantages of celebrating in Yucatán.',
          'The region offers archaeological sites, cenotes, historic towns and the Yucatecan coast as possible experiences before or after the wedding.',
          'A couple might welcome guests in Mérida and celebrate the wedding elsewhere.',
          'Others might build an optional excursion into the itinerary.',
          'And some may simply provide recommendations and allow guests to decide how much they want to explore.',
          'Not every guest needs to do everything.',
          'A destination wedding should still leave room for discovery.',
        ],
      },
      {
        titulo: 'Treat Transportation as Part of the Guest Experience',
        parrafos: [
          'Once different locations enter the itinerary, transportation becomes part of the planning.',
          'Many celebrations take place outside central Mérida, which means moving a group between hotels, venues and activities requires coordination.',
          'For guests unfamiliar with the destination, clear transportation can make the weekend feel effortless.',
          'Keep meeting points simple.',
          'Communicate departure times clearly.',
          'Avoid creating unnecessary movements between locations.',
          'And when group transportation makes sense, organize it rather than expecting every guest to navigate independently.',
          "Good logistics should almost disappear from the guest's perspective.",
        ],
      },
      {
        titulo: 'Design Around the Climate, Not Against It',
        parrafos: [
          "Yucatán's climate should influence the rhythm of the celebration.",
          'Heat, humidity and seasonal rain can affect outdoor ceremonies, guest transportation, photography, dining and the amount of time people are comfortable spending outside. The cooler months toward the end and beginning of the year are particularly favorable for outdoor celebrations, while the warmer and rainier months require more careful contingency planning.',
          'That does not mean every moment needs to move indoors.',
          'It means planners should consider shade, hydration, timing and a genuine weather alternative from the beginning.',
          'A Plan B works best when it feels like another version of the celebration — not an emergency solution.',
        ],
      },
      {
        titulo: 'Give Guests Time to Experience the Destination',
        parrafos: [
          'It can be tempting to fill every hour because everyone has traveled so far.',
          'Resist that instinct.',
          'Guests may want to explore Mérida, visit a cenote, spend time at their hotel, discover local food or simply recover between celebrations.',
          'A thoughtful wedding weekend has rhythm.',
          'There are moments when everyone comes together and moments when people are free to experience Yucatán in their own way.',
          'That breathing room can make the organized moments feel even more special.',
        ],
      },
      {
        titulo: 'Use Local Knowledge',
        parrafos: [
          'For planners coming from outside Yucatán, local collaborators are particularly valuable.',
          'They understand the distances, weather, venues, transportation, suppliers and realities of producing events in the region.',
          'That knowledge can also help distinguish between something that looks beautiful on paper and something that actually works on the ground.',
          'The strongest destination weddings rarely feel imported into a place.',
          'They are created through collaboration with it.',
        ],
      },
      {
        titulo: 'Build a Weekend, Not Just a Timeline',
        parrafos: [
          'Ultimately, planning a destination wedding in Mérida is not about creating the longest possible itinerary.',
          'It is about creating continuity.',
          'Arrival.',
          'Discovery.',
          'Celebration.',
          'Time together.',
          'And eventually, departure.',
          'Mérida can connect those moments while allowing the wedding itself to take guests somewhere completely different within Yucatán.',
          'For a planner, that is the opportunity.',
          "Don't simply bring a wedding to Mérida. Let Mérida shape the way the wedding weekend is experienced.",
        ],
      },
    ],
  },
  {
    slug: 'how-to-build-a-wedding-weekend-in-yucatan',
    titulo: 'How to Build a Wedding Weekend in Yucatán',
    extracto:
      'A destination wedding can be more than a single celebration. In Yucatán, the days around it can become part of the story.',
    fecha: '2026-09-20',
    secciones: [
      {
        parrafos: [
          'When guests travel hundreds or thousands of miles for a wedding, the experience rarely begins at the ceremony.',
          'It begins when they arrive.',
          'The first walk through Mérida. The first dinner together. The first taste of Yucatán. The conversations that happen before everyone is dressed for the main event.',
          'That is the opportunity of a destination wedding weekend: turning a wedding day into a collection of moments that allow people to celebrate, discover and spend meaningful time together.',
          'In Yucatán, there is no shortage of possibilities.',
          'The challenge is knowing how much is enough.',
        ],
      },
      {
        titulo: 'Day One: Let Everyone Arrive',
        parrafos: [
          'The first day does not need to impress anyone.',
          'Guests have traveled, checked into hotels and adjusted to a new destination. Give them time to settle in.',
          'Later, bring everyone together in a way that feels easy.',
          'A welcome cocktail or dinner can be the first introduction to Yucatán through food, architecture, music or simply the atmosphere of the setting.',
          'Regional dishes such as cochinita pibil, papadzules, poc chuc or relleno negro can introduce guests to flavors they may never have experienced before.',
          'But the goal is not to create a second wedding reception.',
          'It is simply to say: you made it. Welcome to Yucatán.',
        ],
      },
      {
        titulo: 'Day Two: Give Them Something to Discover',
        parrafos: [
          'The day before the wedding is where destination weddings become especially interesting.',
          'Some couples may want to organize an experience for everyone. Others may prefer to give guests a list of possibilities and let them explore independently.',
          'Both can work.',
          'Around Mérida, the options range from cenotes and historic haciendas to archaeological sites, traditional towns, coastal experiences and cultural activities.',
          "Inside the city, guests can explore the Historic Center, discover Yucatecan gastronomy or experience Mérida's cultural life.",
          'The important thing is not to turn the weekend into a checklist.',
          'Choose experiences because they reveal something about the destination, not because every available hour needs to be filled.',
        ],
      },
      {
        titulo: 'Think About Distance Before Adding Another Experience',
        parrafos: [
          'Something can be extraordinary and still not belong in your wedding weekend.',
          'Yucatán is larger than it appears on an itinerary.',
          'Some of its most recognizable destinations can require several hours of travel from Mérida, while other experiences are considerably closer to the city.',
          'That matters when guests may already be traveling between their hotel, welcome event and wedding venue.',
          'Before adding an excursion, ask a simple question: is the experience worth the time it asks from our guests?',
          'Sometimes the answer will absolutely be yes.',
          'Other times, a slower afternoon in Mérida or time by the pool will be more valuable than another destination crossed off a list.',
        ],
      },
      {
        titulo: 'The Wedding Day: Make Space for the Main Event',
        parrafos: [
          'On the wedding day, resist the temptation to add too much.',
          'This is the center of the weekend.',
          'Give guests enough time to rest, get ready and arrive without feeling rushed.',
          'And if the celebration takes place outside Mérida, transportation should feel effortless from their perspective.',
          'The wedding itself can then reveal another side of Yucatán.',
          'A historic property, garden or architectural setting can feel completely different from the city guests experienced during the previous days.',
          'That contrast is part of what makes a destination celebration memorable.',
          'Each moment can reveal a different side of the same place.',
        ],
      },
      {
        titulo: 'Let the Destination Influence the Celebration',
        parrafos: [
          'Celebrating in Yucatán does not mean every detail needs to announce that you are in Yucatán.',
          'Often, the most meaningful connections to place are quieter.',
          'A regional ingredient. A locally made object. A traditional cooking technique. A piece created by an artisan. An experience led by someone who carries the knowledge behind it.',
          'Yucatán offers community-based experiences around traditional cooking, textiles, henequen craftsmanship and meliponiculture, among others.',
          'When local culture becomes part of a wedding weekend, the objective should not be to turn tradition into decoration.',
          'It should be to engage with the people, knowledge and stories behind it.',
        ],
      },
      {
        titulo: 'The Morning After: Keep It Easy',
        parrafos: [
          'The day after a wedding has a completely different energy.',
          'Let it.',
          'A relaxed brunch, time around a pool or an informal meal gives everyone a chance to reconnect before departures begin. Outdoor brunches, relaxed pool gatherings and wellness experiences are among the possibilities for a post-wedding day.',
          'This does not need the same production level as the wedding.',
          'In fact, it probably should not.',
          'The best farewell moments often feel effortless: good food, comfortable surroundings and enough time to talk about everything that happened the night before.',
        ],
      },
      {
        titulo: 'Leave Something Unplanned',
        parrafos: [
          'Perhaps the most important part of building a wedding weekend is knowing when to stop planning.',
          'Guests need time to sleep. To wander. To have lunch somewhere they discovered themselves. To stay longer at the pool. To change their plans. To experience Yucatán without an itinerary telling them what comes next.',
          'A wedding weekend should have rhythm, not constant programming.',
          'Think in terms of a few anchors — arrival, welcome, celebration and farewell — and allow space to exist between them.',
        ],
      },
      {
        titulo: 'Create a Weekend People Remember as a Journey',
        parrafos: [
          'Years later, guests may not remember every activity on the itinerary.',
          'But they may remember walking through Mérida for the first time.',
          'The dinner where everyone finally arrived. The heat of the afternoon before the wedding. The road to the venue. A flavor they had never tasted. The morning after, when nobody wanted the weekend to end.',
          'That is what a destination wedding can become when the destination is given enough room to be experienced.',
          "Don't simply plan several events around a wedding. Create a reason to remember the entire journey.",
        ],
      },
    ],
  },
  {
    slug: 'best-time-to-get-married-in-yucatan',
    titulo: 'When Is the Best Time to Get Married in Yucatán?',
    extracto:
      'From cooler winter evenings to dramatic summer skies, every season changes the way a celebration in Yucatán feels.',
    fecha: '2026-09-25',
    secciones: [
      {
        parrafos: [
          'There is no single perfect month to get married in Yucatán. There is, however, a season that may be better suited to the celebration you have in mind.',
          'Weather affects much more than whether it rains. It can influence ceremony times, outdoor dinners, photography, guest comfort, transportation and even the way a venue is experienced throughout the day. So instead of asking only when is the best time to get married in Yucatán, it is worth considering what you actually want your wedding to feel like.',
        ],
      },
      {
        titulo: 'December to February: Cooler Days and Outdoor Celebrations',
        parrafos: [
          "Winter brings some of Yucatán's most comfortable conditions. Days tend to be sunny without the intensity of the warmer months, evenings feel cooler and rain is generally uncommon.",
          'For celebrations centered around gardens, courtyards and other outdoor spaces, this can make a significant difference. Guests can spend more time outside comfortably, and dinners or receptions can move naturally into the evening without heat becoming as dominant a consideration.',
          'There is a trade-off. These months — particularly December — are highly sought after, which means desirable dates and venues may need to be secured considerably earlier. If cooler weather is a priority, planning ahead matters.',
        ],
      },
      {
        titulo: 'March to May: Beautiful Light, Rising Heat',
        parrafos: [
          'Spring brings abundant daylight and a relatively low probability of rain, but it also marks the transition into significantly warmer weather. By April and May, heat can become one of the defining factors of an outdoor celebration.',
          'That does not necessarily mean avoiding these months. It means designing around them. Ceremony timing, shade, hydration and ventilation become increasingly important, and asking guests to spend long periods outdoors during the hottest part of the day may not create the experience you intended.',
          'This is also where the architecture of a venue can become particularly valuable. Covered spaces, interior rooms, terraces and shaded areas can allow the celebration to move with the conditions rather than fight against them.',
        ],
      },
      {
        titulo: 'June to September: Rain, Humidity and a Different Kind of Beauty',
        parrafos: [
          'Summer introduces another side of Yucatán. The weather becomes hotter and more humid, while the rainy season brings a greater possibility of intense afternoon showers. But a rainy season does not necessarily mean entire days of rain. Showers can arrive intensely and then clear, leaving behind saturated vegetation and a completely different atmosphere.',
          'For photography, those changing conditions can sometimes create beautiful moments. For production, however, they require preparation. A rain plan during these months should never be an afterthought.',
          'If the ceremony, cocktail hour or dinner is planned outdoors, there should already be an alternative that works aesthetically and logistically before the wedding day arrives. The objective is not simply to have somewhere to move people if it rains; the alternative should still feel like part of the wedding rather than an emergency solution.',
        ],
      },
      {
        titulo: 'October to November: The Transition Into High Season',
        parrafos: [
          'By autumn, conditions begin to shift again. Rain becomes less dominant, temperatures gradually become more comfortable and November moves into one of the most sought-after periods for celebrations.',
          'For couples imagining a wedding that uses outdoor spaces extensively, this transition can be particularly appealing. It also means increased demand, and as the more comfortable season begins, availability can become more competitive.',
          "October can still sit closer to the transition from the rainy season, while November begins to offer more of the conditions associated with Yucatán's cooler months. For couples considering this period, securing the venue and key vendors well in advance becomes increasingly important.",
        ],
      },
      {
        titulo: 'What About Hurricane Season?',
        parrafos: [
          'For anyone planning a destination wedding near the Gulf of Mexico or Caribbean, hurricane season deserves to be understood rather than ignored. The official Atlantic hurricane season runs from June 1 through November 30.',
          'That does not mean a hurricane is expected simply because a wedding falls within those dates. It does mean weather monitoring and contingency planning become especially important during that period.',
          "For couples and planners, the practical response is preparation: understand the venue's weather protocols, discuss alternative spaces, consider transportation implications and establish how decisions would be made if severe weather affected the destination. The purpose is not to plan around fear, but to avoid planning without a backup.",
        ],
      },
      {
        titulo: 'Think About the Time of Day, Not Only the Month',
        parrafos: [
          "Choosing a date is only part of the equation. The same venue can feel completely different at midday and in the early evening, particularly during Yucatán's warmer months.",
          'Shifting a ceremony later in the day can change guest comfort significantly, while cooler periods may allow more of the celebration to take place outdoors. Light also changes the character of a space throughout the day, affecting everything from photography to how different areas of the venue are experienced.',
          'When visiting a venue, do not only ask where the ceremony or dinner will happen. Consider when those spaces will be used, where shade naturally falls and how guests will move through the property as conditions change.',
        ],
      },
      {
        titulo: 'Let the Season Influence the Design',
        parrafos: [
          'Weather does not only create limitations; it can also create direction. A celebration during a warmer period might prioritize shaded spaces, later ceremonies and an easy transition between indoor and outdoor environments, while a winter wedding might take greater advantage of gardens and open-air dining.',
          'A celebration during the greener months may also experience the landscape differently than one taking place during the drier part of the year. Rather than trying to make every season behave the same way, the stronger approach is to design a celebration that makes sense for the conditions you chose.',
        ],
      },
      {
        titulo: 'So, When Should You Get Married in Yucatán?',
        parrafos: [
          'If comfortable outdoor weather is the priority, the cooler months are naturally appealing. If abundant daylight matters more, spring brings different possibilities along with considerably warmer conditions. If you are comfortable building a strong rain plan and adapting to heat and humidity, summer offers another version of the destination, while autumn marks the transition toward cooler conditions and the beginning of a more sought-after period.',
          'There is no date that guarantees perfect weather. The better question is which conditions fit the celebration you imagine and how prepared you are to design around them.',
          'The best season for a wedding in Yucatán is not simply the one with the best forecast. It is the one you are prepared to celebrate well.',
        ],
      },
    ],
  },
  {
    slug: '10-things-to-know-before-planning-a-hacienda-wedding-in-yucatan',
    titulo: '10 Things to Know Before Planning a Hacienda Wedding in Yucatán',
    extracto:
      "From weather plans to creative direction, the details worth considering when turning one of Yucatán's historic estates into the setting for a destination celebration.",
    fecha: '2026-09-27',
    secciones: [
      {
        parrafos: [
          'There is something unmistakable about a hacienda wedding in Yucatán.',
          'The late-afternoon light. Centuries-old stone walls. Tropical gardens and open courtyards. Spaces shaped by history that take on an entirely new life when filled with people, music and celebration.',
          'But the beauty of these places comes with a reality worth understanding: a hacienda wedding is not simply an event placed inside a beautiful venue.',
          'It is a production shaped by architecture, climate, logistics and dozens of decisions made long before the first guest arrives.',
          'Here are ten things worth knowing before you begin.',
        ],
      },
      {
        titulo: '1. Start With How You Want the Celebration to Feel',
        parrafos: [
          'Before choosing flowers, furniture or a color palette, define the atmosphere you want to create.',
          'What should your guests feel when they arrive? What moments matter most to you? What feels completely unlike you?',
          'A clear creative direction gives every later decision a purpose and helps your planner, designer and vendors build something that feels personal rather than predetermined.',
        ],
      },
      {
        titulo: '2. Bring Inspiration, Not a Formula',
        parrafos: [
          "Pinterest boards and saved photographs are useful references, but the goal does not have to be recreating someone else's wedding.",
          'Share the images, places, memories, music and experiences you are drawn to.',
          'Sometimes the most meaningful creative direction begins with something that has nothing to do with weddings at all.',
        ],
      },
      {
        titulo: '3. Destination Planning Depends on Communication',
        parrafos: [
          'Planning from another city or country means many decisions will happen remotely.',
          'Clear communication and timely approvals help the entire team move together, particularly when several local vendors are involved.',
          'The smoother the decision-making process is behind the scenes, the more room there is for creativity.',
        ],
      },
      {
        titulo: '4. Make the Big Decisions Early',
        parrafos: [
          'A new idea two weeks before the wedding may appear simple but can affect production, rentals, florals, staffing, transportation or other elements already in motion.',
          'There will always be final adjustments.',
          'The important thing is to make the decisions that define the celebration early enough for the team to execute them properly — and then trust the choices you made.',
        ],
      },
      {
        titulo: "5. Understand What the Venue Does — and Doesn't — Provide",
        parrafos: [
          'A spectacular setting is only one part of the experience.',
          'Depending on the property and the celebration you envision, additional elements may include furniture, lighting, sound, florals, catering, production and coordination.',
          'Understanding what is included from the beginning makes it much easier to establish priorities and build a realistic budget around them.',
        ],
      },
      {
        titulo: '6. Choose a Planner Who Understands the Destination',
        parrafos: [
          'For a destination wedding, local knowledge matters.',
          'Your planner is not simply managing a schedule. They are coordinating venues, vendors, timing, guest logistics and countless details that may be unfamiliar when planning from abroad.',
          'Give them context, communicate what matters to you and allow their knowledge of the destination to become part of the process.',
        ],
      },
      {
        titulo: '7. Decide Who Makes the Final Call',
        parrafos: [
          'Destination weddings often involve families, friends and many opinions.',
          'That can be wonderful — until every decision requires consensus.',
          'Establish early who has the final say on creative and logistical decisions. It keeps the process moving and helps the celebration maintain a coherent point of view.',
        ],
      },
      {
        titulo: '8. Give the Creative Process Room to Work',
        parrafos: [
          'Thoughtful proposals take time.',
          'Designing for a historic property requires understanding the architecture, scale and existing character of the venue before adding anything to it.',
          'Rather than searching endlessly for more options, give the people you selected enough information — and enough trust — to develop an idea with intention.',
        ],
      },
      {
        titulo: '9. Always Have a Weather Plan',
        parrafos: [
          'When much of a celebration takes place outdoors, weather has to be part of the conversation.',
          'Discuss the alternative plan early with your venue and planning team rather than treating it as a last-minute contingency.',
          'A thoughtful Plan B should not feel like the lesser version of the wedding. It should feel like another considered version of the same celebration.',
        ],
      },
      {
        titulo: '10. Remember the People Behind the Celebration',
        parrafos: [
          'A destination wedding brings together far more people than guests can usually see.',
          'Planners, chefs, servers, florists, designers, photographers, production teams and venue staff all contribute to what ultimately feels effortless.',
          'The best celebrations are built through collaboration.',
          'And appreciation — during the process and after it — matters.',
        ],
      },
      {
        titulo: 'One More Thing: Let the Hacienda Be Part of the Story',
        parrafos: [
          'A hacienda is not simply a backdrop.',
          'Its architecture, gardens, textures and history already give the celebration a sense of place. The strongest designs do not compete with that character; they respond to it.',
          'That is what makes celebrating in Yucatán different.',
          'You are not simply choosing where your wedding will happen.',
          'You are choosing a place that becomes part of how the story is remembered.',
        ],
      },
    ],
  },
  {
    slug: 'the-case-for-an-intimate-wedding-in-yucatan',
    titulo: 'The Case for an Intimate Wedding in Yucatán',
    extracto:
      'Why a smaller guest list can create more room for place, design and meaningful experiences.',
    fecha: '2026-09-10',
    secciones: [
      {
        parrafos: [
          'For years, weddings seemed to move in one direction: bigger guest lists, larger productions and more elaborate celebrations.',
          'But a memorable wedding does not have to be defined by scale.',
          'For some couples, celebrating with fewer people creates something entirely different: more time together, more attention to detail and more freedom to shape the experience around the people who matter most.',
          'And in Yucatán, where historic architecture, gardens, gastronomy and a strong sense of place can become part of the celebration itself, intimacy can completely change the way a destination wedding is experienced.',
        ],
      },
      {
        titulo: "Smaller Doesn't Mean Simpler",
        parrafos: [
          'An intimate wedding is not simply a traditional wedding with fewer chairs.',
          'The guest list may be smaller, but the experience can be just as considered — and sometimes even more detailed.',
          'With fewer people to accommodate, couples may have greater flexibility to think about how guests move through the celebration, where they gather, what they eat and how each part of the day feels.',
          'Instead of asking how to fill a large space, the question becomes more personal: how do we want to experience this day with the people we invited?',
          'That shift can influence everything from the venue to the dinner format.',
        ],
      },
      {
        titulo: 'More Room for the Guest Experience',
        parrafos: [
          'Destination weddings already create something unusual: guests are not simply attending an event. They are traveling somewhere to experience it.',
          'With a smaller group, that experience can become even more connected.',
          'A welcome dinner can feel like one long table rather than a formal reception. A gathering can move naturally between different areas of a property. Meals can become longer, conversations less rushed and the weekend itself more intentional.',
          'The celebration begins to feel less like a single event and more like time spent together in a destination.',
        ],
      },
      {
        titulo: 'Yucatán Offers a Different Kind of Setting',
        parrafos: [
          'One of the most interesting things about planning an intimate wedding in Yucatán is the variety of environments available.',
          'A celebration might unfold within the courtyard of a historic hacienda, beneath tropical vegetation, inside a restored architectural space or around a table surrounded by centuries-old walls.',
          'With fewer guests, couples may also be able to consider spaces differently.',
          'A courtyard that might serve as only one moment of a large wedding could become the setting for an entire dinner. A garden can feel more immersive. Architectural details that might disappear within a large production can become part of the experience.',
          'The venue does not need to be filled simply because the space exists.',
          'Sometimes, allowing a place to breathe is part of the design.',
        ],
      },
      {
        titulo: 'Design Can Become More Personal',
        parrafos: [
          'A smaller celebration does not necessarily mean less design.',
          'It can mean designing differently.',
          'Rather than spreading the creative budget across hundreds of guests, couples may choose to concentrate on elements that matter most to them: a beautifully considered table, exceptional lighting, custom details, flowers, furniture or a dining experience that would be difficult to reproduce at a much larger scale.',
          'The objective is not to add more.',
          'It is to make each decision matter.',
          'And because the celebration is more intimate, guests are often physically closer to those details. They experience the textures, objects, food and atmosphere from a different perspective.',
        ],
      },
      {
        titulo: 'Food Becomes Part of the Story',
        parrafos: [
          'In Yucatán, an intimate celebration also creates an opportunity to make gastronomy a larger part of the experience.',
          'Instead of treating dinner simply as one step in the wedding timeline, it can become one of the central moments of the evening.',
          'Local ingredients, regional flavors and thoughtful menus can introduce guests to the destination through something they experience together.',
          'For couples traveling to Yucatán to celebrate, that sense of place can be just as memorable as the setting itself.',
        ],
      },
      {
        titulo: 'Intimacy Creates Different Possibilities',
        parrafos: [
          'A smaller guest list can also change what is possible beyond the wedding day.',
          'A destination celebration might include a welcome gathering, an afternoon exploring Mérida, a shared meal, a relaxed morning after the wedding or another experience designed specifically for the group.',
          'These moments do not need to be extravagant.',
          'Their value comes from giving people time together.',
          'And that may be one of the strongest arguments for an intimate destination wedding: rather than concentrating everything into a few hours, the celebration can become a collection of experiences shared over several days.',
        ],
      },
      {
        titulo: 'But Intimate Still Requires Planning',
        parrafos: [
          'Fewer guests do not automatically mean fewer decisions.',
          'Venue logistics, weather considerations, transportation, catering, production and guest experience still matter. In some cases, an intimate wedding may involve just as much attention to detail as a much larger celebration.',
          'The difference is where that attention is directed.',
          'Instead of designing around scale, couples can design around experience.',
        ],
      },
      {
        titulo: 'A Celebration Defined by Intention',
        parrafos: [
          'There is no ideal number of guests and no single format that makes a wedding meaningful.',
          'For some couples, celebrating with hundreds of people is exactly what feels right.',
          'For others, the most memorable version of the day may be sharing one extraordinary place with a much smaller circle.',
          'That is what makes intimate weddings interesting.',
          'They are not necessarily about doing less.',
          'They are about deciding what deserves more.',
        ],
      },
    ],
  },
];

export const articulosDemo: Articulo[] = ARTICULOS.map((a, i) => ({
  _id: `articulo-${a.slug}`,
  _type: 'articulo',
  // Sin `es`: todavía no hay traducción y el sitio debe mostrar el aviso real de que
  // falta (localizar(), D-008), no un texto en inglés disfrazado de español.
  titulo: { en: a.titulo },
  slug: a.slug,
  // La portada sigue siendo una foto de relleno: el documento no trae fotografías por artículo.
  imagenPortada: imagenDemo(
    `articulo-${i + 1}.jpg`,
    ...HORIZONTAL,
    `[DEMO] Placeholder photo for "${a.titulo}"`,
    `[DEMO] Foto de relleno para «${a.titulo}»`,
  ),
  extracto: { en: a.extracto },
  fechaPublicacion: a.fecha,
  tiempoLectura: tiempoLecturaDe(a.secciones),
  cuerpo: cuerpoArticulo(`articulo-${i + 1}`, a.secciones),
}));

// --- Páginas editoriales -------------------------------------------------------------------

// Preguntas del documento de estructura (sección 12); las respuestas son [DEMO].
const PREGUNTAS_NOSOTROS: Array<[en: string, es: string]> = [
  ['What is Curated Yucatán?', '¿Qué es Curated Yucatán?'],
  ['Why does it exist?', '¿Por qué existe?'],
  ['Who is it for?', '¿Para quién fue creado?'],
  ['What problem does it solve?', '¿Qué problema resuelve?'],
  [
    'How does it help an international wedding professional?',
    '¿Cómo ayuda a un wedding professional internacional?',
  ],
];

export const paginasDemo: PaginaEditorial[] = [
  {
    _id: 'pagina-nosotros',
    _type: 'paginaEditorial',
    titulo: texto('About Curated', 'Nosotros'),
    entradilla: texto(
      '[DEMO] Yucatán is the protagonist. Curated is the guide. Sample introduction.',
      '[DEMO] Yucatán es el protagonista. Curated es la guía. Entradilla de ejemplo.',
    ),
    imagen: imagenDemo(
      'nosotros.jpg',
      ...HORIZONTAL,
      '[DEMO] Placeholder photo for About Curated',
      '[DEMO] Foto de relleno para Nosotros',
    ),
    secciones: [
      ...PREGUNTAS_NOSOTROS.map(([en, es], i) => ({
        _type: 'seccionTexto' as const,
        _key: `pregunta-${i + 1}`,
        titulo: texto(en, es),
        texto: bloques(
          `nosotros-${i + 1}`,
          ['[DEMO] Sample answer in one or two short paragraphs.'],
          ['[DEMO] Respuesta de ejemplo en uno o dos párrafos cortos.'],
        ),
      })),
      {
        _type: 'seccionTexto',
        _key: 'minimal',
        titulo: texto('Curated and Minimal', 'Curated y Minimal'),
        texto: bloques(
          'nosotros-minimal',
          [
            '[DEMO] Sample text explaining, with transparency, that Minimal takes part as Curated Partner in Design & Production.',
          ],
          [
            '[DEMO] Texto de ejemplo que explica con transparencia que Minimal participa como Curated Partner en Design & Production.',
          ],
        ),
      },
      {
        _type: 'seccionLlamado',
        _key: 'llamado',
        titulo: texto('Start planning with Curated', 'Empieza a planear con Curated'),
        texto: texto(
          '[DEMO] Tell us about your event and we will connect you with the right places and partners.',
          '[DEMO] Cuéntanos de tu evento y te conectamos con los lugares y aliados adecuados.',
        ),
        destino: 'planea-tu-evento',
      },
    ],
  },
  {
    _id: 'pagina-privacidad',
    _type: 'paginaEditorial',
    titulo: texto('Privacy notice', 'Aviso de privacidad'),
    secciones: [
      {
        _type: 'seccionTexto',
        _key: 'pendiente',
        texto: bloques(
          'privacidad',
          [
            '[PENDIENTE] The legal text of the privacy notice will be provided by the project owner.',
          ],
          [
            '[PENDIENTE] El texto legal del aviso de privacidad lo proporcionará el responsable del proyecto.',
          ],
        ),
      },
    ],
  },
];
