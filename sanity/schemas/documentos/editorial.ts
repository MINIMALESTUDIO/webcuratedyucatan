import { defineArrayMember, defineField, defineType } from 'sanity';
import { campoBloquesLocalizados, campoLocalizado, campoSlug } from '../ayudantes';

export const historia = defineType({
  name: 'historia',
  title: 'Historia',
  type: 'document',
  fields: [
    campoLocalizado({ name: 'titulo', title: 'Título', max: 100 }),
    campoSlug('titulo.en'),
    defineField({
      name: 'tipo',
      title: 'Tipo',
      type: 'string',
      options: {
        list: [
          { title: 'Artículo', value: 'articulo' },
          { title: 'Boda real', value: 'boda-real' },
          { title: 'Lista', value: 'lista' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'imagenPortada',
      title: 'Imagen de portada',
      type: 'imagenConAlt',
      validation: (r) => r.required(),
    }),
    campoLocalizado({ name: 'extracto', title: 'Extracto', largo: true, max: 200 }),
    campoBloquesLocalizados({ name: 'cuerpo', title: 'Cuerpo', conMedios: true }),
    defineField({
      name: 'venuesRelacionados',
      title: 'Venues relacionados',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'venue' }] })],
    }),
    defineField({
      name: 'proveedoresRelacionados',
      title: 'Proveedores relacionados',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'proveedor' }] })],
    }),
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

export const episodio = defineType({
  name: 'episodio',
  title: 'Episodio',
  type: 'document',
  description: 'Videos del canal no ligados a una ficha de venue.',
  fields: [
    campoLocalizado({ name: 'titulo', title: 'Título', max: 100 }),
    defineField({
      name: 'youtubeId',
      title: 'ID del video de YouTube',
      type: 'string',
      validation: (r) => r.required().regex(/^[\w-]{11}$/, { name: 'ID de YouTube' }),
    }),
    campoLocalizado({ name: 'descripcion', title: 'Descripción', largo: true, max: 300 }),
    defineField({
      name: 'capitulos',
      title: 'Capítulos',
      type: 'array',
      of: [defineArrayMember({ type: 'capitulo' })],
    }),
    defineField({
      name: 'venue',
      title: 'Venue (opcional)',
      type: 'reference',
      to: [{ type: 'venue' }],
    }),
    defineField({
      name: 'fechaPublicacion',
      title: 'Fecha de publicación',
      type: 'date',
      validation: (r) => r.required(),
    }),
  ],
  orderings: [
    {
      title: 'Más recientes',
      name: 'fecha',
      by: [{ field: 'fechaPublicacion', direction: 'desc' }],
    },
  ],
  preview: { select: { title: 'titulo.en', subtitle: 'fechaPublicacion' } },
});

export const guia = defineType({
  name: 'guia',
  title: 'Guía descargable',
  type: 'document',
  fields: [
    defineField({
      name: 'edicion',
      title: 'Edición',
      description: 'Por ejemplo, "2027".',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'portada',
      title: 'Portada',
      type: 'imagenConAlt',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'archivoPDF',
      title: 'PDF',
      description: 'Un archivo por idioma; si falta el español se envía el inglés (D-018).',
      type: 'object',
      fields: [
        defineField({
          name: 'en',
          title: 'English',
          type: 'file',
          options: { accept: 'application/pdf' },
          validation: (r) => r.required(),
        }),
        defineField({
          name: 'es',
          title: 'Español',
          type: 'file',
          options: { accept: 'application/pdf' },
        }),
      ],
    }),
    defineField({
      name: 'paginasMuestra',
      title: 'Páginas de muestra',
      type: 'array',
      of: [defineArrayMember({ type: 'imagenConAlt' })],
    }),
    campoLocalizado({ name: 'descripcion', title: 'Descripción', largo: true, max: 240 }),
    defineField({
      name: 'activa',
      title: 'Activa',
      description: 'La edición activa es la que se ofrece en el sitio.',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { edicion: 'edicion', activa: 'activa', media: 'portada' },
    prepare: ({ edicion, activa, media }) => ({
      title: `Guía ${edicion ?? ''}`,
      subtitle: activa ? 'Activa' : 'Inactiva',
      media,
    }),
  },
});

/** Bloques reutilizables para páginas editoriales (Planea tu boda, Fin de semana, Aliados, Privacidad). */
const seccionTexto = defineArrayMember({
  name: 'seccionTexto',
  title: 'Texto',
  type: 'object',
  fields: [
    campoLocalizado({ name: 'titulo', title: 'Título', max: 100, requerido: false }),
    campoBloquesLocalizados({ name: 'contenido', title: 'Contenido', conMedios: true }),
  ],
  preview: {
    select: { title: 'titulo.en' },
    prepare: ({ title }) => ({ title: title ?? 'Texto', subtitle: 'Texto' }),
  },
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
            campoLocalizado({ name: 'respuesta', title: 'Respuesta', largo: true }),
          ],
          preview: { select: { title: 'pregunta.en' } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'titulo.en' },
    prepare: ({ title }) => ({ title: title ?? 'Preguntas', subtitle: 'Preguntas frecuentes' }),
  },
});

const seccionLlamado = defineArrayMember({
  name: 'seccionLlamado',
  title: 'Llamado a la acción',
  type: 'object',
  fields: [
    campoLocalizado({ name: 'titulo', title: 'Título', max: 100 }),
    campoLocalizado({ name: 'texto', title: 'Texto', largo: true, max: 240, requerido: false }),
    campoLocalizado({ name: 'etiquetaBoton', title: 'Texto del botón', max: 40 }),
    defineField({
      name: 'destino',
      title: 'Destino',
      description: 'Ruta interna en español, por ejemplo "/asesoria" o "/venues".',
      type: 'string',
      validation: (r) => r.required().regex(/^\/[\w\-/]*$/, { name: 'ruta interna' }),
    }),
  ],
  preview: {
    select: { title: 'titulo.en' },
    prepare: ({ title }) => ({ title, subtitle: 'Llamado a la acción' }),
  },
});

export const paginaEditorial = defineType({
  name: 'paginaEditorial',
  title: 'Página editorial',
  type: 'document',
  fields: [
    campoLocalizado({ name: 'titulo', title: 'Título', max: 100 }),
    campoSlug('titulo.en'),
    defineField({
      name: 'secciones',
      title: 'Secciones',
      type: 'array',
      of: [
        seccionTexto,
        defineArrayMember({ type: 'imagenConAlt', title: 'Imagen' }),
        seccionPreguntas,
        seccionLlamado,
      ],
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: { select: { title: 'titulo.en', subtitle: 'slug.current' } },
});
