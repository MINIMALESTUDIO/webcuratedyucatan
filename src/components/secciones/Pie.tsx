import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { NAVEGACION_PIE } from '@/lib/navegacion';
import { SelectorIdioma } from './SelectorIdioma';

export async function Pie() {
  const t = await getTranslations('Pie');
  const tn = await getTranslations('Navegacion');
  const tc = await getTranslations('Comun');

  return (
    <footer className="bg-tinta text-cal">
      <div className="patron-pasta h-5 opacity-90" aria-hidden="true" />
      <div className="mx-auto grid w-full max-w-contenido gap-12 px-margen py-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="font-titulo text-titulo-3">{tc('marca')}</p>
          <p className="mt-4 max-w-xs text-sm text-piedra">{t('descripcion')}</p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-8">
          {NAVEGACION_PIE.map((grupo) => (
            <nav key={grupo.titulo} aria-label={t(grupo.titulo)}>
              <p className="text-xs font-semibold tracking-[0.16em] text-piedra uppercase">
                {t(grupo.titulo)}
              </p>
              <ul className="mt-3">
                {grupo.enlaces.map((enlace) => (
                  <li key={enlace.href}>
                    <Link
                      href={enlace.href}
                      className="inline-flex min-h-11 items-center text-sm text-cal hover:underline foco-claro"
                    >
                      {tn(enlace.clave)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="border-t border-cal/15">
        <div className="mx-auto flex w-full max-w-contenido flex-col gap-4 px-margen py-6 text-xs text-piedra sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <p>{t('derechos', { anio: new Date().getFullYear() })}</p>
            <p>{t('avisoPiloto')}</p>
          </div>
          <SelectorIdioma tono="claro" />
        </div>
      </div>
    </footer>
  );
}
