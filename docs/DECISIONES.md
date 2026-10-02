# Registro de decisiones

Formato ADR breve (sección 14 de `docs/PROMPT.md`). Las decisiones marcadas "aprobada" las confirmó el responsable del proyecto el 2026-09-28.

---

### D-001 — Versiones del stack y de Node.js

- Fecha: 2026-09-28
- Contexto: el documento pide la última versión estable compatible con Hostinger y registrar versiones exactas. Verificado en npm el 2026-09-28.
- Opciones consideradas: usar siempre la última versión publicada de cada paquete; fijar la última versión compatible entre sí.
- Decisión (aprobada): versiones exactas (`save-exact` en `.npmrc`):

  | Pieza                              | Versión              | Nota                                                                                                                                                                |
  | ---------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | Node.js                            | 24.x (local 24.19.0) | Hostinger ofrece 18/20/22/24; Sanity 6 exige ≥ 22.12                                                                                                                |
  | npm                                | 11.17.0 (local)      |                                                                                                                                                                     |
  | next                               | 16.3.6               | última estable                                                                                                                                                      |
  | react / react-dom                  | 19.2.8               | la que fija create-next-app 16.3.6                                                                                                                                  |
  | next-intl                          | 4.14.7               | soporta Next 16                                                                                                                                                     |
  | typescript                         | 6.0.3                | **no 7.0.2**: typescript-eslint 8.71 exige < 6.1                                                                                                                    |
  | eslint                             | 9.39.5               | **no 10.x**: eslint-plugin-react, -import y -jsx-a11y declaran hasta ESLint 9. npm avisa que la rama 9 ya no tiene soporte; se migra cuando los plugins soporten 10 |
  | eslint-config-next                 | 16.3.6               |                                                                                                                                                                     |
  | eslint-config-prettier             | 10.1.8               |                                                                                                                                                                     |
  | prettier                           | 3.9.9                |                                                                                                                                                                     |
  | tailwindcss / @tailwindcss/postcss | 4.3.3                |                                                                                                                                                                     |
  | zod                                | 4.6.5                |                                                                                                                                                                     |
  | server-only                        | 0.0.1                | ver D-022                                                                                                                                                           |
  | vitest                             | 5.0.2                |                                                                                                                                                                     |
  | @playwright/test                   | 1.63.0               |                                                                                                                                                                     |
  | @axe-core/playwright               | 4.13.0               |                                                                                                                                                                     |
  | @types/node                        | 24.19.0              |                                                                                                                                                                     |
  | @types/react / @types/react-dom    | 19.2.18 / 19.2.7     | alineados con React 19.2                                                                                                                                            |
  | sharp                              | 0.35.5               | dependencia opcional de Next; la usan el optimizador de imágenes y el script de imágenes DEMO                                                                       |

  Fases siguientes (versiones verificadas, se instalan en su fase): drizzle-orm 0.45.3, drizzle-kit 0.31.11, mysql2 3.24.4, sanity 6.16.0, next-sanity 13.3.4, @sanity/image-url 2.1.1, resend 6.30.0, @lhci/cli 0.15.1.

- Consecuencias: TypeScript 7 (nativo) y ESLint 10 quedan pendientes de compatibilidad. npm 11 bloquea por defecto los scripts de instalación de `@swc/core`, `@parcel/watcher` (dependencias del extractor de next-intl) y `unrs-resolver`; no se aprueban porque el piloto no los necesita y lint pasa sin ellos.

### D-002 — La base de datos de Hostinger es MariaDB

- Fecha: 2026-09-28
- Contexto: el documento dice MySQL. El soporte de Hostinger (artículo actualizado el 5 ago 2026) indica que los planes Web y Cloud usan MariaDB, sin opción de cambio.
- Opciones consideradas: MariaDB con el dialecto `mysql` de Drizzle; contratar un VPS con MySQL.
- Decisión: MariaDB. Docker local con la misma versión de producción (pendiente de que el responsable la confirme desde phpMyAdmin). Drizzle con dialecto `mysql`.
- Consecuencias: `json()` de drizzle-orm 0.45.3 no convierte el valor al leer (verificado en su código) y MariaDB guarda JSON como LONGTEXT: se hará un tipo JSON propio que parsea y valida con zod (Fase 4).

### D-003 — Fase P (piloto visual) antes de la Fase 0

- Fecha: 2026-09-28
- Contexto: el responsable quiere ver un piloto funcionando lo antes posible.
- Opciones consideradas: seguir el orden original; adelantar un piloto sin base de datos ni CMS.
- Decisión (aprobada): Fase P con Home, listado y ficha de venue, bilingüe, con datos DEMO locales, desplegada en Hostinger. Sin base de datos, sin Sanity y sin envío real de formularios.
- Consecuencias: la Fase 0 queda para lo que falta (Docker/MariaDB, `.env` validado, conexión de prueba). Las páginas del piloto se reutilizan en la Fase 3 cambiando solo la fuente de datos.

### D-004 — Internacionalización

