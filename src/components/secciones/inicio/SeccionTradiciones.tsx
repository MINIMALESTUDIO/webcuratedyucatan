import { getLocale, getTranslations } from 'next-intl/server';
import type { ConfiguracionSitio } from '@/lib/contenido/tipos';
import { localizar } from '@/lib/i18n/localizar';
import { Contenedor } from '@/components/ui/Contenedor';
import { ImagenContenido } from '@/components/ui/ImagenContenido';
import { EncabezadoSeccion } from '../EncabezadoSeccion';

export async function SeccionTradiciones({ datos }: { datos: ConfiguracionSitio['tradiciones'] }) {
  const t = await getTranslations('Inicio.tradiciones');
  const idioma = await getLocale();

  return (
    <section aria-labelledby="tradiciones" className="py-seccion">
      <Contenedor>
        <EncabezadoSeccion
          id="tradiciones"
          sobretitulo={t('sobretitulo')}
          titulo={localizar(datos.titulo, idioma)}
          entradilla={localizar(datos.entradilla, idioma)}
        />
        <ul className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-6 lg:gap-10">
          {datos.elementos.map((elemento) => (
            <li key={elemento._key}>
              <div className="arco relative aspect-[4/5] overflow-hidden bg-piedra">
                <ImagenContenido
                  imagen={elemento.imagen}
                  sizes="(min-width: 1280px) 400px, (min-width: 640px) 30vw, 100vw"
                />
              </div>
              <h3 className="mt-5 text-titulo-3">{localizar(elemento.titulo, idioma)}</h3>
              <p className="mt-2 text-sm text-tinta-suave">{localizar(elemento.texto, idioma)}</p>
            </li>
          ))}
        </ul>
      </Contenedor>
    </section>
  );
}
