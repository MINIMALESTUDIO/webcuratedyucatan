# Prompt de desarrollo — Sitio web Curated Yucatán

> Pega este documento completo como primera instrucción en Claude Code, o guárdalo en la raíz del repositorio como `docs/PROMPT.md` y pídele que lo lea antes de empezar.

> **Registro de cambios de este documento**
>
> - 2026-09-28: se agrega la **Fase P (piloto visual)** antes de la Fase 0 por decisión del responsable del proyecto (ver D-003 en `docs/DECISIONES.md`).
> - 2026-09-28: sección 6 — se agrega el campo `slugsAnteriores` a `venue` y `proveedor` (ver D-021).
> - 2026-09-28: sección 15 — se agrega `SANITY_API_WRITE_TOKEN`, solo para uso local (ver D-021).
> - Otras decisiones aprobadas que precisan este documento sin cambiar su texto: base de datos MariaDB en Hostinger (D-002), redirecciones permanentes 308 (D-020), límite de envíos sin `DELETE` (D-011), `contactoLeads` en documentos `privado.*` (D-012). La lista completa está en `docs/DECISIONES.md`.

---

## 0. Rol y forma de trabajo

Eres el desarrollador principal de este proyecto. Trabajas por fases, con puntos de control donde te detienes y esperas mi aprobación. Tu prioridad es que cada decisión y cada cambio sean **auditables**: que yo pueda saber qué hiciste, por qué, cómo lo verificaste y qué quedó pendiente.

### Reglas obligatorias

1. **No avances de fase sin aprobación.** Al terminar cada fase, entrega el reporte de fase (sección 13) y espera mi respuesta.
2. **Antes de empezar cada fase**, presenta un plan breve: objetivos, archivos que vas a crear o modificar, dependencias nuevas y riesgos. Espera aprobación si el plan se desvía de este documento.
3. **No inventes contenido real.** No escribas datos, precios, capacidades, citas ni descripciones de venues o proveedores reales. Usa datos de ejemplo claramente marcados con el prefijo `[DEMO]` y textos pendientes con `[PENDIENTE]`.
4. **No agregues dependencias fuera del stack** (sección 2) sin justificarlas en `docs/DECISIONES.md` y avisarme en el reporte.
5. **Si algo es ambiguo, pregunta** antes de asumir. Si debes asumir para no bloquearte, regístralo como supuesto en el reporte.
6. **Verifica, no supongas.** Ejecuta build, lint, typecheck y pruebas antes de declarar algo terminado, y reporta los resultados reales (incluidos errores).
7. **Commits pequeños y atómicos**, en español, con formato Conventional Commits: `feat(venues): agrega filtros por región`, `fix(leads): valida fecha de boda futura`, etc.
8. **Idioma de trabajo:** comentarios, documentación, commits y reportes en español. Nombres de variables y funciones en español salvo cuando una convención del framework o librería requiera otro nombre. El contenido del sitio es bilingüe (sección 5).
9. **Nunca expongas secretos.** Ninguna llave privada puede llegar al código del navegador ni al repositorio.

---

## 1. Contexto del proyecto

**Curated Yucatán** promueve Yucatán, México, como destino para bodas, con una selección curada de venues y proveedores. Referencia de inspiración: https://www.neworleans.com/weddings/ (estructura de captación de leads, guía descargable, organización por tipo de venue y por momento del fin de semana de boda), pero con identidad editorial propia y mejor experiencia.

Activos existentes que el sitio debe integrar:
- **Canal de YouTube** con entrevistas largas a representantes de cada venue (el diferenciador principal).
- **Instagram** con contenido corto.
- **Publicación impresa** con cada venue detallado, sus espacios y galería.

**Audiencia principal:** parejas y wedding planners de EE. UU. y Canadá (inglés por defecto), secundaria: México y Latinoamérica (español).

**Objetivo de negocio:** generar solicitudes calificadas (leads) para venues y proveedores, y capturar contactos mediante la guía descargable.

