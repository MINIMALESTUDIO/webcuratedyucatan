# Curated Yucatán

Plataforma bilingüe (inglés por defecto, español en `/es`) para descubrir Yucatán como destino de celebraciones: _Your insider guide to celebrating in Yucatán_. Es la extensión digital del libro Curated Yucatán, pensada sobre todo para wedding planners y profesionales internacionales. La dirección está en `docs/referencias/`.

**Estado:** realineado con la dirección del proyecto (Fase R), con la base del CMS (Fase 2). Sin proyecto de Sanity configurado, el sitio usa datos `[DEMO]`. Todavía no hay base de datos ni envío real de formularios.

Mapa del sitio: Home, Discover Yucatán, Venues (tres colecciones), Catering, Photography, Design & Production (Minimal), Curated Journal, About, Find Your Yucatán y Plan Your Event.

## Requisitos

- Node.js 24 (ver `.nvmrc`) y npm 11.
- Para las pruebas e2e: navegadores de Playwright (`npx playwright install chromium webkit`).

## Comandos

| Comando                             | Qué hace                                                             |
| ----------------------------------- | -------------------------------------------------------------------- |
| `npm run dev`                       | Servidor de desarrollo en http://localhost:3000                      |
| `npm run build`                     | Build de producción                                                  |
| `npm run build:medido`              | Build de producción con memoria pico al final (el que usa Hostinger) |
| `npm run start`                     | Sirve el build de producción                                         |
| `npm run lint`                      | ESLint                                                               |
| `npm run typecheck`                 | Genera los tipos de rutas y corre `tsc`                              |
| `npm run format`                    | Prettier                                                             |
| `npm test`                          | Pruebas unitarias (Vitest)                                           |
| `npm run test:e2e`                  | Recorrido e2e en móvil y escritorio (Playwright)                     |
| `npm run capturas`                  | Capturas de las páginas principales en 360, 768 y 1440 px            |
| `npm run demo:imagenes`             | Regenera las imágenes `[DEMO]` de `public/demo/`                     |
| `npm run studio`                    | Sanity Studio local en http://localhost:3333                         |
| `npm run studio:deploy`             | Publica el Studio en `*.sanity.studio`                               |
| `npm run sanity:semilla`            | Genera `sanity/semilla/demo.ndjson` para importar los datos DEMO     |
| `npm run sanity:verificar-privados` | Comprueba que los contactos de leads no son públicos                 |

Las pruebas e2e y las capturas corren contra el build de producción: ejecuta `npm run build` antes.
Si regeneras imágenes con el mismo nombre, borra `.next/cache/images` (el optimizador las guarda hasta 4 horas).

## Estructura

```
docs/                 requisitos (PROMPT), referencias de dirección, decisiones, bitácora, despliegue, contenido
src/app/[locale]/     páginas; [locale]/layout.tsx es el layout raíz
src/components/       ui/ (primitivos), secciones/ (bloques de página), formularios/
src/i18n/             rutas traducidas, configuración de next-intl y mensajes en/es
src/lib/contenido/    tipos, contrato de fuentes y acceso a datos (Sanity o DEMO)
src/lib/sanity/       cliente, consultas GROQ y edición visual
sanity/               esquemas, estructura del Studio y Presentation
src/lib/demo/         datos [DEMO]
src/lib/descubrimiento/ reglas de Find Your Yucatán
src/estilos/          tokens de diseño y tipografía (cambiar de tipografía = editar tipografia.ts)
tests/                unit/ (Vitest) y e2e/ (Playwright)
scripts/              medición de memoria del build e imágenes DEMO
```

## Documentación

- [Dirección del proyecto: prompt visual, estructura web, LOVE MÉXICO y el libro](docs/referencias/)
- [Análisis de brechas frente a la dirección](docs/ANALISIS_DIRECCION.md)
- [Requisitos técnicos originales](docs/PROMPT.md) (donde chocan, manda la dirección: D-038)
- [Decisiones](docs/DECISIONES.md)
- [Bitácora por fase](docs/BITACORA.md)
- [Despliegue en Hostinger y Sanity](docs/DESPLIEGUE.md)
- [Guía de contenido](docs/CONTENIDO.md)
