/*
 * Configuración pública de Sanity para el sitio. Solo usa variables NEXT_PUBLIC_*: puede
 * importarse desde el servidor y desde el cliente. Los tokens viven en ./tokens.ts (server-only).
 *
 * Si falta NEXT_PUBLIC_SANITY_PROJECT_ID, el sitio usa los datos DEMO locales (D-033).
 */

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
/** Versión fija de la API de Sanity: cambiarla es una decisión deliberada. */
export const apiVersion = '2026-02-01';
/** URL del Studio, para los enlaces de "editar" de la edición visual. */
export const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'http://localhost:3333';

export function sanityConfigurado(): boolean {
  return /^[a-z0-9-]+$/.test(projectId);
}
