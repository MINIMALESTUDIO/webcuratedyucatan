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

const seccionTexto = defineArrayMember({
  name: 'seccionTexto',
  title: 'Texto',
  type: 'object',
  fields: [
    campoLocalizado({ name: 'titulo', title: 'Título', max: 100, requerido: false }),
    campoBloquesLocalizados({ name: 'texto', title: 'Texto' }),
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

const seccionLlamado = defineArrayMember({
  name: 'seccionLlamado',
  title: 'Llamado a la acción',
  type: 'object',
  fields: [
    campoLocalizado({ name: 'titulo', title: 'Título', max: 80 }),
    campoLocalizado({ name: 'texto', title: 'Texto', largo: true, max: 240, requerido: false }),
    defineField({
      name: 'destino',
      title: 'Destino del botón',
      type: 'string',
      options: {
        list: [
          { title: 'Plan your event', value: 'planea-tu-evento' },
          { title: 'Find your Yucatán', value: 'encuentra-tu-yucatan' },
          { title: 'Venues', value: 'venues' },
          { title: 'Discover Yucatán', value: 'descubre-yucatan' },
        ],
      },
      validation: (r) => r.required(),
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
      of: [seccionTexto, seccionImagen, seccionPreguntas, seccionLlamado],
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
    defineField({
      name: 'secciones',
      title: 'Secciones',
      description: 'Mérida, Haciendas, Culture, Gastronomy, Nature, Experiences.',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'seccionDescubre',
          type: 'object',
          fields: [
            defineField({
              name: 'ancla',
              title: 'Ancla',
              description:
                'Identificador en la URL (#merida): minúsculas, sin espacios. Lo usan los temas del inicio.',
              type: 'string',
              validation: (r) =>
                r.required().regex(/^[a-z0-9-]+$/, { name: 'minúsculas, números y guiones' }),
            }),
            campoLocalizado({ name: 'titulo', title: 'Título', max: 40 }),
            campoLocalizado({
              name: 'etiquetas',
              title: 'Etiquetas',
              description: '"City · Architecture · Gastronomy · Lifestyle". Opcional.',
              max: 80,
              requerido: false,
            }),
            campoBloquesLocalizados({ name: 'texto', title: 'Texto' }),
            defineField({
              name: 'imagenes',
              title: 'Imágenes',
              description: 'Una o dos fotografías.',
              type: 'array',
              of: [defineArrayMember({ type: 'imagenConAlt' })],
              validation: (r) => r.min(1).max(2),
            }),
          ],
          preview: { select: { title: 'titulo.en', subtitle: 'ancla', media: 'imagenes.0' } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Discover Yucatán' }) },
});
