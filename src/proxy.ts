import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// En Next 16 el middleware se llama proxy. Resuelve el idioma de la URL y las rutas traducidas.
export default createMiddleware(routing);

export const config = {
  // Excluye API, Studio (fase CMS), internos de Next y archivos con extensión (imágenes, robots.txt).
  matcher: '/((?!api|studio|_next|_vercel|.*\\..*).*)',
};
