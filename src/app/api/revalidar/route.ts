import { revalidateTag } from 'next/cache';
import { parseBody } from 'next-sanity/webhook';
import { NextResponse, type NextRequest } from 'next/server';

/*
 * Webhook de Sanity al publicar (D-010). Se protege con la firma del webhook
 * (SANITY_REVALIDATE_SECRET), no con Turnstile ni límite por IP: quien llama es Sanity.
 * Invalida las páginas que usan el tipo de documento publicado y, si trae slug, la ficha.
 * Respuesta con la forma común { ok, error?, datos? } (sección 8).
 */

interface CuerpoWebhook {
  _type?: string;
  slug?: string;
}

function responder(estado: number, cuerpo: { ok: boolean; error?: string; datos?: unknown }) {
  return NextResponse.json(cuerpo, { status: estado });
}

export async function POST(peticion: NextRequest) {
  const secreto = process.env.SANITY_REVALIDATE_SECRET;
  if (!secreto) {
    console.error('[revalidar] Falta SANITY_REVALIDATE_SECRET');
    return responder(500, { ok: false, error: 'no-configurado' });
  }

  try {
    const { isValidSignature, body } = await parseBody<CuerpoWebhook>(peticion, secreto);
    if (!isValidSignature) return responder(401, { ok: false, error: 'firma-invalida' });
    if (!body?._type) return responder(400, { ok: false, error: 'cuerpo-invalido' });

    const etiquetas = [body._type, ...(body.slug ? [`${body._type}:${body.slug}`] : [])];
    // expire: 0 → la siguiente visita ya ve el contenido nuevo (no se sirve la versión vieja).
    for (const etiqueta of etiquetas) revalidateTag(etiqueta, { expire: 0 });

    return responder(200, { ok: true, datos: { etiquetas } });
  } catch (error) {
    console.error('[revalidar] Error al procesar el webhook', error);
    return responder(500, { ok: false, error: 'error-interno' });
  }
}
