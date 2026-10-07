import { z } from 'zod';
import { BUSQUEDAS, ORIGENES_SOLICITUD, RANGOS_INVITADOS, TIPOS_EVENTO } from './opciones';

/*
 * Esquemas de los formularios (D-027, D-042). Se usan en el cliente en el piloto y se
 * reutilizarán en los route handlers de la Fase 4. Los mensajes de error son claves de
 * traducción (Formularios.errores.*, ver ./errores.ts), no textos.
 * En el cliente este módulo se carga con import() al enviar, para no sumar zod al JS inicial.
 */

export { CODIGOS_ERROR, type CodigoError, erroresPorCampo } from './errores';

const textoRequerido = (min: number, max: number) =>
  z
    .string({ error: 'requerido' })
    .trim()
    .min(1, { error: 'requerido' })
    .min(min, { error: 'muyCorto' })
    .max(max, { error: 'muyLargo' });

const nombre = textoRequerido(2, 120);
const empresa = textoRequerido(2, 160);
const pais = textoRequerido(2, 80);

const correo = z
  .string({ error: 'requerido' })
  .trim()
  .min(1, { error: 'requerido' })
  .max(200, { error: 'muyLargo' })
  .pipe(z.email({ error: 'correoInvalido' }));

const opcional = (max: number) => z.string().trim().max(max, { error: 'muyLargo' }).optional();

const idioma = z.enum(['en', 'es']);
const consentimientoPrivacidad = z.literal(true, { error: 'consentimiento' });

/**
 * Plan Your Event (sección 13) y la solicitud de información de un venue o partner, que usan
 * los mismos campos: tipo de evento, invitados, qué busca y contacto. Solo el teléfono es
 * opcional en el documento; el mensaje también lo es (supuesto de D-042).
 */
export const esquemaSolicitud = z.object({
  tipoEvento: z.enum(TIPOS_EVENTO, { error: 'requerido' }),
  invitados: z.enum(RANGOS_INVITADOS, { error: 'requerido' }),
  buscando: z.array(z.enum(BUSQUEDAS)).min(1, { error: 'eligeUno' }),
  nombre,
  empresa,
  pais,
  correo,
  telefono: opcional(40),
  fechaAproximada: textoRequerido(2, 60),
  mensaje: opcional(2000),
  consentimientoPrivacidad,
  origen: z.enum(ORIGENES_SOLICITUD),
  origenSlug: z.string().max(200).optional(),
  idioma,
});

/** "Want to save your Curated selection?" de Find Your Yucatán (sección 14). */
export const esquemaSeleccion = z.object({
  nombre,
  empresa,
  correo,
  pais,
  consentimientoPrivacidad,
  resultado: z.string().min(1).max(80),
  venues: z.array(z.string().max(200)).max(6),
  idioma,
});

export type DatosSolicitud = z.infer<typeof esquemaSolicitud>;
export type DatosSeleccion = z.infer<typeof esquemaSeleccion>;
