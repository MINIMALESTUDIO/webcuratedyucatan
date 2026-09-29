import { getLocale, getTranslations } from 'next-intl/server';
import type { Venue } from '@/lib/contenido/tipos';
import { localizar } from '@/lib/i18n/localizar';
import { Contenedor } from '@/components/ui/Contenedor';
import { ImagenContenido } from '@/components/ui/ImagenContenido';
import { Sobretitulo } from '@/components/ui/Sobretitulo';

/**
 * Hero image + nombre del venue + ubicación. Sin texto sobre la foto: el nombre va debajo, en
 * Cinzel y centrado, como en las fichas del libro ("VENUE OVERVIEW").
 */
export async function HeroVenue({ venue }: { venue: Venue }) {
  const t = await getTranslations('Venue');
  const idioma = await getLocale();

  return (
    <section>
      <div className="relative h-[58svh] min-h-80 overflow-hidden bg-arena lg:h-[72svh]">
        <ImagenContenido
          imagen={venue.media.imagenHero}
          edicion={{ id: venue._id, tipo: 'venue', ruta: 'media.imagenHero' }}
          sizes="100vw"
          preload
        />
      </div>
      <Contenedor className="flex flex-col items-center pt-14 text-center sm:pt-20">
        <Sobretitulo>{t('resumen')}</Sobretitulo>
        <h1 className="mt-5 titulo-nombre text-nombre">{venue.nombre}</h1>
        <p className="mt-5 text-sm text-tinta-suave">
          {venue.localidad} · {localizar(venue.region.nombre, idioma)}
        </p>
      </Contenedor>
    </section>
  );
}
