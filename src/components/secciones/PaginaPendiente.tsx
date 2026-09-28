import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import type { ClaveNavegacion } from '@/lib/navegacion';
import { BotonEnlace } from '@/components/ui/Boton';
import { Contenedor } from '@/components/ui/Contenedor';
import { Sobretitulo } from '@/components/ui/Sobretitulo';

/** Metadatos de las páginas fuera del piloto: nunca se indexan (D-029). */
export async function metadatosPendiente(): Promise<Metadata> {
  const t = await getTranslations('Metadatos');
  return { title: t('pendienteTitulo'), robots: { index: false, follow: false } };
}

/** Página provisional para las rutas de la sección 4 que llegan en fases posteriores. */
export async function PaginaPendiente({ seccion }: { seccion: ClaveNavegacion }) {
  const t = await getTranslations('Pendiente');
  const tn = await getTranslations('Navegacion');

  return (
    <section className="relative overflow-hidden py-seccion">
      <Contenedor className="grid items-center gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <Sobretitulo>
            {t('sobretitulo')} · {tn(seccion)}
          </Sobretitulo>
          <h1 className="mt-4 text-titulo-1">{t('titulo')}</h1>
          <p className="mt-5 max-w-xl text-destacado text-tinta-suave">{t('texto')}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <BotonEnlace href="/venues" variante="primario">
              {t('verVenues')}
            </BotonEnlace>
            <BotonEnlace href="/" variante="secundario">
              {t('volver')}
            </BotonEnlace>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="arco mx-auto hidden aspect-[3/4] w-full max-w-sm bg-piedra md:col-span-5 md:block"
        >
          <div className="patron-pasta arco h-full w-full opacity-40" />
        </div>
      </Contenedor>
    </section>
  );
}
