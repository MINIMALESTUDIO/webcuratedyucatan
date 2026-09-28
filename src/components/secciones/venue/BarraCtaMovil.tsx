'use client';

// Cliente: barra fija inferior de la ficha en móvil (sección 10) con el botón de favorito, que en
// el piloto solo avisa que la lista llega en la Fase 6.
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { clasesBoton } from '@/components/ui/Boton';
import { Icono } from '@/components/ui/Icono';

export function BarraCtaMovil() {
  const t = useTranslations('Venue');
  const [aviso, setAviso] = useState(false);

  return (
    <div
      data-testid="barra-cta-movil"
      data-barra-fija
      className="fixed inset-x-0 bottom-0 z-30 border-t border-piedra bg-cal/95 px-margen pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm lg:hidden"
    >
      <p aria-live="polite" className="text-center text-xs text-tinta-suave empty:hidden">
        {aviso ? t('favorito.avisoPiloto') : ''}
      </p>
      <div className="mt-1 flex items-center gap-3">
        <a href="#disponibilidad" className={clasesBoton('primario', 'flex-1')}>
          {t('solicitarDisponibilidad')}
        </a>
        <button
          type="button"
          onClick={() => setAviso(true)}
          className="inline-flex size-12 shrink-0 items-center justify-center border border-tinta"
        >
          <Icono nombre="corazon" className="size-6" />
          <span className="sr-only">{t('favorito.guardar')}</span>
        </button>
      </div>
    </div>
  );
}
