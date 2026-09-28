import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId, sanityConfigurado, studioUrl } from './configuracion';

/*
 * Cliente de Sanity. Stega (texto invisible con el origen de cada dato) solo se activa en modo
 * borrador y solo en textos bilingües y nombres: así la edición visual marca lo editable sin
 * contaminar slugs, IDs de YouTube ni valores de listas que el sitio usa como claves (D-034).
 */

function esTextoEditable(ruta: ReadonlyArray<unknown>): boolean {
  const ultimo = ruta.at(-1);
  return (
    ruta.some((parte) => parte === 'en' || parte === 'es') ||
    ultimo === 'nombre' ||
    ultimo === 'autor'
  );
}

export const cliente = createClient({
  // Con un ID de relleno el cliente se puede crear aunque falte la configuración; el sitio no
  // lo usa hasta que sanityConfigurado() sea verdadero (D-033).
  projectId: sanityConfigurado() ? projectId : 'sin-proyecto',
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  stega: {
    studioUrl,
    filter: (props) => esTextoEditable(props.sourcePath) && props.filterDefault(props),
  },
});
