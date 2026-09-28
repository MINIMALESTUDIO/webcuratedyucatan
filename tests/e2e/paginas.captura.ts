import { mkdirSync } from 'node:fs';
import { test, type Page } from '@playwright/test';

/*
 * Capturas de página completa de las tres páginas del piloto en 360, 768 y 1440 px.
 * Se guardan en docs/capturas/fase-p/ para el reporte de la Fase P.
 * Uso: npm run build && npm run capturas
 */

const DESTINO = 'docs/capturas/fase-p';
const ANCHOS = [360, 768, 1440];
const PAGINAS = [
  { nombre: 'inicio', ruta: '/' },
  { nombre: 'listado', ruta: '/venues' },
  { nombre: 'ficha', ruta: '/venues/demo-hacienda-ejemplo-norte' },
];

// Recorre la página para que carguen las imágenes diferidas antes de la captura.
async function cargarTodo(pagina: Page) {
  await pagina.evaluate(async () => {
    await document.fonts.ready;
    const paso = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += paso) {
      window.scrollTo(0, y);
      await new Promise((resolver) => setTimeout(resolver, 150));
    }
    await Promise.all(
      Array.from(document.images)
        .filter((imagen) => !imagen.complete)
        .map(
          (imagen) =>
            new Promise((resolver) => imagen.addEventListener('load', resolver, { once: true })),
        ),
    );
    window.scrollTo(0, 0);
  });
  await pagina.waitForTimeout(300);
}

test.beforeAll(() => {
  mkdirSync(DESTINO, { recursive: true });
});

for (const { nombre, ruta } of PAGINAS) {
  for (const ancho of ANCHOS) {
    test(`${nombre} a ${ancho} px`, async ({ page }) => {
      await page.setViewportSize({ width: ancho, height: 900 });
      await page.goto(ruta);
      await cargarTodo(page);
      await page.screenshot({
        path: `${DESTINO}/${nombre}-${ancho}.jpg`,
        fullPage: true,
        type: 'jpeg',
        quality: 70,
      });
    });
  }
}
