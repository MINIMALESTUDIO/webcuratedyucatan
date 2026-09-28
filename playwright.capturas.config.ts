import { defineConfig, devices } from '@playwright/test';

// Capturas del reporte de fase (npm run capturas). Requiere `npm run build` antes.
const PUERTO = 3100;

export default defineConfig({
  testDir: 'tests/e2e',
  testMatch: '**/*.captura.ts',
  fullyParallel: false,
  reporter: [['list']],
  use: { ...devices['Desktop Chrome'], baseURL: `http://localhost:${PUERTO}` },
  webServer: {
    command: `npm run start -- -p ${PUERTO}`,
    url: `http://localhost:${PUERTO}`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
