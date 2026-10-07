import type { StructureResolver } from 'sanity/structure';

/** Documentos únicos: se editan, pero no se crean ni se borran desde el Studio. */
export const DOCUMENTOS_UNICOS = {
  configuracionSitio: 'configuracionSitio',
  descubreYucatan: 'descubreYucatan',
  disenoProduccion: 'disenoProduccion',
  // El punto en el ID lo mantiene privado aunque el dataset sea público (D-012).
  contactosLeads: 'privado.contactosLeads',
} as const;

/** Páginas editoriales con ruta fija: un documento por ID fijo (sin punto: serían privados). */
export const PAGINAS_EDITORIALES = [
  { id: 'pagina-nosotros', titulo: 'About' },
  { id: 'pagina-privacidad', titulo: 'Privacy' },
] as const;

export const TIPOS_UNICOS = new Set<string>([...Object.keys(DOCUMENTOS_UNICOS), 'paginaEditorial']);

const API = '2026-02-01';

export const estructura: StructureResolver = (S) => {
  const unico = (tipo: keyof typeof DOCUMENTOS_UNICOS, titulo: string) =>
    S.listItem()
      .title(titulo)
      .id(tipo)
      .child(S.document().schemaType(tipo).documentId(DOCUMENTOS_UNICOS[tipo]).title(titulo));

  const partners = (tipo: 'catering' | 'fotografia', titulo: string) =>
    S.listItem()
      .title(titulo)
      .id(`partners-${tipo}`)
      .child(
        S.documentList()
          .title(titulo)
          .schemaType('proveedor')
          .apiVersion(API)
          .filter('_type == "proveedor" && tipo == $tipo')
          .params({ tipo }),
      );

  return S.list()
    .title('Contenido')
    .items([
      unico('configuracionSitio', 'Inicio y configuración'),
      S.listItem()
        .title('Discover Yucatán')
        .id('discover')
        .child(
          S.list()
            .title('Discover Yucatán')
            .items([
              unico('descubreYucatan', 'Portada'),
              S.listItem()
                .title('Categorías')
                .id('categorias-descubre')
                .child(
                  S.documentTypeList('categoriaDescubre')
                    .title('Categorías')
                    .defaultOrdering([{ field: 'orden', direction: 'asc' }]),
                ),
            ]),
        ),
      S.divider(),
      S.documentTypeListItem('venue').title('Venues'),
      S.documentTypeListItem('coleccion').title('Colecciones'),
      S.documentTypeListItem('region').title('Regiones'),
      S.divider(),
      partners('catering', 'Catering'),
      partners('fotografia', 'Photography'),
      unico('disenoProduccion', 'Design & Production (Minimal)'),
      S.divider(),
      S.documentTypeListItem('articulo').title('Curated Journal'),
      ...PAGINAS_EDITORIALES.map((pagina) =>
        S.listItem()
          .title(pagina.titulo)
          .id(pagina.id)
          .child(
            S.document().schemaType('paginaEditorial').documentId(pagina.id).title(pagina.titulo),
          ),
      ),
      S.divider(),
      unico('contactosLeads', 'Contactos de leads (privado)'),
    ]);
};
