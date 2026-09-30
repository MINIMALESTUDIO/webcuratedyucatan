import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'bx8gqx3p',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  // Studio publicado en https://<studioHost>.sanity.studio (D-013).
  studioHost: process.env.SANITY_STUDIO_HOST || 'curatedyucatan',
  deployment: { autoUpdates: true },
  server: { port: 3333 },
});
