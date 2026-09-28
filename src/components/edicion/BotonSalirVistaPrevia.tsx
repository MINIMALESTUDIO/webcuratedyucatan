'use client';

// Cliente: detecta si la página está dentro de "Editar en la página" del Studio.
import { useIsPresentationTool } from 'next-sanity/hooks';
import { useTranslations } from 'next-intl';

/** Aviso de vista previa con salida, solo fuera del Studio (dentro, el Studio ya lo indica). */
export function BotonSalirVistaPrevia() {
  const t = useTranslations('Comun');
  const enEstudio = useIsPresentationTool();
  if (enEstudio !== false) return null;

  return (
    // Ruta de API que borra la cookie del modo borrador y redirige: requiere navegación completa.
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    <a
      href="/api/draft-mode/disable"
      className="fixed right-4 bottom-4 z-50 inline-flex min-h-11 items-center gap-2 rounded-full bg-tinta px-5 text-sm font-semibold text-cal shadow-lg foco-claro"
    >
      {t('salirVistaPrevia')}
    </a>
  );
}
