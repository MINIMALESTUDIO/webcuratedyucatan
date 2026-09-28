import { z } from 'zod';

/*
 * Esquemas de los formularios (D-027). Se usan en el cliente en el piloto y se reutilizarán
 * en los route handlers de la Fase 4. Los mensajes de error son claves de traducción
 * (Formularios.errores.*, ver ./errores.ts), no textos.
 * En el cliente este módulo se carga con import() al enviar, para no sumar zod al JS inicial.
 */

export { CODIGOS_ERROR, type CodigoError, erroresPorCampo } from './errores';

const nombre = z
  .string()
  .trim()
  .min(1, { error: 'requerido' })
  .min(2, { error: 'muyCorto' })
  .max(120, { error: 'muyLargo' });

const correo = z
  .string()
  .trim()
  .min(1, { error: 'requerido' })
  .max(200, { error: 'muyLargo' })
  .pipe(z.email({ error: 'correoInvalido' }));

const pais = z
  .string()
  .trim()
  .min(1, { error: 'requerido' })
  .min(2, { error: 'muyCorto' })
  .max(80, { error: 'muyLargo' });

const idioma = z.enum(['en', 'es']);

/** Fecha de hoy (AAAA-MM-DD) en la zona horaria de Mérida. */
export function hoyEnMerida(ahora: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Merida' }).format(ahora);
}

const FECHA_ISO = /^\d{4}-\d{2}-\d{2}$/;

function esFechaValida(valor: string): boolean {
  if (!FECHA_ISO.test(valor)) return false;
  const fecha = new Date(`${valor}T00:00:00Z`);
  return !Number.isNaN(fecha.getTime()) && fecha.toISOString().startsWith(valor);
}

export const esquemaDisponibilidad = z
  .object({
    nombre,
    correo,
    telefono: z.string().trim().max(40, { error: 'muyLargo' }).optional(),
    pais,
    fechaBoda: z.string().trim().optional(),
    fechaFlexible: z.boolean(),
    invitadosAprox: z.preprocess(
      (valor) =>
        valor === '' || valor === undefined || valor === null ? undefined : Number(valor),
      z
        .number({ error: (issue) => (issue.input === undefined ? 'requerido' : 'numeroInvalido') })
        .int({ error: 'numeroInvalido' })
        .min(1, { error: 'numeroInvalido' })
        .max(2000, { error: 'numeroInvalido' }),
    ),
    mensaje: z.string().trim().max(2000, { error: 'muyLargo' }).optional(),
    consentimientoPrivacidad: z.literal(true, { error: 'consentimiento' }),
    venueSlug: z.string().min(1),
    idioma,
  })
  .superRefine((datos, ctx) => {
    const fecha = datos.fechaBoda;
    if (!fecha) {
      if (!datos.fechaFlexible) {
        ctx.addIssue({ code: 'custom', path: ['fechaBoda'], message: 'fechaOFlexible' });
      }
      return;
    }
    if (!esFechaValida(fecha)) {
      ctx.addIssue({ code: 'custom', path: ['fechaBoda'], message: 'fechaInvalida' });
    } else if (fecha <= hoyEnMerida()) {
      ctx.addIssue({ code: 'custom', path: ['fechaBoda'], message: 'fechaPasada' });
    }
  });

export const esquemaGuia = z.object({
  nombre,
  correo,
  consentimientoPrivacidad: z.literal(true, { error: 'consentimiento' }),
  aceptaNovedades: z.boolean(),
  idioma,
});

export type DatosDisponibilidad = z.infer<typeof esquemaDisponibilidad>;
export type DatosGuia = z.infer<typeof esquemaGuia>;
