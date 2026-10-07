import { defineEnableDraftMode } from 'next-sanity/draft-mode';
import { NextResponse, type NextRequest } from 'next/server';
import { cliente } from '@/lib/sanity/cliente';
import { sanityConfigurado } from '@/lib/sanity/configuracion';

/*
 * Activa el modo borrador cuando "Editar en la página" abre el sitio. next-sanity valida el
 * secreto de vista previa que el Studio guarda en el dataset, usando el token de lectura del
 * servidor (nunca llega al navegador).
 */
const token = process.env.SANITY_API_READ_TOKEN;

const activar =
  sanityConfigurado() && token
    ? defineEnableDraftMode({ client: cliente.withConfig({ token }) }).GET
    : null;

export async function GET(peticion: NextRequest) {
  // Sin proyecto o sin token no hay borradores que mostrar: respuesta clara en lugar de un error.
  if (!activar) return NextResponse.json({ ok: false, error: 'no-configurado' }, { status: 404 });
  return activar(peticion);
}
