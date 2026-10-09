import { defineArrayMember, defineField, defineType } from 'sanity';
import { campoBloquesLocalizados, campoLocalizado, campoSlug } from '../ayudantes';

/** Artículo del Curated Journal (documento de estructura, sección 11). */
export const articulo = defineType({
  name: 'articulo',
  title: 'Artículo del Journal',
  type: 'document',
  fields: [
    campoLocalizado({ name: 'titulo', title: 'Título', max: 100 }),
    campoSlug('titulo.en'),
    defineField({
      name: 'imagenPortada',
      title: 'Imagen de portada',
      type: 'imagenConAlt',
      validation: (r) => r.required(),
    }),
    campoLocalizado({ name: 'extracto', title: 'Extracto', largo: true, max: 200 }),
    campoBloquesLocalizados({ name: 'cuerpo', title: 'Cuerpo', conMedios: true }),
    defineField({
      name: 'fechaPublicacion',
      title: 'Fecha de publicación',
      description: 'El tiempo de lectura se calcula solo a partir del cuerpo.',
      type: 'date',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  orderings: [
    {
      title: 'Más recientes',
      name: 'fecha',
      by: [{ field: 'fechaPublicacion', direction: 'desc' }],
    },
  ],
  preview: { select: { title: 'titulo.en', subtitle: 'fechaPublicacion', media: 'imagenPortada' } },
});

// --- Secciones de las páginas editoriales --------------------------------------------

/** Destinos internos de los botones (deben coincidir con DESTINOS_LLAMADO en tipos.ts). */
const LISTA_DESTINOS = [
  { title: 'Plan your event', value: 'planea-tu-evento' },
  { title: 'Find your Yucatán', value: 'encuentra-tu-yucatan' },
  { title: 'Venues', value: 'venues' },
  { title: 'Discover Yucatán', value: 'descubre-yucatan' },
  { title: 'Catering', value: 'catering' },
  { title: 'Photography', value: 'fotografia' },
  { title: 'Design & Production', value: 'diseno-y-produccion' },
  { title: 'Curated Journal', value: 'journal' },
  { title: 'Explore Curated (inicio)', value: 'explora-curated' },
];

const campoSobretitulo = () =>
  campoLocalizado({
    name: 'sobretitulo',
    title: 'Sobretítulo (eyebrow)',
    max: 40,
    requerido: false,
  });

const seccionTexto = defineArrayMember({
  name: 'seccionTexto',
  title: 'Texto',
  type: 'object',
  fields: [
    campoSobretitulo(),
    campoLocalizado({ name: 'titulo', title: 'Título', max: 100, requerido: false }),
    campoBloquesLocalizados({ name: 'texto', title: 'Texto' }),
    campoLocalizado({
      name: 'firma',
      title: 'Firma',
      description: 'Opcional, por ejemplo "A project by Minimal".',
      max: 60,
      requerido: false,
    }),
    defineField({
      name: 'destino',
      title: 'Enlace al final (opcional)',
      type: 'string',
      options: { list: LISTA_DESTINOS },
    }),
  ],
  preview: {
    select: { title: 'titulo.en' },
    prepare: ({ title }) => ({ title: title ?? 'Texto', subtitle: 'Texto' }),
  },
});

const seccionImagen = defineArrayMember({
  name: 'seccionImagen',
  title: 'Imagen',
  type: 'object',
  fields: [
    defineField({
      name: 'imagen',
      title: 'Imagen',
      type: 'imagenConAlt',
      validation: (r) => r.required(),
    }),
    campoLocalizado({ name: 'pie', title: 'Pie de foto', max: 160, requerido: false }),
  ],
  preview: { select: { media: 'imagen' }, prepare: ({ media }) => ({ title: 'Imagen', media }) },
});

const seccionPreguntas = defineArrayMember({
  name: 'seccionPreguntas',
  title: 'Preguntas frecuentes',
  type: 'object',
  fields: [
    campoLocalizado({ name: 'titulo', title: 'Título', max: 100, requerido: false }),
    defineField({
      name: 'preguntas',
      title: 'Preguntas',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'pregunta',
          type: 'object',
          fields: [
            campoLocalizado({ name: 'pregunta', title: 'Pregunta', max: 160 }),
            campoLocalizado({ name: 'respuesta', title: 'Respuesta', largo: true, max: 800 }),
          ],
          preview: { select: { title: 'pregunta.en' } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Preguntas frecuentes' }) },
});

/** Bloque de enlaces a las secciones del sitio ("Explore Curated"). */
const seccionEnlaces = defineArrayMember({
  name: 'seccionEnlaces',
  title: 'Enlaces a secciones',
  type: 'object',
  fields: [
    campoSobretitulo(),
    campoLocalizado({ name: 'titulo', title: 'Título', max: 100 }),
    campoLocalizado({
      name: 'entradilla',
      title: 'Entradilla',
      largo: true,
      max: 240,
      requerido: false,
    }),
    defineField({
      name: 'enlaces',
      title: 'Enlaces',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'enlaceSeccion',
          type: 'object',
          fields: [
            defineField({
              name: 'destino',
              title: 'Sección',
              type: 'string',
              options: { list: LISTA_DESTINOS },
              validation: (r) => r.required(),
            }),
            campoLocalizado({ name: 'texto', title: 'Texto', largo: true, max: 160 }),
          ],
          preview: { select: { title: 'destino', subtitle: 'texto.en' } },
        }),
      ],
      validation: (r) => r.min(1).max(8),
    }),
  ],
  preview: {
    select: { title: 'titulo.en' },
    prepare: ({ title }) => ({ title: title ?? 'Enlaces', subtitle: 'Enlaces a secciones' }),
  },
});

const seccionLlamado = defineArrayMember({
  name: 'seccionLlamado',
  title: 'Llamado a la acción',
  type: 'object',
  fields: [
    campoSobretitulo(),
    campoLocalizado({ name: 'titulo', title: 'Título', max: 80 }),
    campoLocalizado({ name: 'texto', title: 'Texto', largo: true, max: 240, requerido: false }),
    defineField({
      name: 'destino',
      title: 'Destino del botón',
      type: 'string',
      options: { list: LISTA_DESTINOS },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'destinoSecundario',
      title: 'Botón secundario (opcional)',
      type: 'string',
      options: { list: LISTA_DESTINOS },
    }),
  ],
  preview: {
    select: { title: 'titulo.en', subtitle: 'destino' },
  },
});

/**
 * Página editorial con ruta fija (About y Privacy). Su documento tiene un ID fijo
 * (pagina-nosotros, pagina-privacidad): se crea desde el menú del Studio.
 */
export const paginaEditorial = defineType({
  name: 'paginaEditorial',
  title: 'Página editorial',
  type: 'document',
  fields: [
    campoLocalizado({ name: 'titulo', title: 'Título', max: 100 }),
    campoLocalizado({
      name: 'entradilla',
      title: 'Entradilla',
      largo: true,
      max: 280,
      requerido: false,
    }),
    defineField({ name: 'imagen', title: 'Imagen principal', type: 'imagenConAlt' }),
    defineField({
      name: 'secciones',
      title: 'Secciones',
      type: 'array',
      of: [seccionTexto, seccionEnlaces, seccionImagen, seccionPreguntas, seccionLlamado],
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: { select: { title: 'titulo.en' } },
});

/** Discover Yucatán (documento de estructura, sección 5): documento único. */
export const descubreYucatan = defineType({
  name: 'descubreYucatan',
  title: 'Discover Yucatán',
  type: 'document',
  fields: [
    campoLocalizado({ name: 'titulo', title: 'Título', max: 60 }),
    campoLocalizado({ name: 'entradilla', title: 'Entradilla', largo: true, max: 320 }),
    defineField({
      name: 'imagenPrincipal',
      title: 'Imagen principal',
      type: 'imagenConAlt',
      validation: (r) => r.required(),
    }),
  ],
  preview: { prepare: () => ({ title: 'Discover Yucatán' }) },
});

/**
 * Página individual de Discover Yucatán: Architecture, Culture, Gastronomy, History, Nature y
 * Experiences (D-048). La portada y el inicio las listan por su orden.
 */
export const categoriaDescubre = defineType({
  name: 'categoriaDescubre',
  title: 'Categoría de Discover Yucatán',
  type: 'document',
  groups: [
    { name: 'portada', title: 'Portada', default: true },
    { name: 'pagina', title: 'Página' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    campoLocalizado({ name: 'titulo', title: 'Nombre', max: 30, group: 'portada' }),
    campoSlug('titulo.en', 'portada'),
    defineField({
      name: 'orden',
      title: 'Orden',
      description: 'Posición en la portada de Discover Yucatán y en el inicio.',
      type: 'number',
      group: 'portada',
      validation: (r) => r.required().integer().min(1),
    }),
    campoLocalizado({
      name: 'resumen',
      title: 'Microdescripción',
      description: 'Una frase: se muestra en la portada de Discover Yucatán.',
      largo: true,
      max: 120,
      group: 'portada',
    }),
    defineField({
      name: 'imagenPrincipal',
      title: 'Imagen principal',
      description: 'Hero de la página, portada de Discover Yucatán, inicio y "Continue exploring".',
      type: 'imagenConAlt',
      group: 'portada',
      validation: (r) => r.required(),
    }),
    campoLocalizado({ name: 'titular', title: 'Titular (hero)', max: 90, group: 'pagina' }),
    campoLocalizado({
      name: 'entradilla',
      title: 'Entradilla (hero)',
      largo: true,
      max: 360,
      group: 'pagina',
    }),
    defineField({
      name: 'secciones',
      title: 'Secciones',
      type: 'array',
      group: 'pagina',
      of: [
        defineArrayMember({
          name: 'seccionCategoria',
          type: 'object',
          fields: [
            campoLocalizado({ name: 'titulo', title: 'Título', max: 60 }),
            campoBloquesLocalizados({ name: 'texto', title: 'Texto' }),
            defineField({
              name: 'imagenes',
              title: 'Imágenes',
              description: 'Una o dos fotografías.',
              type: 'array',
              of: [defineArrayMember({ type: 'imagenConAlt' })],
              validation: (r) => r.max(2),
            }),
          ],
          preview: { select: { title: 'titulo.en', media: 'imagenes.0' } },
        }),
      ],
    }),
    defineField({
      name: 'relacionadas',
      title: 'Continue exploring',
      description: 'Las tres categorías que se sugieren al final de la página.',
      type: 'array',
      group: 'pagina',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'categoriaDescubre' }] })],
      validation: (r) => r.unique().max(3),
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  orderings: [{ title: 'Orden', name: 'orden', by: [{ field: 'orden', direction: 'asc' }] }],
  preview: { select: { title: 'titulo.en', subtitle: 'resumen.en', media: 'imagenPrincipal' } },
});
