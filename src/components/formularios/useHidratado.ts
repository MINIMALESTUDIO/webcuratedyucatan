'use client';

import { useSyncExternalStore } from 'react';

const suscribir = () => () => {};

/**
 * `false` en el HTML prerenderizado y `true` una vez que React hidrata el componente.
 * Los formularios desactivan el botón de envío hasta hidratar: así un clic temprano no
 * dispara un envío nativo del navegador con los datos en la URL.
 * El prefijo "use" es obligatorio por convención de React para los hooks.
 */
export function useHidratado(): boolean {
  return useSyncExternalStore(
    suscribir,
    () => true,
    () => false,
  );
}
