import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { type Region, TIPOS_VENUE } from '@/lib/contenido/tipos';
import { localizar } from '@/lib/i18n/localizar';
import { Contenedor } from '@/components/ui/Contenedor';
import { Icono } from '@/components/ui/Icono';
import { ImagenContenido } from '@/components/ui/ImagenContenido';
import { EncabezadoSeccion } from '../EncabezadoSeccion';

export async function SeccionPaisajes({ regiones }: { regiones: Region[] }) {
  const t = await getTranslations('Inicio.paisajes');
  const tt = await getTranslations('Tipos');
  const idioma = await getLocale();

  return (
    <section aria-labelledby="paisajes" className="py-seccion">
      <Contenedor>
        <EncabezadoSeccion id="paisajes" sobretitulo={t('sobretitulo')} titulo={t('titulo')} />

        <ul className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-6 lg:gap-10">
          {regiones.map((region) => {
            const nombre = localizar(region.nombre, idioma);
            return (
              <li key={region.slug} className="group relative">
                <div className="arco relative aspect-[4/5] overflow-hidden bg-piedra">
                  <ImagenContenido
                    imagen={region.imagen}
                    edicion={{ id: region._id, tipo: 'region', ruta: 'imagen' }}
                    sizes="(min-width: 1280px) 400px, (min-width: 640px) 30vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <h3 className="mt-5 text-titulo-3">
                  <Link
                    href={{ pathname: '/venues', query: { region: region.slug } }}
                    className="after:absolute after:inset-0 group-hover:text-almagre"
                  >
                    {nombre}
                    <span className="sr-only"> · {t('verVenuesRegion', { region: nombre })}</span>
                  </Link>
                </h3>
                <p className="mt-2 text-sm text-tinta-suave">
                  {localizar(region.descripcion, idioma)}
                </p>
              </li>
            );
          })}
        </ul>

        <div className="mt-14 border-t border-piedra pt-8">
          <h3 className="font-texto text-sm font-semibold">{t('tipos')}</h3>
          <ul className="mt-4 flex flex-wrap gap-3">
            {TIPOS_VENUE.filter((tipo) => tipo !== 'otro').map((tipo) => (
              <li key={tipo}>
                <Link
                  href={{ pathname: '/venues', query: { tipo } }}
                  className="inline-flex min-h-11 items-center gap-2 border border-tinta-suave px-4 text-sm hover:border-almagre hover:text-almagre"
                >
                  {tt(tipo)}
                  <Icono nombre="flechaDerecha" className="size-4" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Contenedor>
    </section>
  );
}
