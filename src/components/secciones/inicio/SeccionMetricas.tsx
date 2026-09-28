import { getLocale, getTranslations } from 'next-intl/server';
import type { ConfiguracionSitio } from '@/lib/contenido/tipos';
import { formatearNumero } from '@/lib/formato';
import { atributoEdicion } from '@/lib/sanity/edicion';
import { Contenedor } from '@/components/ui/Contenedor';
import { Sobretitulo } from '@/components/ui/Sobretitulo';

export async function SeccionMetricas({ metricas }: { metricas: ConfiguracionSitio['metricas'] }) {
  const t = await getTranslations('Inicio.metricas');
  const idioma = await getLocale();
  const cifras = [
    { valor: metricas.venuesVisitados, etiqueta: t('venuesVisitados') },
    { valor: metricas.horasEntrevista, etiqueta: t('horasEntrevista') },
    { valor: metricas.edicionesImpresas, etiqueta: t('edicionesImpresas') },
  ];

  return (
    <section aria-labelledby="metricas" className="bg-henequen py-seccion text-cal">
      <Contenedor>
        <h2 id="metricas" className="sr-only">
          {t('sobretitulo')}
        </h2>
        <Sobretitulo className="text-cal">{t('sobretitulo')}</Sobretitulo>
        <dl
          className="mt-8 grid gap-10 sm:grid-cols-3"
          data-sanity={atributoEdicion({
            id: 'configuracionSitio',
            tipo: 'configuracionSitio',
            ruta: 'metricas',
          })}
        >
          {cifras.map((cifra) => (
            <div
              key={cifra.etiqueta}
              className="flex flex-col-reverse gap-2 border-t border-cal/30 pt-5"
            >
              <dt className="text-destacado">{cifra.etiqueta}</dt>
              <dd className="font-titulo text-display leading-none tabular-nums">
                {formatearNumero(cifra.valor, idioma)}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 text-xs text-cal/85">{t('nota')}</p>
      </Contenedor>
    </section>
  );
}
