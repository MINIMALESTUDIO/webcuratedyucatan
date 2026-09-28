import { getLocale, getTranslations } from 'next-intl/server';
import type { Venue } from '@/lib/contenido/tipos';
import { localizar } from '@/lib/i18n/localizar';
import { BotonAncla } from '@/components/ui/Boton';
import { Contenedor } from '@/components/ui/Contenedor';
import { ImagenContenido } from '@/components/ui/ImagenContenido';

export async function HeroVenue({ venue }: { venue: Venue }) {
  const t = await getTranslations('Venue');
  const tt = await getTranslations('Tipos');
  const idioma = await getLocale();

  return (
    <section className="relative isolate flex min-h-[78svh] items-end overflow-hidden bg-tinta text-cal">
      <ImagenContenido
        imagen={venue.media.imagenHero}
        sizes="100vw"
        preload
        className="-z-20 object-cover"
      />
      <div className="velo-inferior absolute inset-0 -z-10" aria-hidden="true" />
      <Contenedor className="pt-32 pb-12 sm:pb-16">
        <p className="text-xs font-semibold tracking-[0.16em] text-piedra uppercase">
          {localizar(venue.region.nombre, idioma)} ·{' '}
          {venue.tipos.map((tipo) => tt(tipo)).join(', ')}
        </p>
        <h1 className="mt-4 max-w-4xl text-display font-(--peso-display)">{venue.nombre}</h1>
        <p className="mt-5 max-w-2xl text-destacado text-piedra">
          {localizar(venue.resumen, idioma)}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <BotonAncla href="#disponibilidad" variante="primario">
            {t('solicitarDisponibilidad')}
          </BotonAncla>
          {venue.entrevista && (
            <BotonAncla href="#entrevista" variante="claro">
              {t('verEntrevista')}
            </BotonAncla>
          )}
        </div>
      </Contenedor>
    </section>
  );
}
