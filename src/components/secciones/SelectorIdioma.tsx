'use client';

// Cliente: necesita la ruta y los parámetros actuales para cambiar de idioma sin salir de la página.
import type { ComponentProps, MouseEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { cx } from '@/lib/utilidades';

type Destino = ComponentProps<typeof Link>['href'];
type DestinoRouter = Parameters<ReturnType<typeof useRouter>['replace']>[0];

export function SelectorIdioma({
  className,
  tono = 'oscuro',
}: {
  className?: string;
  /** `claro` para fondos oscuros. */
  tono?: 'oscuro' | 'claro';
}) {
  const idioma = useLocale();
  const t = useTranslations('Comun');
  const ruta = usePathname();
  const params = useParams();
  const router = useRouter();

  // La ruta interna y sus parámetros siempre corresponden a la página actual.
  const destino = { pathname: ruta, params } as unknown as Destino;

  // Conserva los filtros del listado (query string) al cambiar de idioma.
  function conservarFiltros(
    evento: MouseEvent<HTMLAnchorElement>,
    otro: (typeof routing.locales)[number],
  ) {
    const busqueda = window.location.search;
    if (!busqueda) return;
    evento.preventDefault();
    const query = Object.fromEntries(new URLSearchParams(busqueda));
    router.replace({ pathname: ruta, params, query } as unknown as DestinoRouter, { locale: otro });
  }

  return (
    <nav aria-label={t('idioma')} className={className}>
      <ul className="flex items-center text-sm">
        {routing.locales.map((otro, i) => (
          <li key={otro} className="flex items-center">
            {i > 0 && (
              <span
                aria-hidden="true"
                className={tono === 'claro' ? 'text-cal/50' : 'text-tinta-suave'}
              >
                ·
              </span>
            )}
            {otro === idioma ? (
              <span
                aria-current="true"
                className={cx(
                  'inline-flex min-h-11 min-w-11 items-center justify-center font-semibold underline decoration-2 underline-offset-4',
                  tono === 'claro' ? 'text-cal' : 'text-tinta',
                )}
              >
                {otro.toUpperCase()}
                <span className="sr-only">
                  {t('idiomaActual', { idioma: t(`nombreIdioma.${otro}`) })}
                </span>
              </span>
            ) : (
              <Link
                href={destino}
                locale={otro}
                lang={otro}
                hrefLang={otro}
                onClick={(evento) => conservarFiltros(evento, otro)}
                className={cx(
                  'inline-flex min-h-11 min-w-11 items-center justify-center hover:underline',
                  tono === 'claro' ? 'text-cal/85 foco-claro' : 'text-tinta-suave',
                )}
              >
                <span aria-hidden="true">{otro.toUpperCase()}</span>
                <span className="sr-only">{t(`nombreIdioma.${otro}`)}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
