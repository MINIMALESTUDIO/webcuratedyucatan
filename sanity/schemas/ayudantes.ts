import {
  defineArrayMember,
  defineField,
  type FileRule,
  type ObjectRule,
  type StringRule,
  type TextRule,
} from 'sanity';

/*
 * Ayudantes para campos bilingües (D-008): cada texto visible es un objeto { en, es }.
 * El inglés es obligatorio; si falta el español, el sitio muestra el inglés.
 */

interface OpcionesLocalizado {
  name: string;
  title: string;
  description?: string;
  /** Texto largo (varias líneas) en lugar de una línea. */
  largo?: boolean;
  /** Longitud máxima por idioma. */
  max?: number;
  requerido?: boolean;
  group?: string;
  fieldset?: string;
}

export function campoLocalizado({
  name,
  title,
  description,
  largo = false,
  max,
  requerido = true,
  group,
  fieldset,
}: OpcionesLocalizado) {
  const validarIdioma = (esIngles: boolean) => (regla: StringRule | TextRule) => {
    let r = regla;
    if (esIngles && requerido) r = r.required().error('El inglés es obligatorio.');
    if (max) r = r.max(max).warning(`Máximo recomendado: ${max} caracteres.`);
    return r;
  };

  return defineField({
    name,
    title,
    description,
    group,
    fieldset,
    type: 'object',
    options: { columns: largo ? 1 : 2 },
    fields: [
      largo
        ? defineField({
            name: 'en',
            title: 'English',
            type: 'text',
            rows: 3,
            validation: validarIdioma(true),
          })
        : defineField({
            name: 'en',
            title: 'English',
            type: 'string',
            validation: validarIdioma(true),
          }),
      largo
        ? defineField({
            name: 'es',
            title: 'Español',
            type: 'text',
            rows: 3,
            validation: validarIdioma(false),
          })
        : defineField({
            name: 'es',
            title: 'Español',
            type: 'string',
            validation: validarIdioma(false),
          }),
    ],
    validation: requerido ? (regla: ObjectRule) => regla.required() : undefined,
  });
}

/** Bloque de texto enriquecido sencillo (párrafos, subtítulos, negritas, cursivas y enlaces). */
export const bloqueTexto = defineArrayMember({
  type: 'block',
  styles: [
    { title: 'Párrafo', value: 'normal' },
    { title: 'Subtítulo', value: 'h3' },
  ],
  lists: [
    { title: 'Viñetas', value: 'bullet' },
    { title: 'Numerada', value: 'number' },
  ],
  marks: {
    decorators: [
      { title: 'Negrita', value: 'strong' },
      { title: 'Cursiva', value: 'em' },
    ],
    annotations: [
      {
        name: 'link',
        title: 'Enlace',
        type: 'object',
        fields: [
          defineField({
            name: 'href',
            title: 'URL',
            type: 'url',
            validation: (r) => r.uri({ scheme: ['http', 'https', 'mailto'] }),
          }),
        ],
      },
    ],
  },
});

interface OpcionesBloques {
  name: string;
  title: string;
  description?: string;
  /** Permite imágenes y videos de YouTube dentro del texto (historias). */
  conMedios?: boolean;
  group?: string;
}

/** Texto enriquecido bilingüe. */
export function campoBloquesLocalizados({
  name,
  title,
  description,
  conMedios = false,
  group,
}: OpcionesBloques) {
  const miembros = conMedios
    ? [
        bloqueTexto,
        defineArrayMember({ type: 'imagenConAlt' }),
        defineArrayMember({ type: 'youtube' }),
      ]
    : [bloqueTexto];
  return defineField({
    name,
    title,
    description,
    group,
    type: 'object',
    fields: [
      defineField({
        name: 'en',
        title: 'English',
        type: 'array',
        of: miembros,
        validation: (r) => r.required().min(1).error('El inglés es obligatorio.'),
      }),
      defineField({ name: 'es', title: 'Español', type: 'array', of: miembros }),
    ],
  });
}

/** Slug único con respaldo del nombre en inglés. */
export function campoSlug(origen = 'nombre.en', group?: string) {
  return defineField({
    name: 'slug',
    title: 'Slug (URL)',
    description:
      'Parte final de la URL, igual en ambos idiomas (D-017). Cambiarlo rompe enlaces: agrega el anterior en "Slugs anteriores".',
    type: 'slug',
    group,
    options: { source: origen, maxLength: 80 },
    validation: (r) => r.required(),
  });
}

export function campoSlugsAnteriores(group?: string) {
  return defineField({
    name: 'slugsAnteriores',
    title: 'Slugs anteriores',
    description: 'Si cambias el slug, agrega aquí el anterior: el sitio redirige con 308 (D-020).',
    type: 'array',
    group,
    of: [defineArrayMember({ type: 'string' })],
  });
}

/** Valida que un archivo de video no supere el peso máximo (D-014). */
export function validarPesoVideo(maxBytes: number) {
  return (regla: FileRule) =>
    regla.custom(async (valor, contexto) => {
      const ref = valor?.asset?._ref;
      if (!ref) return true;
      const peso: number | null = await contexto
        .getClient({ apiVersion: '2026-02-01' })
        .fetch('*[_id == $ref][0].size', { ref });
      if (peso && peso > maxBytes) {
        return `El video pesa ${(peso / 1_048_576).toFixed(1)} MB; el máximo es ${(maxBytes / 1_048_576).toFixed(0)} MB.`;
      }
      return true;
    });
}
