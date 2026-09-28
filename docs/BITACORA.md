# Bitácora

Un reporte por fase, con el formato de la sección 14 de `docs/PROMPT.md`.

---

## Fase P — Piloto visual (2026-09-28)

**Estado:** completa en local y subida a GitHub. **Falta el despliegue en Hostinger**, que requiere conectar GitHub desde hPanel (solo el titular puede autorizarlo). Los datos del despliegue se completarán aquí y en `docs/DESPLIEGUE.md`.

### Resumen

Piloto navegable en inglés (`/`) y español (`/es`) con inicio completo (sección 11), listado de venues con filtros en el cliente reflejados en la URL, y ficha de venue con ficha técnica, entrevista de YouTube con capítulos, espacios, galería con visor, citas, proveedores, formulario de disponibilidad y barra fija en móvil. No hay base de datos, Sanity ni envío real de formularios: los datos son `[DEMO]` locales con la forma de los esquemas de Sanity, y los formularios validan y muestran "Piloto: envío desactivado". El resto de rutas de la sección 4 existen en ambos idiomas con una página `[PENDIENTE]`.

### Archivos creados / modificados

- `package.json`, `.npmrc`, `.nvmrc`, `tsconfig.json`, `eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`, `.gitignore`, `.gitattributes`: proyecto, versiones exactas, TypeScript estricto (con `noUncheckedIndexedAccess`), ESLint 9 + Prettier, Node 24, LF.
- `next.config.ts`: plugin de next-intl y configuración de `next/image` (WebP, calidades 60 y 75, miniaturas de YouTube).
- `src/proxy.ts`: resolución de idioma y rutas traducidas (en Next 16 el middleware se llama proxy).
- `src/i18n/routing.ts`, `navigation.ts`, `request.ts`, `next-intl.d.ts`: rutas de la sección 4, `as-needed`, sin detección por navegador, idioma por `next/root-params`, mensajes tipados.
- `src/i18n/mensajes/en.json`, `es.json`: todos los textos de interfaz.
- `src/estilos/tokens.css`, `globales.css`: paleta aprobada, escala tipográfica fluida, estilos base accesibles y utilidades (arco, mosaico de pasta, velo, foco claro).
- `src/estilos/tipografia.ts`: opción B con `next/font`; cambiar a la opción A es editar solo este archivo.
- `src/lib/contenido/tipos.ts`, `index.ts`: tipos con la forma de Sanity y capa de acceso `server-only`.
- `src/lib/demo/*.ts`: 6 venues, 3 regiones, 9 categorías, 6 proveedores, configuración, episodio, guía y 3 historias, todo `[DEMO]`.
- `src/lib/i18n/localizar.ts`, `formato.ts`, `venues/filtros.ts`, `validacion/errores.ts`, `validacion/formularios.ts`, `navegacion.ts`, `seo/metadatos.ts`, `sitio.ts`, `utilidades.ts`: localización con respaldo al inglés, formatos Intl, lógica de filtros, esquemas zod, navegación, canonical y hreflang, variables del sitio.
- `src/components/ui/*`: Contenedor, Sobretitulo, Boton, Icono (SVG propios), ImagenContenido, Chip, Migas.
- `src/components/secciones/*`: Encabezado, MenuMovil, SelectorIdioma, Pie, EncabezadoSeccion, PaginaPendiente, ReproductorVideo, VideoHero, TarjetaVenue, TarjetaProveedor.
- `src/components/secciones/inicio/*`: las once secciones del inicio.
- `src/components/secciones/venues/*`: ListadoVenues, ListadoVenuesConUrl, PanelFiltros, ChipFiltro.
- `src/components/secciones/venue/*`: HeroVenue, FichaTecnica, SeccionesVenue, Galeria, BarraCtaMovil.
- `src/components/formularios/*`: campos accesibles, AvisoPiloto, formularios de guía y disponibilidad, `useFormularioPiloto`, `useHidratado`.
- `src/app/[locale]/layout.tsx`, `page.tsx`, `venues/page.tsx`, `venues/[slug]/page.tsx`: layout raíz y páginas del piloto.
- `src/app/[locale]/*/page.tsx` (13 rutas), `not-found.tsx`, `[...resto]/page.tsx`: páginas `[PENDIENTE]` y 404 localizado.
- `src/app/robots.ts`, `src/app/icon.svg`: robots según `SITIO_INDEXABLE` e icono propio.
- `public/demo/*.jpg` (53): imágenes de relleno marcadas "[DEMO] Foto pendiente".
- `scripts/generar-imagenes-demo.mjs`, `scripts/medir-build.mjs`: imágenes DEMO y medición de memoria del build.
- `vitest.config.mts`, `tests/unit/*`: 41 pruebas unitarias.
- `playwright.config.ts`, `playwright.capturas.config.ts`, `tests/e2e/*`: recorrido e2e con axe y capturas.
- `docs/PROMPT.md`, `DECISIONES.md`, `DESPLIEGUE.md`, `CONTENIDO.md`, `BITACORA.md`, `README.md`, `CHANGELOG.md`, `.env.example`: documentación.
- `docs/capturas/fase-p/*.jpg`, `docs/lighthouse/fase-p/*.html`: evidencia de este reporte.

