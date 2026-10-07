import { defineArrayMember, defineField, defineType } from 'sanity';
import { campoLocalizado } from './ayudantes';

/** Imagen con texto alternativo bilingüe obligatorio y punto de interés (hotspot). */
export const imagenConAlt = defineType({
  name: 'imagenConAlt',
  title: 'Imagen',
  type: 'image',
  options: { hotspot: true },
  fields: [
    campoLocalizado({
      name: 'alt',
      title: 'Texto alternativo',
      description:
        'Describe la imagen para quien no puede verla (lectores de pantalla y buscadores).',
      max: 160,
    }),
  ],
});

/** Video de YouTube dentro de un texto enriquecido. */
export const youtube = defineType({
  name: 'youtube',
  title: 'Video de YouTube',
  type: 'object',
  fields: [
    defineField({
      name: 'youtubeId',
      title: 'ID del video',
      description: 'Los 11 caracteres después de "v=" en la URL (youtube.com/watch?v=XXXXXXXXXXX).',
      type: 'string',
      validation: (r) => r.required().regex(/^[\w-]{11}$/, { name: 'ID de YouTube' }),
    }),
  ],
  preview: {
    select: { title: 'youtubeId' },
    prepare: ({ title }) => ({ title: `YouTube: ${title ?? ''}` }),
  },
});

