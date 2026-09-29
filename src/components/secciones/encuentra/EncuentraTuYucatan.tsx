'use client';

// Cliente: experiencia paso a paso de Find Your Yucatán (D-041). Una pregunta por pantalla,
// pensada para celular (los visitantes llegan por QR). Las reglas de recomendación viven en
// src/lib/descubrimiento/encuentra.ts y se prueban con Vitest.
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ATRIBUTOS_VENUE, type Imagen, type VenueTarjeta } from '@/lib/contenido/tipos';
import {
  OPCIONES_ENTORNO,
  OPCIONES_HOSPEDAJE,
  recomendarVenues,
  type RespuestasEncuentra,
  TIPOS_EVENTO_ENCUENTRA,
} from '@/lib/descubrimiento/encuentra';
import { RANGOS_INVITADOS } from '@/lib/validacion/opciones';
import { cx } from '@/lib/utilidades';
import { Boton, BotonEnlace } from '@/components/ui/Boton';
import { Icono } from '@/components/ui/Icono';
import { ImagenContenido } from '@/components/ui/ImagenContenido';
import { Sobretitulo } from '@/components/ui/Sobretitulo';
import { FormularioSeleccion } from '@/components/formularios/FormularioSeleccion';
import { TarjetaVenue } from '../TarjetaVenue';

export interface ColeccionEncuentra {
  _id: string;
  slug: string;
  nombre: string;
  lema: string;
  resultado: string;
  descripcion: string;
  imagen: Imagen;
}

type ClavePregunta = keyof RespuestasEncuentra;
const PREGUNTAS: ClavePregunta[] = [
  'evento',
  'atmosfera',
  'hospedaje',
  'entorno',
  'prioridad',
  'invitados',
];

interface Opcion {
  valor: string;
  etiqueta: string;
  detalle?: string;
  imagen?: Imagen;
}

