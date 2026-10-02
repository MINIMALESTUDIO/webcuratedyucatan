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

---

## Fase 2 — CMS: base con edición visual (2026-09-28)

**Estado:** base completa y verificada en modo DEMO. **Falta crear el proyecto de Sanity**, que requiere que el titular inicie sesión una vez en la CLI (`npx sanity login`). Después se crean el proyecto, los tokens, el CORS y el webhook, se importan los datos DEMO, se publica el Studio y se completa la verificación con datos reales. La Fase P sigue pendiente del despliegue en Hostinger.

### Resumen

Modelo de contenido completo de la sección 6 en Sanity, con validaciones, ayudas para el editor, campos bilingües y documentos únicos protegidos. El Studio se configura en el repositorio y se publica aparte (D-013). El sitio lee de Sanity cuando está configurado y de los datos DEMO si no (D-033). La edición directa en la página funciona con la herramienta Presentation: clic en textos, imágenes, ficha técnica, videos y métricas, y vista previa de borradores (D-034). Incluye el webhook de revalidación firmado, la redirección 308 por slugs anteriores y los scripts de semilla y verificación de privacidad.

### Archivos creados / modificados

- `sanity.config.ts`, `sanity.cli.ts`: Studio con Contenido, "Editar en la página" y Consultas GROQ; publicado en `curatedyucatan.sanity.studio`.
- `sanity/schemas/*`: tipos de objeto (imagen con alt, YouTube, capítulo, cita, espacio, ficha técnica, SEO) y documentos (venue, región, proveedor, categoría, historia, episodio, guía, página editorial, configuración del sitio, contactos de leads privados).
- `sanity/estructura.ts`, `sanity/presentacion.ts`: menú del Studio con documentos únicos y relación documento ↔ página para la edición visual.
- `src/lib/sanity/*`: configuración pública, cliente con stega filtrado, `sanityFetch`, consultas GROQ proyectadas a los tipos del sitio, limpieza de null y codificador de `data-sanity`.
- `src/lib/contenido/fuente.ts`, `fuente-demo.ts`, `fuente-sanity.ts`, `index.ts`: contrato común y elección de fuente.
- `src/app/api/draft-mode/enable`, `disable`, `src/app/api/revalidar`: modo borrador y webhook firmado.
- `src/components/edicion/*`: edición visual con carga diferida y botón para salir de la vista previa.
- `src/components/ui/ImagenContenido.tsx` y componentes de secciones: loader del CDN de Sanity, punto de interés y origen de edición.
- `src/app/[locale]/layout.tsx`, `venues/[slug]/page.tsx`: edición visual en modo borrador, metadatos sin stega, redirección 308.
- `scripts/semilla-sanity.ts`, `scripts/verificar-privados-sanity.ts`: datos DEMO a Sanity y prueba de D-012.
- `tests/unit/edicion.test.ts`: el codificador propio equivale a `createDataAttribute`.
- `docs/CONTENIDO.md`, `DESPLIEGUE.md` (sección 7), `DECISIONES.md` (D-013, D-033 a D-035), `.env.example`, `README.md`, `CHANGELOG.md`.

### Dependencias agregadas

| Paquete             | Versión | Motivo                                                              |
| ------------------- | ------- | ------------------------------------------------------------------- |
| sanity              | 6.16.0  | Studio (stack)                                                      |
| next-sanity         | 13.3.4  | cliente, modo borrador, edición visual y loader de imágenes (stack) |
| @sanity/vision      | 6.16.0  | herramienta de consultas en el Studio                               |
| styled-components   | 6.5.3   | requerida por Sanity                                                |
| @portabletext/react | 7.0.1   | texto enriquecido; ya la usa next-sanity (D-035)                    |
| tsx                 | 4.23.15 | scripts TypeScript (aprobada, D-022)                                |

### Decisiones tomadas

D-013 (Studio publicado aparte), D-033 (dos fuentes de contenido), D-034 (edición visual) y D-035 (imágenes y dependencias), en [DECISIONES.md](DECISIONES.md).

