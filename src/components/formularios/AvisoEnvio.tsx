import type { Ref } from 'react';
import { useTranslations } from 'next-intl';
import type { EstadoEnvio } from './useFormulario';

/**
 * Resultado del envío (D-055), debajo del botón. Recibe el foco al aparecer para que los
 * lectores de pantalla lo anuncien. "piloto" se mantiene mientras el correo no esté
 * configurado en el servidor (D-027).
 */
export function AvisoEnvio({
  estado,
  tipo,
  ref,
}: {
  estado: EstadoEnvio;
  tipo: 'solicitud' | 'seleccion';
  ref?: Ref<HTMLDivElement>;
}) {
  const t = useTranslations('Formularios');
  if (estado === 'inicial' || estado === 'enviando') return null;

  const claves = {
    enviado: `envio.${tipo}`,
    piloto: 'piloto',
    error: 'envio.error',
    limite: 'envio.limite',
  } as const;
  const clave = claves[estado];

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="status"
      data-estado={estado}
      className="border-y border-tinta px-1 py-6 text-center outline-none"
    >
      <p className="font-marca text-sm tracking-[0.18em] uppercase">{t(`${clave}.titulo`)}</p>
      <p className="mt-2 text-sm text-tinta-suave">{t(`${clave}.texto`)}</p>
    </div>
  );
}