- Fecha: 2026-09-28
- Contexto: inglés sin prefijo y español con `/es`; la revisión propuso desactivar la redirección por idioma del navegador.
- Opciones consideradas: detección automática de next-intl (por defecto); URL fija por idioma.
- Decisión (aprobada): `localePrefix: 'as-needed'`, `localeDetection: false`, rutas traducidas de la sección 4 con claves internas en español (carpetas `src/app/[locale]/proveedores`, `fin-de-semana`, etc.). Siguiendo la guía de next-intl para Next 16.3, `src/app/[locale]/layout.tsx` es el layout raíz y el idioma se lee con `next/root-params` (no se usa `setRequestLocale`, que ya es legado). `src/proxy.ts` sustituye a `middleware.ts` (cambio de Next 16).
- Consecuencias: cada URL muestra siempre su idioma. No hay `app/layout.tsx` global; el Studio de la fase CMS necesitará su propio layout raíz.

### D-005 — Tipografía: opción B autohospedada

- Fecha: 2026-09-28
- Contexto: el responsable eligió la opción B (Ibarra Real Nova + Source Sans 3).
- Opciones consideradas: `next/font/google` (descarga en el build y sirve desde el propio dominio); `next/font/local` con archivos en el repo.
- Decisión (aprobada): `next/font/google`, ambas variables, subconjunto latin, `display: swap`. Todo lo tipográfico vive en `src/estilos/tipografia.ts`; cambiar a la opción A (Bodoni Moda + Manrope) es editar solo ese archivo.
- Consecuencias: el build necesita salida a Google Fonts. Si el build de Hostinger no la tuviera, se pasa a `next/font/local` en el mismo archivo.

### D-006 — Paleta de color

- Fecha: 2026-09-28
- Contexto: propuesta con contrastes verificados con la fórmula de WCAG 2.1.
- Decisión (aprobada tal cual): `--cal #F7F3EC`, `--piedra #EAE2D4`, `--almagre #A13F2B`, `--henequen #4A6650`, `--cenote #106C74`, `--tinta #221E1A`, `--tinta-suave #5E564E`. Derivado: `--almagre-oscuro #8C3524` para el hover del botón principal (7.17:1 con cal).
- Consecuencias: almagre sobre tinta (2.57:1) no se usa para texto; la diferencia cal/piedra (1.16:1) nunca lleva texto ni bordes de controles; los bordes de campos usan tinta-suave (6.51:1).

### D-007 — Datos DEMO locales con la forma de Sanity

- Fecha: 2026-09-28
- Contexto: el piloto no usa Sanity, pero debe cambiar de fuente sin tocar componentes.
- Opciones consideradas: JSON sueltos; objetos TypeScript tipados con la forma de las consultas GROQ.
- Decisión (aprobada): tipos en `src/lib/contenido/tipos.ts` con los nombres de campo de la sección 6, en su forma ya proyectada (referencias resueltas, imágenes con URL y dimensiones). Datos en `src/lib/demo/`. Los componentes solo usan las funciones asíncronas de `src/lib/contenido/index.ts`, marcadas `server-only`. Todo el texto de ejemplo lleva `[DEMO]`. Para probar el reproductor se usa el video público de Google for Developers de la documentación de la API de YouTube (`M7lc1UVf-VE`), marcado como [DEMO]; se sustituye cuando haya IDs reales.
- Consecuencias: en la Fase 2 se reemplaza la implementación de `src/lib/contenido/index.ts` por consultas GROQ.

### D-008 — Campos localizados y nombres propios

- Fecha: 2026-09-28
- Contexto: el contenido se traduce por campo; la sección 6 dice que todo texto visible es bilingüe.
- Opciones consideradas: plugin `sanity-plugin-internationalized-array`; objetos propios `{ en, es }`.
- Decisión: objetos propios `{ en, es }` (sin dependencia nueva); el inglés es obligatorio y si falta el español se muestra el inglés con aviso en consola solo en desarrollo. Supuesto: `nombre` de venue y proveedor es un nombre propio y no se traduce.
- Consecuencias: si el responsable quiere nombres traducibles, se cambia el tipo de `nombre` a `{ en, es }`.

### D-009 — `/_design` con la carpeta `%5Fdesign`

- Fecha: 2026-09-28
- Contexto: en App Router las carpetas que empiezan con `_` son privadas y no generan ruta.
- Decisión (aprobada): la carpeta se llamará `src/app/[locale]/%5Fdesign`, que conserva la URL `/_design`.
- Consecuencias: se implementa en la Fase 1.

### D-010 — `/api/revalidar` protegido con la firma del webhook

- Fecha: 2026-09-28
- Contexto: el endpoint lo llama el servidor de Sanity; no puede pasar Turnstile ni un límite por IP.
- Decisión (aprobada): verificar la firma del webhook de Sanity con el secreto `SANITY_REVALIDATE_SECRET`; sin Turnstile ni límite de envíos.
- Consecuencias: se implementa en la fase de CMS.

### D-011 — Límite de envíos: una fila por `ip_hash` + ruta, reiniciada con UPDATE

