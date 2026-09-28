import { getLocale, getTranslations } from 'next-intl/server';
import type { ConfiguracionSitio } from '@/lib/contenido/tipos';
import { localizar } from '@/lib/i18n/localizar';
import { Contenedor } from '@/components/ui/Contenedor';
import { Sobretitulo } from '@/components/ui/Sobretitulo';

/** Sello circular con el texto del proceso curated y un arco al centro (SVG propio). */
function Sello({ texto }: { texto: string }) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" className="size-44 text-almagre sm:size-52">
      <defs>
        <path id="sello-circulo" d="M100 100m-74 0a74 74 0 1 1 148 0a74 74 0 1 1-148 0" />
      </defs>
      <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="100" cy="100" r="58" fill="none" stroke="currentColor" strokeWidth="1" />
      <text
        fill="currentColor"
        fontSize="12.5"
        fontWeight="600"
        letterSpacing="3.2"
        className="uppercase"
      >
        <textPath href="#sello-circulo">{texto}</textPath>
      </text>
      <path
        d="M80 128V100a20 20 0 0 1 40 0v28M72 128h56"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

export async function SeccionSello({ datos }: { datos: ConfiguracionSitio['sello'] }) {
  const t = await getTranslations('Inicio.sello');
  const idioma = await getLocale();

  return (
    <section aria-labelledby="sello" className="bg-piedra py-seccion">
      <Contenedor className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="flex flex-col items-start gap-8 lg:col-span-5">
          <Sello texto={t('textoSello')} />
          <div>
            <Sobretitulo>{t('sobretitulo')}</Sobretitulo>
            <h2 id="sello" className="mt-4 text-titulo-1">
              {localizar(datos.titulo, idioma)}
            </h2>
            <p className="mt-5 text-destacado text-tinta-suave">{localizar(datos.texto, idioma)}</p>
          </div>
        </div>
        {/* Es un proceso en orden: la numeración aporta información. */}
        <ol className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:col-span-7">
          {datos.pasos.map((paso, i) => (
            <li key={paso._key} className="flex gap-5 border-t border-tinta/20 pt-5">
              <span className="font-titulo text-titulo-2 leading-none text-almagre tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-titulo-3">{localizar(paso.titulo, idioma)}</h3>
                <p className="mt-2 text-tinta-suave">{localizar(paso.texto, idioma)}</p>
              </div>
            </li>
          ))}
        </ol>
      </Contenedor>
    </section>
  );
}