---

## 2. Stack técnico (fijo)

| Capa | Tecnología |
|---|---|
| Framework | Next.js (App Router), última versión estable compatible con el Node.js disponible en Hostinger |
| Lenguaje | TypeScript en modo `strict` |
| Estilos | Tailwind CSS con tokens de diseño en variables CSS |
| Idiomas | next-intl |
| CMS | Sanity (Studio embebido en `/studio`, protegido por el login de Sanity) |
| Base de datos | MySQL administrado incluido en Hostinger Business, accedido **solo desde el servidor** |
| ORM y migraciones | Drizzle ORM + drizzle-kit, driver `mysql2` |
| Desarrollo local | MySQL en Docker (misma versión mayor que producción) |
| Correo transaccional | Resend |
| Anti-spam | Cloudflare Turnstile |
| Validación | zod (compartida entre cliente y servidor) |
| Video | YouTube embebido con componente ligero (lite-youtube o equivalente para React); loops del hero como MP4/WebM autohospedados |
| Pruebas | Vitest (unitarias), Playwright (e2e), @axe-core/playwright (accesibilidad) |
| Calidad | ESLint, Prettier, Lighthouse CI |
| Hosting | Hostinger, plan Business, hosting Node.js con despliegue automático desde GitHub |

Registra en `docs/DECISIONES.md` la versión exacta de cada dependencia principal y la versión de Node.js usada.

---

## 3. Estructura de carpetas

```
/
├─ docs/
│  ├─ PROMPT.md            # este documento
│  ├─ DECISIONES.md        # registro de decisiones (formato ADR breve)
│  ├─ BITACORA.md          # un reporte por fase
│  ├─ DESPLIEGUE.md        # pasos exactos para Hostinger
│  └─ CONTENIDO.md         # guía para quien carga contenido en Sanity
├─ src/
│  ├─ app/
│  │  ├─ [locale]/         # páginas públicas
│  │  ├─ api/              # route handlers
│  │  └─ studio/           # Sanity Studio
│  ├─ components/
│  │  ├─ ui/               # primitivos (Boton, Tarjeta, Chip, etc.)
│  │  ├─ secciones/        # bloques de página (Hero, GridVenues, etc.)
│  │  └─ formularios/
│  ├─ lib/
│  │  ├─ sanity/           # cliente, queries GROQ, tipos
│  │  ├─ db/               # conexión, esquema Drizzle y consultas
│  │  ├─ correo/           # plantillas y envío
│  │  ├─ validacion/       # esquemas zod
│  │  └─ seo/              # metadata y JSON-LD
│  ├─ i18n/                # configuración y mensajes en/es
│  └─ estilos/
├─ sanity/
│  └─ schemas/
├─ drizzle/
│  └─ migraciones/         # SQL generado y versionado por drizzle-kit
├─ docker-compose.yml      # MySQL local para desarrollo
├─ tests/
│  ├─ unit/
│  └─ e2e/
├─ .env.example            # todas las variables, sin valores reales
└─ CHANGELOG.md
```

---

## 4. Mapa del sitio y rutas

Inglés sin prefijo (`/`), español con prefijo (`/es`). Configurar `localePrefix: 'as-needed'` y rutas traducidas donde tenga sentido.

