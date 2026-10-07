import { getLocale, getTranslations } from 'next-intl/server';
import type { Venue, VenueTarjeta } from '@/lib/contenido/tipos';
import { formatearNumero } from '@/lib/formato';
import { localizar, localizarBloques } from '@/lib/i18n/localizar';
import { atributoEdicion, rutaElemento } from '@/lib/sanity/edicion';
import { Contenedor } from '@/components/ui/Contenedor';
import { ImagenContenido } from '@/components/ui/ImagenContenido';
import { Sobretitulo } from '@/components/ui/Sobretitulo';
import { FormularioSolicitud } from '@/components/formularios/FormularioSolicitud';
import { EncabezadoSeccion } from '../EncabezadoSeccion';
import { ReproductorVideo } from '../ReproductorVideo';
import { TarjetaVenue } from '../TarjetaVenue';
import { TextoEnriquecido } from '../TextoEnriquecido';

/** About: descripción editorial del venue. */
export async function SobreVenue({ venue }: { venue: Venue }) {
  const t = await getTranslations('Venue.sobre');
  const idioma = await getLocale();
  return (
    <section aria-labelledby="sobre" className="py-seccion">
      <Contenedor className="grid gap-8 lg:grid-cols-12 lg:gap-16">
        <h2 id="sobre" className="text-titulo-2 lg:col-span-4">
          {t('titulo')}
        </h2>
        <TextoEnriquecido
          valor={localizarBloques(venue.descripcion, idioma)}
          className="text-destacado lg:col-span-8"
        />
      </Contenedor>
    </section>
  );
}

/** La película del venue en la serie "El Lugar de Tu Historia" (libro, pág. 43). */
export async function SeccionPelicula({ venue }: { venue: Venue }) {
  const pelicula = venue.pelicula;
  if (!pelicula) return null;
  const t = await getTranslations('Venue.pelicula');
  const idioma = await getLocale();

  return (
    <section id="pelicula" aria-labelledby="titulo-pelicula" className="bg-papel-calido py-seccion">
      <Contenedor className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <Sobretitulo>{t('serie')}</Sobretitulo>
          <h2 id="titulo-pelicula" className="mt-4 text-titulo-2">
            {t('titulo')}
          </h2>
          {pelicula.esDemo && <p className="mt-5 text-sm text-tinta-suave">{t('notaDemo')}</p>}
        </div>
        <div className="lg:col-span-8">
          <ReproductorVideo
            youtubeId={pelicula.youtubeId}
            titulo={localizar(pelicula.titulo, idioma)}
            capitulos={pelicula.capitulos.map((capitulo) => ({
              titulo: localizar(capitulo.titulo, idioma),
              segundoInicio: capitulo.segundoInicio,
            }))}
            sizes="(min-width: 1280px) 820px, (min-width: 1024px) 65vw, 100vw"
            edicion={{ id: venue._id, tipo: 'venue', ruta: 'pelicula' }}
          />
        </div>
      </Contenedor>
    </section>
  );
}

