'use client';

// Cliente: abre y cierra el diálogo del menú.
// <dialog> modal aporta el foco atrapado y el cierre con Escape; el bloqueo de scroll del
// fondo está en globales.css (html:has(dialog[open]:modal)).
import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { CTA_PRINCIPAL, ENLACE_ENCUENTRA, type RutaEstatica } from '@/lib/navegacion';
import { clasesBoton } from '@/components/ui/Boton';
import { Icono } from '@/components/ui/Icono';
import { SelectorIdioma } from './SelectorIdioma';

export function MenuMovil({
  enlaces,
}: {
  enlaces: Array<{ href: RutaEstatica; etiqueta: string }>;
}) {
  const t = useTranslations('Navegacion');
  const dialogo = useRef<HTMLDialogElement>(null);
  const ruta = usePathname();

  // Cierra el menú al navegar a otra página.
  useEffect(() => {
    dialogo.current?.close();
  }, [ruta]);

  const cerrar = () => dialogo.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={() => dialogo.current?.showModal()}
        aria-haspopup="dialog"
        className="-mr-2 inline-flex size-11 items-center justify-center lg:hidden"
      >
        <Icono nombre="menu" className="size-6" />
        <span className="sr-only">{t('abrirMenu')}</span>
      </button>

      <dialog
        ref={dialogo}
        aria-label={t('menu')}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-papel p-0 text-tinta"
      >
        <div className="flex min-h-full flex-col px-margen pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <div className="flex h-16 items-center justify-end">
            <button
              type="button"
              onClick={cerrar}
              className="-mr-2 inline-flex size-11 items-center justify-center"
            >
              <Icono nombre="cerrar" className="size-6" />
              <span className="sr-only">{t('cerrarMenu')}</span>
            </button>
          </div>

          <nav aria-label={t('principal')}>
            <ul className="divide-y divide-linea border-y border-linea">
              {enlaces.map((enlace) => (
                <li key={enlace.href}>
                  <Link
                    href={enlace.href}
                    onClick={cerrar}
                    className="flex min-h-14 items-center py-3 font-marca text-base tracking-[0.2em] uppercase"
                  >
                    {enlace.etiqueta}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto flex flex-col gap-4 pt-10">
            <Link
              href={CTA_PRINCIPAL.href}
              onClick={cerrar}
              className={clasesBoton('primario', 'w-full')}
            >
              {t(CTA_PRINCIPAL.clave)}
            </Link>
            <Link
              href={ENLACE_ENCUENTRA.href}
              onClick={cerrar}
              className={clasesBoton('secundario', 'w-full')}
            >
              {t(ENLACE_ENCUENTRA.clave)}
            </Link>
            <SelectorIdioma className="self-center" />
          </div>
        </div>
      </dialog>
    </>
  );
}
