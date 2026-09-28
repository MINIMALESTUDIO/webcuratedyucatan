import { getLocale, getTranslations } from 'next-intl/server';
import type { ConfiguracionSitio } from '@/lib/contenido/tipos';
import { localizar } from '@/lib/i18n/localizar';
import { Contenedor } from '@/components/ui/Contenedor';
import { Sobretitulo } from '@/components/ui/Sobretitulo';

export async function SeccionPorQue({ datos }: { datos: ConfiguracionSitio['porQueYucatan'] }) {
  const t = await getTranslations('Inicio.porQue');
  const idioma = await getLocale();

  return (
    <section aria-labelledby="por-que" className="py-seccion">
      <Contenedor className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Sobretitulo>{t('sobretitulo')}</Sobretitulo>
          <h2 id="por-que" className="mt-4 text-titulo-1">
            {localizar(datos.titulo, idioma)}
          </h2>
          <p className="mt-5 text-destacado text-tinta-suave">
            {localizar(datos.entradilla, idioma)}
          </p>
        </div>
        <ul className="grid gap-10 sm:grid-cols-3 lg:col-span-7 lg:self-end">
          {datos.puntos.map((punto) => (
            <li key={punto._key} className="border-t border-tinta pt-5">
              <h3 className="text-titulo-3">{localizar(punto.titulo, idioma)}</h3>
              <p className="mt-3 text-tinta-suave">{localizar(punto.texto, idioma)}</p>
            </li>
          ))}
        </ul>
      </Contenedor>
    </section>
  );
}
