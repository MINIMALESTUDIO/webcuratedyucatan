# Despliegue en Hostinger

Estado: **Fase P (piloto visual)**. Este documento separa lo verificado (con fuente y fecha) de lo que está **por confirmar**. Se completa con los resultados reales de cada despliegue.

---

## 1. Lo que sabemos del hosting (investigación del 2026-09-28)

| Tema                            | Dato                                                                                                                                                                                          | Fuente                                                                                                                                                                                                                                                           |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Planes con apps Node.js         | Business Web Hosting y Cloud (Startup, Professional, Enterprise). Business ya se vende como "Unlimited" en la mayoría de páginas; quien lo tiene conserva sus límites                         | [Soporte Hostinger: apps Node.js](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/) (actualizado 15 sep 2026), [límites de planes](https://www.hostinger.com/support/6976044-parameters-and-limits-of-hosting-plans-in-hostinger/) |
| Versiones de Node.js            | 18.x, 20.x, 22.x, 24.x. Usamos **24.x**                                                                                                                                                       | idem                                                                                                                                                                                                                                                             |
| Despliegue                      | Desde GitHub con build automático en cada push; también ZIP. **Una sola cuenta de GitHub por plan**                                                                                           | idem                                                                                                                                                                                                                                                             |
| Builds                          | Se guardan en `/home/{usuario}/domains/{dominio}/hbuilds/current/`; se conservan las **dos últimas versiones exitosas**                                                                       | idem                                                                                                                                                                                                                                                             |
| Variables de entorno            | Se configuran en el panel; las `NEXT_PUBLIC_*` se incrustan en el build, así que cambiarlas exige volver a desplegar                                                                          | idem + comportamiento de Next.js                                                                                                                                                                                                                                 |
| Otros                           | Botón de reinicio para apps de servidor; no hay botón de detener ni borrar un despliegue (se borra el sitio completo); los cambios hechos a mano en el administrador de archivos no persisten | idem                                                                                                                                                                                                                                                             |
| Límites del plan Unlimited      | 2 CPU, 3 GB de RAM, 5 sitios Node.js, 75 conexiones MySQL por usuario, 3 GB por base                                                                                                          | [límites de planes](https://www.hostinger.com/support/6976044-parameters-and-limits-of-hosting-plans-in-hostinger/)                                                                                                                                              |
| Comandos sugeridos para Next.js | Instalar `npm ci`, build `npm run build`, arranque `npm run start -- -p $PORT`                                                                                                                | [Guía Next.js para Hostinger](https://github.com/agneliutkiene/deploy-nextjs) (copia de la guía oficial)                                                                                                                                                         |
| Base de datos                   | **MariaDB** (no MySQL) en planes Web y Cloud, sin opción de cambio; puerto 3306                                                                                                               | [Soporte: motor de base de datos](https://www.hostinger.com/support/1583226-which-database-management-system-is-used-at-hostinger/) (5 ago 2026)                                                                                                                 |
| Host de la base desde Node      | `localhost` según la guía; Node puede resolver `localhost` a `::1` (IPv6), así que se probará también `127.0.0.1`                                                                             | [Soporte: MySQL desde Node.js](https://www.hostinger.com/support/connecting-a-hostinger-mysql-database-to-a-node-js-application/) (15 sep 2026)                                                                                                                  |
| Permisos de usuarios            | Casillas por permiso en hPanel; por defecto tienen todos                                                                                                                                      | [Soporte: permisos](https://www.hostinger.com/support/4564363-how-to-change-permissions-for-a-database-user-in-hostinger/)                                                                                                                                       |

**Por confirmar** (se completa en los despliegues): versión exacta de MariaDB; si hay permisos por tabla y varios usuarios por base; acceso remoto a la base con lista de IP; qué encabezado trae la IP real del visitante detrás del proxy; memoria disponible para el build.

---

## 2. Configurar la app del piloto en hPanel

Solo el titular de la cuenta puede hacerlo, porque requiere autorizar GitHub.

1. hPanel → **Sitios web** → **Agregar sitio web** → **App web Node.js**.
2. **Importar repositorio de Git** → autorizar GitHub (cuenta institucional `MINIMALESTUDIO`) → repositorio `webcuratedyucatan`, rama `main`. Ver la sección 9 sobre los dos repositorios.
3. Dominio: el temporal que ofrece Hostinger o un subdominio propio.
4. Configuración de build:

   | Campo                  | Valor                                                                                    |
   | ---------------------- | ---------------------------------------------------------------------------------------- |
   | Framework              | Next.js                                                                                  |
   | Versión de Node.js     | 24.x                                                                                     |
   | Directorio raíz        | `/`                                                                                      |
   | Comando de instalación | `npm ci`                                                                                 |
   | Comando de build       | `npm run build:medido` (mide la memoria, ver D-030; usa webpack y 2 procesos, ver D-050) |
   | Comando de arranque    | `npm run start` (si la app no responde: `npm run start -- -p $PORT`)                     |
   | Directorio de salida   | `.next`                                                                                  |

5. Variables de entorno (sección 3) y **Desplegar**.
6. Cada `git push` a `main` vuelve a desplegar.

## 3. Variables de entorno del piloto

| Variable               | Valor en el piloto                        | Nota                                                            |
| ---------------------- | ----------------------------------------- | --------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | URL pública del despliegue, sin `/` final | Se usa en metadatos                                             |
| `SITIO_INDEXABLE`      | `false`                                   | Con `false` todo lleva `noindex` y `robots.txt` bloquea (D-028) |

El resto de variables de `.env.example` no se usan todavía.

## 4. Resultados del despliegue del piloto

**Línea base local** (2026-09-28, Windows 11, Node 24.19.0, 16 CPU, build limpio sin caché): `npm run build:medido` → memoria pico del árbol de procesos **2177 MB**, **25 s**. En Windows la suma de _working sets_ cuenta la memoria compartida entre procesos más de una vez, así que la cifra real es algo menor. Next reparte la generación de páginas en tantos procesos como CPU haya, así que con las 2 CPU del plan se espera menos memoria y más tiempo.

**Primer intento en Hostinger** (2026-10-07, commit `8861668`):

- entorno: Node v24.6.0 linux/x64, 48 CPU, sin límite de contenedor visible;
- `npm install` tardó 1 min 34 s;
- falló el build: `TurbopackInternalError` en `globales.css`, porque el proceso de Node que abre Turbopack para PostCSS se cerró antes de conectarse. Pico de 920 MB, 55 s;
- se corrigió con D-050 (webpack y 2 procesos).

**Segundo intento** (commit `0838cb1`):

- webpack y 2 procesos funcionaron: compilación en 29.5 s y 105 páginas en curso;
- falló al prerenderizar `/en` con `TypeError: Invalid URL`, porque `NEXT_PUBLIC_SITE_URL` estaba cargada sin protocolo (`ivory-kingfisher-466902.hostingersite.com`);
- desde entonces `urlSitio()` agrega `https://` cuando falta. Aun así, en hPanel conviene escribir la URL completa.

**En Hostinger** (tercer intento, commit `ac9b5c1`, 2026-10-07: correcto):

| Dato                                               | Resultado                                                                                                       | Cómo se obtiene                                                                                                                         |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| URL pública                                        | https://ivory-kingfisher-466902.hostingersite.com (dominio temporal)                                            | hPanel                                                                                                                                  |
| Versión de Node y límite de memoria del contenedor | Node v24.6.0, linux/x64, 48 CPU visibles, límite de contenedor no visible                                       | primera línea `[medir-build]` del log de build                                                                                          |
| Memoria pico y duración del build                  | intento 2 (falló al prerenderizar): 2089 MB, 48 s. Intento 3: por anotar (última línea `[medir-build]` del log) | última línea `[medir-build]` del log                                                                                                    |
| Comando de arranque que funciona                   | `npm run start`                                                                                                 | `npm run start` o `npm run start -- -p $PORT`                                                                                           |
| `next/image` (sharp)                               | 200 `image/webp`                                                                                                | `curl -I "https://<dominio>/_next/image?url=%2Fdemo%2Fvenue-1-hero.jpg&w=640&q=75"` debe responder `200` con `content-type: image/webp` |
| Tiempo de respuesta del HTML                       | TTFB de 0.29 a 0.50 s en `/` (3 mediciones)                                                                     | `curl -w "%{time_starttransfer}"` sobre `/`                                                                                             |

Otras comprobaciones del tercer intento:

- 13 rutas en inglés y español en 200, y una inexistente en 404;
- `noindex, nofollow` y canonical con https en todas las páginas;
- sin redirección por `Accept-Language: es`;
- sin secretos en el HTML;
- Playwright contra la URL: 24 de 27. Las 3 fallas son la prueba que exige `localhost`, igual que en Railway.

Dos comportamientos de Hostinger que conviene conocer:

- **`robots.txt`:** en el dominio temporal (`*.hostingersite.com`) lo sirve la CDN de Hostinger (`Server: hcdn`) en lugar del de la app, y permite todo salvo a Googlebot. Las páginas siguen con `noindex`. Con el dominio propio hay que volver a verificar que se sirva el de la app.
- **Caché de la CDN:** con `x-hcdn-cache-status: DYNAMIC` la CDN no guarda el HTML, así que un despliegue o una revalidación se ven de inmediato.

## 4.1 Caché de imágenes optimizadas

El optimizador de Next guarda las imágenes en `.next/cache/images` hasta 4 horas (valor por defecto en Next 16). Si se reemplaza una imagen de `public/` con el mismo nombre, se sigue sirviendo la anterior hasta que expire o se borre la caché. Con las imágenes de Sanity no ocurre, porque cada archivo nuevo tiene URL nueva.

## 5. Volver a desplegar o revertir

- Volver a desplegar: `git push` a `main`, o botón de redespliegue en hPanel.
- Revertir: `git revert <commit>` y `git push` (queda auditado en el historial). Hostinger conserva las dos últimas versiones exitosas; si su panel permite reactivar la anterior, se documentará aquí tras comprobarlo.

## 6. Alternativa para videos (D-014)

Los loops se sirven desde el CDN de Sanity (tope 2 MB escritorio, 1 MB móvil). Si la transferencia mensual del plan de Sanity se acerca al límite (100 GB en el plan gratuito), la alternativa es servirlos desde Hostinger:

1. Guardar los archivos en `public/video/` (versionados) o subirlos por FTP a una carpeta estática del dominio.
2. Cambiar el campo del video por una URL relativa (`/video/hero-escritorio.mp4`).
3. Añadir `Cache-Control: public, max-age=31536000, immutable` con nombres de archivo con versión.

Costo: el tráfico de video pasa por el servidor compartido (CPU y ancho de banda del plan) y se pierde la edición desde Studio.

## 7. Sanity (CMS y edición visual)

El Studio se publica aparte en `https://curatedyucatan.sanity.studio` (D-013). El sitio lee de Sanity cuando tiene `NEXT_PUBLIC_SANITY_PROJECT_ID`; sin esa variable usa los datos DEMO (D-033).

### 7.1 Puesta en marcha (una sola vez)

Hecha el 2026-09-30. Proyecto **`bx8gqx3p`** ("curated yucatan"), dataset **`production`** (público; los contactos de leads son privados por su ID, D-012).

| Paso                                                         | Comando o acción                                                                                                                               | Estado |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 1. Sesión de la CLI (el titular, abre el navegador)          | `npx sanity login` en `C:curatedyucatan`                                                                                                       | ✅     |
| 2. Proyecto y dataset                                        | creados en sanity.io                                                                                                                           | ✅     |
| 3. Variables locales                                         | `.env.local` (plantilla en `.env.example`); el ID de proyecto también es el valor por defecto del Studio                                       | ✅     |
| 4. Token de lectura (rol _Viewer_) → `SANITY_API_READ_TOKEN` | `npx sanity tokens add "Sitio Curated Yucatan (lectura)" --role viewer`. Solo en el servidor                                                   | ✅     |
| 5. CORS con credenciales                                     | `localhost:3333`, `localhost:3000` y `https://curatedyucatan.sanity.studio`. **Falta la URL de Hostinger**                                     | 🟡     |
| 6. Datos DEMO                                                | `npm run sanity:semilla` y `npx sanity dataset import sanity/semilla/demo.ndjson --dataset production --replace`: 31 documentos y 114 imágenes | ✅     |
| 7. Validar los documentos                                    | `npx sanity documents validate --dataset production --yes`: 31 válidos, 0 errores, 0 avisos                                                    | ✅     |
| 8. Privacidad de los contactos                               | `npm run sanity:verificar-privados`: 0 visibles sin token y 1 con token                                                                        | ✅     |
| 9. Publicar el Studio                                        | `npm run studio:deploy` → https://curatedyucatan.sanity.studio (appId en `sanity.cli.ts`)                                                      | ✅     |

**Al tener la URL de Hostinger:**

- Volver a publicar el Studio con `SANITY_STUDIO_PREVIEW_URL=<url pública>`. Hoy "Editar en la página" abre `http://localhost:3000`.
- Agregar esa URL a CORS.
- Crear el webhook (7.2).

### 7.2 Webhook de revalidación (D-010)

En sanity.io/manage → API → Webhooks:

| Campo        | Valor                                                                                                                                                            |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| URL          | `https://<dominio>/api/revalidar`                                                                                                                                |
| Dataset      | `production`                                                                                                                                                     |
| Disparadores | Crear, actualizar y borrar                                                                                                                                       |
| Filtro       | `_type in ["venue","coleccion","region","proveedor","articulo","paginaEditorial","descubreYucatan","categoriaDescubre","disenoProduccion","configuracionSitio"]` |
| Proyección   | `{ _type, "slug": slug.current }`                                                                                                                                |
| Método       | POST                                                                                                                                                             |
| Secreto      | el mismo valor que `SANITY_REVALIDATE_SECRET`                                                                                                                    |

El endpoint responde `{ ok: true, datos: { etiquetas } }` y regenera las páginas que usan ese tipo de documento (y la ficha, si trae slug) en la siguiente visita.

### 7.3 Variables en Hostinger

| Variable                        | Nota                                                        |
| ------------------------------- | ----------------------------------------------------------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Se incrusta en el build: cambiarla exige volver a desplegar |
| `NEXT_PUBLIC_SANITY_DATASET`    | `production`                                                |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | `https://curatedyucatan.sanity.studio`                      |
| `SANITY_API_READ_TOKEN`         | Token _Viewer_; solo servidor                               |
| `SANITY_REVALIDATE_SECRET`      | Igual al del webhook                                        |

`SANITY_API_WRITE_TOKEN` nunca se configura en Hostinger.

### 7.4 Cómo funciona "Editar en la página"

El Studio abre el sitio en un iframe y llama a `/api/draft-mode/enable`, que valida el secreto de vista previa con el token del servidor y activa el modo borrador. En ese modo el sitio lee borradores, marca los textos editables (stega) y carga `VisualEditing`. Para salir: el botón "Salir de la vista previa" o `/api/draft-mode/disable`. Ningún token llega al navegador (D-034).

## 8. Versión provisional en Railway (D-049)

Mientras se prepara Hostinger, el sitio está en línea en Railway para que el equipo lo revise sin depender de una computadora local.

- **URL:** https://sitio-production-4d31.up.railway.app (sin indexar: `noindex` y `robots.txt` con `Disallow: /`).
- **Proyecto:** `curatedyucatan`, servicio `sitio`, entorno `production`, en el espacio de trabajo de saraseit.
- **Origen:** repositorio `Saraseit/curatedyucatan`, rama `main`. Cada `git push` vuelve a publicar.
- **Build:** Railpack detecta Node 24 por `.nvmrc` y ejecuta `npm install`, `npm run build` y `npm run start`. `next start` escucha en el `PORT` que asigna Railway. No hay `railway.toml`: Railway ya no lo lee en servicios nuevos, así que la configuración vive en el servicio.
- **Variables:** solo `NEXT_PUBLIC_SITE_URL` (la URL de arriba) y `SITIO_INDEXABLE=false`.
  - Sin variables de Sanity el sitio usa el contenido local (D-033), que hoy es el más actual: los 18 venues y las páginas de Discover todavía no están importados en Sanity.
  - Sin secretos: no hay token de lectura ni secreto del webhook.

### 8.1 Verificación (2026-10-02)

| Comprobación                            | Resultado real                                                                                                                |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 13 rutas clave en inglés y español      | 200; ruta inexistente 404                                                                                                     |
| `robots.txt` y metadatos                | `Disallow: /`, `noindex, nofollow` y canonical con la URL de Railway                                                          |
| `/_next/image` con `Accept: image/webp` | 200 `image/webp`                                                                                                              |
| Navegador con `Accept-Language: es`     | 200 en `/`, `lang="en"`, sin redirección                                                                                      |
| Playwright contra la URL de Railway     | 24 de 27. Las 3 fallas son la misma prueba, que exige `localhost` en la URL; su comprobación se hizo con curl (fila anterior) |
| Secretos en el HTML del inicio          | ninguno                                                                                                                       |

### 8.2 Conectar Sanity aquí (cuando se importe la semilla)

1. Importar la semilla y publicar el Studio con `SANITY_STUDIO_PREVIEW_URL` apuntando a la URL de Railway.
2. En Railway: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_STUDIO_URL`, `SANITY_API_READ_TOKEN` y `SANITY_REVALIDATE_SECRET`. Las `NEXT_PUBLIC_` se leen en el build, así que el cambio redespliega.
3. En sanity.io/manage: agregar la URL a CORS (con credenciales) y crear el webhook de la sección 7.2 hacia `/api/revalidar`.

### 8.3 Mudanza a Hostinger

Es la misma app, así que basta con:

1. seguir las secciones 2, 3 y 7.3;
2. cambiar la URL en CORS, en el webhook y en la vista previa del Studio;
3. apuntar el dominio a Hostinger.

Cuando Hostinger sirva el sitio, se puede borrar el proyecto de Railway.

## 9. Repositorios: institucional y personal (2026-10-07)

- **Institucional:** `MINIMALESTUDIO/webcuratedyucatan`, del que despliega Hostinger. Se creó con una copia del código en un solo commit ("Initial commit", `a244dce`), idéntica a `61fb537`.
- **Personal:** `Saraseit/curatedyucatan`, del que despliega Railway (sección 8).
- **Cómo se unieron:** el commit `7d7e234` une ambos historiales sin reemplazar el "Initial commit" ni cambiar archivos (mismo árbol). Desde ahí los dos repos comparten historial y se actualizan sin forzar.
- **Subida a los dos:** en la copia local, `origin` tiene dos URL de subida, así que `git push origin main` sube a ambos repos:

  ```sh
  git remote set-url --push origin https://github.com/Saraseit/curatedyucatan.git
  git remote set-url --add --push origin https://github.com/MINIMALESTUDIO/webcuratedyucatan.git
  ```

- **Permisos:** `Saraseit` es colaborador del repo institucional. Los commits siguen firmados con la cuenta personal.
- **Al terminar la mudanza:** cuando Hostinger sirva el sitio y se borre Railway, se puede dejar solo el institucional con `git remote set-url origin https://github.com/MINIMALESTUDIO/webcuratedyucatan.git`.

## 10. Sanity conectado a Hostinger (2026-10-08)

| Paso                           | Resultado real                                                                                                                                                                                           |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Respaldo previo                | `npx sanity dataset export production` → 1 MB, guardado fuera del repo. No había borradores ni ediciones posteriores a la importación del 30 sep.                                                        |
| Importación                    | `npx sanity dataset import sanity/semilla/demo.ndjson --dataset production --replace` → 50 documentos                                                                                                    |
| Limpieza                       | Se borraron 8 documentos de la semilla anterior que `--replace` no toca: 6 venues de ejemplo y 2 artículos de ejemplo. El dataset quedó idéntico a la semilla.                                           |
| Validación                     | `npx sanity documents validate` → 0 errores y 0 avisos (el máximo del lema pasa de 70 a 100 por el copy real)                                                                                            |
| Privacidad                     | `npm run sanity:verificar-privados` → 0 privados visibles sin token                                                                                                                                      |
| Studio                         | `SANITY_STUDIO_PREVIEW_URL=https://ivory-kingfisher-466902.hostingersite.com npx sanity deploy`. "Editar en la página" abre Hostinger. Se revisaron 156 archivos del build sin encontrar ningún secreto. |
| CORS                           | se agregó `https://ivory-kingfisher-466902.hostingersite.com` con credenciales                                                                                                                           |
| Webhook                        | "Revalidar sitio (Hostinger)" (id `jCFc9PCk9nBf5BJp`) hacia `/api/revalidar`, con el filtro de la sección 7.2. Se creó con la API de webhooks usando la sesión de la CLI.                                |
| Sitio en modo Sanity, en local | `build:medido` correcto (105 páginas, imágenes del CDN de Sanity, sin respaldo DEMO) y Playwright 27 de 27                                                                                               |

**Variables de Hostinger:** se genera `.env.hostinger` en la raíz de la copia local. Git lo ignora por el patrón `.env*` y se importa en hPanel. Lleva `NEXT_PUBLIC_SITE_URL`, `SITIO_INDEXABLE=false`, `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_STUDIO_URL`, `SANITY_API_READ_TOKEN` y `SANITY_REVALIDATE_SECRET`. Nunca lleva el token de escritura ni las `SANITY_STUDIO_*`.

**Para volver a importar la semilla en el futuro:** `--replace` sobrescribe lo editado en el Studio. Haz antes un respaldo con `dataset export`.

## 11. Dominio curatedyucatan.com (2026-10-09)

El dominio quedó vinculado a Hostinger. Estado comprobado:

| Comprobación                                                    | Resultado real                                                                                              |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `https://curatedyucatan.com` y `https://www.curatedyucatan.com` | 200 con certificado válido                                                                                  |
| `http://curatedyucatan.com`                                     | 301 a https                                                                                                 |
| `robots.txt`                                                    | lo sirve la app (`Disallow: /`), no la CDN como en el dominio temporal                                      |
| Sanity CORS                                                     | se agregaron `https://curatedyucatan.com` y `https://www.curatedyucatan.com` con credenciales               |
| Webhook "Revalidar sitio" (`jCFc9PCk9nBf5BJp`)                  | URL cambiada a `https://curatedyucatan.com/api/revalidar`. Petición firmada: 200; sin firma: 401            |
| Studio                                                          | publicado con `SANITY_STUDIO_PREVIEW_URL=https://curatedyucatan.com`: "Editar en la página" abre el dominio |
| `/api/draft-mode/enable` con secreto falso                      | 401                                                                                                         |
| Encabezados                                                     | sin `X-Frame-Options` ni `frame-ancestors`, así que el Studio puede mostrar el sitio                        |

**Pendientes:**

- En hPanel, `NEXT_PUBLIC_SITE_URL=https://curatedyucatan.com` (ya está en `.env.hostinger`) y volver a desplegar. Hasta entonces, la URL canónica y los enlaces de idioma apuntan al dominio temporal.
- `www` responde 200 en vez de redirigir al dominio sin `www`. Conviene una redirección 301 en hPanel; la URL canónica ya evita contenido duplicado una vez corregida la variable.
- `SITIO_INDEXABLE` sigue en `false` hasta el lanzamiento (D-028).
- Los QR deben apuntar a `https://curatedyucatan.com/…`. Las rutas en inglés son estables: `/` y `/find-your-yucatan`.