- Fecha: 2026-09-28
- Contexto: la app no tiene permiso `DELETE` y se descartó el cron. El responsable pidió evaluar el diseño.
- Opciones consideradas: una fila por ventana con limpieza periódica (requiere DELETE); una fila por `(ip_hash, ruta)` que se reinicia cuando la ventana venció.
- Decisión (aprobada, con la evaluación siguiente): clave primaria `(ip_hash, ruta)`, columnas `ventana_inicio` (DATETIME UTC) y `conteo`. Una sola sentencia atómica:

  ```sql
  INSERT INTO limites_envio (ip_hash, ruta, ventana_inicio, conteo)
  VALUES (?, ?, UTC_TIMESTAMP(), 1)
  ON DUPLICATE KEY UPDATE
    conteo = IF(ventana_inicio <= UTC_TIMESTAMP() - INTERVAL ? SECOND, 1, conteo + 1),
    ventana_inicio = IF(ventana_inicio <= UTC_TIMESTAMP() - INTERVAL ? SECOND, UTC_TIMESTAMP(), ventana_inicio);
  ```

  Después se lee `conteo` y, si supera el límite, se responde 429.

  Evaluación:
  1. **Orden de las asignaciones.** MariaDB evalúa las asignaciones de izquierda a derecha, salvo con el modo `SIMULTANEOUS_ASSIGNMENT`. Con `conteo` antes que `ventana_inicio`, ambas condiciones leen el valor anterior en los dos modos. Se cubrirá con una prueba contra MariaDB en la Fase 4.
  2. **Ventana fija.** Permite hasta el doble del límite en una ráfaga alrededor del reinicio. Es aceptable para formularios; Turnstile es la defensa principal.
  3. **Crecimiento.** Las filas nunca se borran. Crecen con las IP distintas que envían formularios, a unos 150 bytes por fila con índice: 100 000 IP ≈ 15 MB.
  4. **Riesgo de relleno (el punto importante).** Si la IP se tomara de un encabezado falsificable, un bot podría crear filas sin fin y no habría cómo borrarlas. Mitigación: verificar Turnstile **antes** de tocar la tabla y usar la IP que agrega el proxy de Hostinger (qué encabezado es de fiar se confirma en el despliegue).
  5. **Privacidad.** Los `ip_hash` se conservan indefinidamente. Rotar `IP_HASH_SALT` (por ejemplo, cada año) los vuelve no vinculables. Un borrado físico, si hiciera falta, lo haría a mano el administrador desde phpMyAdmin.
  6. **IP compartidas** (redes móviles, oficinas): límites holgados, por ejemplo 5 envíos por 10 minutos por ruta.
  7. **Reloj.** Se usa `UTC_TIMESTAMP()` de la base, no la hora de la app.

- Consecuencias: sin problemas bloqueantes. Cambia la sección 7: el índice `(ip_hash, ruta, ventana_inicio)` pasa a clave primaria `(ip_hash, ruta)` y no hay limpieza periódica.

### D-012 — `contactoLeads` en documentos `privado.*`

- Fecha: 2026-09-28
- Contexto: el plan gratuito de Sanity solo admite datasets públicos (sanity.io/pricing).
- Opciones consideradas: plan Growth con dataset privado (US$15 por usuario al mes); documentos con ID de ruta.
- Decisión (aprobada): los correos de contacto viven en documentos con ID `privado.*`, que Sanity no expone sin token. Se leen solo en el servidor con `SANITY_API_READ_TOKEN`. Habrá una prueba automática que confirme que una consulta anónima no los ve.
- Consecuencias: esos documentos sí aparecen en las exportaciones del dataset; las exportaciones se tratan como datos sensibles.

### D-013 — Sanity Studio embebido o desplegado aparte

- Fecha: 2026-09-28
- Contexto: el responsable pidió evaluar `sanity deploy` para aligerar el build en Hostinger. El documento original pedía el Studio embebido en `/studio`.
- Opciones consideradas: embebido en `/studio` (una sola URL, pero su código entra en el build de Next en un plan de 3 GB compartidos); publicado aparte en `*.sanity.studio` con `sanity deploy` (gratis, build del sitio más liviano, se actualiza sin redesplegar el sitio).
- Decisión (2026-09-28, recomendación aplicada al pedir la base del CMS): **Studio publicado aparte.** La configuración vive en el repositorio (`sanity.config.ts`, `sanity/`) y se publica con `npm run studio:deploy`. La edición visual ("Editar en la página") funciona igual desde el Studio publicado. Medido: el build del Studio tarda ~7 s y no forma parte del build del sitio.
- Consecuencias: el Studio tiene su propia URL (`https://curatedyucatan.sanity.studio`, a confirmar al publicar). Embeberlo después es añadir una ruta `src/app/studio/[[...tool]]` con la misma configuración. La CSP de la Fase 7 debe permitir que el Studio muestre el sitio en un iframe (`frame-ancestors`).

### D-014 — Videos del hero y de venues en Sanity

- Fecha: 2026-09-28
- Decisión (aprobada): los loops se suben a Sanity con `videoLoopMovil` opcional. Tope de peso: 2 MB escritorio y 1 MB móvil por loop. Si la transferencia mensual se acerca al límite del plan, la alternativa es servirlos desde Hostinger (documentada en `docs/DESPLIEGUE.md`).
- Consecuencias: el componente de video del hero ya elige la versión móvil y no reproduce con `prefers-reduced-motion` ni `Save-Data`.

### D-015 — `destacado` y `nivelListado`

- Fecha: 2026-09-28
- Decisión (aprobada): `nivelListado` es el plan comercial y decide qué bloques se muestran y la prioridad en el orden "destacados" del listado. `destacado` es una decisión editorial (aparece en el home) y no se vincula al nivel comercial.
- Consecuencias: el orden "destacados" usa nivel comercial, luego `destacado` y luego nombre.

### D-016 — Asesoría con varios venues

- Fecha: 2026-09-28
- Decisión (aprobada): la copia va solo al equipo.

