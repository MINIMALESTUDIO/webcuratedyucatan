import { getLocale, getTranslations } from 'next-intl/server';
import type { Episodio } from '@/lib/contenido/tipos';
import { formatearFecha } from '@/lib/formato';
import { localizar } from '@/lib/i18n/localizar';
import { BotonEnlace } from '@/components/ui/Boton';
import { Contenedor } from '@/components/ui/Contenedor';
import { Sobretitulo } from '@/components/ui/Sobretitulo';
import { ReproductorVideo } from '../ReproductorVideo';

export async function SeccionEpisodio({ episodio }: { episodio: Episodio }) {
  const t = await getTranslations('Inicio.episodio');
  const tv = await getTranslations('Venue.entrevista');
  const idioma = await getLocale();
  const titulo = localizar(episodio.titulo, idioma);

  return (
    <section aria-labelledby="episodio" className="bg-tinta py-seccion text-cal">
      <Contenedor className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-7">
          <ReproductorVideo
            youtubeId={episodio.youtubeId}
            titulo={titulo}
            sizes="(min-width: 1280px) 720px, (min-width: 1024px) 58vw, 100vw"
          />
          {episodio.esDemo && <p className="mt-3 text-xs text-piedra">{tv('notaDemo')}</p>}
        </div>
        <div className="lg:col-span-5">
          <Sobretitulo className="text-piedra">{t('sobretitulo')}</Sobretitulo>
          <h2 id="episodio" className="mt-4 text-titulo-2">
            {titulo}
          </h2>
          <p className="mt-2 text-sm text-piedra">
            <time dateTime={episodio.fechaPublicacion}>
              {formatearFecha(episodio.fechaPublicacion, idioma)}
            </time>
          </p>
          <p className="mt-5 text-piedra">{localizar(episodio.descripcion, idioma)}</p>
          <BotonEnlace href="/venue-tours" variante="claro" className="mt-8">
            {t('verTodos')}
          </BotonEnlace>
        </div>
      </Contenedor>
    </section>
  );
}
