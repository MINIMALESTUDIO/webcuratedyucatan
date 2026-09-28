'use client';

// Cliente: abre y cierra el diálogo del menú.
// <dialog> modal aporta el foco atrapado y el cierre con Escape; el bloqueo de scroll del
// fondo está en globales.css (html:has(dialog[open]:modal)).
import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import type { RutaEstatica } from '@/lib/navegacion';
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
        className="-mr-2 inline-flex size-11 items-center justify-center xl:hidden"
      >
        <Icono nombre="menu" className="size-6" />
        <span className="sr-only">{t('abrirMenu')}</span>
      </button>

      <dialog
        ref={dialogo}
        aria-label={t('menu')}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-cal p-0 text-tinta"
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
            <ul className="divide-y divide-piedra border-y border-piedra">
              {enlaces.map((enlace) => (
                <li key={enlace.href}>
                  <Link
                    href={enlace.href}
                    onClick={cerrar}
                    className="flex min-h-14 items-center justify-between py-3 font-titulo text-titulo-3"
                  >
                    {enlace.etiqueta}
                    <Icono nombre="flechaDerecha" className="text-almagre" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto flex flex-col gap-4 pt-8">
            <Link href="/asesoria" onClick={cerrar} className={clasesBoton('primario', 'w-full')}>
              {t('ctaAsesoria')}
            </Link>
            <SelectorIdioma className="self-center" />
          </div>
        </div>
      </dialog>
    </>
  );
}
