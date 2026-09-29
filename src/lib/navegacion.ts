import type { RutaInterna } from '@/i18n/routing';
import type mensajes from '@/i18n/mensajes/en.json';

/** Rutas internas sin parámetros dinámicos (las que se enlazan desde la navegación). */
export type RutaEstatica = Exclude<RutaInterna, `${string}[${string}`>;

export type ClaveNavegacion = keyof (typeof mensajes)['Navegacion'];

export interface EnlaceNavegacion {
  href: RutaEstatica;
  clave: ClaveNavegacion;
}

/**
 * Navegación principal (documento de estructura, sección 3). En escritorio "Home" lo cubre el
 * logotipo; el menú móvil lo muestra.
 */
export const NAVEGACION_PRINCIPAL: EnlaceNavegacion[] = [
  { href: '/descubre-yucatan', clave: 'descubre' },
  { href: '/venues', clave: 'venues' },
  { href: '/catering', clave: 'catering' },
  { href: '/fotografia', clave: 'fotografia' },
  { href: '/diseno-y-produccion', clave: 'diseno' },
  { href: '/journal', clave: 'journal' },
  { href: '/nosotros', clave: 'nosotros' },
];

export const NAVEGACION_MOVIL: EnlaceNavegacion[] = [
  { href: '/', clave: 'inicio' },
  ...NAVEGACION_PRINCIPAL,
];

/** CTA principal del encabezado (conversión). */
export const CTA_PRINCIPAL: EnlaceNavegacion = { href: '/planea-tu-evento', clave: 'planea' };

/** Experiencia de descubrimiento: accesible por CTA y enlaces específicos, además del QR. */
export const ENLACE_ENCUENTRA: EnlaceNavegacion = {
  href: '/encuentra-tu-yucatan',
  clave: 'encuentra',
};

export const NAVEGACION_PIE: Array<{
  titulo: 'explorar' | 'curated';
  enlaces: EnlaceNavegacion[];
}> = [
  {
    titulo: 'explorar',
    enlaces: [
      { href: '/descubre-yucatan', clave: 'descubre' },
      { href: '/venues', clave: 'venues' },
      { href: '/catering', clave: 'catering' },
      { href: '/fotografia', clave: 'fotografia' },
      { href: '/diseno-y-produccion', clave: 'diseno' },
    ],
  },
  {
    titulo: 'curated',
    enlaces: [
      { href: '/journal', clave: 'journal' },
      { href: '/nosotros', clave: 'nosotros' },
      ENLACE_ENCUENTRA,
      CTA_PRINCIPAL,
    ],
  },
];
