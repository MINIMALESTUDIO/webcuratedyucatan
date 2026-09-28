import { defineArrayMember, defineField, defineType } from 'sanity';
import {
  campoBloquesLocalizados,
  campoLocalizado,
  campoSlug,
  campoSlugsAnteriores,
} from '../ayudantes';

export const region = defineType({
  name: 'region',
  title: 'Región',
  type: 'document',
  fields: [
    campoLocalizado({ name: 'nombre', title: 'Nombre', max: 40 }),
    campoSlug(),
    campoLocalizado({ name: 'descripcion', title: 'Descripción', largo: true, max: 200 }),
    defineField({
      name: 'imagen',
      title: 'Imagen',
      type: 'imagenConAlt',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'orden',
      title: 'Orden',
      description: 'Menor número = aparece antes.',
      type: 'number',
      validation: (r) => r.integer().min(0),
    }),
  ],
  orderings: [{ title: 'Orden', name: 'orden', by: [{ field: 'orden', direction: 'asc' }] }],
  preview: { select: { title: 'nombre.en', subtitle: 'nombre.es', media: 'imagen' } },
});

export const categoriaProveedor = defineType({
  name: 'categoriaProveedor',
  title: 'Categoría de proveedor',
  type: 'document',
  fields: [
    campoLocalizado({ name: 'nombre', title: 'Nombre', max: 40 }),
    campoSlug(),
    defineField({
      name: 'icono',
      title: 'Icono',
      description: 'Iconos propios del sitio (sin librería externa).',
      type: 'string',
      options: {
        list: [
          { title: 'Planeación', value: 'planner' },
          { title: 'Cámara', value: 'camara' },
          { title: 'Flor', value: 'flor' },
          { title: 'Silla', value: 'silla' },
          { title: 'Música', value: 'musica' },
          { title: 'Banquete', value: 'banquete' },
          { title: 'Belleza', value: 'belleza' },
          { title: 'Transporte', value: 'transporte' },
          { title: 'Hospedaje', value: 'hospedaje' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'orden',
      title: 'Orden',
      type: 'number',
      validation: (r) => r.integer().min(0),
    }),
  ],
  orderings: [{ title: 'Orden', name: 'orden', by: [{ field: 'orden', direction: 'asc' }] }],
  preview: { select: { title: 'nombre.en', subtitle: 'nombre.es' } },
});

export const proveedor = defineType({
  name: 'proveedor',
  title: 'Proveedor',
  type: 'document',
  fields: [
    defineField({
      name: 'nombre',
      title: 'Nombre',
      description: 'Nombre propio: se muestra igual en ambos idiomas.',
      type: 'string',
      validation: (r) => r.required().max(80),
    }),
    campoSlug('nombre'),
    campoSlugsAnteriores(),
    defineField({
      name: 'categoria',
      title: 'Categoría',
      type: 'reference',
      to: [{ type: 'categoriaProveedor' }],
      validation: (r) => r.required(),
    }),
    campoLocalizado({ name: 'resumen', title: 'Resumen', largo: true, max: 200 }),
    campoBloquesLocalizados({ name: 'descripcion', title: 'Descripción' }),
    defineField({
      name: 'imagenes',
      title: 'Imágenes',
      type: 'array',
      of: [defineArrayMember({ type: 'imagenConAlt' })],
      validation: (r) => r.required().min(1),
    }),
    defineField({ name: 'sitioWeb', title: 'Sitio web', type: 'url' }),
    defineField({
      name: 'instagram',
      title: 'Instagram',
      description: 'URL del perfil.',
      type: 'url',
    }),
    defineField({
      name: 'regionesQueCubre',
      title: 'Regiones que cubre',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'region' }] })],
      validation: (r) => r.unique(),
    }),
    defineField({ name: 'destacado', title: 'Destacado', type: 'boolean', initialValue: false }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: { select: { title: 'nombre', subtitle: 'categoria.nombre.en', media: 'imagenes.0' } },
});