| Ruta (EN) | Ruta (ES) | Contenido |
|---|---|---|
| `/` | `/es` | Home |
| `/venues` | `/es/venues` | Listado con filtros |
| `/venues/[slug]` | `/es/venues/[slug]` | Ficha de venue |
| `/vendors` | `/es/proveedores` | Proveedores por categoría |
| `/vendors/[slug]` | `/es/proveedores/[slug]` | Ficha de proveedor |
| `/wedding-weekend` | `/es/fin-de-semana` | Pre y post boda, tours, luna de miel |
| `/plan-your-wedding` | `/es/planea-tu-boda` | Logística, clima, trámites, presupuesto |
| `/venue-tours` | `/es/venue-tours` | Videoteca organizada |
| `/guide` | `/es/guia` | Guía digital + descarga con correo |
| `/stories` | `/es/historias` | Blog y bodas reales |
| `/stories/[slug]` | `/es/historias/[slug]` | Artículo |
| `/planning-assistance` | `/es/asesoria` | Formulario de asesoría gratuita |
| `/partners` | `/es/aliados` | Página B2B para venues y proveedores |
| `/shortlist` | `/es/mi-lista` | Lista de favoritos del usuario |
| `/shortlist/[id]` | `/es/mi-lista/[id]` | Lista compartida (solo lectura) |
| `/privacy` | `/es/privacidad` | Aviso de privacidad |

Además: `sitemap.xml`, `robots.txt`, páginas 404 y 500 con diseño propio en ambos idiomas.

---

## 5. Idiomas

- Idioma por defecto: inglés. Segundo idioma: español.
- Textos de interfaz en `src/i18n/mensajes/en.json` y `es.json`. Ninguna cadena de interfaz puede estar escrita directamente en un componente.
- Contenido editorial traducido **por campo** en Sanity (cada campo de texto tiene versión `en` y `es`).
- Si falta la traducción de un campo, mostrar la versión en inglés y registrar la falta en consola solo en desarrollo.
- Selector de idioma visible en encabezado y pie, que mantiene la página actual.
- `hreflang` y `alternates` correctos en todas las páginas.
- Formatos de fecha, número y moneda con `Intl` según el idioma. Los rangos de inversión se muestran en USD.

---

## 6. Modelo de contenido (Sanity)

Todos los campos de texto visibles son bilingües salvo que se indique lo contrario. Añade validaciones en Studio (obligatorios, rangos, longitudes máximas) y descripciones de ayuda para el editor.

### `venue`
- `nombre`, `slug` (único), `slugsAnteriores` (opcional; slugs previos para redirigir con 308, ver sección 12), `destacado` (booleano), `nivelListado` (`basico` | `video` | `destacado`), `publicado`
- `region` → referencia a `region`
- `tipos` → arreglo (`hacienda`, `ciudad-colonial`, `playa`, `cenote-selva`, `boutique`, `otro`)
- `resumen` (máx. 200 caracteres), `descripcion` (texto enriquecido)
- `fichaTecnica`:
  - `capacidadCeremoniaMax`, `capacidadCoctelMax`, `capacidadBanqueteMax` (números)
  - `hospedaje`: `tieneHospedaje`, `habitaciones`, `huespedesMax`
  - `catering`: `propio` | `externo` | `ambos`
  - `horarioLimiteMusica` (texto corto)
  - `minutosAeropuertoMID`, `minutosCentroMerida`
  - `inversionDesdeUSD` (número, opcional)
  - `mejorTemporada` (texto corto)
  - `ubicacion` (geopoint)
- `media`: `imagenHero` (con texto alternativo obligatorio), `videoLoop` (archivo, opcional), `galeria` (imágenes con texto alternativo obligatorio)
- `entrevista`: `youtubeId`, `capitulos` → arreglo de `{ titulo, segundoInicio }`
- `citasDestacadas` → arreglo de `{ texto, autor, cargo }`
- `espacios` → arreglo de objetos `espacio`:
  - `nombre`, `descripcion`, `interiorExterior`, `capacidadCeremonia`, `capacidadCoctel`, `capacidadBanquete`, `imagenes`
- `proveedoresRecomendados` → referencias a `proveedor`
- `contactoLeads` (correo, **no visible en el sitio**)
- `seo`: `titulo`, `descripcion`, `imagenOG`

### `proveedor`
- `nombre`, `slug`, `slugsAnteriores` (opcional; slugs previos para redirigir con 308, ver sección 12), `categoria` → referencia, `resumen`, `descripcion`, `imagenes`, `sitioWeb`, `instagram`, `regionesQueCubre`, `contactoLeads` (no visible), `destacado`, `seo`

