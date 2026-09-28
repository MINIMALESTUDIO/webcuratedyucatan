import {
  defineDocuments,
  defineLocations,
  type PresentationPluginOptions,
} from 'sanity/presentation';

/*
 * Relación entre documentos y páginas del sitio para la herramienta Presentation
 * ("Editar en la página"): qué documento se edita en cada URL y en qué URLs aparece cada
 * documento. El inglés va sin prefijo y el español con /es (D-004).
 */

const enAmbosIdiomas = (titulo: string, ruta: string) => [
  { title: `${titulo} (EN)`, href: ruta },
  { title: `${titulo} (ES)`, href: ruta === '/' ? '/es' : `/es${ruta}` },
];

export const resolverPresentacion: PresentationPluginOptions['resolve'] = {
  mainDocuments: defineDocuments([
    { route: '/', filter: `_id == "configuracionSitio"` },
    { route: '/es', filter: `_id == "configuracionSitio"` },
    { route: '/venues/:slug', filter: `_type == "venue" && slug.current == $slug` },
    { route: '/es/venues/:slug', filter: `_type == "venue" && slug.current == $slug` },
  ]),
  locations: {
    configuracionSitio: defineLocations({
      message: 'Textos y fotos del inicio',
      locations: enAmbosIdiomas('Inicio', '/'),
    }),
    venue: defineLocations({
      select: { nombre: 'nombre', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: doc?.slug
          ? [
              ...enAmbosIdiomas(doc.nombre ?? 'Venue', `/venues/${doc.slug}`),
              { title: 'Listado de venues', href: '/venues' },
            ]
          : [],
      }),
    }),
    region: defineLocations({
      select: { nombre: 'nombre.en', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          { title: 'Inicio · Explora por paisaje', href: '/' },
          ...(doc?.slug
            ? [{ title: `Venues en ${doc.nombre ?? ''}`, href: `/venues?region=${doc.slug}` }]
            : []),
        ],
      }),
    }),
    proveedor: defineLocations({
      message: 'Aparece en las fichas de los venues que lo recomiendan',
      locations: [{ title: 'Listado de venues', href: '/venues' }],
    }),
    categoriaProveedor: defineLocations({ locations: enAmbosIdiomas('Inicio', '/') }),
    episodio: defineLocations({
      message: 'El más reciente aparece en el inicio',
      locations: enAmbosIdiomas('Inicio', '/'),
    }),
    guia: defineLocations({
      message: 'La guía activa aparece en el inicio',
      locations: enAmbosIdiomas('Inicio', '/'),
    }),
    historia: defineLocations({
      message: 'Las tres más recientes aparecen en el inicio',
      locations: enAmbosIdiomas('Inicio', '/'),
    }),
  },
};
