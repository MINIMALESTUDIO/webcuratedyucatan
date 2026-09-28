import { getTranslations } from 'next-intl/server';
import type { VenueTarjeta } from '@/lib/contenido/tipos';
import { BotonEnlace } from '@/components/ui/Boton';
import { Contenedor } from '@/components/ui/Contenedor';
import { EncabezadoSeccion } from '../EncabezadoSeccion';
import { TarjetaVenue } from '../TarjetaVenue';

export async function SeccionDestacados({ venues }: { venues: VenueTarjeta[] }) {
  const t = await getTranslations('Inicio.destacados');

  return (
    <section aria-labelledby="destacados" className="py-seccion">
      <Contenedor>
        <EncabezadoSeccion
          id="destacados"
          sobretitulo={t('sobretitulo')}
          titulo={t('titulo')}
          accion={
            <BotonEnlace href="/venues" variante="secundario">
              {t('verTodos')}
            </BotonEnlace>
          }
        />
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
