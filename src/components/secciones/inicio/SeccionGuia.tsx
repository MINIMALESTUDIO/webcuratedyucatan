import { getLocale, getTranslations } from 'next-intl/server';
import type { Guia } from '@/lib/contenido/tipos';
import { localizar } from '@/lib/i18n/localizar';
import { Contenedor } from '@/components/ui/Contenedor';
import { ImagenContenido } from '@/components/ui/ImagenContenido';
import { Sobretitulo } from '@/components/ui/Sobretitulo';
import { FormularioGuia } from '@/components/formularios/FormularioGuia';

export async function SeccionGuia({ guia }: { guia: Guia }) {
  const t = await getTranslations('Inicio.guia');
  const idioma = await getLocale();
  // Texto alternativo propio de la interfaz, ya traducido al idioma de la página.
  const textoAlternativo = t('portadaAlt', { edicion: guia.edicion });

  return (
    <section aria-labelledby="guia" className="bg-piedra py-seccion">
      <Contenedor className="grid gap-12 md:grid-cols-12 md:items-center lg:gap-16">
        <div className="md:col-span-5">
          <div className="relative mx-auto aspect-[3/4] w-full max-w-sm -rotate-2 shadow-[0_24px_48px_-24px_rgb(34_30_26/0.45)]">
            <ImagenContenido
              imagen={{ ...guia.portada, alt: { en: textoAlternativo, es: textoAlternativo } }}
              edicion={{ id: guia._id, tipo: 'guia', ruta: 'portada' }}
              sizes="(min-width: 768px) 384px, 80vw"
            />
          </div>
        </div>
        <div className="md:col-span-7">
          <Sobretitulo>
            {t('sobretitulo')} · {t('edicion', { edicion: guia.edicion })}
          </Sobretitulo>
          <h2 id="guia" className="mt-4 text-titulo-1">
            {localizar(guia.descripcion, idioma)}
          </h2>
          <div className="mt-8">
            <FormularioGuia />
          </div>
        </div>
      </Contenedor>
    </section>
  );
}