### D-017 — Slug único por documento

- Fecha: 2026-09-28
- Decisión (aprobada): un slug para ambos idiomas, también en historias.

### D-018 — Guía PDF por idioma

- Fecha: 2026-09-28
- Decisión (aprobada): un archivo por idioma, con respaldo en inglés.

### D-019 — Mapa de la ficha

- Fecha: 2026-09-28
- Decisión (aprobada): dibujo propio de la península con el punto del venue y enlace a Google Maps, sin llave de API. En el piloto la ficha ya muestra los tiempos de traslado y el enlace a Google Maps; el dibujo llega en la Fase 3.

### D-020 — Redirecciones permanentes 308

- Fecha: 2026-09-28
- Decisión (aprobada): `permanentRedirect` de Next (308) para `slugsAnteriores`.

### D-021 — `slugsAnteriores` y `SANITY_API_WRITE_TOKEN`

- Fecha: 2026-09-28
- Decisión (aprobada): se agregan a las secciones 6 y 15 de `docs/PROMPT.md`. El token de escritura es solo local.

### D-022 — Dependencias `server-only` y `tsx`

- Fecha: 2026-09-28
- Contexto: fuera del stack original.
- Decisión (aprobada): `server-only` impide que módulos de servidor (datos, secretos) lleguen al bundle del cliente; se usa desde la Fase P en `src/lib/contenido`. `tsx` se instalará cuando haya scripts TypeScript (Fase 0/4).

### D-023 — Analítica pendiente

- Fecha: 2026-09-28
- Decisión (aprobada): no bloquea el piloto. La CSP de la Fase 7 dejará espacio para el proveedor que se elija antes de esa fase.

### D-024 — Renderizado estático sin Cache Components

- Fecha: 2026-09-28
- Contexto: Next 16 ofrece `cacheComponents` (opcional).
- Opciones consideradas: activarlo ya; usar el modelo anterior con `generateStaticParams`.
- Decisión: el piloto no lo activa. Home, listado y fichas se generan estáticos en el build (`generateStaticParams` para idiomas y slugs). Se reevalúa en la fase de CMS junto con `revalidateTag`.

### D-025 — Imágenes en el piloto

- Fecha: 2026-09-28
- Contexto: el responsable pidió documentar la compatibilidad de `next/image` en Hostinger.
- Decisión: en el piloto las imágenes DEMO son archivos locales y pasan por el optimizador de Next (sharp), para probarlo en Hostinger. En la fase de CMS las imágenes vendrán del CDN de Sanity con un `loader` propio, sin optimizar en el servidor. Imágenes DEMO generadas con `npm run demo:imagenes`, marcadas visiblemente como "[DEMO] Foto pendiente".
- Consecuencias: el optimizador guarda cada imagen en `.next/cache/images` hasta 4 horas (`minimumCacheTTL` por defecto en Next 16). Si se reemplaza un archivo con la misma URL, se sigue sirviendo la versión anterior: hay que borrar esa carpeta o cambiar el nombre del archivo. Con Sanity no ocurre, porque cada archivo nuevo tiene URL nueva.

### D-026 — Filtros del listado

- Fecha: 2026-09-28
- Decisión: filtros en el cliente sobre los datos de la página, sincronizados con la URL mediante `history.replaceState` (compartible y se conserva al volver desde una ficha). Parámetros en español y valores separados por comas: `region`, `tipo`, `capacidad`, `hospedaje`, `catering`, `inversion`, `orden`. Supuestos: capacidad de banquete por rangos (el venue entra si su capacidad cae en el rango); catering "propio" incluye venues con `ambos`, igual que "externo"; rangos de capacidad e inversión marcados [DEMO] hasta que el responsable los defina.

### D-027 — Formularios del piloto

- Fecha: 2026-09-28
- Decisión: formularios completos con validación zod en el cliente (esquemas en `src/lib/validacion/`, reutilizables en el servidor en la Fase 4). Al enviar datos válidos se muestra "Piloto: envío desactivado" y no se manda nada.

### D-028 — Piloto no indexable

- Fecha: 2026-09-28
- Contexto: el despliegue público tendrá datos DEMO.
- Decisión: variable `SITIO_INDEXABLE` (por defecto `false`): `noindex` en todas las páginas y `robots.txt` que bloquea todo. Se cambia a `true` solo en producción con contenido real.

### D-029 — Rutas fuera del piloto

- Fecha: 2026-09-28
- Decisión: las rutas de la sección 4 que no son parte del piloto muestran una página "[PENDIENTE]" en ambos idiomas, para que la navegación no lleve a errores 404.

### D-030 — Medición de memoria del build

- Fecha: 2026-09-28
- Contexto: hay que documentar el uso de memoria del build en Hostinger.
- Decisión: `npm run build:medido` ejecuta `next build` y muestra al final la memoria pico del árbol de procesos (en Linux lee `/proc`; en Windows, `Win32_Process`). Es el comando de build que se configura en Hostinger.

### D-031 — Esquemas zod cargados al enviar

