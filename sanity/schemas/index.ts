import {
  capitulo,
  elementoLista,
  espacio,
  fichaTecnica,
  imagenConAlt,
  notaCurated,
  seo,
  youtube,
} from './objetos';
import { coleccion, proveedor, region } from './documentos/catalogos';
import {
  articulo,
  categoriaDescubre,
  descubreYucatan,
  paginaEditorial,
} from './documentos/editorial';
import { configuracionSitio, contactosLeads, disenoProduccion } from './documentos/singletons';
import { venue } from './documentos/venue';

// Modelo de contenido alineado con "Estructura y dirección web" (docs/referencias, D-038).
export const tiposEsquema = [
  // Objetos reutilizables
  imagenConAlt,
  youtube,
  capitulo,
  elementoLista,
  espacio,
  fichaTecnica,
  notaCurated,
  seo,
  // Documentos
  venue,
  coleccion,
  region,
  proveedor,
  articulo,
  paginaEditorial,
  descubreYucatan,
  categoriaDescubre,
  configuracionSitio,
  disenoProduccion,
  contactosLeads,
];
