import { defineArrayMember, defineField, defineType } from 'sanity';
import { campoLocalizado, validarPesoVideo } from '../ayudantes';

const MB = 1_048_576;

const elementoTexto = (name: string, title: string, conImagen = false) =>
  defineArrayMember({
    name,
    title,
    type: 'object',
    fields: [
      campoLocalizado({ name: 'titulo', title: 'Título', max: 60 }),
      campoLocalizado({ name: 'texto', title: 'Texto', largo: true, max: 240 }),
      ...(conImagen
        ? [
            defineField({
              name: 'imagen',
              title: 'Imagen',
              type: 'imagenConAlt',
              validation: (r) => r.required(),
            }),
          ]
        : []),
    ],
    preview: { select: { title: 'titulo.en', media: 'imagen' } },
  });

/** Singleton con los textos del inicio y los datos generales del sitio (sección 6). */
export const configuracionSitio = defineType({
  name: 'configuracionSitio',
  title: 'Configuración del sitio',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Portada', default: true },
    { name: 'inicio', title: 'Secciones del inicio' },
    { name: 'general', title: 'Contacto y redes' },
  ],
  fields: [
    campoLocalizado({ name: 'fraseHero', title: 'Frase principal', max: 70, group: 'hero' }),
    campoLocalizado({
      name: 'subtituloHero',
      title: 'Subtítulo',
      largo: true,
      max: 160,
      group: 'hero',
    }),
    defineField({
      name: 'imagenHero',
      title: 'Imagen de portada',
      description: 'Se muestra de inmediato; el video, si existe, carga después.',
      type: 'imagenConAlt',
      group: 'hero',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'videoHero',
      title: 'Video de portada',
      type: 'object',
      group: 'hero',
      fields: [
        defineField({
          name: 'escritorio',
          title: 'Escritorio (máx. 2 MB)',
          type: 'file',
          options: { accept: 'video/mp4,video/webm' },
          validation: validarPesoVideo(2 * MB),
        }),
        defineField({
          name: 'movil',
          title: 'Móvil (máx. 1 MB)',
          type: 'file',
          options: { accept: 'video/mp4,video/webm' },
          validation: validarPesoVideo(MB),
        }),
      ],
    }),
    defineField({
      name: 'porQueYucatan',
      title: 'Por qué Yucatán',
      type: 'object',
      group: 'inicio',
      fields: [
        campoLocalizado({ name: 'titulo', title: 'Título', max: 70 }),
        campoLocalizado({ name: 'entradilla', title: 'Entradilla', largo: true, max: 240 }),
        defineField({
          name: 'puntos',
          title: 'Puntos',
          type: 'array',
          of: [elementoTexto('punto', 'Punto')],
          validation: (r) => r.max(4),
        }),
      ],
    }),
    defineField({
      name: 'sello',
      title: 'Sello y proceso curated',
      type: 'object',
      group: 'inicio',
      fields: [
        campoLocalizado({ name: 'titulo', title: 'Título', max: 70 }),
        campoLocalizado({ name: 'texto', title: 'Texto', largo: true, max: 240 }),
        defineField({
          name: 'pasos',
          title: 'Pasos',
          description: 'En orden: el sitio los numera.',
          type: 'array',
          of: [elementoTexto('paso', 'Paso')],
          validation: (r) => r.max(6),
        }),
      ],
    }),
    defineField({
      name: 'tradiciones',
      title: 'Tradiciones yucatecas',
      type: 'object',
      group: 'inicio',
      fields: [
        campoLocalizado({ name: 'titulo', title: 'Título', max: 70 }),
        campoLocalizado({ name: 'entradilla', title: 'Entradilla', largo: true, max: 240 }),
        defineField({
          name: 'elementos',
          title: 'Tradiciones',
          type: 'array',
          of: [elementoTexto('tradicion', 'Tradición', true)],
          validation: (r) => r.max(6),
        }),
      ],
    }),
    defineField({
      name: 'metricas',
      title: 'Métricas de credibilidad',
      type: 'object',
      group: 'inicio',
      options: { columns: 3 },
      fields: [
        defineField({
          name: 'venuesVisitados',
          title: 'Venues visitados',
          type: 'number',
          validation: (r) => r.integer().min(0),
        }),
        defineField({
          name: 'horasEntrevista',
          title: 'Horas de entrevista',
          type: 'number',
          validation: (r) => r.integer().min(0),
        }),
        defineField({
          name: 'edicionesImpresas',
          title: 'Ediciones impresas',
          type: 'number',
          validation: (r) => r.integer().min(0),
        }),
      ],
    }),
    defineField({
      name: 'redes',
      title: 'Redes sociales',
      type: 'object',
      group: 'general',
      fields: [
        defineField({ name: 'instagram', title: 'Instagram', type: 'url' }),
        defineField({ name: 'youtube', title: 'YouTube', type: 'url' }),
      ],
    }),
    defineField({
      name: 'correoContacto',
      title: 'Correo de contacto',
      type: 'email',
      group: 'general',
    }),
  ],
  preview: { prepare: () => ({ title: 'Configuración del sitio' }) },
});

/**
 * Correos que reciben copia de los leads de cada venue o proveedor (D-012).
 * Vive en un documento con ID "privado.contactosLeads": Sanity no expone documentos con punto
 * en el ID sin token, aunque el dataset sea público. El sitio lo lee solo en el servidor.
 */
export const contactosLeads = defineType({
  name: 'contactosLeads',
  title: 'Contactos de leads (privado)',
  type: 'document',
  fields: [
    defineField({
      name: 'contactos',
      title: 'Contactos',
      description:
        'No se muestran en el sitio. Solo el servidor los usa para enviar copias de solicitudes.',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'contacto',
          type: 'object',
          fields: [
            defineField({
              name: 'referencia',
              title: 'Venue o proveedor',
              type: 'reference',
              to: [{ type: 'venue' }, { type: 'proveedor' }],
              weak: true,
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'correo',
              title: 'Correo',
              type: 'email',
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: 'referencia.nombre', subtitle: 'correo' } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Contactos de leads (privado)' }) },
});
