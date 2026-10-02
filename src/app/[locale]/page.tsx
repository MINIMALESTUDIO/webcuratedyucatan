import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import {
  obtenerArticulos,
  obtenerCategoriasDescubre,
  obtenerConfiguracionSitio,
  obtenerVenuesDestacados,
} from '@/lib/contenido';
import { alternativas } from '@/lib/seo/metadatos';
import { HeroInicio } from '@/components/secciones/inicio/HeroInicio';
import { SeccionDescubre } from '@/components/secciones/inicio/SeccionDescubre';
import { SeccionDestacados } from '@/components/secciones/inicio/SeccionDestacados';
import { SeccionExplora } from '@/components/secciones/inicio/SeccionExplora';
import { SeccionJournal } from '@/components/secciones/inicio/SeccionJournal';
import { SeccionPlanea } from '@/components/secciones/inicio/SeccionPlanea';
import { SeccionQueEs } from '@/components/secciones/inicio/SeccionQueEs';

export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'Metadatos' });
  return {
    title: { absolute: `${t('tituloSitio')} · ${t('inicioTitulo')}` },
    description: t('descripcionSitio'),
    alternates: alternativas('/', locale),
  };
}

/**
 * Inicio (documento de estructura, sección 4): principalmente visual y editorial, sin saturar.
 * Siete bloques en orden: Hero, What is Curated?, Discover Yucatán, Explore Curated,
 * Featured venues, Curated Journal y Plan your event.
 */
export default async function Inicio() {
  const [configuracion, categorias, destacados, articulos] = await Promise.all([
    obtenerConfiguracionSitio(),
    obtenerCategoriasDescubre(),
    obtenerVenuesDestacados(6),
    obtenerArticulos(3),
  ]);

  return (
    <>
      <HeroInicio configuracion={configuracion} />
      <SeccionQueEs configuracion={configuracion} />
      <SeccionDescubre configuracion={configuracion} categorias={categorias} />
      <SeccionExplora configuracion={configuracion} />
      <SeccionDestacados venues={destacados} />
      <SeccionJournal articulos={articulos} />
      <SeccionPlanea configuracion={configuracion} />
    </>
  );
}