### `categoriaProveedor`
- `nombre`, `slug`, `icono`, `orden` (planners, foto y video, flores, mobiliario y renta, música, banquetes, belleza, transporte, hospedaje)

### `region`
- `nombre`, `slug`, `descripcion`, `imagen`, `orden` (Mérida centro, haciendas, costa, oriente y Valladolid, cenotes y selva, Izamal; editable)

### `historia`
- `titulo`, `slug`, `tipo` (`articulo` | `boda-real` | `lista`), `imagenPortada`, `extracto`, `cuerpo` (texto enriquecido con imágenes y embeds de YouTube), `venuesRelacionados`, `proveedoresRelacionados`, `fechaPublicacion`, `tiempoLectura` (calculado), `seo`

### `episodio`
- Para videos del canal no ligados a un venue: `titulo`, `youtubeId`, `descripcion`, `capitulos`, `venue` (referencia opcional), `fechaPublicacion`

### `guia`
- `edicion` (ej. "2027"), `portada`, `archivoPDF`, `paginasMuestra` (imágenes), `descripcion`, `activa`

### `paginaEditorial`
- Para Planea tu boda, Fin de semana, Aliados, Privacidad: `titulo`, `slug`, `secciones` (bloques reutilizables)

### `configuracionSitio` (singleton)
- Textos del home, frase del hero, video del hero (versión escritorio y móvil), enlaces de redes, correo de contacto, textos del sello "curated", métricas de credibilidad (venues visitados, horas de entrevista, ediciones impresas).

### Revalidación
- Webhook de Sanity → `POST /api/revalidar` con secreto. Usa `revalidateTag` por tipo de documento y por slug. Documenta la configuración en `docs/DESPLIEGUE.md`.

---

## 7. Base de datos (MySQL en Hostinger)

### Reglas generales
- Esquema definido en TypeScript con Drizzle en `src/lib/db/esquema.ts`. Migraciones generadas con drizzle-kit en `drizzle/migraciones/` y **siempre versionadas en Git**. Nunca modificar la base de producción a mano; todo cambio pasa por una migración.
- Motor InnoDB, codificación `utf8mb4` y collation `utf8mb4_unicode_ci` (acentos, ñ y emojis).
- Fechas en UTC (`DATETIME` o `TIMESTAMP` en UTC; convertir a zona local solo al mostrar).
- IDs: `CHAR(36)` con UUID generado en la aplicación (`crypto.randomUUID()`), salvo en `shortlists` (ver abajo).
- Arreglos (estilos, venues de interés, etc.) en columnas `JSON`, validados con zod antes de guardar.
- **Usuario de base de datos con permisos mínimos** para la app: solo `SELECT`, `INSERT` y `UPDATE` sobre las tablas del sitio. Las migraciones se ejecutan con un usuario distinto, nunca desde la app en producción.
- Conexión con **pool pequeño (3 a 5 conexiones)** y reutilizado entre peticiones (singleton), porque el plan compartido limita conexiones simultáneas. Manejar y registrar errores de conexión sin exponerlos al cliente.
- Índices en: `leads.creado_en`, `leads.correo`, `leads.estado`, `suscriptores_guia.correo`, `limites_envio (ip_hash, ruta, ventana_inicio)`.
- Nunca guardar la IP en claro: usar hash con sal secreta (`IP_HASH_SALT`).

### `leads`
`id` (CHAR(36)), `creado_en`, `tipo` (ENUM `asesoria` | `disponibilidad_venue` | `contacto_proveedor`), `nombre`, `correo`, `telefono` (opcional), `pais`, `idioma`, `fecha_boda` (fecha, nulable) y `fecha_flexible` (booleano), `invitados_aprox`, `presupuesto_rango`, `estilo` (JSON), `mensaje` (TEXT), `venues_interes` (JSON de slugs), `proveedor_slug` (opcional), `origen_url`, `utm_source`, `utm_medium`, `utm_campaign`, `consentimiento_privacidad` (booleano, obligatorio), `ip_hash`, `estado` (ENUM `nuevo` | `contactado` | `cerrado`, por defecto `nuevo`)

