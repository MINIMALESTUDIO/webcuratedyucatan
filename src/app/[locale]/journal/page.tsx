import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { obtenerArticulos } from '@/lib/contenido';
import { alternativas } from '@/lib/seo/metadatos';
import { Contenedor } from '@/components/ui/Contenedor';
import { EncabezadoSeccion } from '@/components/secciones/EncabezadoSeccion';
import { TarjetaArticulo } from '@/components/secciones/TarjetaArticulo';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/journal'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'Metadatos' });
  const tj = await getTranslations({ locale, namespace: 'Journal' });
  return {
    title: tj('titulo'),
    description: t('journalDescripcion'),
    alternates: alternativas('/journal', locale),
  };
}

/** Curated Journal: sección editorial, no un blog corporativo (documento de estructura, sección 11). */
export default async function PaginaJournal() {
  const [articulos, t] = await Promise.all([obtenerArticulos(), getTranslations('Journal')]);
  const [principal, ...resto] = articulos;

  return (
    <>
      <Contenedor className="pt-16 pb-14 sm:pt-20">
        <EncabezadoSeccion nivel="h1" titulo={t('titulo')} entradilla={t('entradilla')} />
      </Contenedor>
      <Contenedor className="pb-seccion">
        {principal && (
          <div className="border-b border-linea pb-16">
            <TarjetaArticulo articulo={principal} nivel="h2" />
          </div>
        )}
        {resto.length > 0 && (
          <ul className="mt-16 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {resto.map((articulo) => (
              <li key={articulo._id} className="flex">
                <TarjetaArticulo articulo={articulo} nivel="h2" />
              </li>
            ))}
          </ul>
        )}
      </Contenedor>
    </>
  );
}
