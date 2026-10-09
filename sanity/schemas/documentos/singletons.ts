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
        defineField({ name: 'imagen', title: 'Imagen (opcional)', type: 'imagenConAlt' }),
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
  title: 'Design & Production',
  type: 'document',
  groups: [
    { name: 'inicio', title: 'Hero e introducción', default: true },
    { name: 'marcas', title: 'Marcas' },
    { name: 'cierre', title: 'Destino y cierre' },
  ],
  fields: [
    campoLocalizado({ name: 'titular', title: 'Titular (hero)', max: 80, group: 'inicio' }),
    campoLocalizado({
      name: 'entradilla',
      title: 'Texto del hero',
      largo: true,
      max: 280,
      group: 'inicio',
    }),
    defineField({
      name: 'imagenPrincipal',
      title: 'Imagen principal',
      type: 'imagenConAlt',
      group: 'inicio',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'introduccion',
      title: 'Introducción',
      type: 'object',
      group: 'inicio',
      fields: [
        campoLocalizado({ name: 'titulo', title: 'Título', max: 80 }),
        campoBloquesLocalizados({ name: 'texto', title: 'Texto' }),
      ],
    }),
    defineField({
      name: 'marcas',
      title: 'Marcas',
      description: 'Minimal, Más que Ayer y Otro Cielo (D-052).',
      type: 'array',
      group: 'marcas',
      of: [
        defineArrayMember({
          name: 'marcaDiseno',
          type: 'object',
          fields: [
            defineField({
              name: 'nombre',
              title: 'Nombre',
              type: 'string',
              validation: (r) => r.required().max(40),
            }),
            campoLocalizado({ name: 'categoria', title: 'Categoría', max: 40 }),
            campoLocalizado({ name: 'titular', title: 'Titular', max: 80 }),
            campoBloquesLocalizados({ name: 'descripcion', title: 'About' }),
            defineField({
              name: 'servicios',
              title: 'Servicios',
              type: 'array',
              of: [defineArrayMember({ type: 'elementoLista' })],
            }),
            campoBloquesLocalizados({
              name: 'notasCurated',
              title: 'Curated Notes',
              requerido: false,
            }),
            defineField({
              name: 'imagenes',
              title: 'Fotografías',
              type: 'array',
              of: [defineArrayMember({ type: 'imagenConAlt' })],
              options: { layout: 'grid' },
            }),
            defineField({
              name: 'sitioWeb',
              title: 'Enlace de "Discover"',
              description: 'Opcional. Sin enlace, no se muestra el botón.',
              type: 'url',
            }),
          ],
          preview: { select: { title: 'nombre', subtitle: 'categoria.en', media: 'imagenes.0' } },
        }),
      ],
      validation: (r) => r.min(1),
    }),
    defineField({
      name: 'experienciaDestino',
      title: 'Destination experience',
      type: 'object',
      group: 'cierre',
      fields: [
        campoLocalizado({ name: 'sobretitulo', title: 'Sobretítulo', max: 40 }),
        campoLocalizado({ name: 'titulo', title: 'Título', max: 80 }),
        campoBloquesLocalizados({ name: 'texto', title: 'Texto' }),
      ],
    }),
    defineField({
      name: 'cierre',
      title: 'Cierre',
      type: 'object',
      group: 'cierre',
      fields: [
        campoLocalizado({ name: 'titulo', title: 'Título', max: 80 }),
        campoLocalizado({ name: 'texto', title: 'Texto', largo: true, max: 240 }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Design & Production' }) },
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
