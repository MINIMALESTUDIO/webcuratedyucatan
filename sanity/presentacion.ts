import {
  defineDocuments,
  defineLocations,
  type PresentationPluginOptions,
} from 'sanity/presentation';

/*
 * Relación entre documentos y páginas del sitio para la herramienta Presentation
 * ("Editar en la página"): qué documento se edita en cada URL y en qué URLs aparece cada
 * documento. El inglés va sin prefijo y el español con /es; varias rutas se traducen (D-038).
 */

type Ruta = { en: string; es: string };

const enAmbosIdiomas = (titulo: string, ruta: Ruta) => [
  { title: `${titulo} (EN)`, href: ruta.en },
  { title: `${titulo} (ES)`, href: ruta.es },
];

const RUTAS = {
  inicio: { en: '/', es: '/es' },
  descubre: { en: '/discover-yucatan', es: '/es/descubre-yucatan' },
  venues: { en: '/venues', es: '/es/venues' },
  catering: { en: '/catering', es: '/es/catering' },
  fotografia: { en: '/photography', es: '/es/fotografia' },
  diseno: { en: '/design-production', es: '/es/diseno-y-produccion' },
  journal: { en: '/journal', es: '/es/journal' },
  encuentra: { en: '/find-your-yucatan', es: '/es/encuentra-tu-yucatan' },
  nosotros: { en: '/about', es: '/es/nosotros' },
  privacidad: { en: '/privacy', es: '/es/privacidad' },
} satisfies Record<string, Ruta>;

/** Rutas en ambos idiomas para un filtro GROQ. */
const ambas = (ruta: Ruta, filtro: string) => [
  { route: ruta.en, filter: filtro },
  { route: ruta.es, filter: filtro },
];

export const resolverPresentacion: PresentationPluginOptions['resolve'] = {
  mainDocuments: defineDocuments([
    ...ambas(RUTAS.inicio, `_id == "configuracionSitio"`),
    ...ambas(RUTAS.descubre, `_id == "descubreYucatan"`),
    ...ambas(RUTAS.diseno, `_id == "disenoProduccion"`),
    ...ambas(RUTAS.nosotros, `_id == "pagina-nosotros"`),
    ...ambas(RUTAS.privacidad, `_id == "pagina-privacidad"`),
    ...ambas(
      { en: '/venues/:slug', es: '/es/venues/:slug' },
      `_type == "venue" && slug.current == $slug`,
    ),
    ...ambas(
      { en: '/catering/:slug', es: '/es/catering/:slug' },
      `_type == "proveedor" && slug.current == $slug`,
    ),
    ...ambas(
      { en: '/photography/:slug', es: '/es/fotografia/:slug' },
      `_type == "proveedor" && slug.current == $slug`,
    ),
    ...ambas(
      { en: '/journal/:slug', es: '/es/journal/:slug' },
      `_type == "articulo" && slug.current == $slug`,
    ),
  ]),
  locations: {
    configuracionSitio: defineLocations({
      message: 'Textos y fotos del inicio',
      locations: enAmbosIdiomas('Inicio', RUTAS.inicio),
    }),
    descubreYucatan: defineLocations({
      locations: enAmbosIdiomas('Discover Yucatán', RUTAS.descubre),
    }),
    disenoProduccion: defineLocations({
      locations: enAmbosIdiomas('Design & Production', RUTAS.diseno),
    }),
    venue: defineLocations({
      select: { nombre: 'nombre', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: doc?.slug
          ? [
              ...enAmbosIdiomas(doc.nombre ?? 'Venue', {
                en: `/venues/${doc.slug}`,
                es: `/es/venues/${doc.slug}`,
              }),
              { title: 'Venues', href: RUTAS.venues.en },
            ]
          : [],
      }),
    }),
    coleccion: defineLocations({
      message: 'Ordena el listado de venues y el resultado de Find Your Yucatán',
      locations: [
        { title: 'Venues', href: RUTAS.venues.en },
        { title: 'Find your Yucatán', href: RUTAS.encuentra.en },
      ],
    }),
    region: defineLocations({
      locations: [{ title: 'Venues', href: RUTAS.venues.en }],
    }),
    proveedor: defineLocations({
      select: { nombre: 'nombre', slug: 'slug.current', tipo: 'tipo' },
      resolve: (doc) => {
        if (!doc?.slug) return { locations: [] };
        const base = doc.tipo === 'fotografia' ? RUTAS.fotografia : RUTAS.catering;
        return {
          locations: [
            ...enAmbosIdiomas(doc.nombre ?? 'Partner', {
              en: `${base.en}/${doc.slug}`,
              es: `${base.es}/${doc.slug}`,
            }),
            { title: doc.tipo === 'fotografia' ? 'Photography' : 'Catering', href: base.en },
          ],
        };
      },
    }),
    articulo: defineLocations({
      select: { titulo: 'titulo.en', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: doc?.slug
          ? [
              ...enAmbosIdiomas(doc.titulo ?? 'Artículo', {
                en: `/journal/${doc.slug}`,
                es: `/es/journal/${doc.slug}`,
              }),
              { title: 'Curated Journal', href: RUTAS.journal.en },
              { title: 'Inicio', href: RUTAS.inicio.en },
            ]
          : [],
      }),
    }),
    paginaEditorial: defineLocations({
      select: { id: '_id' },
      resolve: (doc) => {
        const id = doc?.id?.replace(/^drafts\./, '');
        if (id === 'pagina-nosotros') return { locations: enAmbosIdiomas('About', RUTAS.nosotros) };
        if (id === 'pagina-privacidad')
          return { locations: enAmbosIdiomas('Privacy', RUTAS.privacidad) };
        return { locations: [] };
      },
    }),
  },
};
