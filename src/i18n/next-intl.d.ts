import type { routing } from './routing';
import type mensajes from './mensajes/en.json';

// Tipado de next-intl: idiomas válidos y claves de mensajes comprobadas al compilar.
declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof mensajes;
  }
}
