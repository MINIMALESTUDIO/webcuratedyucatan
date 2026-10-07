import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // En Next, server-only impide importar módulos de servidor desde el cliente;
      // en las pruebas unitarias (Node) se sustituye por un módulo vacío.
      'server-only': fileURLToPath(new URL('./tests/unit/vacio.ts', import.meta.url)),
    },
  },
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
  },
});
