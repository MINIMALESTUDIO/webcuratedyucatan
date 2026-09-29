import { useTranslations } from 'next-intl';
import { clasesBoton } from '@/components/ui/Boton';

/**
 * Barra fija inferior de la ficha en móvil (sección 10): lleva a la solicitud de información.
 * El espacio que ocupa lo reserva globales.css (body:has([data-barra-fija])).
 */
export function BarraCtaMovil() {
  const t = useTranslations('Venue.solicitud');
  return (
    <div
      data-testid="barra-cta-movil"
      data-barra-fija
      className="fixed inset-x-0 bottom-0 z-30 border-t border-linea bg-papel/95 px-margen pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm lg:hidden"
    >
      <a href="#solicitud" className={clasesBoton('primario', 'w-full')}>
        {t('titulo')}
      </a>
    </div>
  );
}
