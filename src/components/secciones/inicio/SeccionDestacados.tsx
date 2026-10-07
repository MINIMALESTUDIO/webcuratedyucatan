import { getTranslations } from 'next-intl/server';
import type { VenueTarjeta } from '@/lib/contenido/tipos';
import { cx } from '@/lib/utilidades';
import { BotonEnlace } from '@/components/ui/Boton';
import { Contenedor } from '@/components/ui/Contenedor';
import { EncabezadoSeccion } from '../EncabezadoSeccion';
import { TarjetaVenue } from '../TarjetaVenue';

/** 05 — Featured venues: de 4 a 6 venues con la marca editorial "destacado". */
export async function SeccionDestacados({ venues }: { venues: VenueTarjeta[] }) {
  if (venues.length === 0) return null;
  const t = await getTranslations('Inicio.destacados');
  return (
    <section aria-labelledby="destacados" className="border-t border-linea py-seccion">
      <Contenedor>
        <EncabezadoSeccion id="destacados" titulo={t('titulo')} />
        {/* Con 4 venues, cuatro columnas; con 5 o 6, tres: la cuadrícula no deja uno solo en la fila. */}
        <ul
          className={cx(
            'mt-14 grid gap-x-8 gap-y-16 sm:grid-cols-2',
            venues.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3',
          )}
        >
          {venues.map((venue) => (
            <li key={venue._id} className="flex">
              <TarjetaVenue venue={venue} />
            </li>
          ))}
        </ul>
        <div className="mt-16 flex justify-center">
          <BotonEnlace href="/venues" variante="secundario">
            {t('verTodos')}
          </BotonEnlace>
        </div>
      </Contenedor>
    </section>
  );
}