### `suscriptores_guia`
`id`, `creado_en`, `nombre`, `correo`, `idioma`, `pais`, `edicion_guia`, `consentimiento_privacidad`, `acepta_novedades`, `utm_source`, `utm_medium`, `utm_campaign`, `ip_hash`

### `shortlists`
`id` (CHAR(8), código corto aleatorio no secuencial, generado con un alfabeto sin caracteres ambiguos; reintentar si colisiona), `creado_en`, `venues` (JSON de slugs), `proveedores` (JSON de slugs), `nota` (opcional)

### `limites_envio`
Para limitar abusos: `ip_hash`, `ruta`, `ventana_inicio`, `conteo`. Limpiar registros viejos de forma periódica (documentar el mecanismo).

### Consulta de leads (mientras no exista panel)
Documentar en `docs/DESPLIEGUE.md` cómo consultar y exportar leads a CSV desde phpMyAdmin de Hostinger, e incluir un script `npm run exportar:leads` que genere un CSV por rango de fechas usando la conexión configurada.

## 8. Backend (route handlers)

Todos los endpoints: validan con zod, verifican Turnstile, aplican límite de envíos, responden JSON con forma consistente `{ ok, error?, datos? }`, registran errores sin exponer detalles al cliente, y tienen pruebas.

| Endpoint | Función |
|---|---|
| `POST /api/leads` | Guarda el lead, envía correo interno al equipo, envía copia al `contactoLeads` del venue o proveedor si existe, envía confirmación a la pareja en su idioma |
| `POST /api/guia` | Guarda suscriptor, envía correo con enlace de descarga del PDF (URL de Sanity o firmada) |
| `POST /api/shortlists` | Crea una lista compartible y devuelve su `id` |
| `POST /api/revalidar` | Revalida caché desde el webhook de Sanity (verifica secreto) |

La lectura de una shortlist compartida se hace en el componente de servidor de `/shortlist/[id]`, no por API pública.

Plantillas de correo en ambos idiomas, en `src/lib/correo/`, con diseño sencillo coherente con la marca y versión de texto plano.

---

## 9. Diseño

### Dirección de arte
Editorial de revista de viajes de lujo, coherente con la publicación impresa. Fotografía y video como protagonistas, mucho espacio en blanco, movimiento lento y sutil.

### Tokens (definir como variables CSS y mapearlos en Tailwind)
- **Colores:** `--cal` (blanco hueso, fondo), `--piedra` (caliza, superficies), `--almagre` (rojo de hacienda, color de marca y CTA), `--henequen` (verde, acentos), `--cenote` (turquesa, uso mínimo), `--tinta` (texto principal), `--tinta-suave` (texto secundario). Proponme valores hexadecimales con contraste AA verificado antes de fijarlos.
- **Tipografía:** una serif editorial de alto contraste para títulos y una sans legible para interfaz y datos, cargadas con `next/font` (autohospedadas, `display: swap`, solo pesos usados). Propón dos combinaciones y espera mi elección.
- **Escala tipográfica fluida** con `clamp()`.
- **Espaciado** en escala consistente (4/8 px).
- **Recursos gráficos:** máscaras de imagen en forma de arco (arquería de hacienda) y un patrón sutil inspirado en mosaico de pasta para separadores. Deben ser SVG ligeros.

### Componentes base
Botón (primario, secundario, texto), Tarjeta de venue, Tarjeta de proveedor, Chip de filtro, Ficha técnica, Galería con visor, Reproductor de entrevista con capítulos, Tarjeta de episodio, Encabezado, Menú móvil, Pie, Selector de idioma, Botón de favorito, Barra de CTA fija en móvil, Formularios con estados de carga, éxito y error.

