import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { HistoriaResumen } from '@/lib/contenido/tipos';
import { formatearFecha } from '@/lib/formato';
import { localizar } from '@/lib/i18n/localizar';
import { BotonEnlace } from '@/components/ui/Boton';
import { Contenedor } from '@/components/ui/Contenedor';
import { ImagenContenido } from '@/components/ui/ImagenContenido';
import { EncabezadoSeccion } from '../EncabezadoSeccion';

export async function SeccionHistorias({ historias }: { historias: HistoriaResumen[] }) {
  const t = await getTranslations('Inicio.historias');
  const idioma = await getLocale();

  return (
    <section aria-labelledby="historias" className="py-seccion">
      <Contenedor>
        <EncabezadoSeccion
          id="historias"
          sobretitulo={t('sobretitulo')}
          titulo={t('titulo')}
          accion={
            <BotonEnlace href="/historias" variante="secundario">
              {t('verTodas')}
            </BotonEnlace>
          }
        />
        <ul className="mt-12 grid gap-12 md:grid-cols-3 md:gap-8 lg:gap-10">
          {historias.map((historia) => (
            <li key={historia._id}>
              <article className="group relative">
                <div className="relative aspect-[3/2] overflow-hidden bg-piedra">
                  <ImagenContenido
                    imagen={historia.imagenPortada}
                    edicion={{ id: historia._id, tipo: 'historia', ruta: 'imagenPortada' }}
                    sizes="(min-width: 1280px) 400px, (min-width: 768px) 30vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <p className="mt-5 text-xs font-semibold tracking-[0.14em] text-almagre uppercase">
                  {t(`tipo.${historia.tipo}`)}
                </p>
                <h3 className="mt-2 text-titulo-3">
                  <Link
                    href={{ pathname: '/historias/[slug]', params: { slug: historia.slug } }}
                    className="after:absolute after:inset-0 group-hover:text-almagre"
                  >
                    {localizar(historia.titulo, idioma)}
                  </Link>
                </h3>
                <p className="mt-2 text-sm text-tinta-suave">
                  {localizar(historia.extracto, idioma)}
                </p>
                <p className="mt-3 text-xs text-tinta-suave">
                  <time dateTime={historia.fechaPublicacion}>
                    {formatearFecha(historia.fechaPublicacion, idioma)}
                  </time>{' '}
                  · {t('minutosLectura', { minutos: historia.tiempoLectura })}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </Contenedor>
    </section>
  );
}
