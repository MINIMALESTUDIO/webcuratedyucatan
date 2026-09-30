import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'bx8gqx3p',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  // Studio publicado en https://<studioHost>.sanity.studio (D-013).
  studioHost: process.env.SANITY_STUDIO_HOST || 'curatedyucatan',
  // appId: lo asignó el primer `sanity deploy`; evita que la CLI lo pregunte en cada despliegue.
  deployment: { appId: 'naj67vz3h1dhgmwvpkr9x5yu', autoUpdates: true },
  server: { port: 3333 },
});