Crea una página interna `/[locale]/_design` (excluida de sitemap y con `noindex`) que muestre todos los tokens y componentes, para revisión visual.

---

## 10. Responsivo y rendimiento (requisito central)

### Enfoque
**Mobile first.** Se diseña y prueba primero en 360 px de ancho y se escala hacia arriba.

Puntos de quiebre: `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`. El contenido no debe estirarse sin límite en pantallas grandes (ancho máximo de lectura y de contenedor definidos).

### Reglas de móvil
- Áreas táctiles de al menos 44 × 44 px.
- Estados `hover` solo dentro de `@media (hover: hover)`; en táctil, todo debe funcionar sin hover.
- Menú móvil accesible (foco atrapado, cierre con Escape, bloqueo de scroll del fondo).
- En la ficha de venue, barra fija inferior con CTA "Solicitar disponibilidad" y botón de favorito, respetando `env(safe-area-inset-bottom)`.
- Filtros del listado en un panel deslizable en móvil y barra lateral en escritorio.
- Galerías con gestos de deslizar en móvil y navegación con teclado en escritorio.
- Formularios con el `type` e `inputmode` correctos, `autocomplete` adecuado y sin zoom indeseado en iOS (tamaño de fuente de inputs ≥ 16 px).
- Unidades `dvh`/`svh` en lugar de `100vh` para secciones de pantalla completa.

### Video e imágenes
- Hero con video: imagen `poster` que se muestra de inmediato; el video carga después. Versión de video más ligera para móvil. No reproducir video si el usuario tiene `prefers-reduced-motion` o `Save-Data`; mostrar solo la imagen.
- Entrevistas de YouTube: se carga solo la miniatura hasta que el usuario da play. Los capítulos reinician el reproductor en el segundo indicado.
- Todas las imágenes con `next/image` o el constructor de URL de Sanity, con `sizes` correctos, formatos modernos y dimensiones definidas para evitar saltos de diseño. Solo la imagen principal de cada página usa prioridad de carga.

### Presupuestos (medidos en móvil con red 4G simulada)
- Lighthouse móvil: Rendimiento ≥ 90, Accesibilidad ≥ 95, Buenas prácticas ≥ 95, SEO ≥ 95.
- LCP < 2.5 s, CLS < 0.1, INP < 200 ms.
- JavaScript de primera carga en home y ficha de venue: reportar el tamaño y justificarlo si supera 170 KB comprimido.
- Preferir componentes de servidor; usar `"use client"` solo donde haya interactividad, y documentarlo.

### Accesibilidad
WCAG 2.1 AA: contraste, orden de foco visible, navegación completa con teclado, textos alternativos obligatorios, etiquetas en formularios, mensajes de error asociados a su campo, `lang` correcto por idioma, respeto a `prefers-reduced-motion`.

### Navegadores objetivo
Últimas 2 versiones de Chrome, Safari (macOS e iOS), Firefox y Edge, y Chrome en Android. Probar específicamente Safari iOS.

---

## 11. Funcionalidades por página

**Home:** hero con video y dos CTA; "Por qué Yucatán"; sello y proceso "curated"; explorar por paisaje (regiones y tipos); venues destacados con miniatura de video; último episodio; bloque de la guía; tradiciones yucatecas; categorías de proveedores; historias recientes; métricas de credibilidad; pie.

**Listado de venues:** filtros por región, tipo, capacidad de banquete (rangos), hospedaje en sitio, tipo de catering y rango de inversión. Los filtros se reflejan en la URL (se puede compartir y volver atrás). Contador de resultados, orden (destacados, capacidad, nombre) y estado vacío útil.

**Ficha de venue:** hero; ficha técnica; entrevista con capítulos; espacios con capacidades por formato; galería; citas; proveedores recomendados; mapa estático o ligero con tiempos de traslado (sin cargar una librería de mapas pesada en esta fase); venues similares; formulario de disponibilidad; datos estructurados.

