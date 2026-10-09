import { getLocale, getTranslations } from 'next-intl/server';
import type { ConfiguracionSitio } from '@/lib/contenido/tipos';
import { localizar } from '@/lib/i18n/localizar';
import { BotonEnlace } from '@/components/ui/Boton';
import { Contenedor } from '@/components/ui/Contenedor';
import { ImagenContenido } from '@/components/ui/ImagenContenido';

/** 02 — What is Curated? Explicación breve con CTA a About; no es un About completo. */
export async function SeccionQueEs({ configuracion }: { configuracion: ConfiguracionSitio }) {
  const t = await getTranslations('Inicio.queEs');
  const idioma = await getLocale();
  return (
    <section aria-labelledby="que-es" className="py-seccion">
      <Contenedor ancho="lectura" className="flex flex-col items-center text-center">
        <h2 id="que-es" className="text-titulo-2">
          {t('titulo')}
        </h2>
        <span aria-hidden="true" className="mt-8 block h-px w-16 bg-linea" />
        <p className="mt-8 text-destacado">{localizar(configuracion.queEsCurated.texto, idioma)}</p>
        <BotonEnlace href="/nosotros" variante="texto" className="mt-8">
          {t('cta')}
        </BotonEnlace>
      </Contenedor>
      {configuracion.queEsCurated.imagen && (
        <Contenedor className="mt-16">
          <div className="relative aspect-[16/9] overflow-hidden bg-arena">
            <ImagenContenido
              imagen={configuracion.queEsCurated.imagen}
              edicion={{
                id: configuracion._id,
                tipo: 'configuracionSitio',
                ruta: 'queEsCurated.imagen',
              }}
              sizes="(min-width: 1280px) 1200px, 100vw"
            />
          </div>
        </Contenedor>
      )}
    </section>
  );
}
