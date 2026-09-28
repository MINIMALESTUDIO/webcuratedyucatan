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
2. **Importar repositorio de Git** → autorizar GitHub (cuenta `Saraseit`) → repositorio `curatedyucatan`, rama `main`.
3. Dominio: el temporal que ofrece Hostinger o un subdominio propio.
4. Configuración de build:

   | Campo                  | Valor                                                                |
   | ---------------------- | -------------------------------------------------------------------- |
   | Framework              | Next.js                                                              |
   | Versión de Node.js     | 24.x                                                                 |
   | Directorio raíz        | `/`                                                                  |
   | Comando de instalación | `npm ci`                                                             |
   | Comando de build       | `npm run build:medido` (mide la memoria, ver D-030)                  |
   | Comando de arranque    | `npm run start` (si la app no responde: `npm run start -- -p $PORT`) |
   | Directorio de salida   | `.next`                                                              |

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

**En Hostinger** — _por completar tras el primer despliegue:_

| Dato                                               | Resultado     | Cómo se obtiene                                                                                                                         |
| -------------------------------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| URL pública                                        | por confirmar | hPanel                                                                                                                                  |
| Versión de Node y límite de memoria del contenedor | por confirmar | primera línea `[medir-build]` del log de build                                                                                          |
| Memoria pico y duración del build                  | por confirmar | última línea `[medir-build]` del log                                                                                                    |
| Comando de arranque que funciona                   | por confirmar | `npm run start` o `npm run start -- -p $PORT`                                                                                           |
| `next/image` (sharp)                               | por confirmar | `curl -I "https://<dominio>/_next/image?url=%2Fdemo%2Fvenue-1-hero.jpg&w=640&q=75"` debe responder `200` con `content-type: image/webp` |
| Tiempo de respuesta del HTML                       | por confirmar | `curl -w "%{time_starttransfer}"` sobre `/`                                                                                             |

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
