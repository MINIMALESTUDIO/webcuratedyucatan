import { getLocale, getTranslations } from 'next-intl/server';
import type { ConfiguracionSitio } from '@/lib/contenido/tipos';
import { localizar } from '@/lib/i18n/localizar';
import { BotonEnlace } from '@/components/ui/Boton';
import { ImagenContenido } from '@/components/ui/ImagenContenido';
import { VideoHero } from '../VideoHero';

/**
 * 01 — Hero: video corto del destino, "CURATED YUCATÁN" con el lema y un solo CTA hacia
 * Discover Yucatán. Velo uniforme (sin degradado); el texto blanco es grande y el botón sólido
 * para mantener el contraste sobre cualquier foto (D-037).
 */
export async function HeroInicio({ configuracion }: { configuracion: ConfiguracionSitio }) {
  const t = await getTranslations('Inicio.hero');
  const tc = await getTranslations('Comun');
  const idioma = await getLocale();
  const { videoHero } = configuracion;

  return (
    <section className="relative isolate flex min-h-[88svh] items-center justify-center overflow-hidden bg-tinta text-papel">
      {/* La imagen se muestra de inmediato; el video, si existe, carga después. */}
      <ImagenContenido
        imagen={configuracion.imagenHero}
        edicion={{ id: configuracion._id, tipo: 'configuracionSitio', ruta: 'imagenHero' }}
        sizes="100vw"
        preload
        className="-z-20 object-cover"
      />
      {videoHero && <VideoHero escritorio={videoHero.escritorio} movil={videoHero.movil} />}
      <div className="velo absolute inset-0 -z-10" aria-hidden="true" />

      <div className="flex flex-col items-center px-margen py-32 text-center">
        <h1 className="text-display tracking-[0.2em] text-papel">{tc('marca')}</h1>
        <p className="mt-6 max-w-xl text-2xl leading-snug text-papel italic">
          {localizar(configuracion.lema, idioma)}
        </p>
        <BotonEnlace href="/descubre-yucatan" variante="claro" className="mt-12">
          {t('cta')}
        </BotonEnlace>
      </div>
    </section>
  );
}