### Supuestos

- El dataset `production` será público (plan gratuito); la privacidad de los contactos depende del ID `privado.*`, que se comprueba con `npm run sanity:verificar-privados` al crear el proyecto.
- El Studio queda en inglés (interfaz de Sanity) con títulos y ayudas en español; el paquete de idioma español del Studio sería una dependencia más.
- La interfaz del Studio no pide PDF para la guía DEMO (no existe); el campo queda marcado como pendiente.

### Verificación

| Comando                                          | Resultado real                                                               |
| ------------------------------------------------ | ---------------------------------------------------------------------------- |
| `npx sanity schemas validate`                    | 0 errores, 0 advertencias                                                    |
| `npm run studio:build`                           | correcto, ~7 s                                                               |
| `npm run typecheck` / `npm run lint`             | sin errores                                                                  |
| `npm test`                                       | 47 de 47 (5 archivos; incluye la equivalencia del codificador `data-sanity`) |
| `npm run build`                                  | correcto; todas las páginas siguen estáticas pese a leer `draftMode()`       |
| `npm run test:e2e`                               | 18 de 18 en modo DEMO                                                        |
| `npm run sanity:semilla`                         | 31 documentos con 53 imágenes                                                |
| Lighthouse móvil local (mediana de 3, modo DEMO) | inicio 91 con 179 KB de JS; ficha 89 con 190 KB                              |

Hallazgo durante la verificación: importar la edición visual de forma estática sumaba ~180 KB comprimidos a todas las páginas (JS inicial 373 KB, rendimiento 75). Se corrigió con carga diferida y el codificador propio (D-034).

### Pendientes y riesgos

- **Crear el proyecto de Sanity** (necesito tu inicio de sesión) y completar la verificación: importación, privacidad de contactos, "Editar en la página" de punta a punta y webhook.
- Configurar el webhook y las variables de Sanity en Hostinger cuando exista el despliegue.
- La CSP de la Fase 7 debe permitir que el Studio muestre el sitio en un iframe.
- `npm audit`: 15 alertas en la cadena de herramientas de la CLI de Sanity, no en el sitio (D-035).
- Tipos generados con Sanity TypeGen: pendiente; hoy las consultas se tipan a mano contra `tipos.ts`.

---

## Fase R — Realineación con la dirección del proyecto (2026-09-29)

**Estado:** completa en modo DEMO, pendiente de tu revisión. El envío real de formularios sigue en la Fase 4 y el proyecto de Sanity sigue sin crearse (falta `npx sanity login`).

### Resumen

El sitio se reconstruyó sobre los documentos de dirección (`docs/referencias/`): prompt visual, "Estructura y dirección web", estrategia LOVE MÉXICO 2026 y el libro impreso, analizado página por página. Donde chocan con PROMPT.md, mandan esos documentos (D-038).

- **Sistema visual del libro:** negro sobre blanco, fotografía protagonista, filetes finos y mucho aire. Montserrat, Cinzel y Questrial (sustituto medido de Century Gothic).
- **Mapa del sitio del documento:** Home con sus siete bloques, Discover Yucatán, Venues con tres colecciones, Catering, Photography, Design & Production (Minimal), Curated Journal, About, Find Your Yucatán y Plan Your Event.
- **Modelo, datos y Studio:** modelo de contenido, datos DEMO y Studio de Sanity reescritos para esa estructura, con la edición en la página.

### Archivos creados / modificados

- **Base visual:**
  - `src/estilos/tokens.css`, `globales.css`, `tipografia.ts`: paleta y tipografía nuevas.
  - `scripts/generar-imagenes-demo.mjs` y `public/demo/`: 114 marcadores neutros.
- **Modelo:**
  - `src/lib/contenido/tipos.ts`, `derivados.ts`, `fuente.ts`, `fuente-demo.ts`, `fuente-sanity.ts`, `index.ts`.
  - `src/lib/demo/*`: colecciones, venues, partners, Minimal, Journal, Discover y páginas.
