# Registro de cambios

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

## [Sin publicar]

### Agregado

- Fase P (piloto visual), en inglés (`/`) y español (`/es`):
  - Inicio con las once secciones de la sección 11.
  - Listado de venues con filtros reflejados en la URL (barra lateral en escritorio, panel en móvil).
  - Ficha de venue con ficha técnica, entrevista con capítulos, espacios, galería con visor, citas, proveedores, formulario de disponibilidad, venues similares y barra fija en móvil.
  - Formularios con validación y aviso de envío desactivado.
  - Páginas `[PENDIENTE]` para el resto de rutas de la sección 4 y 404 localizado.
- Base técnica: Next.js 16.3.6, TypeScript 6 estricto, next-intl sin detección por navegador, tokens de marca, tipografía autohospedada, datos DEMO con la forma de Sanity, 53 imágenes de relleno.
- Calidad: 41 pruebas unitarias, 18 pruebas e2e en móvil, escritorio y WebKit con axe, capturas en 360, 768 y 1440 px, Lighthouse móvil local y medición de memoria del build.
- Documentación: requisitos, decisiones D-001 a D-032, guía de despliegue en Hostinger y bitácora de la Fase P.

### Cambiado

- Los esquemas zod se cargan al enviar un formulario: el JS inicial bajó de 264 a 173 KB en el inicio (D-031).
