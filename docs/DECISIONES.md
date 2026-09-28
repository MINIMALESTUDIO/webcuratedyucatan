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
- Contexto: el responsable pidió evaluar `sanity deploy` para aligerar el build en Hostinger.
- Decisión: **pendiente**. La recomendación se entrega antes de la fase de CMS. La Fase P mide la memoria del build sin Studio como línea base (D-030).
- Consecuencias: ninguna todavía.

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
