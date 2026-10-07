import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { CTA_PRINCIPAL, NAVEGACION_MOVIL, NAVEGACION_PRINCIPAL } from '@/lib/navegacion';
import { BotonEnlace } from '@/components/ui/Boton';
import { MenuMovil } from './MenuMovil';
import { SelectorIdioma } from './SelectorIdioma';

/** Logotipo tipográfico: "CURATED YUCATÁN" espaciado, como la portada del libro. */
function Logotipo({ marca }: { marca: string }) {
  return (
    <Link
      href="/"
      className="inline-flex min-h-11 items-center font-marca text-[0.9375rem] tracking-[0.3em] whitespace-nowrap uppercase lg:text-lg"
    >
      {marca}
    </Link>
  );
}

/**
 * Móvil: barra fija con logotipo y menú. Escritorio: dos niveles, como una revista, con el
 * logotipo centrado y la navegación del documento de estructura debajo (no es fija).
 */
export async function Encabezado() {
  const t = await getTranslations('Navegacion');
  const tc = await getTranslations('Comun');

  return (
    <header className="sticky top-0 z-40 border-b border-linea bg-papel/95 backdrop-blur-sm lg:static lg:bg-papel lg:backdrop-blur-none">
      <div className="mx-auto grid h-16 w-full max-w-contenido grid-cols-[1fr_auto_1fr] items-center gap-4 px-margen lg:h-20">
        <div className="hidden lg:block">
          <SelectorIdioma />
        </div>
        <div className="col-start-1 justify-self-start lg:col-start-2 lg:justify-self-center">
          <Logotipo marca={tc('marca')} />
        </div>
        <div className="col-start-3 flex items-center justify-end gap-3">
          {/* La visibilidad va en un contenedor: `hidden` no puede competir con el
              `inline-flex` propio del botón. */}
          <div className="hidden sm:block">
            <BotonEnlace href={CTA_PRINCIPAL.href} variante="secundario" className="min-h-11 px-5">
              {t(CTA_PRINCIPAL.clave)}
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

      <nav aria-label={t('principal')} className="hidden border-t border-linea lg:block">
        <ul className="mx-auto flex max-w-contenido items-center justify-center gap-x-8 px-margen xl:gap-x-11">
          {NAVEGACION_PRINCIPAL.map((enlace) => (
            <li key={enlace.href}>
              <Link
                href={enlace.href}
                className="inline-flex min-h-12 items-center text-[0.6875rem] font-medium tracking-[0.2em] text-tinta uppercase underline-offset-8 hover:underline"
              >
                {t(enlace.clave)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
