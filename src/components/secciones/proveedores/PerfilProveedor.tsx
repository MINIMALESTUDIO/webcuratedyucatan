import type { ReactNode } from 'react';
import { getLocale, getTranslations } from 'next-intl/server';
import type { Proveedor } from '@/lib/contenido/tipos';
import { localizar, localizarBloques } from '@/lib/i18n/localizar';
import { BotonEnlace } from '@/components/ui/Boton';
import { Contenedor } from '@/components/ui/Contenedor';
import { Icono } from '@/components/ui/Icono';
import { ImagenContenido } from '@/components/ui/ImagenContenido';
import { Sobretitulo } from '@/components/ui/Sobretitulo';
import { Galeria } from '../venue/Galeria';
import { TextoEnriquecido } from '../TextoEnriquecido';

function Bloque({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div className="border-t border-linea pt-6">
      <h2 className="etiqueta font-texto text-tinta-suave">{titulo}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

/**
 * Perfil individual de Catering o Photography (documento de estructura, secciones 8 y 9):
 * hero visual → descripción → servicios → estilo → experiencia → ubicación y cobertura →
 * galería → datos digitales → CTA. La fotografía pesa más que el logotipo.
 */
export async function PerfilProveedor({ proveedor }: { proveedor: Proveedor }) {
  const t = await getTranslations('Proveedores');
  const idioma = await getLocale();
  const busqueda = proveedor.tipo === 'catering' ? 'catering' : 'fotografia';

  return (
    <>
      <section>
        <div className="relative h-[52svh] min-h-72 overflow-hidden bg-arena lg:h-[64svh]">
          <ImagenContenido
            imagen={proveedor.imagenPrincipal}
            edicion={{ id: proveedor._id, tipo: 'proveedor', ruta: 'imagenPrincipal' }}
            sizes="100vw"
            preload
          />
        </div>
        <Contenedor className="flex flex-col items-center pt-14 text-center sm:pt-20">
          <Sobretitulo>
            {proveedor.estilosFotografia.length > 0
              ? proveedor.estilosFotografia.map((e) => t(`estilos.${e}`)).join(' · ')
              : t(`${proveedor.tipo}.titulo`)}
          </Sobretitulo>
          <h1 className="mt-5 titulo-nombre text-nombre">{proveedor.nombre}</h1>
          <p className="mt-5 text-destacado text-tinta-suave">
            {localizar(proveedor.especialidad, idioma)}
          </p>
        </Contenedor>
      </section>

      <section className="py-seccion">
        <Contenedor className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <TextoEnriquecido
            valor={localizarBloques(proveedor.descripcion, idioma)}
            className="text-destacado lg:col-span-7"
          />
          <div className="flex flex-col gap-10 lg:col-span-5">
            {proveedor.servicios.length > 0 && (
              <Bloque titulo={t('perfil.servicios')}>
                <ul className="flex flex-col gap-2 text-sm">
                  {proveedor.servicios.map((servicio) => (
                    <li key={servicio._key}>{localizar(servicio.texto, idioma)}</li>
                  ))}
                </ul>
              </Bloque>
            )}
            <Bloque titulo={t('perfil.estilo')}>
              <p className="text-sm">{localizar(proveedor.estilo, idioma)}</p>
            </Bloque>
            <Bloque titulo={t('perfil.experiencia')}>
              <p className="text-sm">{localizar(proveedor.experiencia, idioma)}</p>
            </Bloque>
            <Bloque titulo={t('perfil.cobertura', { ciudad: proveedor.ciudadBase })}>
              <p className="text-sm">{localizar(proveedor.cobertura, idioma)}</p>
            </Bloque>
            {(proveedor.sitioWeb || proveedor.instagram) && (
              <Bloque titulo={t('perfil.enlaces')}>
                <ul className="flex flex-wrap gap-x-6">
                  {proveedor.sitioWeb && (
                    <li>
                      <a
                        href={proveedor.sitioWeb}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="enlace-accion"
                      >
                        {t('perfil.sitioWeb')}
                        <Icono nombre="externo" className="size-4" />
                        <span className="sr-only">{t('perfil.externo')}</span>
                      </a>
                    </li>
                  )}
                  {proveedor.instagram && (
                    <li>
                      <a
                        href={proveedor.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="enlace-accion"
                      >
                        {t('perfil.instagram')}
                        <Icono nombre="externo" className="size-4" />
                        <span className="sr-only">{t('perfil.externo')}</span>
                      </a>
                    </li>
                  )}
                </ul>
              </Bloque>
            )}
          </div>
        </Contenedor>
      </section>

      <Galeria
        imagenes={proveedor.galeria}
        origen={{ id: proveedor._id, tipo: 'proveedor', arreglo: 'galeria' }}
      />

      <section aria-labelledby="solicitud" className="bg-papel-calido py-seccion">
        <Contenedor ancho="lectura" className="flex flex-col items-center text-center">
          <h2 id="solicitud" className="text-titulo-2">
            {t('perfil.cta')}
          </h2>
          <p className="mt-6 text-tinta-suave">
            {t('perfil.ctaTexto', { nombre: proveedor.nombre })}
          </p>
          <BotonEnlace
            href={{
              pathname: '/planea-tu-evento',
              query: { buscando: busqueda, origen: 'proveedor', slug: proveedor.slug },
            }}
            variante="primario"
            className="mt-10"
          >
            {t('perfil.cta')}
          </BotonEnlace>
        </Contenedor>
      </section>
    </>
  );
}
