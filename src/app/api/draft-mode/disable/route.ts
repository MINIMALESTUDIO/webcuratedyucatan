import { draftMode } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

/** Sale del modo borrador y vuelve al inicio con el contenido publicado. */
export async function GET(peticion: NextRequest) {
  (await draftMode()).disable();
  return NextResponse.redirect(new URL('/', peticion.url));
}
