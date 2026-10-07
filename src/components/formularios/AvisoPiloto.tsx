import type { Ref } from 'react';
import { useTranslations } from 'next-intl';

/** Confirmación que reemplaza el envío real en el piloto (D-027): clara, pero honesta. */
export function AvisoPiloto({ ref }: { ref?: Ref<HTMLDivElement> }) {
  const t = useTranslations('Formularios.piloto');
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="status"
      className="border-y border-tinta px-1 py-6 text-center outline-none"
    >
      <p className="font-marca text-sm tracking-[0.18em] uppercase">{t('titulo')}</p>
      <p className="mt-2 text-sm text-tinta-suave">{t('texto')}</p>
    </div>
  );
}
