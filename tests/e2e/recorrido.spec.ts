import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from '@playwright/test';

/*
 * Recorridos del sitio alineado con "Estructura y dirección web" (Fase R), en móvil (360 px),
 * escritorio (1440 px) y WebKit. Requiere `npm run build`.
 */

const esMovil = (proyecto: string) => proyecto.startsWith('movil');

/** Espera a que el listado hidrate y sus filtros respondan. */
async function esperarListadoInteractivo(pagina: Page) {
  await pagina.locator('[data-interactivo="si"]').waitFor();
}

test('navegación del documento: menú, CTA principal y Find your Yucatán', async ({
  page,
}, info) => {
  await page.goto('/');
  const enlaces = [
    'Discover Yucatán',
    'Venues',
    'Catering',
    'Photography',
    'Design & Production',
    'Curated Journal',
    'About',
  ];
  if (esMovil(info.project.name)) {
    const menu = page.getByRole('dialog', { name: 'Menu' });
    // El botón solo responde tras hidratar: se reintenta el clic hasta que el diálogo abre.
    await expect(async () => {
      await page.getByRole('button', { name: 'Open menu' }).click();
      await expect(menu).toBeVisible({ timeout: 1000 });
    }).toPass();
    for (const enlace of ['Home', ...enlaces]) {
      await expect(menu.getByRole('link', { name: enlace, exact: true })).toBeVisible();
    }
    await expect(menu.getByRole('link', { name: 'Plan your event' })).toBeVisible();
    await expect(menu.getByRole('link', { name: 'Find your Yucatán' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
  } else {
    const nav = page.getByRole('banner').getByRole('navigation', { name: 'Main' });
    for (const enlace of enlaces) {
      await expect(nav.getByRole('link', { name: enlace, exact: true })).toBeVisible();
    }
    await expect(
      page.getByRole('banner').getByRole('link', { name: 'Plan your event' }),
    ).toBeVisible();
  }
});

test('inicio → Discover → venues con colección y filtro → ficha', async ({ page }, info) => {
  const movil = esMovil(info.project.name);

  // Inicio: siete bloques del documento
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Curated Yucatán');
  for (const titulo of [
    'What is Curated?',
    'Discover Yucatán',
    'Explore Curated',
    'Featured venues',
    'Curated Journal',
    'Plan your event',
  ]) {
    await expect(page.getByRole('heading', { level: 2, name: titulo })).toBeVisible();
  }

  // Hero → Discover Yucatán → Explore venues
  await page.getByRole('link', { name: 'Explore Yucatán' }).click();
  await expect(page).toHaveURL(/\/discover-yucatan$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Discover Yucatán');
  await page.getByRole('link', { name: 'Explore venues' }).last().click();
  await expect(page).toHaveURL(/\/venues$/);
  await esperarListadoInteractivo(page);
  await expect(page.getByText('18 venues', { exact: true })).toBeVisible();

  // Colección como entrada visual
  await page.getByRole('button', { name: /Organic Estates/ }).click();
  await expect(page).toHaveURL(/\?estilo=organic$/);
  await expect(page.getByText('6 venues', { exact: true })).toBeVisible();

  // Panel de filtros: capacidad hasta 200
  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  const panel = page.getByRole('dialog', { name: 'Filters' });
  await expect(panel).toBeVisible();
  await panel.getByRole('button', { name: 'Up to 200', exact: true }).click();
  await panel.getByRole('button', { name: 'See 1 venue' }).click();
  await expect(panel).toBeHidden();
  await expect(page).toHaveURL(/\?estilo=organic&capacidad=hasta-200$/);
  await expect(page.getByText('1 venue', { exact: true })).toBeVisible();

  // El filtro vive en la URL: sobrevive a una recarga
  await page.reload();
  await esperarListadoInteractivo(page);
  await expect(page.getByText('1 venue', { exact: true })).toBeVisible();

  // A la ficha: estructura base del documento
  await page.getByRole('link', { name: 'Hacienda Sac Chich' }).click();
  await expect(page).toHaveURL(/\/venues\/hacienda-sac-chich$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hacienda Sac Chich');
  for (const titulo of ['Quick facts', 'About', 'Spaces', 'Curated Notes', 'Gallery']) {
    await expect(page.getByRole('heading', { level: 2, name: titulo, exact: true })).toBeAttached();
  }
  await expect(page.getByText('Organic Estates').first()).toBeVisible();
  // Quick facts con el texto de la ficha real (D-047)
  const datos = page.locator('dl').filter({ hasText: 'Accommodation' });
  await expect(datos).toContainText('Colonial architecture with contemporary design');
  await expect(datos).toContainText('8 rooms · up to 21 guests');

  // Barra fija con CTA: visible solo en móvil y lleva a la solicitud
  const barra = page.getByTestId('barra-cta-movil');
  if (movil) {
    await expect(barra).toBeVisible();
    await barra.getByRole('link', { name: 'Request information' }).click();
    await expect(page).toHaveURL(/#solicitud$/);
    await expect(
      page.getByRole('heading', { level: 2, name: 'Request information' }),
    ).toBeInViewport();
  } else {
    await expect(barra).toBeHidden();
  }

  // Volver atrás conserva los filtros
  await page.goBack();
  if (movil) await page.goBack();
  await expect(page).toHaveURL(/\?estilo=organic&capacidad=hasta-200$/);
});

test('solicitud de información en la ficha: errores asociados y confirmación', async ({ page }) => {
  await page.goto('/venues/hacienda-sac-chich');
  const formulario = page.locator('#solicitud form');
  await expect(formulario).toHaveAttribute('data-hidratado', 'si');

  await formulario.getByRole('button', { name: 'Send my request' }).click();
  await expect(formulario.getByRole('alert')).toContainText('Please check');
  await expect(formulario.getByRole('radio', { name: 'Wedding' })).toBeFocused();

  const grupo = (nombre: string) => formulario.getByRole('group', { name: nombre });
  await grupo('What are you planning?').getByText('Wedding', { exact: true }).click();
  await grupo('Estimated guests?').getByText('100–200', { exact: true }).click();
  await formulario.getByLabel('Name', { exact: true }).fill('Ana López');
  await formulario.getByLabel('Company').fill('Estudio Ejemplo');
  await formulario.getByLabel('Country').fill('Canada');
  await formulario.getByLabel('Email').fill('ana@example.com');
  await formulario.getByLabel('Approximate date').fill('March 2027');
  await formulario.getByLabel(/I accept the privacy notice/).check();
  await formulario.getByRole('button', { name: 'Send my request' }).click();

  await expect(formulario.getByRole('status')).toContainText('This is a pilot');
  await expect(formulario.getByRole('alert')).toHaveCount(0);
});

test('Plan your event: "Looking for" llega marcado desde un partner', async ({ page }) => {
  await page.goto('/photography/demo-estudio-ejemplo');
  await page.getByRole('link', { name: 'Request information' }).click();
  await expect(page).toHaveURL(/\/plan-your-event\?buscando=fotografia/);
  const buscando = page.getByRole('group', { name: 'Looking for' });
  await expect(buscando.getByRole('checkbox', { name: 'Photography' })).toBeChecked();
  await expect(buscando.getByRole('checkbox', { name: 'Venue' })).not.toBeChecked();
});

test('Find your Yucatán: seis preguntas, resultado y tres venues', async ({ page }) => {
  await page.goto('/find-your-yucatan');
  await page.getByRole('button', { name: 'Begin' }).click();
  await expect(page.getByText('Question 1 of 6')).toBeVisible();
  await page.getByRole('button', { name: 'Wedding' }).click();
  await page.getByRole('button', { name: /^Organic/ }).click();
  await page.getByRole('button', { name: 'Not necessary' }).click();
  await page.getByRole('button', { name: 'Outdoor' }).click();
  await page.getByRole('button', { name: 'Nature' }).click();
  await page.getByRole('button', { name: '200–400' }).click();

  const resultado = page.getByRole('heading', { level: 2, name: 'Organic' });
  await expect(resultado).toBeFocused();
  const lugares = page.locator('#lugares ~ ul > li');
  await expect(lugares).toHaveCount(3);
  await expect(lugares.first()).toContainText('Organic Estates');
  await expect(page.getByRole('link', { name: 'View all Organic Estates' })).toHaveAttribute(
    'href',
    '/venues?estilo=organic',
  );
  await expect(
    page.getByRole('heading', { name: 'Want to save your Curated selection?' }),
  ).toBeVisible();
});

test('español: rutas traducidas y cambio de idioma que conserva la página', async ({ page }) => {
  await page.goto('/es');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.getByRole('heading', { level: 2, name: '¿Qué es Curated?' })).toBeVisible();

  await page.goto('/venues/hacienda-sac-chich');
  await page.getByRole('contentinfo').getByRole('link', { name: 'Español' }).click();
  await expect(page).toHaveURL(/\/es\/venues\/hacienda-sac-chich$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.getByRole('heading', { name: 'Datos clave' })).toBeAttached();

  const rutas: Array<[string, string]> = [
    ['/es/descubre-yucatan', 'Descubre Yucatán'],
    ['/es/fotografia', 'Fotografía'],
    ['/photography', 'Photography'],
    ['/es/diseno-y-produccion', 'Minimal 4.0'],
    ['/es/encuentra-tu-yucatan', 'Encuentra tu Yucatán'],
    ['/es/planea-tu-evento', 'Planea tu evento'],
    ['/about', 'About Curated'],
  ];
  for (const [ruta, titulo] of rutas) {
    await page.goto(ruta);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(titulo);
  }
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
  test.setTimeout(120_000);
  const rutas = [
    '/',
    '/discover-yucatan',
    '/venues',
    '/venues/hacienda-xtepen',
    '/catering',
    '/photography/demo-estudio-ejemplo',
    '/design-production',
    '/journal',
    '/journal/why-yucatan-for-a-destination-wedding',
    '/about',
    '/find-your-yucatan',
    '/plan-your-event',
    '/es/venues',
  ];
  for (const ruta of rutas) {
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
