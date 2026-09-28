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

export const cita = defineType({
  name: 'cita',
  title: 'Cita destacada',
  type: 'object',
  fields: [
    campoLocalizado({ name: 'texto', title: 'Cita', largo: true, max: 280 }),
    defineField({ name: 'autor', title: 'Autor', type: 'string', validation: (r) => r.required() }),
    campoLocalizado({ name: 'cargo', title: 'Cargo', max: 60 }),
  ],
  preview: { select: { title: 'texto.en', subtitle: 'autor' } },
});

const capacidad = (name: string, title: string, requerido = false) =>
  defineField({
    name,
    title,
    type: 'number',
    validation: (r) => (requerido ? r.required() : r).integer().min(0).max(5000),
  });

export const espacio = defineType({
  name: 'espacio',
  title: 'Espacio',
  type: 'object',
  fields: [
    campoLocalizado({ name: 'nombre', title: 'Nombre', max: 60 }),
    campoLocalizado({ name: 'descripcion', title: 'Descripción', largo: true, max: 300 }),
    defineField({
      name: 'interiorExterior',
      title: 'Interior o exterior',
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
    capacidad('capacidadCeremonia', 'Capacidad de ceremonia'),
    capacidad('capacidadCoctel', 'Capacidad de cóctel'),
    capacidad('capacidadBanquete', 'Capacidad de banquete'),
    defineField({
      name: 'imagenes',
      title: 'Imágenes',
      type: 'array',
      of: [defineArrayMember({ type: 'imagenConAlt' })],
    }),
  ],
  preview: { select: { title: 'nombre.en', subtitle: 'interiorExterior', media: 'imagenes.0' } },
});

/** Datos estandarizados del venue: base de filtros y comparadores futuros (sección 13). */
export const fichaTecnica = defineType({
  name: 'fichaTecnica',
  title: 'Ficha técnica',
  type: 'object',
  fieldsets: [
    { name: 'capacidades', title: 'Capacidades máximas', options: { columns: 3 } },
    { name: 'traslados', title: 'Traslados (minutos)', options: { columns: 2 } },
  ],
  fields: [
    { ...capacidad('capacidadCeremoniaMax', 'Ceremonia', true), fieldset: 'capacidades' },
    { ...capacidad('capacidadCoctelMax', 'Cóctel', true), fieldset: 'capacidades' },
    { ...capacidad('capacidadBanqueteMax', 'Banquete', true), fieldset: 'capacidades' },
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
      ],
    }),
    defineField({
      name: 'catering',
      title: 'Catering',
      type: 'string',
      options: {
        list: [
          { title: 'Propio', value: 'propio' },
          { title: 'Externo', value: 'externo' },
          { title: 'Ambos', value: 'ambos' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (r) => r.required(),
    }),
    campoLocalizado({ name: 'horarioLimiteMusica', title: 'Horario límite de música', max: 40 }),
    defineField({
      name: 'minutosAeropuertoMID',
      title: 'Desde el aeropuerto MID',
      type: 'number',
      fieldset: 'traslados',
      validation: (r) => r.required().integer().min(0),
    }),
    defineField({
      name: 'minutosCentroMerida',
      title: 'Desde el centro de Mérida',
      type: 'number',
      fieldset: 'traslados',
      validation: (r) => r.required().integer().min(0),
    }),
    defineField({
      name: 'inversionDesdeUSD',
      title: 'Inversión desde (USD)',
      description: 'Opcional. Si se deja vacío, el sitio muestra "A consultar".',
      type: 'number',
      validation: (r) => r.integer().min(0),
    }),
    campoLocalizado({ name: 'mejorTemporada', title: 'Mejor temporada', max: 60 }),
    defineField({
      name: 'ubicacion',
      title: 'Ubicación',
      description: 'Latitud y longitud. Se usa para el mapa y el enlace a Google Maps.',
      type: 'geopoint',
      validation: (r) => r.required(),
    }),
  ],
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
