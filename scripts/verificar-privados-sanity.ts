// Prueba de D-012: una consulta anónima NO debe ver los contactos de leads (documentos privado.*),
// y una consulta con el token del servidor SÍ. Sale con código 1 si la privacidad falla.
// Uso: npm run sanity:verificar-privados  (lee .env.local)
import { existsSync } from 'node:fs';

if (existsSync('.env.local')) process.loadEnvFile('.env.local');

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_READ_TOKEN;

if (!projectId) {
  console.error('[privados] Falta NEXT_PUBLIC_SANITY_PROJECT_ID en .env.local');
  process.exit(1);
}

const consulta = encodeURIComponent(
  'count(*[_id in path("privado.**") || _type == "contactosLeads"])',
);
const url = `https://${projectId}.api.sanity.io/v2026-02-01/data/query/${dataset}?query=${consulta}&perspective=raw`;

async function contar(conToken: boolean): Promise<number> {
  const respuesta = await fetch(url, {
    headers: conToken && token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}: ${await respuesta.text()}`);
  const { result } = (await respuesta.json()) as { result: number };
  return result;
}

// tsx ejecuta este archivo como CommonJS (sin await de nivel superior): todo va en main().
async function main() {
  const anonimo = await contar(false);
  console.log(
    `[privados] Consulta anónima: ${anonimo} documento(s) privado(s) visibles (esperado: 0)`,
  );

  if (token) {
    const conToken = await contar(true);
    console.log(
      `[privados] Consulta con token del servidor: ${conToken} documento(s) (esperado: 1 o más)`,
    );
  } else {
    console.log('[privados] Sin SANITY_API_READ_TOKEN: se omite la comprobación con token.');
  }

  if (anonimo !== 0) {
    console.error('[privados] FALLA: los contactos de leads son visibles sin token.');
    process.exit(1);
  }
  console.log('[privados] Correcto: los contactos de leads no son públicos.');
}

main().catch((error: unknown) => {
  console.error('[privados] Error al consultar Sanity:', error);
  process.exit(1);
});
