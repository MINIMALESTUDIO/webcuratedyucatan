import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { ConfiguracionSitio } from '@/lib/contenido/tipos';
import { localizar } from '@/lib/i18n/localizar';
import { rutaElemento } from '@/lib/sanity/edicion';
import { cx } from '@/lib/utilidades';
import { BotonEnlace } from '@/components/ui/Boton';
import { Contenedor } from '@/components/ui/Contenedor';
import { ImagenContenido } from '@/components/ui/ImagenContenido';
import { EncabezadoSeccion } from '../EncabezadoSeccion';

/**
 * Posición de cada tema en el mosaico: en escritorio el primero ocupa 2×2 y los dos últimos
 * van anchos, así los siete temas llenan la cuadrícula sin huecos.
 */
function clasesTema(indice: number, total: number): string {
  if (indice === 0) return 'col-span-2 aspect-[3/2] lg:row-span-2 lg:aspect-auto';
  if (indice >= total - 2 && total === 7) return 'aspect-[4/5] lg:col-span-2 lg:aspect-auto';
  return 'aspect-[4/5] lg:aspect-auto';
}

/** 03 — Discover Yucatán: introducción visual al destino, principalmente con fotografía. */
export async function SeccionDescubre({ configuracion }: { configuracion: ConfiguracionSitio }) {
  const t = await getTranslations('Inicio.descubre');
  const idioma = await getLocale();
  const { temas, texto } = configuracion.descubre;

  return (
    <section aria-labelledby="descubre" className="pb-seccion">
      <Contenedor>
        <EncabezadoSeccion
          id="descubre"
          titulo={t('titulo')}
          entradilla={localizar(texto, idioma)}
        />
        <ul className="mt-14 grid grid-cols-2 gap-2 lg:auto-rows-[15rem] lg:grid-cols-4">
          {temas.map((tema, i) => (
            <li
              key={tema._key}
              className={cx('group relative overflow-hidden bg-arena', clasesTema(i, temas.length))}
            >
              <ImagenContenido
                imagen={tema.imagen}
                edicion={{
                  id: configuracion._id,
                  tipo: 'configuracionSitio',
                  ruta: rutaElemento('descubre.temas', tema._key, '.imagen'),
                }}
                sizes={
                  i === 0 ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 25vw, 50vw'
                }
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
              />
              {/* Etiqueta blanca sólida: se lee sobre cualquier foto, sin velo. */}
              <Link
                href={{ pathname: '/descubre-yucatan', hash: tema.ancla }}
                className="absolute bottom-3 left-3 bg-papel px-3 py-2 font-marca text-xs tracking-[0.2em] text-tinta uppercase after:absolute after:inset-[-100vmax] sm:bottom-4 sm:left-4"
              >
                {localizar(tema.titulo, idioma)}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-12 flex justify-center">
          <BotonEnlace href="/descubre-yucatan" variante="texto">
            {t('cta')}
          </BotonEnlace>
        </div>
      </Contenedor>
    </section>
  );
}
