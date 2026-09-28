import { getLocale, getTranslations } from 'next-intl/server';
import type { ConfiguracionSitio } from '@/lib/contenido/tipos';
import { localizar } from '@/lib/i18n/localizar';
import { BotonEnlace } from '@/components/ui/Boton';
import { Contenedor } from '@/components/ui/Contenedor';
import { ImagenContenido } from '@/components/ui/ImagenContenido';
import { Sobretitulo } from '@/components/ui/Sobretitulo';
import { VideoHero } from '../VideoHero';

export async function HeroInicio({ configuracion }: { configuracion: ConfiguracionSitio }) {
  const t = await getTranslations('Inicio.hero');
  const idioma = await getLocale();
  const { videoHero } = configuracion;

  return (
    <section className="relative isolate flex min-h-[86svh] items-end overflow-hidden bg-tinta text-cal">
      {/* La imagen se muestra de inmediato; el video, si existe, carga después. */}
      <ImagenContenido
        imagen={configuracion.imagenHero}
        edicion={{ id: configuracion._id, tipo: 'configuracionSitio', ruta: 'imagenHero' }}
        sizes="100vw"
        preload
        className="-z-20 object-cover"
      />
      {videoHero && <VideoHero escritorio={videoHero.escritorio} movil={videoHero.movil} />}
      <div className="velo-inferior absolute inset-0 -z-10" aria-hidden="true" />

      <Contenedor className="pt-40 pb-14 sm:pb-20">
        <div className="max-w-3xl">
          <Sobretitulo className="text-piedra">{t('sobretitulo')}</Sobretitulo>
          <h1 className="mt-4 text-display font-(--peso-display) text-cal">
            {localizar(configuracion.fraseHero, idioma)}
          </h1>
          <p className="mt-5 max-w-xl text-destacado text-piedra">
            {localizar(configuracion.subtituloHero, idioma)}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <BotonEnlace href="/venues" variante="primario">
              {t('ctaVenues')}
            </BotonEnlace>
            <BotonEnlace href="/guia" variante="claro">
              {t('ctaGuia')}
            </BotonEnlace>
          </div>
        </div>
      </Contenedor>
    </section>
  );
}
