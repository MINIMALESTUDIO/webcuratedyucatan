import { capitulo, cita, espacio, fichaTecnica, imagenConAlt, seo, youtube } from './objetos';
import { categoriaProveedor, proveedor, region } from './documentos/catalogos';
import { episodio, guia, historia, paginaEditorial } from './documentos/editorial';
import { configuracionSitio, contactosLeads } from './documentos/singletons';
import { venue } from './documentos/venue';

// Modelo de contenido de la sección 6 de docs/PROMPT.md.
export const tiposEsquema = [
  // Objetos reutilizables
  imagenConAlt,
  youtube,
  capitulo,
  cita,
  espacio,
  fichaTecnica,
  seo,
  // Documentos
  venue,
  region,
  proveedor,
  categoriaProveedor,
  historia,
  episodio,
  guia,
  paginaEditorial,
  configuracionSitio,
  contactosLeads,
];