/** Spaces: áreas disponibles y capacidades, como la lista "Capacity & spaces" del libro. */
export async function SeccionEspacios({ venue }: { venue: Venue }) {
  if (venue.espacios.length === 0) return null;
  const t = await getTranslations('Venue.espacios');
  const tc = await getTranslations('Comun');
  const idioma = await getLocale();

  return (
    <section aria-labelledby="espacios" className="py-seccion">
      <Contenedor>
        <EncabezadoSeccion id="espacios" titulo={t('titulo')} />
        <ul className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-2 xl:grid-cols-3">
          {venue.espacios.map((espacio) => {
            const imagen = espacio.imagenes[0];
            return (
              <li key={espacio._key} className="flex flex-col">
                {imagen && (
                  <div className="relative aspect-[3/2] overflow-hidden bg-arena">
                    <ImagenContenido
                      imagen={imagen}
                      edicion={{
                        id: venue._id,
                        tipo: 'venue',
                        ruta: rutaElemento(
                          'espacios',
                          espacio._key,
                          `.${rutaElemento('imagenes', imagen._key)}`,
                        ),
                      }}
                      sizes="(min-width: 1280px) 400px, (min-width: 768px) 45vw, 100vw"
                    />
                  </div>
                )}
                <h3 className="mt-6 text-titulo-3">{localizar(espacio.nombre, idioma)}</h3>
                <p className="etiqueta mt-2 text-tinta-suave">
                  {t(espacio.interiorExterior)}
                  {espacio.capacidad
                    ? ` · ${tc('invitados', { cantidad: formatearNumero(espacio.capacidad, idioma) })}`
                    : ''}
                </p>
                {espacio.descripcion && (
                  <p className="mt-3 text-sm text-tinta-suave">
                    {localizar(espacio.descripcion, idioma)}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </Contenedor>
    </section>
  );
}

/** Curated Notes: información especialmente útil para wedding planners. */
export async function SeccionNotas({ venue }: { venue: Venue }) {
  if (venue.notasCurated.length === 0) return null;
  const t = await getTranslations('Venue.notas');
  const unica = venue.notasCurated.length === 1 ? venue.notasCurated[0] : undefined;
  const idioma = await getLocale();

  return (
    <section aria-labelledby="notas" className="border-y border-linea py-seccion">
      <Contenedor>
        <EncabezadoSeccion id="notas" titulo={t('titulo')} entradilla={t('entradilla')} />
        {unica ? (
          // Una sola nota (el caso de las fichas reales): párrafo a lo ancho de lectura.
          <div
            className="mt-14 max-w-3xl border-t border-tinta pt-6"
            data-sanity={atributoEdicion({ id: venue._id, tipo: 'venue', ruta: 'notasCurated' })}
          >
            {unica.titulo && <h3 className="text-titulo-3">{localizar(unica.titulo, idioma)}</h3>}
            <p className={unica.titulo ? 'mt-3 text-tinta-suave' : 'text-tinta-suave'}>
              {localizar(unica.texto, idioma)}
            </p>
          </div>
        ) : (
          <ol
            className="mt-14 grid gap-x-10 gap-y-10 md:grid-cols-3"
            data-sanity={atributoEdicion({ id: venue._id, tipo: 'venue', ruta: 'notasCurated' })}
          >
            {venue.notasCurated.map((nota, i) => (
              <li key={nota._key} className="flex flex-col gap-3 border-t border-tinta pt-6">
                <span className="font-marca text-xs tracking-[0.2em] text-tinta-suave">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {nota.titulo && <h3 className="text-titulo-3">{localizar(nota.titulo, idioma)}</h3>}
                <p className="text-sm text-tinta-suave">{localizar(nota.texto, idioma)}</p>
              </li>
            ))}
          </ol>
        )}
      </Contenedor>
    </section>
  );
}

/** Request information: solicitud mediante Curated, con el venue ya indicado. */
export async function SeccionSolicitud({ venue }: { venue: Venue }) {
  const t = await getTranslations('Venue.solicitud');
  return (
    <section
      id="solicitud"
      aria-labelledby="titulo-solicitud"
      className="bg-papel-calido py-seccion"
    >
      <Contenedor className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <h2 id="titulo-solicitud" className="text-titulo-2">
            {t('titulo')}
          </h2>
          <p className="mt-6 text-tinta-suave">{t('texto', { nombre: venue.nombre })}</p>
        </div>
        <div className="lg:col-span-8">
          <FormularioSolicitud
            origen="venue"
            origenSlug={venue.slug}
            mostrarBuscando={false}
            buscandoInicial={['venue']}
          />
        </div>
      </Contenedor>
    </section>
  );
}

/** Más venues de la misma colección. */
export async function SeccionSimilares({
  venues,
  coleccion,
}: {
  venues: VenueTarjeta[];
  coleccion: string;
}) {
  if (venues.length === 0) return null;
  const t = await getTranslations('Venue.similares');
  return (
    <section aria-labelledby="similares" className="py-seccion">
      <Contenedor>
        <EncabezadoSeccion id="similares" titulo={t('titulo', { coleccion })} />
        <ul className="mt-14 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => (
            <li key={venue._id} className="flex">
              <TarjetaVenue venue={venue} />
            </li>
          ))}
        </ul>
      </Contenedor>
    </section>
  );
}
