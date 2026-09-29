import { getLocale, getTranslations } from 'next-intl/server';
import type { DestinoLlamado, PaginaEditorial } from '@/lib/contenido/tipos';
import { localizar, localizarBloques } from '@/lib/i18n/localizar';
import type { EnlaceNavegacion } from '@/lib/navegacion';
import { rutaElemento } from '@/lib/sanity/edicion';
import { BotonEnlace } from '@/components/ui/Boton';
import { Contenedor } from '@/components/ui/Contenedor';
import { ImagenContenido } from '@/components/ui/ImagenContenido';
import { EncabezadoSeccion } from './EncabezadoSeccion';
import { TextoEnriquecido } from './TextoEnriquecido';

const DESTINOS: Record<DestinoLlamado, EnlaceNavegacion> = {
  'planea-tu-evento': { href: '/planea-tu-evento', clave: 'planea' },
  'encuentra-tu-yucatan': { href: '/encuentra-tu-yucatan', clave: 'encuentra' },
  venues: { href: '/venues', clave: 'venues' },
  'descubre-yucatan': { href: '/descubre-yucatan', clave: 'descubre' },
};

/** Página editorial (About, Privacy) compuesta por secciones de Sanity. */
export async function PaginaEditorialVista({ pagina }: { pagina: PaginaEditorial }) {
  const idioma = await getLocale();
  const tn = await getTranslations('Navegacion');

  return (
    <>
      <Contenedor className="pt-16 pb-14 sm:pt-20">
        <EncabezadoSeccion
          nivel="h1"
          titulo={localizar(pagina.titulo, idioma)}
          entradilla={pagina.entradilla ? localizar(pagina.entradilla, idioma) : undefined}
        />
      </Contenedor>
      {pagina.imagen && (
        <Contenedor className="pb-seccion">
          <div className="relative aspect-[16/9] overflow-hidden bg-arena">
            <ImagenContenido
              imagen={pagina.imagen}
              edicion={{ id: pagina._id, tipo: 'paginaEditorial', ruta: 'imagen' }}
              sizes="(min-width: 1280px) 1200px, 100vw"
              preload
            />
          </div>
        </Contenedor>
      )}
      <div className="pb-seccion">
        {pagina.secciones.map((seccion) => {
          switch (seccion._type) {
            case 'seccionTexto':
              return (
                <section
                  key={seccion._key}
                  className="border-t border-linea py-14 first:border-t-0"
                >
                  <Contenedor className="grid gap-6 lg:grid-cols-12 lg:gap-16">
                    {seccion.titulo && (
                      <h2 className="text-titulo-3 lg:col-span-4">
                        {localizar(seccion.titulo, idioma)}
                      </h2>
                    )}
                    <TextoEnriquecido
                      valor={localizarBloques(seccion.texto, idioma)}
                      className={seccion.titulo ? 'lg:col-span-8' : 'lg:col-span-8 lg:col-start-3'}
                    />
                  </Contenedor>
                </section>
              );
            case 'seccionImagen':
              return (
                <Contenedor key={seccion._key} className="py-14">
                  <figure>
                    <div className="relative aspect-[3/2] overflow-hidden bg-arena">
                      <ImagenContenido
                        imagen={seccion.imagen}
                        edicion={{
                          id: pagina._id,
                          tipo: 'paginaEditorial',
                          ruta: rutaElemento('secciones', seccion._key, '.imagen'),
                        }}
                        sizes="(min-width: 1280px) 1200px, 100vw"
                      />
                    </div>
                    {seccion.pie && (
                      <figcaption className="mt-3 text-sm text-tinta-suave">
                        {localizar(seccion.pie, idioma)}
                      </figcaption>
                    )}
                  </figure>
                </Contenedor>
              );
            case 'seccionPreguntas':
              return (
                <section key={seccion._key} className="border-t border-linea py-14">
                  <Contenedor ancho="lectura">
                    {seccion.titulo && (
                      <h2 className="text-center text-titulo-2">
                        {localizar(seccion.titulo, idioma)}
                      </h2>
                    )}
                    <div className="mt-10 divide-y divide-linea border-y border-linea">
                      {seccion.preguntas.map((pregunta) => (
                        <details key={pregunta._key} className="group py-5">
                          <summary className="cursor-pointer list-none font-medium marker:hidden">
                            {localizar(pregunta.pregunta, idioma)}
                          </summary>
                          <p className="mt-3 text-tinta-suave">
                            {localizar(pregunta.respuesta, idioma)}
                          </p>
                        </details>
                      ))}
                    </div>
                  </Contenedor>
                </section>
              );
            case 'seccionLlamado': {
              const destino = DESTINOS[seccion.destino];
              return (
                <section key={seccion._key} className="bg-papel-calido py-seccion">
                  <Contenedor ancho="lectura" className="flex flex-col items-center text-center">
                    <h2 className="text-titulo-2">{localizar(seccion.titulo, idioma)}</h2>
                    {seccion.texto && (
                      <p className="mt-6 text-tinta-suave">{localizar(seccion.texto, idioma)}</p>
                    )}
                    <BotonEnlace href={destino.href} variante="primario" className="mt-10">
                      {tn(destino.clave)}
                    </BotonEnlace>
                  </Contenedor>
                </section>
              );
            }
          }
        })}
      </div>
    </>
  );
}