- **Lógica:**
  - `src/lib/venues/filtros.ts`: filtros del documento.
  - `src/lib/descubrimiento/encuentra.ts`: Find Your Yucatán.
  - `src/lib/validacion/*`: Plan Your Event y selección.
- **Rutas:**
  - `src/i18n/routing.ts` y `src/lib/navegacion.ts`.
  - Páginas nuevas en `src/app/[locale]/`: descubre-yucatan, catering, fotografia, diseno-y-produccion, journal, nosotros, encuentra-tu-yucatan, planea-tu-evento y privacidad.
  - Se retiraron nueve rutas.
- **Componentes:**
  - Rehechos: encabezado de dos niveles, menú, pie, tarjetas de venue, partner y artículo, inicio (siete bloques), ficha de venue, listado con colecciones y panel de filtros, reproductor y galería.
  - Nuevos: perfil de partner, página editorial y Find Your Yucatán.
  - Formularios de solicitud y de selección.
- **Sanity:** esquemas, estructura del Studio, Presentation, consultas GROQ y semilla.
- **Pruebas:**
  - `tests/unit/*`: filtros, validación, datos, y Find Your Yucatán nueva.
  - `tests/e2e/recorrido.spec.ts` y `paginas.captura.ts`.
- **Documentación:**
  - `docs/DECISIONES.md` (D-036 a D-046).
  - Entrada nueva en el registro de cambios de `docs/PROMPT.md`.
  - `docs/CONTENIDO.md`, `docs/DESPLIEGUE.md` (filtro del webhook), `README.md`, `docs/ANALISIS_DIRECCION.md` (sección 13).
  - Evidencia en `docs/capturas/fase-r/` y `docs/lighthouse/fase-r/`.

### Dependencias

**Ninguna nueva.** Questrial, Cinzel y Montserrat llegan con `next/font`. Herramientas usadas sin agregarlas al proyecto:

- Lighthouse 13.5.0 (vía `npx`);
- PyMuPDF, en un entorno aislado de la carpeta temporal, solo para analizar el PDF del libro.

### Decisiones tomadas

Detalle en [DECISIONES.md](DECISIONES.md):

- D-036 (tipografía) y D-037 (sistema visual) reemplazan D-005 y D-006.
- D-038: la dirección manda sobre PROMPT.md.
- D-039 a D-044: colecciones, venues, Find Your Yucatán, formularios, partners y contenido editorial.
- D-045: el constructor de bloques queda aplazado.
- D-046: rendimiento de la imagen principal y las fuentes.

### Supuestos (por validar)

1. **Tres colecciones** (documento de estructura) y no los dos estilos del libro (volumen II, borrador). Cambiarlo es editar documentos en Sanity.
2. **Se mantiene el español** con URL traducidas; el inglés es el idioma por defecto.
3. **Formulario de solicitud:** Company obligatoria y Message opcional.
4. Las **entrevistas de YouTube** se quedan como "la película" de cada venue (el libro presenta la serie "El Lugar de Tu Historia").
5. Se retiran la **guía descargable** (el libro no se regala) y la **shortlist**.
6. Los **rangos de capacidad** y los atributos de venues son [DEMO].

### Verificación

| Comando                                                | Resultado real                                                                                          |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `npm run lint` / `npm run typecheck`                   | sin errores ni avisos                                                                                   |
| `npm test`                                             | 50 de 50 (6 archivos; incluye las reglas de Find Your Yucatán y los datos derivados)                    |
| `npx sanity schemas validate` / `npm run studio:build` | 0 errores y 0 avisos / correcto                                                                         |
| `npm run sanity:semilla`                               | 31 documentos del modelo nuevo                                                                          |
| `npm run build:medido`                                 | correcto, todas las páginas estáticas; memoria pico 2293 MB, 18 s                                       |
| `npm run test:e2e`                                     | 27 de 27 en móvil, escritorio y WebKit, dos corridas seguidas; axe sin violaciones serias en 13 páginas |
| `npm run capturas`                                     | 30 capturas (10 páginas × 360, 768 y 1440 px)                                                           |
| Lighthouse móvil (mediana de 3)                        | ver la tabla de abajo                                                                                   |

