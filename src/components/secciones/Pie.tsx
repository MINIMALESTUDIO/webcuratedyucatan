import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { obtenerConfiguracionSitio } from '@/lib/contenido';
import { NAVEGACION_PIE } from '@/lib/navegacion';
import { SelectorIdioma } from './SelectorIdioma';

const claseEnlace = 'inline-flex min-h-11 items-center text-sm text-tinta hover:underline';

/** Pie blanco con filetes, como la contraportada del libro. */
export async function Pie() {
  const [t, tn, tc, configuracion] = await Promise.all([
    getTranslations('Pie'),
    getTranslations('Navegacion'),
    getTranslations('Comun'),
    obtenerConfiguracionSitio(),
  ]);
  const { redes, correoContacto } = configuracion;

  return (
    <footer className="border-t border-linea bg-papel">
      <div className="mx-auto flex w-full max-w-contenido flex-col items-center px-margen pt-20 pb-12 text-center">
        <p className="font-marca text-xl tracking-[0.3em] uppercase">{tc('marca')}</p>
        <p className="mt-4 text-sm text-tinta-suave italic">{t('descripcion')}</p>
      </div>

      <div className="mx-auto grid w-full max-w-contenido gap-10 px-margen pb-16 sm:grid-cols-3">
        {NAVEGACION_PIE.map((grupo) => (
          <nav key={grupo.titulo} aria-label={t(grupo.titulo)}>
            <p className="etiqueta text-tinta-suave">{t(grupo.titulo)}</p>
            <ul className="mt-3">
              {grupo.enlaces.map((enlace) => (
                <li key={enlace.href}>
                  <Link href={enlace.href} className={claseEnlace}>
                    {tn(enlace.clave)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <div>
          <p className="etiqueta text-tinta-suave">{t('contacto')}</p>
          <ul className="mt-3">
            {correoContacto && (
              <li>
                <a href={`mailto:${correoContacto}`} className={claseEnlace}>
                  {correoContacto}
                </a>
              </li>
            )}
            {redes.instagram && (
              <li>
                <a
                  href={redes.instagram}
                  rel="noopener noreferrer"
                  target="_blank"
                  className={claseEnlace}
                >
                  Instagram
                </a>
              </li>
            )}
            {redes.youtube && (
              <li>
                <a
                  href={redes.youtube}
                  rel="noopener noreferrer"
                  target="_blank"
                  className={claseEnlace}
                >
                  {t('serieVideo')}
                </a>
              </li>
            )}
            <li>
              <Link href="/privacidad" className={claseEnlace}>
                {tn('privacidad')}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-linea">
        <div className="mx-auto flex w-full max-w-contenido flex-col gap-4 px-margen py-6 text-xs text-tinta-suave md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1">
            <p>
              {t('derechos', { anio: new Date().getFullYear() })} ·{' '}
              <span className="etiqueta">Minimal 4.0</span> — {t('partner')}
            </p>
            <p>{t('avisoPiloto')}</p>
          </div>
          <SelectorIdioma />
        </div>
      </div>
    </footer>
  );
}
