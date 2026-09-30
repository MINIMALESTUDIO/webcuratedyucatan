import { defineConfig, devices } from '@playwright/test';

/*
 * Pruebas e2e contra el build de producción local. Antes: `npm run build`.
 * Proyectos: móvil a 360 px (Chromium), escritorio a 1440 px (Chromium) y móvil WebKit
 * (aproximación a Safari iOS; la prueba en un iPhone real sigue pendiente).
 */
const PUERTO = 3100;

export default defineConfig({
  testDir: 'tests/e2e',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  // Con más workers, WebKit se satura en este equipo y las pruebas fallan por tiempo.
  workers: 4,
  // Con imágenes del CDN de Sanity, WebKit hidrata después de los 5 s por defecto.
  expect: { timeout: 10_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${PUERTO}`,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'movil',
      use: { ...devices['Pixel 7'], viewport: { width: 360, height: 780 } },
    },
    {
      name: 'escritorio',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'movil-webkit',
      use: { ...devices['iPhone 13'] },
    },
  ],
  webServer: {
    command: `npm run start -- -p ${PUERTO}`,
    url: `http://localhost:${PUERTO}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
