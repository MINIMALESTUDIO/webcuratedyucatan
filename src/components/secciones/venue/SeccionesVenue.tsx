import { getLocale, getTranslations } from 'next-intl/server';
import type { Venue, VenueTarjeta } from '@/lib/contenido/tipos';
import { formatearNumero } from '@/lib/formato';
import { localizar, localizarBloques } from '@/lib/i18n/localizar';
import { Chip } from '@/components/ui/Chip';
import { Contenedor } from '@/components/ui/Contenedor';
import { ImagenContenido } from '@/components/ui/ImagenContenido';
import { Sobretitulo } from '@/components/ui/Sobretitulo';
import { FormularioDisponibilidad } from '@/components/formularios/FormularioDisponibilidad';
import { EncabezadoSeccion } from '../EncabezadoSeccion';
import { ReproductorVideo } from '../ReproductorVideo';
import { TarjetaProveedor } from '../TarjetaProveedor';
import { TarjetaVenue } from '../TarjetaVenue';

/** Descripción en texto enriquecido (subconjunto de Portable Text). */
export async function DescripcionVenue({ venue }: { venue: Venue }) {
  const t = await getTranslations('Venue.descripcion');
  const idioma = await getLocale();
  return (
    <div>
      <h2 className="text-titulo-2">{t('titulo')}</h2>
      <div className="mt-6 flex max-w-lectura flex-col gap-5 text-destacado">
        {localizarBloques(venue.descripcion, idioma).map((bloque) =>
          bloque.style === 'h3' ? (
            <h3 key={bloque._key} className="text-titulo-3">
              {bloque.children.map((hijo) => hijo.text).join('')}
            </h3>
          ) : (
            <p key={bloque._key}>{bloque.children.map((hijo) => hijo.text).join('')}</p>
          ),
        )}
      </div>
    </div>
  );
}

export async function SeccionEntrevista({ venue }: { venue: Venue }) {
  const entrevista = venue.entrevista;
  if (!entrevista) return null;
  const t = await getTranslations('Venue.entrevista');
  const idioma = await getLocale();

  return (
    <section
      id="entrevista"
      aria-labelledby="titulo-entrevista"
      className="bg-tinta py-seccion text-cal"
    >
      <Contenedor className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <Sobretitulo className="text-piedra">{t('sobretitulo')}</Sobretitulo>
          <h2 id="titulo-entrevista" className="mt-4 text-titulo-2">
            {t('titulo', { nombre: venue.nombre })}
          </h2>
          {entrevista.esDemo && <p className="mt-5 text-sm text-piedra">{t('notaDemo')}</p>}
        </div>
        <div className="lg:col-span-8">
          <ReproductorVideo
            youtubeId={entrevista.youtubeId}
            titulo={localizar(entrevista.titulo, idioma)}
            capitulos={entrevista.capitulos.map((capitulo) => ({
              titulo: localizar(capitulo.titulo, idioma),
              segundoInicio: capitulo.segundoInicio,
            }))}
            sizes="(min-width: 1280px) 820px, (min-width: 1024px) 65vw, 100vw"
          />
        </div>
      </Contenedor>
    </section>
  );
}

