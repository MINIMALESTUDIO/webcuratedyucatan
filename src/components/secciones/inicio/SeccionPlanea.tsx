import { getLocale, getTranslations } from 'next-intl/server';
import type { ConfiguracionSitio } from '@/lib/contenido/tipos';
import { localizar } from '@/lib/i18n/localizar';
import { BotonEnlace } from '@/components/ui/Boton';
import { Contenedor } from '@/components/ui/Contenedor';
import { ImagenContenido } from '@/components/ui/ImagenContenido';

/**
 * 07 — Plan your event: último bloque del inicio y principal punto de conversión. Ofrece además
 * Find Your Yucatán para quien todavía está descubriendo.
 */
export async function SeccionPlanea({ configuracion }: { configuracion: ConfiguracionSitio }) {
  const t = await getTranslations('Inicio.planea');
  const idioma = await getLocale();
  const { imagen, texto } = configuracion.planea;

  return (
    <section aria-labelledby="planea" className="bg-papel-calido py-seccion">
      <Contenedor className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {imagen && (
          <div className="relative aspect-[4/3] overflow-hidden bg-arena">
            <ImagenContenido
              imagen={imagen}
              edicion={{ id: configuracion._id, tipo: 'configuracionSitio', ruta: 'planea.imagen' }}
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        )}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <h2 id="planea" className="text-titulo-1">
            {t('titulo')}
          </h2>
          <p className="mt-6 max-w-md text-destacado text-tinta-suave">
            {localizar(texto, idioma)}
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <BotonEnlace href="/planea-tu-evento" variante="primario">
              {t('cta')}
            </BotonEnlace>
            <BotonEnlace href="/encuentra-tu-yucatan" variante="texto">
              {t('encuentra')}
            </BotonEnlace>
          </div>
        </div>
      </Contenedor>
    </section>
  );
}
