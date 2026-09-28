import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { CategoriaProveedor } from '@/lib/contenido/tipos';
import { localizar } from '@/lib/i18n/localizar';
import { BotonEnlace } from '@/components/ui/Boton';
import { Contenedor } from '@/components/ui/Contenedor';
import { Icono } from '@/components/ui/Icono';
import { EncabezadoSeccion } from '../EncabezadoSeccion';

export async function SeccionCategorias({ categorias }: { categorias: CategoriaProveedor[] }) {
  const t = await getTranslations('Inicio.categorias');
  const idioma = await getLocale();

  return (
    <section aria-labelledby="categorias" className="bg-piedra py-seccion">
      <Contenedor>
        <EncabezadoSeccion
          id="categorias"
          sobretitulo={t('sobretitulo')}
          titulo={t('titulo')}
          accion={
            <BotonEnlace href="/proveedores" variante="secundario">
              {t('verTodos')}
            </BotonEnlace>
          }
        />
        <ul className="mt-12 grid grid-cols-2 gap-px bg-tinta/15 sm:grid-cols-3">
          {categorias.map((categoria) => (
            <li key={categoria.slug} className="bg-piedra">
              <Link
                href={{ pathname: '/proveedores', query: { categoria: categoria.slug } }}
                className="group flex h-full min-h-28 flex-col justify-between gap-6 p-5 hover:bg-cal sm:p-6"
              >
                <Icono nombre={categoria.icono} className="size-8 text-henequen" />
                <span className="flex items-center justify-between gap-2 font-titulo text-destacado">
                  {localizar(categoria.nombre, idioma)}
                  <Icono
                    nombre="flechaDerecha"
                    className="size-4 text-almagre opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Contenedor>
    </section>
  );
}