- Fecha: 2026-09-28
- Contexto: la primera medición de Lighthouse dio 264 KB de JS inicial en el inicio y 272 KB en la ficha (presupuesto: 170 KB). El chunk más pesado que controlamos (90 KB gzip) era casi todo zod, que solo se usa al enviar un formulario.
- Opciones consideradas: `zod/mini` (más pequeño, otra API); validar sin zod en el cliente (rompe el esquema compartido); cargar el esquema con `import()` al enviar.
- Decisión: `import()` al enviar. Los códigos de error viven en `src/lib/validacion/errores.ts`, sin zod en tiempo de ejecución; los esquemas siguen en `formularios.ts` y se reutilizarán en el servidor.
- Consecuencias: zod (88 KB gzip) se descarga solo en el primer envío, con una espera mínima. Rendimiento en Lighthouse: inicio 79 → 91 y ficha 81 → 90; JS inicial 173 KB y 184 KB.

### D-032 — Envío bloqueado hasta hidratar

- Fecha: 2026-09-28
- Contexto: las páginas son estáticas. Si alguien envía un formulario antes de que cargue el JS, el navegador hace un envío nativo (GET) y los datos personales quedan en la URL.
- Decisión: el botón de envío está desactivado en el HTML prerenderizado y se activa al hidratar (`useHidratado`, con `useSyncExternalStore`). El formulario expone `data-hidratado` para las pruebas.
- Consecuencias: durante la carga inicial el botón se ve atenuado un instante.

### D-033 — Dos fuentes de contenido: Sanity o DEMO

- Fecha: 2026-09-28
- Contexto: la base del CMS se construye antes de que exista el proyecto de Sanity (falta iniciar sesión en la CLI), y el sitio y sus pruebas deben seguir funcionando.
- Opciones consideradas: reemplazar la fuente DEMO por Sanity de una vez; elegir la fuente según la configuración.
- Decisión: `src/lib/contenido/index.ts` usa Sanity si hay `NEXT_PUBLIC_SANITY_PROJECT_ID` y los datos DEMO si no. Ambas fuentes cumplen el mismo contrato (`fuente.ts`) y devuelven los mismos tipos; la fuente de Sanity se carga con `import()` para que el modo DEMO no cargue su cliente. Los datos DEMO se convierten en documentos de Sanity con `npm run sanity:semilla` y se importan con la CLI.
- Consecuencias: las pruebas e2e corren en modo DEMO sin servicios externos. Si falta el documento `configuracionSitio` en Sanity, el inicio usa los textos DEMO y lo avisa en el log. Los venues incompletos (sin foto principal, región o ficha) no se listan para no romper las tarjetas.

### D-034 — Edición visual ("Editar en la página")

- Fecha: 2026-09-28
- Contexto: el responsable pidió poder editar el sitio directo desde la página.
- Decisión: herramienta Presentation de Sanity con modo borrador de Next (`/api/draft-mode/enable` y `/disable`), `sanityFetch` de `next-sanity/live` y `VisualEditing`.
  - **Stega** (marcas invisibles con el origen de cada texto) solo en modo borrador y solo en textos bilingües, nombres y autores: no toca slugs, IDs de YouTube ni valores de listas que el sitio usa como claves.
  - Imágenes, ficha técnica, videos y métricas se marcan con atributos `data-sanity`, con un codificador propio equivalente a `createDataAttribute` (una prueba unitaria compara ambos) para no cargar ~11 KB en el navegador.
  - **Ningún token llega al navegador** (regla 9): `browserToken: false`. En Presentation, al editar, `VisualEditing` refresca la página desde el servidor, que lee los borradores con `SANITY_API_READ_TOKEN`.
  - El código de edición visual (~180 KB comprimidos) se carga con `next/dynamic` solo en modo borrador; los visitantes no lo descargan.
- Consecuencias: JS inicial medido en modo DEMO: 179 KB en el inicio y 190 KB en la ficha (+6 KB por el loader de imágenes de Sanity). Fuera del Studio, la vista previa de borradores se actualiza al recargar (sin token en el navegador no hay actualización en vivo). Los cambios publicados llegan por el webhook `/api/revalidar` (D-010).

### D-035 — Imágenes de Sanity y dependencias de la fase de CMS

- Fecha: 2026-09-28
- Decisión: las imágenes de Sanity usan el `imageLoader` de `next-sanity/image` (se redimensionan en el CDN de Sanity, sin trabajo en Hostinger) y respetan el punto de interés como `object-position`. No se usa `@sanity/image-url`: el loader cumple su función. Dependencias agregadas: `sanity` 6.16.0, `next-sanity` 13.3.4, `@sanity/vision` 6.16.0, `styled-components` 6.5.3 (requerida por Sanity), `@portabletext/react` 7.0.1 (la usa `next-sanity`; se declara explícita para no depender de una instalación indirecta) y `tsx` 4.23.15 (scripts, aprobada en D-022).
- Consecuencias: `npm audit` reporta 15 alertas (3 altas y 12 moderadas), todas en la cadena de herramientas de la CLI de Sanity (adm-zip, js-yaml, smol-toml, uuid), que se usan al compilar o publicar el Studio y al importar datos. Ninguna llega al código que descargan los visitantes. El arreglo que propone npm es bajar a Sanity 5; se descarta y se revisará al actualizar Sanity.

### D-036 — Tipografía del libro con sustituto libre de Century Gothic