export async function SeccionEspacios({ venue }: { venue: Venue }) {
  const t = await getTranslations('Venue.espacios');
  const idioma = await getLocale();
  const formatos = [
    { etiqueta: t('ceremonia'), clave: 'capacidadCeremonia' },
    { etiqueta: t('coctel'), clave: 'capacidadCoctel' },
    { etiqueta: t('banquete'), clave: 'capacidadBanquete' },
  ] as const;

  return (
    <section aria-labelledby="espacios" className="py-seccion">
      <Contenedor>
        <EncabezadoSeccion id="espacios" sobretitulo={t('sobretitulo')} titulo={t('titulo')} />
        <ul className="mt-12 grid gap-12 md:grid-cols-2 xl:grid-cols-3 lg:gap-10">
          {venue.espacios.map((espacio) => {
            const imagen = espacio.imagenes[0];
            return (
              <li key={espacio._key} className="flex flex-col">
                {imagen && (
                  <div className="relative aspect-[3/2] overflow-hidden bg-piedra">
                    <ImagenContenido
                      imagen={imagen}
                      sizes="(min-width: 1280px) 400px, (min-width: 768px) 45vw, 100vw"
                    />
                  </div>
                )}
                <div className="mt-5 flex items-center justify-between gap-3">
                  <h3 className="text-titulo-3">{localizar(espacio.nombre, idioma)}</h3>
                  <Chip className="shrink-0 text-henequen">{t(espacio.interiorExterior)}</Chip>
                </div>
                <p className="mt-2 text-sm text-tinta-suave">
                  {localizar(espacio.descripcion, idioma)}
                </p>
                <table className="mt-4 w-full text-sm">
                  <thead className="sr-only">
                    <tr>
                      <th scope="col">{t('formato')}</th>
                      <th scope="col">{t('capacidad')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formatos.map((formato) => {
                      const valor = espacio[formato.clave];
                      return (
                        <tr key={formato.clave} className="border-t border-piedra">
                          <th scope="row" className="py-2 text-left font-normal text-tinta-suave">
                            {formato.etiqueta}
                          </th>
                          <td className="py-2 text-right font-semibold tabular-nums">
                            {valor ? (
                              formatearNumero(valor, idioma)
                            ) : (
                              <span className="font-normal text-tinta-suave">{t('noAplica')}</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </li>
            );
          })}
        </ul>
      </Contenedor>
    </section>
  );
}

export async function SeccionCitas({ venue }: { venue: Venue }) {
  if (venue.citasDestacadas.length === 0) return null;
  const t = await getTranslations('Venue.citas');
  const idioma = await getLocale();

  return (
    <section aria-labelledby="citas" className="bg-piedra py-seccion">
      <Contenedor>
        <h2 id="citas" className="sr-only">
          {t('titulo')}
        </h2>
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          {venue.citasDestacadas.map((cita) => (
            <figure key={cita._key} className="flex flex-col gap-5">
              <span
                aria-hidden="true"
                className="font-titulo text-[5rem] leading-[0.5] text-almagre"
              >
                “
              </span>
              <blockquote className="font-titulo-italica text-titulo-2 italic">
                <p>{localizar(cita.texto, idioma)}</p>
              </blockquote>
              <figcaption className="text-sm">
                <span className="font-semibold">{cita.autor}</span>
                <span className="text-tinta-suave"> · {localizar(cita.cargo, idioma)}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Contenedor>
    </section>
  );
}

export async function SeccionProveedores({ venue }: { venue: Venue }) {
  if (venue.proveedoresRecomendados.length === 0) return null;
  const t = await getTranslations('Venue.proveedores');

  return (
    <section aria-labelledby="proveedores" className="py-seccion">
      <Contenedor>
        <EncabezadoSeccion id="proveedores" sobretitulo={t('sobretitulo')} titulo={t('titulo')} />
        <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {venue.proveedoresRecomendados.map((proveedor) => (
            <li key={proveedor._id} className="flex border border-piedra">
              <TarjetaProveedor proveedor={proveedor} />
            </li>
          ))}
        </ul>
      </Contenedor>
    </section>
  );
}

export async function SeccionDisponibilidad({ venue }: { venue: Venue }) {
  const t = await getTranslations('Venue.disponibilidad');

  return (
    <section
      id="disponibilidad"
      aria-labelledby="titulo-disponibilidad"
      className="bg-piedra py-seccion"
    >
      <Contenedor className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <Sobretitulo>{t('sobretitulo')}</Sobretitulo>
          <h2 id="titulo-disponibilidad" className="mt-4 text-titulo-2">
            {t('titulo', { nombre: venue.nombre })}
          </h2>
          <p className="mt-5 text-tinta-suave">{t('texto')}</p>
        </div>
        <div className="lg:col-span-8">
          <FormularioDisponibilidad venueSlug={venue.slug} />
        </div>
      </Contenedor>
    </section>
  );
}

export async function SeccionSimilares({ venues }: { venues: VenueTarjeta[] }) {
  if (venues.length === 0) return null;
  const t = await getTranslations('Venue.similares');

  return (
    <section aria-labelledby="similares" className="py-seccion">
      <Contenedor>
        <EncabezadoSeccion id="similares" titulo={t('titulo')} />
        <ul className="mt-12 grid gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
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
