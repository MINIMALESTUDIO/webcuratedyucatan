import type { ComponentProps } from 'react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

type Destino = ComponentProps<typeof Link>['href'];

/** Ruta de navegación; el último elemento es la página actual. */
export async function Migas({
  elementos,
}: {
  elementos: Array<{ etiqueta: string; href?: Destino }>;
}) {
  const t = await getTranslations('Navegacion');
  return (
    <nav aria-label={t('migas')} className="etiqueta text-tinta-suave">
      <ol className="flex flex-wrap items-center gap-x-3">
        {elementos.map((elemento, i) => (
          // En móvil se omite la página actual: ya la nombra el título de la página.
          <li
            key={elemento.etiqueta}
            className={
              elemento.href ? 'flex items-center gap-x-3' : 'hidden items-center gap-x-3 sm:flex'
            }
          >
            {i > 0 && <span aria-hidden="true">/</span>}
            {elemento.href ? (
              <Link
                href={elemento.href}
                className="inline-flex min-h-11 items-center hover:underline"
              >
                {elemento.etiqueta}
              </Link>
            ) : (
              <span aria-current="page" className="line-clamp-1 text-tinta">
                {elemento.etiqueta}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