- Fecha: 2026-09-29
- Contexto: el prompt visual pide las familias del libro impreso, y el PDF lo confirma: Century Gothic es la voz de marca (portada, títulos de sección y aperturas), Cinzel solo va en nombres de venues y Montserrat en cuerpo y etiquetas. Century Gothic es comercial; el responsable indicó buscar un sustituto.
- Opciones consideradas: Questrial, Didact Gothic, Jost, Urbanist, Outfit, Josefin Sans y Poppins, medidas contra la Century Gothic instalada en el equipo (ancho de "CURATED YUCATAN HERITAGE SPACES", altura de x y redondez de la "O").
- Decisión: **Questrial** (OFL, Google Fonts) como sustituto: 99 % del ancho de Century Gothic, altura de x 0.76 frente a 0.74 y la misma "O" redonda. Montserrat para el cuerpo, con la itálica aparte y sin precarga (D-046); Cinzel sin precarga. Todo con `next/font`, en `src/estilos/tipografia.ts`. Los títulos van en mayúsculas espaciadas, como en el libro.
- Consecuencias: **reemplaza D-005**. Questrial tiene un solo peso; las negritas e itálicas de Century Gothic del libro (índice y etiquetas) se resuelven con Montserrat.

### D-037 — Sistema visual del libro: negro sobre blanco

