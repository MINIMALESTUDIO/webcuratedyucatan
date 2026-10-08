import { defineArrayMember, defineField, defineType } from 'sanity';
import { campoBloquesLocalizados, campoLocalizado, validarPesoVideo } from '../ayudantes';

const MB = 1_048_576;

/** Singleton con los textos e imágenes del inicio y los datos generales del sitio. */
export const configuracionSitio = defineType({
  name: 'configuracionSitio',
  title: 'Configuración del sitio',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'inicio', title: 'Bloques del inicio' },
    { name: 'general', title: 'Contacto y redes' },
  ],
  fields: [
    campoLocalizado({
      name: 'lema',
      title: 'Lema',
      description: 'Frase del hero del inicio (01_WEB/01_HOME).',
      max: 100,
      group: 'hero',
    }),
    defineField({
      name: 'imagenHero',
      title: 'Imagen del hero',
      description: 'Se muestra de inmediato; el video, si existe, carga después.',
      type: 'imagenConAlt',
      group: 'hero',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'videoHero',
      title: 'Video del hero',
      description: 'Haciendas, arquitectura, Mérida, naturaleza, gastronomía, montajes y diseño.',
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
      name: 'queEsCurated',
      title: '02 · What is Curated?',
      type: 'object',
      group: 'inicio',
      fields: [
        campoLocalizado({
          name: 'texto',
          title: 'Texto',
          description: 'Breve: no es un About completo.',
          largo: true,
          max: 320,
        }),
      ],
    }),
    defineField({
      name: 'descubre',
      title: '03 · Discover Yucatán',
      description:
        'Los temas del bloque son las categorías de Discover Yucatán, en su orden (D-048).',
      type: 'object',
      group: 'inicio',
      fields: [campoLocalizado({ name: 'texto', title: 'Texto', largo: true, max: 240 })],
    }),
    defineField({
      name: 'exploraCurated',
      title: '04 · Explore Curated',
      type: 'object',
      group: 'inicio',
      fields: [
        campoLocalizado({ name: 'texto', title: 'Texto', max: 120 }),
        defineField({
          name: 'areas',
          title: 'Áreas',
          description:
            'Venues, Catering, Photography y Design & Production, cada una con fotografía.',
          type: 'array',
          of: [
            defineArrayMember({
              name: 'areaExplora',
              type: 'object',
              fields: [
                defineField({
                  name: 'destino',
                  title: 'Área',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Venues', value: 'venues' },
                      { title: 'Catering', value: 'catering' },
                      { title: 'Photography', value: 'fotografia' },
                      { title: 'Design & Production', value: 'diseno-produccion' },
                    ],
                  },
                  validation: (r) => r.required(),
                }),
                campoLocalizado({ name: 'texto', title: 'Texto', max: 100 }),
                defineField({
                  name: 'imagen',
                  title: 'Imagen',
                  type: 'imagenConAlt',
                  validation: (r) => r.required(),
                }),
              ],
              preview: { select: { title: 'destino', media: 'imagen' } },
            }),
          ],
          validation: (r) => r.max(4),
        }),
      ],
    }),
    defineField({
      name: 'planea',
      title: '07 · Plan your event',
      type: 'object',
      group: 'inicio',
      fields: [
        campoLocalizado({ name: 'texto', title: 'Texto', largo: true, max: 240 }),
        defineField({ name: 'imagen', title: 'Imagen', type: 'imagenConAlt' }),
      ],
    }),
    defineField({
      name: 'redes',
      title: 'Redes sociales',
      type: 'object',
      group: 'general',
      fields: [
        defineField({ name: 'instagram', title: 'Instagram', type: 'url' }),
        defineField({
          name: 'youtube',
          title: 'YouTube (El Lugar de Tu Historia)',
          type: 'url',
        }),
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
 * Design & Production: Minimal como Curated Design & Production Partner (documento de
 * estructura, sección 10). No es un directorio: un solo documento con sus áreas.
 */
export const disenoProduccion = defineType({
  name: 'disenoProduccion',
  title: 'Design & Production (Minimal)',
  type: 'document',
  fields: [
    defineField({
      name: 'nombre',
      title: 'Nombre',
      type: 'string',
      initialValue: 'Minimal 4.0',
      validation: (r) => r.required(),
    }),
    campoLocalizado({ name: 'lema', title: 'Lema', max: 60 }),
    campoBloquesLocalizados({ name: 'descripcion', title: 'Descripción' }),
    defineField({
      name: 'imagenPrincipal',
      title: 'Imagen principal',
      type: 'imagenConAlt',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'areas',
      title: 'Áreas',
      description: 'Furniture, Tabletop, Floral Design, Décor, Production.',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'areaDiseno',
          type: 'object',
          fields: [
            campoLocalizado({ name: 'nombre', title: 'Nombre', max: 40 }),
            campoLocalizado({ name: 'descripcion', title: 'Descripción', largo: true, max: 320 }),
            defineField({
              name: 'imagenes',
              title: 'Portafolio',
              type: 'array',
              of: [defineArrayMember({ type: 'imagenConAlt' })],
              validation: (r) => r.min(1).max(2),
            }),
          ],
          preview: { select: { title: 'nombre.en', media: 'imagenes.0' } },
        }),
      ],
    }),
    defineField({
      name: 'servicios',
      title: 'Principales servicios',
      type: 'array',
      of: [defineArrayMember({ type: 'elementoLista' })],
    }),
    campoLocalizado({ name: 'estilo', title: 'Estilo o diferenciador', largo: true, max: 280 }),
    campoLocalizado({ name: 'experiencia', title: 'Experiencia', largo: true, max: 280 }),
    defineField({
      name: 'ciudadBase',
      title: 'Ciudad base',
      type: 'string',
      validation: (r) => r.required(),
    }),
    campoLocalizado({ name: 'cobertura', title: 'Zonas donde trabajan', max: 120 }),
    defineField({ name: 'sitioWeb', title: 'Sitio web', type: 'url' }),
    defineField({ name: 'instagram', title: 'Instagram', type: 'url' }),
    defineField({ name: 'logotipo', title: 'Logotipo', type: 'imagenConAlt' }),
  ],
  preview: { prepare: () => ({ title: 'Design & Production (Minimal)' }) },
});

/**
 * Correos que reciben copia de los leads de cada venue o partner (D-012).
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
              title: 'Venue o partner',
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