**Shortlist:** guardado en `localStorage` con manejo de errores; contador en encabezado; página de lista; botón para compartir que crea el enlace; botón "solicitar información de todos" que prellena el formulario de asesoría.

**Guía:** portada, páginas de muestra, formulario de descarga, confirmación en pantalla y por correo.

**Asesoría:** formulario por pasos en móvil (fecha, invitados, estilo, presupuesto, datos de contacto) y en una sola vista en escritorio; guardar progreso en la sesión para no perder datos.

**Captura de UTM:** leer parámetros UTM al llegar, guardarlos en la sesión y adjuntarlos a cualquier lead o suscripción.

---

## 12. SEO

- `generateMetadata` en cada página con título, descripción, canonical, `alternates` por idioma e imagen OG.
- JSON-LD: `Organization` (sitio), `BreadcrumbList` (páginas internas), `Place` / `EventVenue` (venue), `VideoObject` (entrevistas), `Article` (historias), `LocalBusiness` (proveedores).
- `sitemap.xml` dinámico con ambos idiomas; `robots.txt`; `noindex` en `/studio`, `/_design` y listas compartidas.
- URLs limpias y estables; redirecciones 301 si cambia un slug (campo opcional `slugsAnteriores` en venue y proveedor).

---

## 13. Fases y criterios de aceptación

Cada fase termina con: build sin errores, lint y typecheck limpios, pruebas pasando, commit(s), entrada en `docs/BITACORA.md` y reporte de fase.

### Fase 0 — Preparación
- Inicializar el proyecto, TypeScript estricto, ESLint, Prettier, Tailwind, next-intl, Vitest y Playwright.
- `.env.example` completo y documentado.
- Crear `docs/` con los archivos de la sección 3.
- **Investigar y documentar** en `docs/DESPLIEGUE.md` los requisitos actuales del hosting Node.js de Hostinger plan Business (versión de Node, comando de build y de inicio, variables de entorno, integración con GitHub, compatibilidad con `next/image`). Si algo no es verificable, márcalo como "por confirmar".
- Documentar también la base de datos MySQL del plan: versión de MySQL, host que debe usar la app Node.js del mismo plan (interno o remoto), límite de conexiones simultáneas, si permite acceso remoto desde otra computadora con lista de IPs, y cómo crear usuarios con permisos específicos.
- Levantar MySQL local con `docker-compose.yml` usando la misma versión mayor que producción. Si Hostinger permite acceso remoto, **no** usar la base de producción para desarrollo de todos modos.
- **Aceptación:** `npm run dev` levanta una página "hola" en ambos idiomas; la app se conecta al MySQL local y ejecuta una consulta de prueba; `npm run build`, `lint`, `typecheck` y `test` pasan.

### Fase 1 — Sistema de diseño
- Tokens, tipografías (tras mi elección), componentes base y página `/_design`.
- **Aceptación:** `/_design` se ve correcta en 360, 768, 1280 y 1536 px; axe sin violaciones serias; captura de pantalla de cada ancho en el reporte.

### Fase 2 — CMS
- Esquemas de Sanity (sección 6), Studio en `/studio`, queries GROQ tipadas, datos `[DEMO]` para 6 venues, 10 proveedores, 3 historias y la configuración del sitio.
- `docs/CONTENIDO.md` explicando cómo cargar un venue completo.
- **Aceptación:** puedo crear y publicar un venue desde Studio y ver sus datos en una página de prueba.

### Fase 3 — Páginas núcleo
- Home, listado de venues con filtros y ficha de venue.
- **Aceptación:** presupuestos de la sección 10 cumplidos en home y ficha (reporte de Lighthouse incluido); pruebas e2e de navegación y filtros en viewport móvil y escritorio.

