import type { ReactNode } from 'react';
import { getLocale, getTranslations } from 'next-intl/server';
import { entornoDeEspacios } from '@/lib/contenido/derivados';
import type { Venue } from '@/lib/contenido/tipos';
import { formatearNumero } from '@/lib/formato';
import { localizar } from '@/lib/i18n/localizar';
import { atributoEdicion } from '@/lib/sanity/edicion';
import { Contenedor } from '@/components/ui/Contenedor';

function Dato({ etiqueta, children }: { etiqueta: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 border-t border-linea py-5 sm:border-t-0 sm:border-l sm:px-6 sm:py-1 sm:first:border-l-0 sm:first:pl-0">
      <dt className="etiqueta text-tinta-suave">{etiqueta}</dt>
      <dd className="text-sm">{children}</dd>
    </div>
  );
}

/**
 * Quick facts (documento de estructura, sección 7): Location, Capacity, Accommodation, Style e
 * Indoor / Outdoor. Interior / exterior se calcula a partir de los espacios.
 */
export async function DatosClave({ venue }: { venue: Venue }) {
  const t = await getTranslations('Venue');
  const tc = await getTranslations('Comun');
  const idioma = await getLocale();
  const { fichaTecnica: ficha } = venue;
  const entorno = entornoDeEspacios(venue.espacios.map((e) => e.interiorExterior));

  return (
    <section aria-labelledby="datos-clave" className="pt-12 sm:pt-16">
      <Contenedor>
        <h2 id="datos-clave" className="sr-only">
          {t('datos.titulo')}
        </h2>
        <dl
          className="grid border-y border-linea py-2 sm:grid-cols-5 sm:py-8"
          data-sanity={atributoEdicion({ id: venue._id, tipo: 'venue', ruta: 'fichaTecnica' })}
        >
          <Dato etiqueta={t('datos.ubicacion')}>
            {venue.localidad}
            <span className="block text-tinta-suave">
              {t('datos.minutosCentro', {
                minutos: formatearNumero(ficha.minutosCentroMerida, idioma),
              })}
              {ficha.kmCentroMerida
                ? ` · ${t('datos.kilometros', { km: ficha.kmCentroMerida })}`
                : ''}
            </span>
          </Dato>
          <Dato etiqueta={t('datos.capacidad')}>
            {tc('invitados', { cantidad: formatearNumero(ficha.capacidadMax, idioma) })}
          </Dato>
          <Dato etiqueta={t('datos.hospedaje')}>
            {ficha.hospedaje.tieneHospedaje && ficha.hospedaje.habitaciones
              ? t('datos.habitaciones', {
                  habitaciones: ficha.hospedaje.habitaciones,
                  huespedes: ficha.hospedaje.huespedesMax ?? 0,
                })
              : t('datos.sinHospedaje')}
          </Dato>
          <Dato etiqueta={t('datos.estilo')}>{localizar(venue.coleccion.nombre, idioma)}</Dato>
          <Dato etiqueta={t('datos.entorno')}>{t(`entorno.${entorno}`)}</Dato>
        </dl>
      </Contenedor>
    </section>
  );
}
