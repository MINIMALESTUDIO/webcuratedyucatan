import type { RutaInterna } from '@/i18n/routing';
import type mensajes from '@/i18n/mensajes/en.json';

/** Rutas internas sin parámetros dinámicos (las que se enlazan desde la navegación). */
export type RutaEstatica = Exclude<RutaInterna, `${string}[${string}`>;

export type ClaveNavegacion = keyof (typeof mensajes)['Navegacion'];

export interface EnlaceNavegacion {
  href: RutaEstatica;
  clave: ClaveNavegacion;
}

/** Navegación principal de escritorio. */
export const NAVEGACION_PRINCIPAL: EnlaceNavegacion[] = [
  { href: '/venues', clave: 'venues' },
  { href: '/proveedores', clave: 'proveedores' },
  { href: '/fin-de-semana', clave: 'finDeSemana' },
  { href: '/planea-tu-boda', clave: 'planeaTuBoda' },
  { href: '/venue-tours', clave: 'venueTours' },
  { href: '/guia', clave: 'guia' },
];

/** El menú móvil agrega secciones que en escritorio viven en el pie. */
export const NAVEGACION_MOVIL: EnlaceNavegacion[] = [
  ...NAVEGACION_PRINCIPAL,
  { href: '/historias', clave: 'historias' },
  { href: '/aliados', clave: 'aliados' },
];

export const NAVEGACION_PIE: Array<{
  titulo: 'explorar' | 'planear' | 'nosotros';
  enlaces: EnlaceNavegacion[];
}> = [
  {
    titulo: 'explorar',
    enlaces: [
      { href: '/venues', clave: 'venues' },
      { href: '/proveedores', clave: 'proveedores' },
      { href: '/fin-de-semana', clave: 'finDeSemana' },
      { href: '/venue-tours', clave: 'venueTours' },
    ],
  },
  {
    titulo: 'planear',
    enlaces: [
      { href: '/planea-tu-boda', clave: 'planeaTuBoda' },
      { href: '/guia', clave: 'guia' },
      { href: '/asesoria', clave: 'asesoria' },
      { href: '/historias', clave: 'historias' },
    ],
  },
  {
    titulo: 'nosotros',
    enlaces: [
      { href: '/aliados', clave: 'aliados' },
      { href: '/privacidad', clave: 'privacidad' },
    ],
  },
];
