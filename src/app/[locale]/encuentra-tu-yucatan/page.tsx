import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { obtenerColecciones, obtenerVenuesTarjeta } from '@/lib/contenido';
import { localizar } from '@/lib/i18n/localizar';
import { alternativas } from '@/lib/seo/metadatos';
import { Contenedor } from '@/components/ui/Contenedor';
import { EncabezadoSeccion } from '@/components/secciones/EncabezadoSeccion';
import { EncuentraTuYucatan } from '@/components/secciones/encuentra/EncuentraTuYucatan';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/encuentra-tu-yucatan'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'Metadatos' });
  const te = await getTranslations({ locale, namespace: 'Encuentra' });
  return {
    title: te('titulo'),
    description: t('encuentraDescripcion'),
    alternates: alternativas('/encuentra-tu-yucatan', locale),
  };
}

/**
 * Find Your Yucatán (documento de estructura, sección 14): descubrimiento, no conversión.
 * La URL en inglés (/find-your-yucatan) es la del QR 02 de LOVE MÉXICO.
 */
export default async function PaginaEncuentra() {
  const [venues, colecciones, t, idioma] = await Promise.all([
    obtenerVenuesTarjeta(),
    obtenerColecciones(),
    getTranslations('Encuentra'),
    getLocale(),
  ]);

  return (
    <Contenedor className="pt-16 pb-seccion sm:pt-20">
      <EncabezadoSeccion
        nivel="h1"
        sobretitulo={t('titulo')}
        titulo={t('titular')}
        entradilla={t('entradilla')}
      />
      <div className="mt-14">
        <EncuentraTuYucatan
          venues={venues}
          colecciones={colecciones.map((c) => ({
            _id: c._id,
            slug: c.slug,
            nombre: localizar(c.nombre, idioma),
            lema: localizar(c.lema, idioma),
            resultado: localizar(c.resultado, idioma),
            descripcion: localizar(c.descripcion, idioma),
            imagen: c.imagen,
          }))}
        />
      </div>
    </Contenedor>
  );
}
