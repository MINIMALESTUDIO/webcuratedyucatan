import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { CategoriaDescubreResumen, ConfiguracionSitio } from '@/lib/contenido/tipos';
import { localizar } from '@/lib/i18n/localizar';
import { cx } from '@/lib/utilidades';
import { BotonEnlace } from '@/components/ui/Boton';
import { Contenedor } from '@/components/ui/Contenedor';
import { ImagenContenido } from '@/components/ui/ImagenContenido';
import { EncabezadoSeccion } from '../EncabezadoSeccion';

/**
 * Posición de cada tema en el mosaico, para llenar la cuadrícula sin huecos. En escritorio el
 * primero ocupa 2×2; con seis temas el último va a todo lo ancho y con siete los dos últimos
 * ocupan dos columnas. En móvil, el primero y el último (si queda solo) van a lo ancho.
 */
function clasesTema(indice: number, total: number): string {
  if (indice === 0) return 'col-span-2 aspect-[3/2] lg:row-span-2 lg:aspect-auto';
  const ultimo = indice === total - 1;
  if (total === 6 && ultimo) return 'col-span-2 aspect-[3/2] lg:col-span-4 lg:aspect-auto';
  if (total === 7 && indice >= total - 2) return 'aspect-[4/5] lg:col-span-2 lg:aspect-auto';
  if (ultimo && total % 2 === 0) return 'col-span-2 aspect-[3/2] lg:aspect-auto';
  return 'aspect-[4/5] lg:aspect-auto';
}

/**
 * 03 — Discover Yucatán: introducción visual al destino, principalmente con fotografía. Los
 * temas son las categorías de Discover Yucatán y llevan a su página (D-048).
 */
export async function SeccionDescubre({
  configuracion,
  categorias,
}: {
  configuracion: ConfiguracionSitio;
  categorias: CategoriaDescubreResumen[];
}) {
  const t = await getTranslations('Inicio.descubre');
  const idioma = await getLocale();
  const { texto } = configuracion.descubre;

  return (
    <section aria-labelledby="descubre" className="pb-seccion">
      <Contenedor>
        <EncabezadoSeccion
          id="descubre"
          titulo={t('titulo')}
          entradilla={localizar(texto, idioma)}
        />
        <ul className="mt-14 grid grid-cols-2 gap-2 lg:auto-rows-[15rem] lg:grid-cols-4">
          {categorias.map((categoria, i) => (
            <li
              key={categoria._id}
              className={cx(
                'group relative overflow-hidden bg-arena',
                clasesTema(i, categorias.length),
              )}
            >
              <ImagenContenido
                imagen={categoria.imagenPrincipal}
                edicion={{ id: categoria._id, tipo: 'categoriaDescubre', ruta: 'imagenPrincipal' }}
                sizes={
                  i === 0 ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 25vw, 50vw'
                }
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
              />
              {/* Etiqueta blanca sólida: se lee sobre cualquier foto, sin velo. */}
              <Link
                href={{
                  pathname: '/descubre-yucatan/[categoria]',
                  params: { categoria: categoria.slug },
                }}
                className="absolute bottom-3 left-3 bg-papel px-3 py-2 font-marca text-xs tracking-[0.2em] text-tinta uppercase after:absolute after:inset-[-100vmax] sm:bottom-4 sm:left-4"
              >
                {localizar(categoria.titulo, idioma)}
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