Lighthouse móvil, mediana de 3 corridas, en modo DEMO con 4G simulada:

| Página | Rendimiento | Accesibilidad | Buenas prácticas | SEO | LCP    | CLS | JS inicial |
| ------ | ----------- | ------------- | ---------------- | --- | ------ | --- | ---------- |
| Inicio | 88          | 100           | 100              | 100 | 3.65 s | 0   | 169 KB     |
| Ficha  | 88          | 100           | 100              | 100 | 3.75 s | 0   | 185 KB     |

**Hallazgos de la verificación:**

- La imagen principal se pedía con prioridad baja y la itálica de Montserrat se precargaba; ambas cosas se corrigieron (D-046).
- El LCP observado es de 1.3 s; el simulado sube por el JavaScript del framework con la CPU 4 veces más lenta.
- La corrección de accesibilidad de los capítulos (nombre accesible que incluye el texto visible, pedida en la Fase C) va incluida y la cubre una prueba e2e.

### Pendientes y riesgos

- **Rendimiento:** 88 frente al presupuesto de 90, y LCP simulado de 3.7 s frente a 2.5 s. La ficha lleva 185 KB de JS: los componentes interactivos de galería, película y formulario justifican pasar de 170 KB. Propuesta: imágenes renderizadas en el servidor con un loader global, para reducir la hidratación, y medir en Hostinger.
- **Contenido real:** venues verificados, partners, Minimal y los artículos del Journal. El libro sirve de referencia visual pero no como fuente de datos: es un borrador con los títulos de los venues cruzados.
- **Fotografías originales** en alta resolución y confirmar que la autorización "for editorial purposes" cubre la web.
- **Backend (Fase 4):** Plan Your Event, solicitud de información y guardado de la selección no envían nada todavía. Falta la captura de UTM para medir los QR.
- **Sanity:** crear el proyecto (tu `npx sanity login`), importar la semilla, validar los documentos contra el esquema y probar la edición en la página de punta a punta.
- **Decisiones abiertas:** 2 o 3 colecciones; MasQueAyer dentro o fuera de Design & Production; destino del QR 03 y del QR de la videoteca; fecha de LOVE MÉXICO.
- **Fase C** (constructor de bloques): replantear sobre esta estructura.

---

## Fase 2 — CMS: proyecto de Sanity conectado (2026-09-30)

**Estado:** puesta en marcha completa. Falta tu prueba de "Editar en la página" desde el Studio publicado; el webhook y la URL de vista previa definitiva esperan el despliegue en Hostinger.

### Resumen

El titular creó el proyecto `bx8gqx3p` en sanity.io e inició sesión en la CLI. Desde la línea de comandos se hizo lo siguiente:

- se importaron los datos DEMO;
- se validaron contra el esquema y se comprobó la privacidad de los contactos;
- se creó el token de solo lectura y se configuraron los orígenes permitidos (CORS);
- se conectó el sitio y se publicó el Studio en https://curatedyucatan.sanity.studio.

No se usó el asistente "npm create sanity" que sugiere Sanity: el Studio ya vivía en el repositorio con los esquemas de la Fase R (D-013), y ese asistente habría creado un segundo Studio vacío.

### Archivos modificados

- `sanity.cli.ts` y `sanity.config.ts`: el proyecto `bx8gqx3p` como valor por defecto (el ID es público) y el `appId` del Studio publicado.
- `scripts/verificar-privados-sanity.ts`: corregido. Nunca se había podido ejecutar: usaba await de nivel superior y tsx lo corre como CommonJS.
- `scripts/semilla-sanity.ts`: la instrucción de importación usa `--dataset` (el argumento posicional está obsoleto).
- `playwright.config.ts`: espera de 10 s por comprobación, porque con las imágenes del CDN de Sanity WebKit hidrata después de los 5 s por defecto.
- `.gitignore`, `.prettierignore`, `eslint.config.mjs` y `tsconfig.json`: excluyen `dist/`, donde `sanity deploy` compila el Studio.
- `docs/DESPLIEGUE.md`: sección 7.1 con el estado real de cada paso.
- `.env.local` (no se sube): ID de proyecto, token de lectura y secreto del webhook.

