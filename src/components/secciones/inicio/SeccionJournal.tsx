import { getTranslations } from 'next-intl/server';
import type { ArticuloResumen } from '@/lib/contenido/tipos';
import { BotonEnlace } from '@/components/ui/Boton';
import { Contenedor } from '@/components/ui/Contenedor';
import { EncabezadoSeccion } from '../EncabezadoSeccion';
import { TarjetaArticulo } from '../TarjetaArticulo';

/** 06 — Curated Journal: tres artículos destacados. */
export async function SeccionJournal({ articulos }: { articulos: ArticuloResumen[] }) {
  if (articulos.length === 0) return null;
  const t = await getTranslations('Inicio.journal');
  return (
    <section aria-labelledby="journal" className="border-t border-linea py-seccion">
      <Contenedor>
        <EncabezadoSeccion id="journal" titulo={t('titulo')} />
        <ul className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-3">
          {articulos.map((articulo) => (
            <li key={articulo._id} className="flex">
              <TarjetaArticulo articulo={articulo} />
            </li>
          ))}
        </ul>
        <div className="mt-14 flex justify-center">
          <BotonEnlace href="/journal" variante="texto">
            {t('cta')}
          </BotonEnlace>
        </div>
      </Contenedor>
    </section>
  );
}