export function EncuentraTuYucatan({
  venues,
  colecciones,
}: {
  venues: VenueTarjeta[];
  colecciones: ColeccionEncuentra[];
}) {
  const t = useTranslations('Encuentra');
  const tf = useTranslations('Formularios');
  // -1: presentación; 0–5: preguntas; 6: resultado.
  const [paso, setPaso] = useState(-1);
  const [respuestas, setRespuestas] = useState<Partial<RespuestasEncuentra>>({});
  const titulo = useRef<HTMLHeadingElement>(null);

  // Al cambiar de paso, el foco va al título nuevo para que el lector de pantalla lo anuncie.
  useEffect(() => {
    if (paso >= 0) titulo.current?.focus();
  }, [paso]);

  function opcionesDe(clave: ClavePregunta): Opcion[] {
    const pregunta = (valor: string) => t(`preguntas.${clave}.opciones.${valor}` as never);
    switch (clave) {
      case 'evento':
        return TIPOS_EVENTO_ENCUENTRA.map((valor) => ({ valor, etiqueta: pregunta(valor) }));
      case 'atmosfera':
        return colecciones.map((c) => ({
          valor: c.slug,
          etiqueta: c.resultado,
          detalle: c.lema,
          imagen: c.imagen,
        }));
      case 'hospedaje':
        return OPCIONES_HOSPEDAJE.map((valor) => ({ valor, etiqueta: pregunta(valor) }));
      case 'entorno':
        return OPCIONES_ENTORNO.map((valor) => ({ valor, etiqueta: pregunta(valor) }));
      case 'prioridad':
        return ATRIBUTOS_VENUE.map((valor) => ({ valor, etiqueta: pregunta(valor) }));
      case 'invitados':
        return RANGOS_INVITADOS.map((valor) => ({
          valor,
          etiqueta: tf(`opciones.invitados.${valor}`),
        }));
    }
  }

  function responder(clave: ClavePregunta, valor: string) {
    setRespuestas((anteriores) => ({ ...anteriores, [clave]: valor }));
    setPaso((actual) => actual + 1);
  }

  function reiniciar() {
    setRespuestas({});
    setPaso(0);
  }

  if (paso === -1) {
    return (
      <div className="flex flex-col items-center text-center">
        <Boton variante="primario" onClick={() => setPaso(0)}>
          {t('empezar')}
        </Boton>
      </div>
    );
  }

  if (paso >= PREGUNTAS.length) {
    const completas = respuestas as RespuestasEncuentra;
    const coleccion = colecciones.find((c) => c.slug === completas.atmosfera) ?? colecciones[0];
    if (!coleccion) return null;
    const recomendados = recomendarVenues(venues, completas);

    return (
      <div aria-live="polite">
        <div className="flex flex-col items-center text-center">
          <Sobretitulo>{t('resultado.sobretitulo')}</Sobretitulo>
          <h2
            ref={titulo}
            tabIndex={-1}
            className="mt-6 text-display tracking-[0.2em] outline-none"
          >
            {coleccion.resultado}
          </h2>
          <p className="mt-4 font-marca text-sm tracking-[0.2em] uppercase">{coleccion.nombre}</p>
          <p className="mt-6 max-w-xl text-destacado text-tinta-suave">{coleccion.descripcion}</p>
        </div>

        <section aria-labelledby="lugares" className="mt-20 border-t border-linea pt-16">
          <h3 id="lugares" className="text-center text-titulo-2">
            {t('resultado.lugares')}
          </h3>
          <ul className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {recomendados.map((venue) => (
              <li key={venue._id} className="flex">
                <TarjetaVenue venue={venue} />
              </li>
            ))}
          </ul>
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <BotonEnlace
              href={{ pathname: '/venues', query: { estilo: coleccion.slug } }}
              variante="secundario"
            >
              {t('resultado.verColeccion', { coleccion: coleccion.nombre })}
            </BotonEnlace>
            <Boton variante="texto" onClick={reiniciar}>
              {t('resultado.reiniciar')}
            </Boton>
          </div>
        </section>

        <section
          aria-labelledby="guardar"
          className="mx-auto mt-20 max-w-2xl bg-papel-calido px-6 py-12 sm:px-12"
        >
          <h3 id="guardar" className="text-center text-titulo-3">
            {t('resultado.guardar.titulo')}
          </h3>
          <p className="mt-4 mb-8 text-center text-sm text-tinta-suave">
            {t('resultado.guardar.texto')}
          </p>
          <FormularioSeleccion
            resultado={coleccion.slug}
            venues={recomendados.map((venue) => venue.slug)}
          />
        </section>
      </div>
    );
  }

  const clave = PREGUNTAS[paso] as ClavePregunta;
  const opciones = opcionesDe(clave);
  const conImagen = clave === 'atmosfera';

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between gap-4">
        <p className="etiqueta text-tinta-suave">
          {t('paso', { actual: paso + 1, total: PREGUNTAS.length })}
        </p>
        {paso > 0 && (
          <button
            type="button"
            onClick={() => setPaso((actual) => actual - 1)}
            className="etiqueta inline-flex min-h-11 items-center gap-2 hover:underline"
          >
            <Icono nombre="flechaIzquierda" className="size-4" />
            {t('atras')}
          </button>
        )}
      </div>
      <div aria-hidden="true" className="mt-3 h-px w-full bg-linea">
        <div
          className="h-px bg-tinta transition-[width] duration-500"
          style={{ width: `${((paso + 1) / PREGUNTAS.length) * 100}%` }}
        />
      </div>

      <h2 ref={titulo} tabIndex={-1} className="mt-14 text-center text-titulo-1 outline-none">
        {t(`preguntas.${clave}.titulo` as never)}
      </h2>

      <ul
        className={cx(
          'mt-12 grid gap-3',
          conImagen ? 'sm:grid-cols-3' : 'sm:grid-cols-2',
          !conImagen && opciones.length === 3 && 'sm:grid-cols-3',
        )}
      >
        {opciones.map((opcion) => {
          const elegida = respuestas[clave] === opcion.valor;
          return (
            <li key={opcion.valor}>
              <button
                type="button"
                aria-pressed={elegida}
                onClick={() => responder(clave, opcion.valor)}
                className={cx(
                  'group flex w-full flex-col border text-left transition-colors duration-300',
                  elegida ? 'border-tinta' : 'border-linea hover:border-tinta',
                  conImagen ? 'p-0' : 'min-h-16 justify-center px-6 py-4',
                )}
              >
                {opcion.imagen && (
                  <span className="relative block aspect-[4/3] w-full overflow-hidden bg-arena">
                    <ImagenContenido
                      imagen={opcion.imagen}
                      decorativa
                      sizes="(min-width: 640px) 33vw, 100vw"
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
                    />
                  </span>
                )}
                <span
                  className={cx(
                    conImagen && 'px-5 pt-5',
                    'font-marca text-sm tracking-[0.2em] uppercase',
                  )}
                >
                  {opcion.etiqueta}
                </span>
                {opcion.detalle && (
                  <span className="px-5 pt-1 pb-5 text-sm text-tinta-suave italic">
                    {opcion.detalle}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
