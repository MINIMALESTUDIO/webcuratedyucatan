import { NextResponse, type NextRequest } from 'next/server';
import { hashIp, ipDe, registrarIntento } from '@/lib/leads/proteccion';
import { procesarSeleccion, procesarSolicitud, type ResultadoLead } from '@/lib/leads/servicio';
import { esquemaSeleccion, esquemaSolicitud } from '@/lib/validacion/formularios';

/*
 * Envío de los formularios (D-055): solicitud (Plan Your Event, venue, partner, Design &
 * Production) y selección de Find Your Yucatán. Respuesta con la forma común
 * { ok, error?, datos? } (sección 8). Defensas, en orden:
 * 1. Solo JSON: un formulario de otro sitio no puede enviar JSON sin pasar por CORS.
 * 2. Campo trampa `sitioWeb`, invisible para personas: si llega con texto, se responde ok sin
 *    enviar nada.
 * 3. Límite de 5 envíos por IP cada 10 minutos.
 * 4. Validación con los mismos esquemas zod del navegador.
 * 5. Duplicados: el mismo formulario no se reenvía en 24 horas (servicio + Resend).
 */

export const dynamic = 'force-dynamic';

const TAMANO_MAXIMO = 20_000;

function responder(estado: number, cuerpo: { ok: boolean; error?: string; datos?: unknown }) {
  return NextResponse.json(cuerpo, { status: estado, headers: { 'Cache-Control': 'no-store' } });
}

const ESTADO_ERROR: Record<Exclude<ResultadoLead, { ok: true }>['error'], number> = {
  'no-configurado': 503,
  'envio-fallido': 502,
  'datos-invalidos': 400,
};

export async function POST(peticion: NextRequest) {
  if (!peticion.headers.get('content-type')?.includes('application/json')) {
    return responder(415, { ok: false, error: 'tipo-no-admitido' });
  }

  let cuerpo: unknown;
  try {
    const crudo = await peticion.text();
    if (crudo.length > TAMANO_MAXIMO) return responder(413, { ok: false, error: 'muy-grande' });
    cuerpo = JSON.parse(crudo);
  } catch {
    return responder(400, { ok: false, error: 'cuerpo-invalido' });
  }
  if (typeof cuerpo !== 'object' || cuerpo === null) {
    return responder(400, { ok: false, error: 'cuerpo-invalido' });
  }

  const { tipo, sitioWeb, ...datos } = cuerpo as Record<string, unknown>;
  if (typeof sitioWeb === 'string' && sitioWeb.trim() !== '') {
    return responder(200, { ok: true, datos: { envio: 'enviado' } });
  }

  if (!registrarIntento(hashIp(ipDe(peticion.headers)))) {
    return responder(429, { ok: false, error: 'limite' });
  }

  try {
    let resultado: ResultadoLead;
    if (tipo === 'solicitud') {
      const validos = esquemaSolicitud.safeParse(datos);
      if (!validos.success) return responder(400, { ok: false, error: 'datos-invalidos' });
      resultado = await procesarSolicitud(validos.data);
    } else if (tipo === 'seleccion') {
      const validos = esquemaSeleccion.safeParse(datos);
      if (!validos.success) return responder(400, { ok: false, error: 'datos-invalidos' });
      resultado = await procesarSeleccion(validos.data);
    } else {
      return responder(400, { ok: false, error: 'tipo-invalido' });
    }

    return resultado.ok
      ? responder(200, { ok: true, datos: { envio: resultado.envio } })
      : responder(ESTADO_ERROR[resultado.error], { ok: false, error: resultado.error });
  } catch (error) {
    console.error('[leads] Error al procesar el formulario', error);
    return responder(500, { ok: false, error: 'error-interno' });
  }
}
