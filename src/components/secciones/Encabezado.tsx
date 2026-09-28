import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { NAVEGACION_MOVIL, NAVEGACION_PRINCIPAL } from '@/lib/navegacion';
import { BotonEnlace } from '@/components/ui/Boton';
import { MenuMovil } from './MenuMovil';
import { SelectorIdioma } from './SelectorIdioma';

export async function Encabezado() {
  const t = await getTranslations('Navegacion');
  const tc = await getTranslations('Comun');

  return (
    <header className="sticky top-0 z-40 border-b border-piedra bg-cal/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-contenido items-center justify-between gap-6 px-margen">
        <Link
          href="/"
          className="font-titulo text-[1.375rem] leading-none tracking-[-0.01em] whitespace-nowrap"
        >
          {tc('marca')}
        </Link>

        <nav aria-label={t('principal')} className="hidden xl:block">
          <ul className="flex items-center gap-7 text-sm">
            {NAVEGACION_PRINCIPAL.map((enlace) => (
              <li key={enlace.href}>
                <Link
                  href={enlace.href}
                  className="inline-flex min-h-11 items-center text-tinta hover:text-almagre"
                >
                  {t(enlace.clave)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <SelectorIdioma className="hidden xl:block" />
          {/* La visibilidad va en un contenedor: `hidden` no puede competir con el
              `inline-flex` propio del botón. */}
          <div className="hidden sm:block">
            <BotonEnlace href="/asesoria" variante="primario" className="min-h-11 px-5">
              {t('ctaAsesoria')}
            </BotonEnlace>
          </div>
          <MenuMovil
            enlaces={NAVEGACION_MOVIL.map((enlace) => ({
              href: enlace.href,
              etiqueta: t(enlace.clave),
            }))}
          />
        </div>
      </div>
    </header>
  );
}