function formatearSegundos(segundos = 0) {
  const m = Math.floor(segundos / 60);
  const s = String(segundos % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export const capitulo = defineType({
  name: 'capitulo',
  title: 'Capítulo',
  type: 'object',
  fields: [
    campoLocalizado({ name: 'titulo', title: 'Título', max: 80 }),
    defineField({
      name: 'segundoInicio',
      title: 'Segundo de inicio',
      description: 'Momento del video donde empieza el capítulo, en segundos (1:35 = 95).',
      type: 'number',
      validation: (r) => r.required().integer().min(0),
    }),
  ],
  preview: {
    select: { titulo: 'titulo.en', segundo: 'segundoInicio' },
    prepare: ({ titulo, segundo }) => ({
      title: `${formatearSegundos(segundo)} · ${titulo ?? ''}`,
    }),
  },
});

/** Elemento de una lista bilingüe (servicios). */
export const elementoLista = defineType({
  name: 'elementoLista',
  title: 'Elemento',
  type: 'object',
  fields: [campoLocalizado({ name: 'texto', title: 'Texto', max: 80 })],
  preview: { select: { title: 'texto.en', subtitle: 'texto.es' } },
});

/** Espacio del venue, como "Capacity & spaces" en el libro. */
export const espacio = defineType({
  name: 'espacio',
  title: 'Espacio',
  type: 'object',
  fields: [
    campoLocalizado({ name: 'nombre', title: 'Nombre', max: 60 }),
    campoLocalizado({
      name: 'descripcion',
      title: 'Descripción',
      largo: true,
      max: 300,
      requerido: false,
    }),
    defineField({
      name: 'interiorExterior',
      title: 'Interior o exterior',
      description: 'El sitio calcula con esto el dato "Indoor / Outdoor" del venue.',
      type: 'string',
      options: {
        list: [
          { title: 'Interior', value: 'interior' },
          { title: 'Exterior', value: 'exterior' },
          { title: 'Interior y exterior', value: 'mixto' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'capacidad',
      title: 'Capacidad (invitados)',
      type: 'number',
      validation: (r) => r.integer().min(0).max(5000),
    }),
    defineField({
      name: 'imagenes',
      title: 'Imágenes',
      type: 'array',
      of: [defineArrayMember({ type: 'imagenConAlt' })],
    }),
  ],
  preview: { select: { title: 'nombre.en', subtitle: 'interiorExterior', media: 'imagenes.0' } },
});

/** Datos clave del venue ("Quick facts"): base de los filtros y de Find Your Yucatán. */
export const fichaTecnica = defineType({
  name: 'fichaTecnica',
  title: 'Datos clave',
  type: 'object',
  fieldsets: [{ name: 'traslado', title: 'Desde el centro de Mérida', options: { columns: 2 } }],
  fields: [
    defineField({
      name: 'capacidadMax',
      title: 'Capacidad máxima (invitados)',
      description:
        'La del espacio más grande. Se usa en el filtro de capacidad y en Find Your Yucatán.',
      type: 'number',
      validation: (r) => r.required().integer().min(1).max(5000),
    }),
    campoLocalizado({
      name: 'capacidadDetalle',
      title: 'Texto de capacidad',
      description:
        'Opcional, cuando hay formatos distintos ("Banquet up to 280 guests / Cocktail up to 300 guests").',
      max: 120,
      requerido: false,
    }),
    defineField({
      name: 'hospedaje',
      title: 'Hospedaje',
      type: 'object',
      options: { columns: 3 },
      fields: [
        defineField({
          name: 'tieneHospedaje',
          title: 'Tiene hospedaje',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'habitaciones',
          title: 'Habitaciones',
          type: 'number',
          hidden: ({ parent }) => !parent?.tieneHospedaje,
          validation: (r) => r.integer().min(0),
        }),
        defineField({
          name: 'huespedesMax',
          title: 'Huéspedes máximo',
          type: 'number',
          hidden: ({ parent }) => !parent?.tieneHospedaje,
          validation: (r) => r.integer().min(0),
        }),
        campoLocalizado({
          name: 'descripcion',
          title: 'Texto de hospedaje',
          description:
            'Opcional. Si se llena, la ficha muestra este texto (por ejemplo "Casitas (2–4 guests)…").',
          max: 160,
          requerido: false,
        }),
      ],
    }),
    defineField({
      name: 'minutosCentroMerida',
      title: 'Minutos',
      type: 'number',
      fieldset: 'traslado',
      description: 'Opcional: si falta, la ficha no muestra el traslado.',
      validation: (r) => r.integer().min(0),
    }),
    defineField({
      name: 'kmCentroMerida',
      title: 'Kilómetros',
      type: 'number',
      fieldset: 'traslado',
      validation: (r) => r.min(0),
    }),
    campoLocalizado({
      name: 'estilo',
      title: 'Estilo (Style)',
      description: 'Opcional. Si falta, la ficha muestra el nombre de la colección.',
      max: 120,
      requerido: false,
    }),
    campoLocalizado({
      name: 'interiorExterior',
      title: 'Texto de Indoor / Outdoor',
      description: 'Opcional. Si falta, la ficha muestra el valor calculado por los espacios.',
      max: 120,
      requerido: false,
    }),
    defineField({
      name: 'entorno',
      title: 'Interior / exterior para filtros',
      description:
        'Opcional. Manda sobre el cálculo por espacios en el filtro y en Find Your Yucatán (D-047).',
      type: 'string',
      options: {
        list: [
          { title: 'Interior', value: 'interior' },
          { title: 'Exterior', value: 'exterior' },
          { title: 'Ambos', value: 'ambos' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
  ],
});

/** Nota práctica para wedding planners ("Curated Notes"). */
export const notaCurated = defineType({
  name: 'notaCurated',
  title: 'Nota',
  type: 'object',
  fields: [
    campoLocalizado({ name: 'titulo', title: 'Título', max: 60, requerido: false }),
    campoLocalizado({ name: 'texto', title: 'Texto', largo: true, max: 600 }),
  ],
  preview: {
    select: { titulo: 'titulo.en', texto: 'texto.en' },
    prepare: ({ titulo, texto }) => ({
      title: titulo ?? texto,
      subtitle: titulo ? texto : undefined,
    }),
  },
});

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    campoLocalizado({ name: 'titulo', title: 'Título para buscadores', max: 60, requerido: false }),
    campoLocalizado({
      name: 'descripcion',
      title: 'Descripción para buscadores',
      largo: true,
      max: 160,
      requerido: false,
    }),
    defineField({ name: 'imagenOG', title: 'Imagen para redes sociales', type: 'imagenConAlt' }),
  ],
});