### Verificación

| Comprobación                                                 | Resultado real                                                                                    |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| `npx sanity dataset import … --dataset production --replace` | 31 documentos y 114 imágenes                                                                      |
| `npx sanity documents validate --dataset production`         | 31 válidos, 0 errores, 0 avisos                                                                   |
| `npm run sanity:verificar-privados`                          | 0 documentos privados visibles sin token y 1 con el token del servidor (D-012)                    |
| Token de lectura                                             | creado con rol Viewer, guardado en `.env.local` sin imprimirse                                    |
| CORS                                                         | `localhost:3333`, `localhost:3000` y `https://curatedyucatan.sanity.studio`, con credenciales     |
| `npm run build` con `NEXT_PUBLIC_SANITY_PROJECT_ID`          | correcto; todas las páginas estáticas con los slugs de Sanity, sin avisos de documentos faltantes |
| `npm run test:e2e` contra el sitio con Sanity                | 27 de 27                                                                                          |
| `/api/draft-mode/enable` con secreto falso                   | 401 "Invalid secret", sin cookie                                                                  |
| `/api/revalidar` con la firma del secreto real               | 200 y etiquetas `venue` y `venue:demo-casona-ejemplo-centro`                                      |
| Imágenes de la ficha                                         | 136 referencias al CDN `cdn.sanity.io/images/bx8gqx3p`                                            |
| `npx sanity deploy`                                          | https://curatedyucatan.sanity.studio (responde con redirección al login de Sanity)                |
| Build publicado del Studio                                   | revisados 144 archivos: sin token ni secreto; solo el ID de proyecto y la URL de vista previa     |

### Pendientes

- **Tu prueba de "Editar en la página"** con el sitio local encendido. Verifica que funcione el refresco de los borradores sin token en el navegador (D-034).
- **Con la URL de Hostinger:**
  - volver a publicar el Studio con `SANITY_STUDIO_PREVIEW_URL`;
  - agregar esa URL a CORS;
  - crear el webhook (sección 7.2);
  - cargar en hPanel `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_STUDIO_URL`, `SANITY_API_READ_TOKEN` y `SANITY_REVALIDATE_SECRET`.
- **Invitar al equipo** que editará contenido desde sanity.io/manage (Members).
- **Build del Studio:** copia `public/demo/` (2 MB) porque Vite toma `public/` como carpeta estática. No afecta al sitio; se revisará si molesta.

## Contenido real: venues desde el Drive (2026-10-02)

**Estado:** hecho y verificado en modo DEMO. Sanity todavía tiene los venues de ejemplo; falta importar la semilla (ver Pendientes).

### Resumen

Se volvió a leer "FICHAS DE VENUES" (solo lectura, sin tocar el Drive). Ahora trae 18 venues: 4 en Contemporary Sanctuaries, 6 en Organic Estates y 8 en Timeless Venues. Reemplazan a los seis venues de ejemplo con su nombre, dirección, datos rápidos, About, espacios y Curated Note reales (D-047). Los destacados del inicio son los cuatro de Home > Featured Venues: Sac Chich, Chablé, San Antonio Hool y San Diego Cutz.

### Archivos modificados

- `src/lib/demo/venues.ts`: los 18 venues. El comentario inicial explica qué es copy real, qué se derivó y qué sigue en DEMO.
- `src/lib/contenido/tipos.ts`, `derivados.ts`, `fuente-sanity.ts`, `src/lib/sanity/consultas.ts`, `sanity/schemas/objetos.ts` y `sanity/schemas/documentos/venue.ts`: campos opcionales nuevos (D-047).
- `src/components/secciones/venue/DatosClave.tsx`: Quick facts con los textos de la ficha, la dirección, y los minutos solo si existen.
- `SeccionesVenue.tsx`: una nota única sin título se muestra como párrafo a lo ancho de lectura.
- `TarjetaVenue.tsx`: los minutos son opcionales.
- `src/app/[locale]/venues/page.tsx`: el filtro Location solo ofrece regiones con venues.
- `src/i18n/mensajes/*.json`: `Venue.datos.soloHabitaciones` y `conHospedaje`. Corrige el "up to 0 guests" que salía cuando había habitaciones sin cifra de huéspedes.
- Pruebas: datos reales (18 venues, colecciones 4/6/8, destacados), entorno de la ficha, y recorrido e2e por Organic Estates → "Up to 200" → Hacienda Sac Chich con comprobación de sus Quick facts.