### Dependencias agregadas

| Paquete                                              | Versión                    | Motivo                                                          |
| ---------------------------------------------------- | -------------------------- | --------------------------------------------------------------- |
| next / react / react-dom                             | 16.3.6 / 19.2.8 / 19.2.8   | framework (stack)                                               |
| next-intl                                            | 4.14.7                     | idiomas (stack)                                                 |
| zod                                                  | 4.6.5                      | validación compartida (stack)                                   |
| server-only                                          | 0.0.1                      | impide que la capa de datos llegue al cliente (aprobada, D-022) |
| typescript                                           | 6.0.3                      | stack; no 7.0 por typescript-eslint (D-001)                     |
| eslint / eslint-config-next / eslint-config-prettier | 9.39.5 / 16.3.6 / 10.1.8   | calidad (stack); ESLint 9 por compatibilidad de plugins (D-001) |
| prettier                                             | 3.9.9                      | calidad (stack)                                                 |
| tailwindcss / @tailwindcss/postcss                   | 4.3.3                      | estilos (stack)                                                 |
| vitest                                               | 5.0.2                      | pruebas unitarias (stack)                                       |
| @playwright/test / @axe-core/playwright              | 1.63.0 / 4.13.0            | e2e y accesibilidad (stack)                                     |
| @types/node / @types/react / @types/react-dom        | 24.19.0 / 19.2.18 / 19.2.7 | tipos                                                           |

Herramientas usadas sin agregarlas como dependencia: Lighthouse 13.5.0 (vía `npx`) y sharp 0.35.5 (ya viene con Next; lo usa el script de imágenes).

### Decisiones tomadas

Todas en [DECISIONES.md](DECISIONES.md): versiones (D-001), MariaDB (D-002), Fase P (D-003), idiomas (D-004), tipografía (D-005), paleta (D-006), datos DEMO (D-007), campos localizados (D-008), decisiones de la revisión aprobadas (D-009 a D-023), estático sin Cache Components (D-024), imágenes (D-025), filtros (D-026), formularios (D-027), no indexable (D-028), rutas pendientes (D-029), medición del build (D-030), zod al enviar (D-031) y envío tras hidratar (D-032).

### Supuestos

- Los nombres de venues y proveedores son nombres propios y no se traducen (D-008).
- Regiones del piloto: Mérida centro, Haciendas y Costa.
- Rangos de capacidad e inversión, y la regla de catering ("propio" y "externo" incluyen "ambos"), son `[DEMO]` hasta que definas los reales (D-026).
- Orden "destacados" del listado: nivel comercial, luego la marca editorial y luego el nombre (D-015).
- El formulario de la guía no pide país (captación corta); la columna `pais` de `suscriptores_guia` quedaría opcional.
- La navegación completa aparece desde 1280 px; por debajo se usa el menú.
- Entrevista y episodio usan un video público de Google for Developers como muestra, marcado `[DEMO]` (D-007).
- El favorito de la barra móvil solo avisa que la lista llega en la Fase 6.
- Los textos de consentimiento son provisionales y necesitan revisión legal.
- El dibujo del mapa y los datos estructurados (JSON-LD) quedan para las fases 3 y 7; la ficha ya muestra traslados y enlace a Google Maps.

### Verificación

| Comando                                | Resultado real                                                                                                                |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `npm run typecheck`                    | sin errores (TypeScript 6.0.3)                                                                                                |
| `npm run lint`                         | 0 problemas                                                                                                                   |
| `npm test`                             | 41 de 41 pruebas (4 archivos)                                                                                                 |
| `npm run build`                        | correcto; 2 idiomas × (inicio, listado, 6 fichas y 10 páginas pendientes) generados estáticos                                 |
| `npm run build:medido` (limpio)        | pico 2177 MB, 25 s (Windows, 16 CPU; ver `DESPLIEGUE.md`)                                                                     |
| `npm run test:e2e`                     | 18 de 18: 6 pruebas × 3 proyectos (móvil 360 px Chromium, escritorio 1440 px, móvil WebKit iPhone 13)                         |
| axe (en la suite e2e)                  | 0 violaciones serias o críticas WCAG 2.1 AA en `/`, `/venues`, `/venues/demo-hacienda-ejemplo-norte` y `/es/venues`           |
| `curl` al servidor de producción local | `/` responde en inglés aunque el navegador pida español; `/es` en español; `/en` redirige a `/`; cabecera `Link` con hreflang |

