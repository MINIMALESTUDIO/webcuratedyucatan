import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { CategoriaDescubreResumen } from '@/lib/contenido/tipos';
import { localizar } from '@/lib/i18n/localizar';
import { cx } from '@/lib/utilidades';

/**
 * Las seis categorías de Discover Yucatán, para pasar de una a otra sin volver a la portada.
 * En móvil la fila se desplaza en horizontal.
 */
export async function NavegacionCategorias({
  categorias,
  actual,
}: {
  categorias: CategoriaDescubreResumen[];
  actual?: string;
}) {
  const t = await getTranslations('Descubre');
  const idioma = await getLocale();
  return (
    <nav aria-label={t('categorias')} className="overflow-x-auto">
      <ul className="flex min-w-max justify-center gap-x-6">
        {categorias.map((categoria) => {
          const esActual = categoria.slug === actual;
          return (
            <li key={categoria._id}>
              <Link
                href={{
                  pathname: '/descubre-yucatan/[categoria]',
                  params: { categoria: categoria.slug },
                }}
                aria-current={esActual ? 'page' : undefined}
                className={cx('enlace-accion', esActual ? 'text-tinta' : 'text-tinta-suave')}
              >
                {localizar(categoria.titulo, idioma)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
