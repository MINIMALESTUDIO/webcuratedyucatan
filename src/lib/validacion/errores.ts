import type { z } from 'zod';

/*
 * Códigos de error de los formularios (claves de Formularios.errores.*). Este módulo no carga
 * zod en tiempo de ejecución (solo sus tipos): los componentes lo importan de forma estática y
 * cargan los esquemas con import() al enviar (D-031).
 */

export const CODIGOS_ERROR = [
  'requerido',
  'muyCorto',
  'muyLargo',
  'correoInvalido',
  'eligeUno',
  'consentimiento',
] as const;

export type CodigoError = (typeof CODIGOS_ERROR)[number];

/** Primer código de error por campo, para mostrarlo junto a cada campo. */
export function erroresPorCampo(error: z.ZodError): Record<string, CodigoError> {
  const errores: Record<string, CodigoError> = {};
  for (const issue of error.issues) {
    const campo = String(issue.path[0] ?? '');
    const codigo = CODIGOS_ERROR.find((c) => c === issue.message) ?? 'requerido';
    if (campo && !errores[campo]) errores[campo] = codigo;
  }
  return errores;
}