### Verificación

| Comprobación                                      | Resultado real                                                                                                      |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `tsc`, ESLint                                     | sin errores                                                                                                         |
| Vitest                                            | 53 de 53                                                                                                            |
| `npm run build` en modo DEMO (con `.next` limpio) | correcto, 36 fichas de venue (18 × 2 idiomas)                                                                       |
| Playwright (móvil, escritorio, WebKit)            | 24 de 24, incluido axe en 13 páginas (la prueba de la película se retiró, D-047)                                    |
| Revisión visual                                   | Quick facts de Chablé con dirección, hospedaje, estilo e interior/exterior de la ficha; listado móvil con 18 venues |

Nota: el primer build reutilizó componentes compilados viejos y mostraba los Quick facts anteriores aunque las pruebas pasaban. Borrar `.next` lo resolvió, y el e2e ahora comprueba esos textos.

### No se muestran (líneas de la ficha que no son espacios ni datos rápidos)

- San Antonio Hool: "Catering service: Available for up to 150 guests."
- Yaxcopoil: "Civil or symbolic ceremony: 100–600 guests." Los formatos de banquete y cóctel (800) quedan cubiertos por la capacidad.
- Casa Faller: "Cocktail: Up to 300 guests."
- San Juan Opichén: "Cocktail: Up to 250 guests" y "Covered areas: 3 / Outdoor areas: 4". Sus espacios con nombre sí se muestran.
- San Pedro Ochil: "historic event spaces" (sin nombre).
- Dzibikak: el desglose de las 6 habitaciones. Se muestra "6 rooms · up to 20 guests".

### Pendientes

- **Fotos:** FOTOS VENUES está vacía; los marcadores `[DEMO]` siguen hasta que lleguen.
- **Por confirmar con el equipo:**
  - Xtepén dice "8 rooms, including Deluxe, Junior Suite and Master Suites", la misma frase que San Antonio Hool (la versión anterior de la ficha no mencionaba hospedaje);
  - San Pedro Ochil, San Antonio Millet y San Juan Opichén muestran "Not specified" en hospedaje, tal como lo dice la ficha;
  - Santa Rosa de Lima, Casona 333 y San Juan Opichén no traen minutos al centro;
  - los atributos y el tipo de cada espacio son derivados (D-047).
- **Traducción al español** del copy de venues.
- **Sanity:** `npm run sanity:semilla` ya genera los 18 venues. Importarlos con `--replace` sobrescribe lo que se haya editado en el Studio, así que se hará cuando lo apruebes.

## Discover Yucatán: páginas de categoría (2026-10-02)

**Estado:** hecho y verificado en modo DEMO. Sanity necesita `sanity deploy` y la importación de la semilla para editar las categorías (ver Pendientes).

### Resumen

Se leyeron (solo lectura) los siete documentos de 01_WEB/02_DISCOVER YUCATAN. "00 — ESTRUCTURA GENERAL" define la portada y las seis categorías con su microdescripción. Cada categoría tiene un documento con hero, 6 a 8 secciones y "Continue exploring". Las carpetas MEDIA solo traen la lista de fotos necesarias.

