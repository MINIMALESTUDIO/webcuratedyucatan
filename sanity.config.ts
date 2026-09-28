import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { presentationTool } from 'sanity/presentation';
import { structureTool } from 'sanity/structure';
import { estructura, TIPOS_UNICOS } from './sanity/estructura';
import { resolverPresentacion } from './sanity/presentacion';
import { tiposEsquema } from './sanity/schemas';

/*
 * Sanity Studio de Curated Yucatán (D-013): se desarrolla con `npm run studio` y se publica
 * aparte con `npm run studio:deploy` (no forma parte del build del sitio en Hostinger).
 * La CLI de Sanity carga las variables SANITY_STUDIO_* desde .env.local.
 */

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'sin-proyecto';
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';
/** Sitio que se abre dentro de "Editar en la página". */
const urlSitio = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000';

const ACCIONES_UNICOS = new Set(['publish', 'discardChanges', 'restore']);

export default defineConfig({
  name: 'curated-yucatan',
  title: 'Curated Yucatán',
  projectId,
  dataset,
  plugins: [
    structureTool({ title: 'Contenido', structure: estructura }),
    presentationTool({
      title: 'Editar en la página',
      resolve: resolverPresentacion,
      previewUrl: {
        initial: urlSitio,
        previewMode: { enable: '/api/draft-mode/enable' },
      },
    }),
    visionTool({ title: 'Consultas GROQ', defaultApiVersion: '2026-02-01' }),
  ],
  schema: {
    types: tiposEsquema,
    // Los documentos únicos no aparecen en "Crear nuevo".
    templates: (plantillas) => plantillas.filter(({ schemaType }) => !TIPOS_UNICOS.has(schemaType)),
  },
  document: {
    // Ni borrar ni duplicar los documentos únicos.
    actions: (acciones, { schemaType }) =>
      TIPOS_UNICOS.has(schemaType)
        ? acciones.filter(({ action }) => action !== undefined && ACCIONES_UNICOS.has(action))
        : acciones,
  },
});
