import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import {
  obtenerCategoriasProveedor,
  obtenerConfiguracionSitio,
  obtenerGuiaActiva,
  obtenerHistoriasRecientes,
  obtenerRegiones,
  obtenerUltimoEpisodio,
  obtenerVenuesDestacados,
} from '@/lib/contenido';
import { alternativas } from '@/lib/seo/metadatos';
import { HeroInicio } from '@/components/secciones/inicio/HeroInicio';
import { SeccionCategorias } from '@/components/secciones/inicio/SeccionCategorias';
import { SeccionDestacados } from '@/components/secciones/inicio/SeccionDestacados';
import { SeccionEpisodio } from '@/components/secciones/inicio/SeccionEpisodio';
import { SeccionGuia } from '@/components/secciones/inicio/SeccionGuia';
import { SeccionHistorias } from '@/components/secciones/inicio/SeccionHistorias';
import { SeccionMetricas } from '@/components/secciones/inicio/SeccionMetricas';
import { SeccionPaisajes } from '@/components/secciones/inicio/SeccionPaisajes';
import { SeccionPorQue } from '@/components/secciones/inicio/SeccionPorQue';
import { SeccionSello } from '@/components/secciones/inicio/SeccionSello';
import { SeccionTradiciones } from '@/components/secciones/inicio/SeccionTradiciones';

export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'Metadatos' });
  return {
    title: { absolute: `${t('inicioTitulo')} · ${t('tituloSitio')}` },
    description: t('descripcionSitio'),
    alternates: alternativas('/', locale),
  };
}

export default async function Inicio() {
  const [configuracion, regiones, destacados, episodio, guia, categorias, historias] =
    await Promise.all([
      obtenerConfiguracionSitio(),
      obtenerRegiones(),
      obtenerVenuesDestacados(3),
      obtenerUltimoEpisodio(),
      obtenerGuiaActiva(),
      obtenerCategoriasProveedor(),
      obtenerHistoriasRecientes(3),
    ]);

  return (
    <>
      <HeroInicio configuracion={configuracion} />
      <SeccionPorQue datos={configuracion.porQueYucatan} />
      <SeccionSello datos={configuracion.sello} />
      <SeccionPaisajes regiones={regiones} />
      <div className="patron-pasta h-5" aria-hidden="true" />
      <SeccionDestacados venues={destacados} />
      {episodio && <SeccionEpisodio episodio={episodio} />}
      {guia && <SeccionGuia guia={guia} />}
      <SeccionTradiciones datos={configuracion.tradiciones} />
      <SeccionCategorias categorias={categorias} />
      <SeccionHistorias historias={historias} />
      <SeccionMetricas metricas={configuracion.metricas} />
    </>
  );
}
