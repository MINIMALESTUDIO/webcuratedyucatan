import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { DestinoLlamado, PaginaEditorial } from '@/lib/contenido/tipos';
import { localizar, localizarBloques } from '@/lib/i18n/localizar';
import type { EnlaceNavegacion } from '@/lib/navegacion';
import { rutaElemento } from '@/lib/sanity/edicion';
import { BotonEnlace } from '@/components/ui/Boton';
import { Contenedor } from '@/components/ui/Contenedor';
import { ImagenContenido } from '@/components/ui/ImagenContenido';
import { Sobretitulo } from '@/components/ui/Sobretitulo';
import { EncabezadoSeccion } from './EncabezadoSeccion';
import { TextoEnriquecido } from './TextoEnriquecido';

/** Destino de cada botón: ruta (con ancla, si aplica) y etiqueta de la navegación. */
const DESTINOS: Record<DestinoLlamado, EnlaceNavegacion & { hash?: string }> = {
  'planea-tu-evento': { href: '/planea-tu-evento', clave: 'planea' },
  'encuentra-tu-yucatan': { href: '/encuentra-tu-yucatan', clave: 'encuentra' },
  venues: { href: '/venues', clave: 'venues' },
  'descubre-yucatan': { href: '/descubre-yucatan', clave: 'descubre' },
  catering: { href: '/catering', clave: 'catering' },
  fotografia: { href: '/fotografia', clave: 'fotografia' },
  'diseno-y-produccion': { href: '/diseno-y-produccion', clave: 'diseno' },
  journal: { href: '/journal', clave: 'journal' },
  'explora-curated': { href: '/', hash: 'explora', clave: 'explora' },
};

function hrefDe(destino: DestinoLlamado) {
  const { href, hash } = DESTINOS[destino];
  return hash ? { pathname: href, hash } : href;
}

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
                    {(seccion.titulo || seccion.sobretitulo) && (
                      <div className="lg:col-span-4">
                        {seccion.sobretitulo && (
                          <Sobretitulo>{localizar(seccion.sobretitulo, idioma)}</Sobretitulo>
                        )}
                        {seccion.titulo && (
                          <h2
                            className={seccion.sobretitulo ? 'mt-4 text-titulo-3' : 'text-titulo-3'}
                          >
                            {localizar(seccion.titulo, idioma)}
                          </h2>
                        )}
                      </div>
                    )}
                    <div
                      className={
                        seccion.titulo || seccion.sobretitulo
                          ? 'lg:col-span-8'
                          : 'lg:col-span-8 lg:col-start-3'
                      }
                    >
                      <TextoEnriquecido valor={localizarBloques(seccion.texto, idioma)} />
                      {seccion.firma && (
                        <p className="mt-8 font-marca text-xs tracking-[0.24em] text-tinta-suave uppercase">
                          {localizar(seccion.firma, idioma)}
                        </p>
                      )}
                      {seccion.destino && (
                        <BotonEnlace
                          href={hrefDe(seccion.destino)}
                          variante="texto"
                          className="mt-8"
                        >
                          {tn(DESTINOS[seccion.destino].clave)}
                        </BotonEnlace>
                      )}
                    </div>
                  </Contenedor>
                </section>
              );
            case 'seccionEnlaces':
              return (
                <section key={seccion._key} className="border-t border-linea py-seccion">
                  <Contenedor>
                    <EncabezadoSeccion
                      sobretitulo={
                        seccion.sobretitulo ? localizar(seccion.sobretitulo, idioma) : undefined
                      }
                      titulo={localizar(seccion.titulo, idioma)}
                      entradilla={
                        seccion.entradilla ? localizar(seccion.entradilla, idioma) : undefined
                      }
                    />
                    <ul className="mt-14 grid gap-px border border-linea bg-linea sm:grid-cols-2 lg:grid-cols-3">
                      {seccion.enlaces.map((enlace) => (
                        <li key={enlace._key} className="relative bg-papel p-8">
                          <h3 className="font-marca text-sm tracking-[0.24em] uppercase">
                            <Link
                              href={hrefDe(enlace.destino)}
                              className="after:absolute after:inset-0"
                            >
                              {tn(DESTINOS[enlace.destino].clave)}
                            </Link>
                          </h3>
                          <p className="mt-4 text-sm text-tinta-suave">
                            {localizar(enlace.texto, idioma)}
                          </p>
                        </li>
                      ))}
                    </ul>
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
            case 'seccionLlamado':
              return (
                <section key={seccion._key} className="bg-papel-calido py-seccion">
                  <Contenedor ancho="lectura" className="flex flex-col items-center text-center">
                    {seccion.sobretitulo && (
                      <Sobretitulo className="mb-4">
                        {localizar(seccion.sobretitulo, idioma)}
                      </Sobretitulo>
                    )}
                    <h2 className="text-titulo-2">{localizar(seccion.titulo, idioma)}</h2>
                    {seccion.texto && (
                      <p className="mt-6 text-tinta-suave">{localizar(seccion.texto, idioma)}</p>
                    )}
                    <div className="mt-10 flex flex-wrap justify-center gap-4">
                      <BotonEnlace href={hrefDe(seccion.destino)} variante="primario">
                        {tn(DESTINOS[seccion.destino].clave)}
                      </BotonEnlace>
                      {seccion.destinoSecundario && (
                        <BotonEnlace href={hrefDe(seccion.destinoSecundario)} variante="secundario">
                          {tn(DESTINOS[seccion.destinoSecundario].clave)}
                        </BotonEnlace>
                      )}
                    </div>
                  </Contenedor>
                </section>
              );
          }
        })}
      </div>
    </>
  );
}
