import type { StructureResolver } from 'sanity/structure';

/** Documentos únicos: se editan, pero no se crean ni se borran desde el Studio. */
export const DOCUMENTOS_UNICOS = {
  configuracionSitio: 'configuracionSitio',
  // El punto en el ID lo mantiene privado aunque el dataset sea público (D-012).
  contactosLeads: 'privado.contactosLeads',
} as const;

export const TIPOS_UNICOS = new Set<string>(Object.keys(DOCUMENTOS_UNICOS));

export const estructura: StructureResolver = (S) =>
  S.list()
    .title('Contenido')
    .items([
      S.listItem()
        .title('Configuración del sitio')
        .id('configuracionSitio')
        .child(
          S.document()
            .schemaType('configuracionSitio')
            .documentId(DOCUMENTOS_UNICOS.configuracionSitio)
            .title('Configuración del sitio'),
        ),
      S.divider(),
      S.documentTypeListItem('venue').title('Venues'),
      S.documentTypeListItem('region').title('Regiones'),
      S.divider(),
      S.documentTypeListItem('proveedor').title('Proveedores'),
      S.documentTypeListItem('categoriaProveedor').title('Categorías de proveedor'),
      S.divider(),
      S.documentTypeListItem('historia').title('Historias'),
      S.documentTypeListItem('episodio').title('Episodios'),
      S.documentTypeListItem('guia').title('Guías'),
      S.documentTypeListItem('paginaEditorial').title('Páginas editoriales'),
      S.divider(),
      S.listItem()
        .title('Contactos de leads (privado)')
        .id('contactosLeads')
        .child(
          S.document()
            .schemaType('contactosLeads')
            .documentId(DOCUMENTOS_UNICOS.contactosLeads)
            .title('Contactos de leads (privado)'),
        ),
    ]);
