import { defineArrayMember, defineField, defineType } from 'sanity';
import {
  campoBloquesLocalizados,
  campoLocalizado,
  campoSlug,
  campoSlugsAnteriores,
} from '../ayudantes';

const orden = defineField({
  name: 'orden',
  title: 'Orden',
  description: 'Menor número = aparece antes.',
  type: 'number',
  validation: (r) => r.integer().min(0),
});

/**
 * Colección del libro (Contemporary Sanctuaries, Organic Estates, Timeless Venues). Es un
 * documento para poder cambiar la taxonomía sin tocar código (D-039).
 */
export const coleccion = defineType({
  name: 'coleccion',
  title: 'Colección',
  type: 'document',
  fields: [
    campoLocalizado({
      name: 'nombre',
      title: 'Nombre',
      description: '"Timeless Venues".',
      max: 40,
    }),
    campoSlug(),
    campoLocalizado({
      name: 'lema',
      title: 'Lema',
      description: '"Heritage and elegance."',
      max: 60,
    }),
    campoLocalizado({ name: 'descripcion', title: 'Descripción', largo: true, max: 280 }),
    campoLocalizado({
      name: 'resultado',
      title: 'Palabra del resultado',
      description: 'Find Your Yucatán muestra "Your Yucatán is… Timeless".',
      max: 20,
    }),
    defineField({
      name: 'imagen',
      title: 'Imagen',
      type: 'imagenConAlt',
      validation: (r) => r.required(),
    }),
    orden,
  ],
  orderings: [{ title: 'Orden', name: 'orden', by: [{ field: 'orden', direction: 'asc' }] }],
  preview: { select: { title: 'nombre.en', subtitle: 'lema.en', media: 'imagen' } },
});

/** Ubicación de los venues (filtro "Location"). */
export const region = defineType({
  name: 'region',
  title: 'Región',
  type: 'document',
  fields: [campoLocalizado({ name: 'nombre', title: 'Nombre', max: 40 }), campoSlug(), orden],
  orderings: [{ title: 'Orden', name: 'orden', by: [{ field: 'orden', direction: 'asc' }] }],
  preview: { select: { title: 'nombre.en', subtitle: 'nombre.es' } },
});

/** Partner de Catering o Photography (documento de estructura, secciones 8 y 9). */
export const proveedor = defineType({
  name: 'proveedor',
  title: 'Partner',
  type: 'document',
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'perfil', title: 'Perfil' },
    { name: 'media', title: 'Fotos' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'tipo',
      title: 'Sección',
      type: 'string',
      group: 'general',
      options: {
        list: [
          { title: 'Catering', value: 'catering' },
          { title: 'Photography', value: 'fotografia' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'nombre',
      title: 'Nombre comercial',
      description: 'Nombre propio: se muestra igual en ambos idiomas.',
      type: 'string',
      group: 'general',
      validation: (r) => r.required().max(80),
    }),
    campoSlug('nombre', 'general'),
    campoSlugsAnteriores('general'),
    campoLocalizado({
      name: 'especialidad',
      title: 'Categoría y especialidad',
      max: 60,
      group: 'general',
    }),
    campoLocalizado({
      name: 'resumen',
      title: 'Diferenciador breve',
      description: 'Una línea para la vista general.',
      max: 180,
      group: 'general',
    }),
    defineField({
      name: 'estilosFotografia',
      title: 'Enfoque fotográfico',
      type: 'array',
      group: 'general',
      hidden: ({ document }) => document?.tipo !== 'fotografia',
      of: [defineArrayMember({ type: 'string' })],
      options: {
        list: [
          { title: 'Editorial', value: 'editorial' },
          { title: 'Documentary', value: 'documental' },
          { title: 'Fine Art', value: 'fine-art' },
          { title: 'Cinematic', value: 'cinematografico' },
        ],
      },
      validation: (r) => r.unique(),
    }),
    defineField({ ...orden, group: 'general' }),
    campoBloquesLocalizados({
      name: 'descripcion',
      title: 'Descripción de la empresa',
      group: 'perfil',
    }),
    defineField({
      name: 'servicios',
      title: 'Principales servicios',
      type: 'array',
      group: 'perfil',
      of: [defineArrayMember({ type: 'elementoLista' })],
      validation: (r) => r.max(8),
    }),
    campoLocalizado({
      name: 'estilo',
      title: 'Estilo',
      description: 'Opcional, por ejemplo "Documentary · Editorial · Candid".',
      largo: true,
      max: 280,
      requerido: false,
      group: 'perfil',
    }),
    campoBloquesLocalizados({
      name: 'notasCurated',
      title: 'Curated Notes',
      description: 'Lo que Curated destaca de este partner para planners.',
      requerido: false,
      group: 'perfil',
    }),
    campoLocalizado({
      name: 'experiencia',
      title: 'Experiencia en bodas destino o eventos internacionales',
      largo: true,
      max: 280,
      group: 'perfil',
    }),
    defineField({
      name: 'ciudadBase',
      title: 'Ciudad base',
      type: 'string',
      group: 'perfil',
      validation: (r) => r.required().max(60),
    }),
    campoLocalizado({
      name: 'cobertura',
      title: 'Zonas donde trabajan',
      max: 120,
      group: 'perfil',
    }),
    defineField({ name: 'sitioWeb', title: 'Sitio web', type: 'url', group: 'perfil' }),
    defineField({
      name: 'instagram',
      title: 'Instagram',
      description: 'URL del perfil.',
      type: 'url',
      group: 'perfil',
    }),
    defineField({
      name: 'imagenPrincipal',
      title: 'Fotografía principal',
      description: 'La fotografía pesa más que el logotipo en todo el sitio.',
      type: 'imagenConAlt',
      group: 'media',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'galeria',
      title: 'Fotografías de su trabajo',
      type: 'array',
      group: 'media',
      of: [defineArrayMember({ type: 'imagenConAlt' })],
      options: { layout: 'grid' },
    }),
    defineField({
      name: 'logotipo',
      title: 'Logotipo',
      description: 'En buena resolución. Uso secundario.',
      type: 'imagenConAlt',
      group: 'media',
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  orderings: [{ title: 'Orden', name: 'orden', by: [{ field: 'orden', direction: 'asc' }] }],
  preview: {
    select: { title: 'nombre', tipo: 'tipo', media: 'imagenPrincipal' },
    prepare: ({ title, tipo, media }) => ({
      title,
      subtitle: tipo === 'fotografia' ? 'Photography' : 'Catering',
      media,
    }),
  },
});
