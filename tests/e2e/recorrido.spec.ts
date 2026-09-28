import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from '@playwright/test';

/*
 * Recorrido del piloto (criterio de aceptación de la Fase P): inicio → listado con filtro →
 * ficha, en viewport móvil (360 px) y de escritorio (1440 px). Requiere `npm run build`.
 */

const esMovil = (proyecto: string) => proyecto.startsWith('movil');

/** Espera a que el listado hidrate y sus filtros respondan. */
async function esperarListadoInteractivo(pagina: Page) {
  await pagina.locator('[data-interactivo="si"]').waitFor();
}

test('inicio → listado con filtro → ficha', async ({ page }, info) => {
  const movil = esMovil(info.project.name);

  // Inicio
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Weddings in Yucatán');

  // Del hero al listado
  await page.getByRole('link', { name: 'Explore venues' }).first().click();
  await expect(page).toHaveURL(/\/venues$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Venues' })).toBeVisible();
  await esperarListadoInteractivo(page);
  await expect(page.getByText('6 venues', { exact: true })).toBeVisible();

  // Filtro por tipo "Hacienda": panel deslizable en móvil, barra lateral en escritorio
  if (movil) {
    await page.getByRole('button', { name: 'Filters', exact: true }).click();
    const panel = page.getByRole('dialog', { name: 'Filters' });
    await expect(panel).toBeVisible();
    await panel.getByRole('button', { name: 'Hacienda', exact: true }).click();
    await panel.getByRole('button', { name: 'Show 2 venues' }).click();
    await expect(panel).toBeHidden();
  } else {
    await page
      .getByRole('complementary', { name: 'Filters' })
      .getByRole('button', { name: 'Hacienda', exact: true })
      .click();
  }
  await expect(page).toHaveURL(/\?tipo=hacienda$/);
  await expect(page.getByText('2 venues', { exact: true })).toBeVisible();

  // El filtro vive en la URL: sobrevive a una recarga
  await page.reload();
  await esperarListadoInteractivo(page);
  await expect(page.getByText('2 venues', { exact: true })).toBeVisible();

  // A la ficha
  await page.getByRole('link', { name: '[DEMO] Hacienda Ejemplo Norte' }).click();
  await expect(page).toHaveURL(/\/venues\/demo-hacienda-ejemplo-norte$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('[DEMO] Hacienda Ejemplo Norte');
  await expect(page.getByRole('heading', { name: 'At a glance' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Chapters' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Spaces and capacities' })).toBeVisible();

  // Barra fija con CTA: visible solo en móvil y lleva al formulario
  const barra = page.getByTestId('barra-cta-movil');
  if (movil) {
    await expect(barra).toBeVisible();
    await barra.getByRole('link', { name: 'Request availability' }).click();
    await expect(page).toHaveURL(/#disponibilidad$/);
    await expect(page.getByRole('heading', { name: /Check dates at/ })).toBeInViewport();
  } else {
    await expect(barra).toBeHidden();
  }

  // Volver atrás conserva el filtro
  await page.goBack();
  if (movil) await page.goBack();
  await expect(page).toHaveURL(/\?tipo=hacienda$/);
});

test('capítulos: al elegir uno se carga el reproductor en ese segundo', async ({ page }) => {
  await page.goto('/venues/demo-hacienda-ejemplo-norte');
  const seccion = page.locator('#entrevista');
  await seccion.getByRole('button', { name: /Play from 5:10/ }).click();
  const iframe = seccion.locator('iframe');
  await expect(iframe).toHaveAttribute(
    'src',
    /youtube-nocookie\.com\/embed\/M7lc1UVf-VE\?.*start=310/,
  );
});

test('formulario de disponibilidad: errores asociados y aviso de piloto', async ({ page }) => {
  await page.goto('/venues/demo-casona-ejemplo-centro');
  const formulario = page.locator('#disponibilidad form');
  await expect(formulario).toHaveAttribute('data-hidratado', 'si');

  await formulario.getByRole('button', { name: 'Send request' }).click();
  await expect(formulario.getByRole('alert')).toContainText('Please check');
  const nombre = formulario.getByLabel('Full name');
  await expect(nombre).toHaveAttribute('aria-invalid', 'true');
  await expect(nombre).toBeFocused();

  await nombre.fill('Ana López');
  await formulario.getByLabel('Email').fill('ana@example.com');
  await formulario.getByLabel('Country of residence').fill('Canada');
  await formulario.getByLabel('My date is flexible').check();
  await formulario.getByLabel('Approximate number of guests').fill('120');
  await formulario.getByLabel(/I accept the privacy notice/).check();
  await formulario.getByRole('button', { name: 'Send request' }).click();

  await expect(formulario.getByRole('status')).toContainText('Pilot: sending is disabled');
  await expect(formulario.getByRole('alert')).toHaveCount(0);
});

test('español: rutas traducidas y cambio de idioma que conserva la página', async ({ page }) => {
  await page.goto('/es');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Bodas en Yucatán');

  await page.goto('/venues/demo-casona-ejemplo-centro');
  await page.getByRole('contentinfo').getByRole('link', { name: 'Español' }).click();
  await expect(page).toHaveURL(/\/es\/venues\/demo-casona-ejemplo-centro$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.getByRole('heading', { name: 'Ficha técnica' })).toBeVisible();

  // Las rutas fuera del piloto existen en ambos idiomas con su URL traducida
  await page.goto('/es/proveedores');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Esta sección llega pronto');
  await page.goto('/vendors');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('This section is coming soon');
});

test.describe('sin redirección por el idioma del navegador', () => {
  test.use({ locale: 'es-MX', extraHTTPHeaders: { 'Accept-Language': 'es-MX,es;q=0.9' } });

  test('un navegador en español ve / en inglés', async ({ page }) => {
    const respuesta = await page.goto('/');
    expect(respuesta?.status()).toBe(200);
    await expect(page).toHaveURL(/^http:\/\/localhost:\d+\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });
});

test('accesibilidad: axe sin violaciones serias ni críticas (WCAG 2.1 AA)', async ({ page }) => {
  for (const ruta of ['/', '/venues', '/venues/demo-hacienda-ejemplo-norte', '/es/venues']) {
    await page.goto(ruta);
    const resultado = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const graves = resultado.violations
      .filter((v) => v.impact === 'serious' || v.impact === 'critical')
      .map((v) => ({ ruta, regla: v.id, nodos: v.nodes.map((n) => n.target.join(' ')) }));
    expect(graves, JSON.stringify(graves, null, 2)).toEqual([]);
  }
});
