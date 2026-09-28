# Curated Yucatán

Sitio bilingüe (inglés por defecto, español en `/es`) que promueve Yucatán como destino de bodas, con una selección curada de venues y proveedores.

**Estado:** Fase P, piloto visual con datos `[DEMO]`. No hay base de datos, Sanity ni envío real de formularios todavía.

## Requisitos

- Node.js 24 (ver `.nvmrc`) y npm 11.
- Para las pruebas e2e: navegadores de Playwright (`npx playwright install chromium webkit`).

## Comandos

| Comando                 | Qué hace                                                             |
| ----------------------- | -------------------------------------------------------------------- |
| `npm run dev`           | Servidor de desarrollo en http://localhost:3000                      |
| `npm run build`         | Build de producción                                                  |
| `npm run build:medido`  | Build de producción con memoria pico al final (el que usa Hostinger) |
| `npm run start`         | Sirve el build de producción                                         |
| `npm run lint`          | ESLint                                                               |
| `npm run typecheck`     | Genera los tipos de rutas y corre `tsc`                              |
| `npm run format`        | Prettier                                                             |
| `npm test`              | Pruebas unitarias (Vitest)                                           |
| `npm run test:e2e`      | Recorrido e2e en móvil y escritorio (Playwright)                     |
| `npm run capturas`      | Capturas de las páginas del piloto en 360, 768 y 1440 px             |
| `npm run demo:imagenes` | Regenera las imágenes `[DEMO]` de `public/demo/`                     |

Las pruebas e2e y las capturas corren contra el build de producción: ejecuta `npm run build` antes.
Si regeneras imágenes con el mismo nombre, borra `.next/cache/images` (el optimizador las guarda hasta 4 horas).

## Estructura

```
docs/                 requisitos (PROMPT), decisiones, bitácora, despliegue, contenido
src/app/[locale]/     páginas; [locale]/layout.tsx es el layout raíz
src/components/       ui/ (primitivos), secciones/ (bloques de página), formularios/
src/i18n/             rutas traducidas, configuración de next-intl y mensajes en/es
src/lib/contenido/    tipos con la forma de Sanity y funciones de acceso a datos
src/lib/demo/         datos [DEMO] del piloto
src/estilos/          tokens de diseño y tipografía (cambiar de tipografía = editar tipografia.ts)
tests/                unit/ (Vitest) y e2e/ (Playwright)
scripts/              medición de memoria del build e imágenes DEMO
```

## Documentación

- [Requisitos del proyecto](docs/PROMPT.md)
- [Decisiones](docs/DECISIONES.md)
- [Bitácora por fase](docs/BITACORA.md)
- [Despliegue en Hostinger](docs/DESPLIEGUE.md)
