import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { ConfiguracionSitio, DestinoExplora } from '@/lib/contenido/tipos';
import { localizar } from '@/lib/i18n/localizar';
import type { EnlaceNavegacion } from '@/lib/navegacion';
import { rutaElemento } from '@/lib/sanity/edicion';
import { Contenedor } from '@/components/ui/Contenedor';
import { ImagenContenido } from '@/components/ui/ImagenContenido';
import { EncabezadoSeccion } from '../EncabezadoSeccion';

const DESTINOS: Record<DestinoExplora, EnlaceNavegacion> = {
  venues: { href: '/venues', clave: 'venues' },
  catering: { href: '/catering', clave: 'catering' },
  fotografia: { href: '/fotografia', clave: 'fotografia' },
  'diseno-produccion': { href: '/diseno-y-produccion', clave: 'diseno' },
};

/** 04 — Explore Curated: las cuatro áreas, cada una con fotografía (no solo logotipos). */
export async function SeccionExplora({ configuracion }: { configuracion: ConfiguracionSitio }) {
  const t = await getTranslations('Inicio.explora');
  const tn = await getTranslations('Navegacion');
  const idioma = await getLocale();
  const { areas, texto } = configuracion.exploraCurated;

  return (
    <section aria-labelledby="explora" className="border-t border-linea py-seccion">
      <Contenedor>
        <EncabezadoSeccion
          id="explora"
          titulo={t('titulo')}
          entradilla={localizar(texto, idioma)}
        />
        <ul className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {areas.map((area) => {
            const destino = DESTINOS[area.destino];
            return (
              <li key={area._key} className="group relative flex flex-col">
                <div className="relative aspect-[3/4] overflow-hidden bg-arena">
                  <ImagenContenido
                    imagen={area.imagen}
                    edicion={{
                      id: configuracion._id,
                      tipo: 'configuracionSitio',
                      ruta: rutaElemento('exploraCurated.areas', area._key, '.imagen'),
                    }}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <h3 className="mt-6 text-center text-titulo-3">
                  <Link href={destino.href} className="after:absolute after:inset-0">
                    {tn(destino.clave)}
                  </Link>
                </h3>
                <p className="mt-2 text-center text-sm text-tinta-suave">
                  {localizar(area.texto, idioma)}
                </p>
              </li>
            );
          })}
        </ul>
      </Contenedor>
    </section>
  );
}