- Fecha: 2026-09-29
- Contexto: medido sobre el PDF del libro: todo el texto es `#000000` sobre blanco, las líneas son negras y no hay color de interfaz; el color lo aportan las fotos. El prompt visual admite blancos cálidos y taupe solo en detalles y pide evitar colores fuertes, degradados y fondos saturados.
- Decisión:
  - Tokens `papel` (#fff), `papel-calido`, `arena`, `linea`, `taupe` (#6f6253, 5.92:1), `tinta` (#111, 18.88:1) y `tinta-suave` (#5f5850, 7.00:1), todos con contraste AA verificado.
  - Botones carbón sólidos o de línea, sin esquinas redondeadas.
  - Se retiran los arcos como máscara, el patrón de pasta, el sello, los iconos de categorías y las bandas de color.
  - Sobre foto, velo uniforme del 45 % (sin degradado) con texto grande y botón blanco sólido.
  - Las imágenes DEMO pasan a marcadores neutros.
- Consecuencias: **reemplaza D-006** y los recursos gráficos de la sección 9 de PROMPT.md (arcos y pasta).

### D-038 — Los documentos de dirección mandan sobre PROMPT.md donde chocan

- Fecha: 2026-09-29
- Contexto: el responsable pidió alinear la implementación con el prompt visual, la estructura web, la estrategia LOVE MÉXICO y el libro (`docs/referencias/`). Describen otro enfoque que PROMPT.md: plataforma de descubrimiento para wedding planners, extensión digital del libro.
- Decisión:
  - Mapa del sitio de la sección 18 del documento de estructura: Home, Discover Yucatán, Venues, Catering, Photography, Design & Production, Curated Journal, About, Find Your Yucatán y Plan Your Event (más Privacy).
  - Menú con el CTA "Plan your event".
  - Se retiran las rutas que el documento no menciona: vendors, wedding weekend, plan your wedding, venue tours, guide, stories, planning assistance, partners y shortlist.
  - Las URL en inglés son estables (`/find-your-yucatan` y `/` para los QR). Se mantiene el español con URL traducidas.
- Consecuencias: PROMPT.md queda como referencia técnica (stack, seguridad, rendimiento y backend). Sus secciones 1, 4, 6, 9 y 11 y el "fuera de alcance" del quiz quedan reemplazadas por este documento y D-039 a D-044. Supuesto por validar: mantener el español.

### D-039 — Tres colecciones como documentos

- Fecha: 2026-09-29
- Contexto: el documento de estructura dice que el libro establece tres categorías (Contemporary Sanctuaries, Organic Estates, Timeless Venues), que también usan el stand y Find Your Yucatán. El libro disponible (volumen II, borrador) usa dos estilos: Heritage Spaces y Distinctive Venues.
- Decisión: **supuesto** a favor de las tres del documento, que es la fuente más reciente y la que conecta con Find Your Yucatán. Son documentos `coleccion` (nombre, lema, descripción, palabra del resultado e imagen), no una lista en el código: cambiar a dos es editar Sanity.
- Consecuencias: cada venue tiene una colección obligatoria.

### D-040 — Venues: filtros y perfil del documento

- Fecha: 2026-09-29
- Decisión:
  - **Filtros:** Style (colección), Capacity (rangos [DEMO] sobre la capacidad máxima), Accommodation, Location (región) e Indoor / Outdoor. Interior / exterior se calcula de los espacios: "mixto" cuenta como ambos. Las colecciones funcionan como entrada visual; el resto de filtros va en un solo panel. El orden es editorial (destacados primero), sin selector.
  - **Perfil:** hero con nombre y ubicación, Quick facts, About, Spaces, Curated Notes, Gallery y Request information. Se suman la película de la serie "El Lugar de Tu Historia" (el libro la presenta como capítulo audiovisual de la colección) y más venues de la misma colección.
  - **Se retiran del modelo:** tipos de venue, nivel de listado (queda la marca editorial `destacado` de D-015), catering, horario de música, inversión, temporada, tiempo al aeropuerto, mapa, citas y proveedores recomendados.
  - **Se agregan:** localidad, km al centro, atributos para Find Your Yucatán y Curated Notes.
- Consecuencias: reemplaza D-026 en sus filtros y el nivel de listado de D-015.

### D-041 — Find Your Yucatán dentro del alcance

- Fecha: 2026-09-29
- Contexto: PROMPT.md dejaba el quiz fuera de alcance; la estrategia LOVE MÉXICO lo incluye en el lanzamiento con su propio QR.
- Decisión:
  - Experiencia paso a paso (una pregunta por pantalla), con las seis preguntas del documento.
  - El resultado es la atmósfera elegida (una colección).
  - Recomienda tres venues con reglas deterministas en `src/lib/descubrimiento/encuentra.ts`, probadas con Vitest:
    - descartan la capacidad insuficiente y la falta de hospedaje "requerido";
    - puntúan: lo que más importa +3, hospedaje preferido +1, entorno +1 y destacado +1;
    - si no alcanzan, se completa con la misma colección y luego con otras.
  - "Save your Curated selection" con Name, Company, Email y Country.
- Consecuencias: el formulario de guardado no envía nada hasta la Fase 4 (D-027).

### D-042 — Formularios de Plan Your Event y solicitud de información

- Fecha: 2026-09-29
- Decisión:
  - Campos exactos de la sección 13: What are you planning?, Estimated guests? (rangos), Looking for (varias opciones) y Contact (Name, Company, Country, Email, Phone opcional, Approximate date, Message).
  - **Supuestos:** Company obligatoria (audiencia de planners) y Message opcional.
  - La solicitud de un venue usa el mismo formulario, sin "Looking for".
  - Los partners y Minimal llevan a Plan Your Event con "Looking for" marcado por la URL.
  - Se retiran el formulario de disponibilidad (fecha exacta y número de invitados) y el de la guía.
- Consecuencias: los envíos siguen desactivados hasta la Fase 4. El esquema `esquemaSolicitud` es el que usará el backend.

### D-043 — Catering, Photography y Minimal

- Fecha: 2026-09-29
- Decisión:
  - `proveedor` pasa a tener una sección (catering o fotografía) y los 11 datos del documento: especialidad, servicios, estilo, enfoque fotográfico (Editorial, Documentary, Fine Art, Cinematic), ciudad base, cobertura, experiencia en bodas destino, web, Instagram, logotipo y fotografías.
  - Se eliminan las categorías de proveedor y los proveedores que no son de catering ni fotografía.
  - Minimal es un documento único `disenoProduccion` con sus cinco áreas y portafolio: no es un directorio.
  - El contacto comercial sigue en `privado.*` (D-012).
- Consecuencias: queda pendiente saber si MasQueAyer (florería del libro) forma parte de Design & Production.

### D-044 — Contenido editorial: Journal, Discover y páginas fijas

- Fecha: 2026-09-29
- Decisión:
  - `historia` pasa a `articulo` (Curated Journal, sin tipos).
  - Discover Yucatán es un documento único con secciones (ancla, etiquetas, texto y fotos); los siete temas del inicio enlazan a sus anclas.
  - About y Privacy son `paginaEditorial` con ID fijo (`pagina-nosotros`, `pagina-privacidad`) y secciones de texto, imagen, preguntas y llamado.
  - Se retiran `episodio` y `guia`: la película va en cada venue y la serie completa se enlaza desde el pie (`redes.youtube`). El libro no se regala (40 ejemplares), así que no hay guía descargable.
- Consecuencias: no hay datos en Sanity que migrar (el proyecto aún no existe); la semilla genera el modelo nuevo directamente.

### D-045 — Constructor de páginas (Fase C) aplazado

- Fecha: 2026-09-29
- Contexto: el plan de C1 se armó sobre la estructura anterior (D-038).
- Decisión: las páginas usan composición fija, con todos sus textos e imágenes editables en Sanity y en "Editar en la página". El constructor por bloques se replanteará sobre la nueva estructura, después de revisar esta fase.

### D-046 — Rendimiento de la imagen principal y fuentes

- Fecha: 2026-09-29
- Contexto: Lighthouse marcaba la imagen principal con prioridad baja (`preload` de Next 16 no agrega `fetchpriority`) y precargaba 72 KB de Montserrat, incluida la itálica.
- Decisión: `fetchPriority="high"` en las imágenes con `preload`. La itálica de Montserrat pasa a ser familia aparte sin precarga, asignada a `.italic`, `em`, `i` y `blockquote`.
- Consecuencias: medición en modo DEMO, mediana de 3 corridas:
  - inicio: rendimiento 88, LCP simulado 3.65 s, JS 169 KB;
  - ficha: rendimiento 88, LCP simulado 3.75 s, JS 185 KB;
  - en ambas, accesibilidad, buenas prácticas y SEO 100, y CLS 0.

  El LCP observado es 1.3 s. La diferencia es el JavaScript del framework (React y el runtime de Next, ~350 KB sin comprimir) que la simulación ejecuta con la CPU 4 veces más lenta antes del pintado. **Pendiente:** evaluar imágenes renderizadas en el servidor (loader global) para reducir la hidratación, y medir en Hostinger.

### D-047 — Venues reales de "FICHAS DE VENUES"

- Fecha: 2026-10-02
- Contexto: la ficha del Drive (01_WEB/03_VENUES) ya trae 18 venues completos en las tres colecciones. Cada uno tiene dirección, datos rápidos, About, espacios y una Curated Note. No trae fotos (FOTOS VENUES está vacía) ni traducción.
- Decisión:
  - El copy se usa tal cual, solo en inglés: el español cae al inglés con aviso (D-008).
  - El resumen de los cuatro destacados es la "Short description" de Home > Featured Venues. El de los demás es la primera frase de su About.
  - El modelo gana campos opcionales para no reescribir la ficha:
    - `direccion`;
    - `fichaTecnica.estilo`, `interiorExterior`, `capacidadDetalle` y `hospedaje.descripcion` (el texto de "Quick Facts");
    - `fichaTecnica.entorno`, que manda sobre el cálculo por espacios.

    Además, `minutosCentroMerida` y el título de las notas pasan a ser opcionales.

  - Datos derivados de la ficha (editables en Sanity, por confirmar con el equipo):
    - **interior / exterior de cada espacio:** cerrado = interior (capilla, salón, casa de máquinas); abierto = exterior (jardín, patio, terraza, anfiteatro); techado y abierto, o "interior y exterior" explícito = mixto (corredores, terrazas techadas, Salón de los Arcos). `fichaTecnica.entorno` solo se fija cuando la ficha dice "Indoor and outdoor" y únicamente nombra la capilla (Yaxcopoil, San José Cholul);
    - **atributos de "What matters most?":** solo los que el About o la Curated Note mencionan de forma explícita (por ejemplo, "architecture, nature and privacy" en Sac Chich, o "within the city" para ubicación);
    - **región del filtro Location:** Mérida cuando la ficha ubica el venue en Mérida (San Antonio Hool, Xcanatún, Casa Faller, Casona 333, San Juan Opichén); Alrededores de Mérida para los demás.
  - Las fotos siguen siendo marcadores `[DEMO]` (se reutilizan los seis juegos existentes). Ningún venue tiene película hasta tener los videos de la serie.
- Consecuencias:
  - el listado oculta las regiones sin venues (Costa);
  - la prueba e2e del reproductor con capítulos se retira hasta que haya una película real;
  - las líneas de la ficha que no son espacios ni datos rápidos no se muestran (ver bitácora).

### D-048 — Páginas individuales de Discover Yucatán

- Fecha: 2026-10-02
- Contexto: "00 — ESTRUCTURA GENERAL" (Drive, 01_WEB/02_DISCOVER YUCATAN) define Discover Yucatán como portada que dirige a seis páginas editoriales: Architecture, Culture, Gastronomy, History, Nature y Experiences. Cada una tiene su documento de contenido completo, que termina con "Continue exploring". Reemplaza a la parte de D-044 que hacía de Discover un único documento con secciones.
- Decisión:
  - **Nuevo tipo `categoriaDescubre`:**
    - campos: nombre, slug, orden, microdescripción, imagen principal, titular, entradilla, secciones (título, texto y hasta 2 fotos), tres categorías relacionadas y SEO;
    - ruta: `/discover-yucatan/[slug]` en inglés y `/es/descubre-yucatan/[slug]` en español. El slug es el mismo en ambos idiomas (D-017): `architecture`, `culture`, etc., como sugiere el documento.
  - **Portada:** se conserva tal como estaba (hero, entradilla, bloques alternados y cierre "Explore venues"). Sus bloques ahora son las seis categorías, cada uno clickeable completo hacia su página. La navegación bajo la entradilla también lleva a las páginas.
  - **Datos que se retiran:** `descubreYucatan.secciones` y `configuracionSitio.descubre.temas`. La portada y el mosaico del inicio leen las categorías por su orden, así una categoría se edita en un solo lugar.
  - **Página de categoría:**
    - arriba, migas (regreso a Discover Yucatán) y las seis categorías con la actual marcada;
    - hero con "Discover Yucatán / Categoría" y el titular;
    - secciones alternadas imagen/texto;
    - "Continue exploring" con las tres categorías que indica cada documento.
  - **Copy:** real y solo en inglés (D-008). Se quitaron las notas internas del documento (comentarios en español sobre la investigación y "Texto pegado"). Los nombres de las categorías sí se traducen.
  - **Fotos:** `[DEMO]`. Las carpetas MEDIA solo traen "Fotos necesarias".
  - Mientras Sanity no tenga categorías, el sitio usa las DEMO con aviso en el log, igual que los documentos únicos.
- Consecuencias:
  - para verlas en Sanity hay que volver a hacer `sanity deploy` (esquemas) e importar la semilla;
  - los campos retirados quedan en el dataset como "campos desconocidos" hasta esa importación.

### D-049 — Versión provisional en Railway

- Fecha: 2026-10-02
- Contexto: el equipo necesita ver el sitio sin depender de la computadora del titular, y Hostinger todavía no está configurado.
- Decisión:
  - Se publica en Railway desde `main` (proyecto `curatedyucatan`, servicio `sitio`) con la URL generada `*.up.railway.app`.
  - Va sin indexar (`SITIO_INDEXABLE=false`) y en modo DEMO: sin variables de Sanity ni secretos, porque el contenido local es hoy el más actual.
  - El dominio y los QR quedan para después. Los QR deben apuntar al dominio definitivo, nunca a la URL de Railway.
- Consecuencias:
  - el destino final sigue siendo Hostinger (docs/PROMPT.md). La app no depende de Railway: la mudanza es copiar variables, cambiar URLs en Sanity y apuntar el dominio (DESPLIEGUE.md, sección 8.3);
  - costo: el uso del plan de Railway mientras dure.