### Fase 4 — Backend
- Esquema Drizzle y migraciones de la sección 7 (aplicadas primero en local), endpoints de la sección 8, Turnstile, límite de envíos, plantillas de correo.
- Formularios de disponibilidad, asesoría y guía conectados.
- **Aceptación:** pruebas unitarias de validación; pruebas e2e del envío de cada formulario (con servicios externos simulados); evidencia de que ninguna llave privada ni credencial de base de datos aparece en el bundle del cliente; migraciones reproducibles desde cero en una base vacía.

### Fase 5 — Resto de páginas
- Proveedores, fin de semana, planea tu boda, venue tours, historias, aliados, privacidad, 404 y 500.
- **Aceptación:** todas las rutas de la sección 4 existen en ambos idiomas y pasan axe.

### Fase 6 — Shortlist
- Favoritos, página de lista, enlace compartible y solicitud múltiple.
- **Aceptación:** e2e del flujo completo en móvil y escritorio.

### Fase 7 — Endurecimiento
- SEO completo (sección 12), encabezados de seguridad (CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`), revisión de rendimiento en todas las plantillas, Lighthouse CI configurado, revisión de textos `[PENDIENTE]`.
- **Aceptación:** tabla con puntuaciones Lighthouse móvil y escritorio por plantilla; lista de todos los `[DEMO]` y `[PENDIENTE]` que quedan.

### Fase 8 — Despliegue
- Configuración en Hostinger con despliegue automático desde GitHub, creación de la base y los dos usuarios de MySQL, aplicación de migraciones en producción, variables de entorno, dominio, webhook de Sanity apuntando a producción.
- **Aceptación:** sitio en producción, formularios probados en producción, revalidación funcionando, `docs/DESPLIEGUE.md` con pasos reproducibles, cómo aplicar una migración nueva en producción, cómo restaurar un respaldo de la base y cómo revertir un despliegue.

### Fuera de alcance (no implementar sin instrucción)
Quiz de matchmaking, comparador de venues, mapa interactivo, visualizador 3D, portal de aliados con login, pagos. Deja la arquitectura lista para agregarlos (datos estandarizados en la ficha técnica), pero no los construyas.

---

## 14. Formato del reporte de fase

Al terminar cada fase, entrega exactamente esta estructura y agrégala a `docs/BITACORA.md`:

```
## Fase N — Nombre (fecha)

### Resumen
Qué se hizo en 3 a 5 líneas.

### Archivos creados / modificados
Lista con una línea de propósito por archivo.

### Dependencias agregadas
Nombre, versión y motivo.

### Decisiones tomadas
Cada una con enlace a su entrada en DECISIONES.md.

### Supuestos
Lo que asumí sin confirmación.

### Verificación
Comandos ejecutados y su resultado real (build, lint, typecheck, pruebas, Lighthouse, axe).

### Pendientes y riesgos
Lo que falta, lo que podría fallar y lo que necesito de ti.

### Commits
Lista de hashes y mensajes.
```

Formato de `docs/DECISIONES.md`:

```
### D-00X — Título
- Fecha:
- Contexto:
- Opciones consideradas:
- Decisión:
- Consecuencias:
```

---

## 15. Variables de entorno esperadas

```
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_READ_TOKEN=
SANITY_API_WRITE_TOKEN=  # solo local, para cargar datos DEMO; nunca en producción
SANITY_REVALIDATE_SECRET=
DATABASE_URL=            # usuario de la app (permisos mínimos)
DATABASE_MIGRACIONES_URL= # usuario de migraciones; no se usa en tiempo de ejecución
RESEND_API_KEY=
CORREO_REMITENTE=
CORREO_EQUIPO=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
IP_HASH_SALT=
```

Solo las variables con prefijo `NEXT_PUBLIC_` pueden llegar al navegador. Verifícalo en la Fase 4.

---

## 16. Primera acción

Lee este documento completo, luego responde con:
1. Dudas o contradicciones que encuentres.
2. El plan de la Fase 0.
3. Las dos propuestas de combinación tipográfica y la propuesta de valores de color (para decidir antes de la Fase 1).

No escribas código hasta que apruebe el plan de la Fase 0.