**Capturas** (página completa, JPEG): `docs/capturas/fase-p/inicio-360.jpg`, `inicio-768.jpg`, `inicio-1440.jpg`, `listado-360.jpg`, `listado-768.jpg`, `listado-1440.jpg`, `ficha-360.jpg`, `ficha-768.jpg`, `ficha-1440.jpg`. En las capturas móviles de la ficha, la barra fija aparece a la altura de la primera pantalla por cómo Playwright captura la página completa; en el navegador queda al pie de la pantalla.

**Lighthouse móvil local** (Lighthouse 13.5.0, 4G simulada, mediana de 3 corridas, build con `SITIO_INDEXABLE=true` y `NEXT_PUBLIC_SITE_URL` del servidor local). Reportes: `docs/lighthouse/fase-p/inicio-movil.html` y `ficha-movil.html`.

| Página | Rendimiento | Accesibilidad | Buenas prácticas | SEO | LCP   | CLS | TBT    | JS inicial (comprimido) |
| ------ | ----------- | ------------- | ---------------- | --- | ----- | --- | ------ | ----------------------- |
| Inicio | 91          | 100           | 100              | 100 | 3.1 s | 0   | 170 ms | 173 KB                  |
| Ficha  | 90          | 100           | 100              | 100 | 3.2 s | 0   | 190 ms | 184 KB                  |

La primera medición, con zod en el JS inicial, dio 79 y 81 de rendimiento con 264 y 272 KB de JS; de ahí D-031.

Contra los presupuestos de la sección 10: rendimiento, accesibilidad, buenas prácticas, SEO y CLS se cumplen. **No se cumplen LCP (< 2.5 s) ni el JS inicial (< 170 KB).** INP no se mide en laboratorio; el TBT (170–190 ms) es su indicador.

- JS inicial: la base de Next 16 y React 19 ya ocupa unos 129 KB (react-dom y runtime 69 KB, router 44 KB, resto 16 KB). A eso se suma el formateador ICU de next-intl (16 KB) y los componentes de cliente del piloto.
- LCP: la imagen llega rápido; el retraso es de pintado ("element render delay"), porque el hilo principal está ocupado ejecutando JS con la CPU ralentizada que simula Lighthouse.
- Plan para la Fase 3: quitar el formateador ICU del cliente (mensajes precompilados o textos ya formateados desde el servidor), reducir componentes de cliente (el selector de idioma aparece tres veces) y medir de nuevo con fotos reales.

### Pendientes y riesgos

- **Despliegue en Hostinger** (necesito que conectes GitHub en hPanel; pasos en `docs/DESPLIEGUE.md`, sección 2). Con él se completan: URL pública, versión de Node, límite y pico de memoria del build, comando de arranque y compatibilidad de `next/image`.
- LCP y JS inicial por encima del presupuesto (plan arriba).
- Safari iOS: la emulación WebKit pasa todas las pruebas; falta probar en un iPhone real.
- Contenido real: IDs de YouTube, fotos, loop del hero, textos editoriales, rangos de filtros y textos legales.
- Memoria del build en Hostinger con Sanity Studio embebido: la recomendación sobre `sanity deploy` (D-013) llega antes de la fase de CMS, con esta medición como base.
- npm muestra que la rama 9 de ESLint ya no tiene soporte; se migra a ESLint 10 cuando los plugins de `eslint-config-next` lo admitan.
- Qué encabezado trae la IP real detrás del proxy de Hostinger (afecta al límite de envíos, D-011): se verifica en la Fase 0 o 4.

### Commits

- `dddcb78` chore: inicializa proyecto Next.js 16.3.6 con TypeScript 6 estricto
- `ee24920` docs: agrega requisitos, registro de decisiones y guía inicial de despliegue
- `b9dbed6` feat(i18n): configura next-intl con rutas traducidas y sin detección de idioma
- `e4d8293` feat(diseno): agrega tokens de marca y tipografía autohospedada
- `719963e` feat(contenido): agrega tipos con forma de Sanity, datos DEMO y utilidades
- `79cecd5` feat(ui): agrega componentes base, encabezado, pie y páginas [PENDIENTE]
- `3732cb1` feat(inicio): construye la página de inicio del piloto
- `36aa802` feat(venues): agrega listado con filtros sincronizados con la URL
- `99cb266` feat(venues): agrega ficha de venue con entrevista, galería y barra fija móvil
- `cace77e` test(e2e): agrega recorrido inicio, listado y ficha en móvil y escritorio
- `c0b9dee` perf(formularios): carga los esquemas zod solo al enviar
- `db3e369` chore(despliegue): agrega medición de memoria del build
- Este reporte y la evidencia: `docs(bitacora): registra la Fase P con capturas y Lighthouse`
