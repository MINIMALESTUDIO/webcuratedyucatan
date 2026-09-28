import type { Ref } from 'react';
import { useTranslations } from 'next-intl';

/** Aviso que reemplaza el envío real en el piloto (D-027). */
export function AvisoPiloto({ ref }: { ref?: Ref<HTMLDivElement> }) {
  const t = useTranslations('Formularios.piloto');
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="status"
      className="border-l-4 border-henequen bg-cal px-5 py-4 outline-none"
    >
      <p className="font-semibold text-henequen">{t('titulo')}</p>
      <p className="mt-1 text-sm text-tinta-suave">{t('texto')}</p>
    </div>
  );
}
