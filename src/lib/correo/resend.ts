import 'server-only';

/*
 * Envío de correo con la API REST de Resend (D-055). Se llama con fetch en lugar del SDK: es
 * una sola petición y así no se suma una dependencia. La llave (RESEND_API_KEY) solo existe en
 * el servidor; nunca lleva el prefijo NEXT_PUBLIC_.
 *
 * Control de duplicados: cada correo lleva un Idempotency-Key. Resend no vuelve a enviar un
 * correo con la misma clave durante 24 horas, aunque el servidor se haya reiniciado.
 */

const URL_API = 'https://api.resend.com/emails';

export interface Correo {
  para: string[];
  asunto: string;
  html: string;
  texto: string;
  responderA?: string;
  /** Hasta 256 caracteres. Debe identificar el envío, no la petición. */
  claveIdempotencia: string;
}

export type ResultadoEnvio =
  { ok: true; id: string | null } | { ok: false; error: 'no-configurado' | 'rechazado' | 'red' };

/** Configuración del correo leída del entorno; null si falta algo. */
export function configuracionCorreo(): {
  llave: string;
  remitente: string;
  equipo: string[];
} | null {
  const llave = process.env.RESEND_API_KEY?.trim();
  const remitente = process.env.CORREO_REMITENTE?.trim();
  const equipo = (process.env.CORREO_EQUIPO ?? '')
    .split(',')
    .map((correo) => correo.trim())
    .filter(Boolean);
  if (!llave || !remitente || equipo.length === 0) return null;
  return { llave, remitente, equipo };
}

export async function enviarCorreo(correo: Correo): Promise<ResultadoEnvio> {
  const configuracion = configuracionCorreo();
  if (!configuracion) return { ok: false, error: 'no-configurado' };

  try {
    const respuesta = await fetch(URL_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${configuracion.llave}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': correo.claveIdempotencia.slice(0, 256),
      },
      body: JSON.stringify({
        from: configuracion.remitente,
        to: correo.para,
        subject: correo.asunto,
        html: correo.html,
        text: correo.texto,
        ...(correo.responderA ? { reply_to: correo.responderA } : {}),
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!respuesta.ok) {
      // El cuerpo de error de Resend no trae datos personales; el destinatario no se registra.
      const detalle = await respuesta.text().catch(() => '');
      console.error(`[correo] Resend respondió ${respuesta.status}: ${detalle.slice(0, 300)}`);
      return { ok: false, error: 'rechazado' };
    }
    const cuerpo = (await respuesta.json().catch(() => ({}))) as { id?: string };
    return { ok: true, id: cuerpo.id ?? null };
  } catch (error) {
    console.error('[correo] No se pudo contactar a Resend', error);
    return { ok: false, error: 'red' };
  }
}
