import type { Metadata } from 'next';
import { Suspense } from 'react';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { alternativas } from '@/lib/seo/metadatos';
import { Contenedor } from '@/components/ui/Contenedor';
import { EncabezadoSeccion } from '@/components/secciones/EncabezadoSeccion';
import { FormularioSolicitud } from '@/components/formularios/FormularioSolicitud';
import { FormularioSolicitudConUrl } from '@/components/formularios/FormularioSolicitudConUrl';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/planea-tu-evento'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'Metadatos' });
  const tp = await getTranslations({ locale, namespace: 'Planea' });
  return {
    title: tp('titulo'),
    description: t('planeaDescripcion'),
    alternates: alternativas('/planea-tu-evento', locale),
  };
}

/** Plan Your Event: principal punto de conversión (documento de estructura, sección 13). */
export default async function PaginaPlanea() {
  const t = await getTranslations('Planea');
  return (
    <>
      <Contenedor className="pt-16 pb-14 sm:pt-20">
        <EncabezadoSeccion nivel="h1" titulo={t('titulo')} entradilla={t('entradilla')} />
      </Contenedor>
      <Contenedor className="pb-seccion">
        <div className="mx-auto max-w-3xl border-t border-linea pt-12">
          <Suspense fallback={<FormularioSolicitud origen="general" />}>
            <FormularioSolicitudConUrl />
          </Suspense>
        </div>
      </Contenedor>
    </>
  );
}