- **Seis páginas nuevas:** `/discover-yucatan/architecture`, `culture`, `gastronomy`, `history`, `nature` y `experiences` (en español, bajo `/es/descubre-yucatan/…`). Llevan el copy completo de su documento (D-048).
- **Portada:** el mismo diseño, con las seis categorías como bloques que llevan a su página. Su entradilla `[DEMO]` pasa a ser el texto real del hero de "00 — ESTRUCTURA GENERAL".
- **Inicio:** el mosaico de Discover muestra las seis categorías (antes eran siete temas con anclas) y cada una lleva a su página.

### Archivos

- Nuevos:
  - `src/lib/demo/descubre.ts`: portada y seis categorías;
  - `src/app/[locale]/descubre-yucatan/[categoria]/page.tsx`;
  - `src/components/secciones/descubre/NavegacionCategorias.tsx` y `TarjetaCategoria.tsx`.
- Modificados:
  - `src/app/[locale]/descubre-yucatan/page.tsx`, `src/app/[locale]/page.tsx` y `SeccionDescubre.tsx` (mosaico de 6);
  - `src/i18n/routing.ts` (16 rutas) y los mensajes `Descubre.categorias`, `descubrir` y `continua`, en ambos idiomas;
  - `tipos.ts`, las fuentes DEMO y Sanity, `consultas.ts`, los esquemas (`categoriaDescubre`; sin `descubreYucatan.secciones` ni `descubre.temas`), `estructura.ts` (Discover Yucatán → Portada / Categorías) y `presentacion.ts`;
  - `scripts/generar-imagenes-demo.mjs` (hero y 4 fotos por categoría) y `scripts/semilla-sanity.ts`;
  - pruebas: rutas, copy real sin notas internas, relacionadas, imágenes, capa de contenido, recorrido e2e por Discover y axe en `/discover-yucatan/architecture`.

### Verificación

| Comprobación                                      | Resultado real                                                                                                              |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `tsc`, ESLint                                     | sin errores                                                                                                                 |
| Vitest                                            | 54 de 54                                                                                                                    |
| `npm run build` en modo DEMO (con `.next` limpio) | correcto, 12 páginas de categoría (6 × 2 idiomas)                                                                           |
| Playwright (móvil, escritorio, WebKit)            | 27 de 27, incluido axe en 14 páginas                                                                                        |
| Revisión visual                                   | portada sin cambios de diseño; mosaico del inicio sin huecos en escritorio y móvil; hero, navegación y "Continue exploring" |

Se corrigió en la revisión visual el sobretítulo del hero, que salía gris sobre la foto: el color del componente ganaba al blanco.

### Pendientes

- **Fotos** de las seis categorías (MEDIA).
- **Traducción al español** del copy.
- **Sanity:** `npx sanity deploy` para publicar el esquema nuevo e importar la semilla. La semilla ya trae las seis categorías y los 18 venues; la importación espera tu aprobación porque sobrescribe lo editado en el Studio.

## Versión provisional en línea: Railway (2026-10-02)

**Estado:** en línea y verificada en https://sitio-production-4d31.up.railway.app (D-049).

### Resumen

Con los conectores de Railway y GitHub se hizo lo siguiente:

- se creó el proyecto `curatedyucatan` con el servicio `sitio`;
- se generó la URL pública;
- se cargaron solo `NEXT_PUBLIC_SITE_URL` y `SITIO_INDEXABLE=false`;
- se conectó el repositorio en `main`.

El primer build tardó unos 2 minutos. Desde ahora, cada `git push` a `main` vuelve a publicar. El sitio usa el contenido local (los 18 venues y Discover con sus seis páginas) y no lleva secretos.

### Verificación

Ver DESPLIEGUE.md, sección 8.1:

- 13 rutas en 200 y una inexistente en 404;
- robots y `noindex` activos;
- WebP en `/_next/image`;
- sin redirección por idioma;
- Playwright contra la URL remota: 24 de 27. Las 3 fallas son una prueba que exige `localhost` en la URL; esa comprobación se hizo con curl.

### Pendientes

- Conectar Sanity aquí después de importar la semilla (DESPLIEGUE.md, sección 8.2).
- Dominio y QR: después, siempre con el dominio definitivo.
- Mudanza a Hostinger (DESPLIEGUE.md, sección 8.3).
