'use client';

// Cliente: validación y estados del formulario de solicitud (Plan Your Event y solicitud de
// información de un venue o partner, D-042).
import { useId } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  BUSQUEDAS,
  type Busqueda,
  type OrigenSolicitud,
  RANGOS_INVITADOS,
  TIPOS_EVENTO,
} from '@/lib/validacion/opciones';
import { Boton } from '@/components/ui/Boton';
import { AvisoPiloto } from './AvisoPiloto';
import { CampoAreaTexto, CampoCasilla, CampoOpciones, CampoTexto } from './Campos';
import { textoDe, useFormularioPiloto } from './useFormularioPiloto';

// El esquema (y zod) se descarga solo al enviar (D-031).
const cargarEsquema = () =>
  import('@/lib/validacion/formularios').then((modulo) => modulo.esquemaSolicitud);

interface Props {
  origen: OrigenSolicitud;
  origenSlug?: string;
  /** Con un venue o partner concreto, "Looking for" ya está resuelto y no se pregunta. */
  mostrarBuscando?: boolean;
  buscandoInicial?: readonly Busqueda[];
}

/**
 * Campos exactos de Plan Your Event (documento de estructura, sección 13): What are you
 * planning?, Estimated guests?, Looking for y Contact. CTA "Send my request".
 */
export function FormularioSolicitud({
  origen,
  origenSlug,
  mostrarBuscando = true,
  buscandoInicial = [],
}: Props) {
  const t = useTranslations('Formularios');
  const idioma = useLocale();
  const base = useId();
  const id = (campo: string) => `${base}-${campo}`;

  const { errores, validado, aviso, alEnviar, hidratado } = useFormularioPiloto(
    cargarEsquema,
    (datos) => ({
      tipoEvento: textoDe(datos, 'tipoEvento'),
      invitados: textoDe(datos, 'invitados'),
      buscando: mostrarBuscando ? datos.getAll('buscando') : [...buscandoInicial],
      nombre: textoDe(datos, 'nombre'),
      empresa: textoDe(datos, 'empresa'),
      pais: textoDe(datos, 'pais'),
      correo: textoDe(datos, 'correo'),
      telefono: textoDe(datos, 'telefono'),
      fechaAproximada: textoDe(datos, 'fechaAproximada'),
      mensaje: textoDe(datos, 'mensaje'),
      consentimientoPrivacidad: datos.get('consentimientoPrivacidad') === 'on',
      origen,
      origenSlug,
      idioma,
    }),
  );

  const error = (campo: string) => {
    const codigo = errores[campo];
    return codigo ? t(`errores.${codigo}`) : undefined;
  };
  const cantidadErrores = Object.keys(errores).length;

  return (
    <form
      noValidate
      onSubmit={alEnviar}
      data-hidratado={hidratado ? 'si' : 'no'}
      className="flex flex-col gap-8"
    >
      {cantidadErrores > 0 && (
        <p role="alert" className="text-sm font-semibold">
          {t('errores.resumen', { cantidad: cantidadErrores })}
        </p>
      )}

      <CampoOpciones
        id={id('tipoEvento')}
        nombre="tipoEvento"
        etiqueta={t('preguntas.tipoEvento')}
        opciones={TIPOS_EVENTO.map((valor) => ({
          valor,
          etiqueta: t(`opciones.tipoEvento.${valor}`),
        }))}
        error={error('tipoEvento')}
      />
      <CampoOpciones
        id={id('invitados')}
        nombre="invitados"
        etiqueta={t('preguntas.invitados')}
        opciones={RANGOS_INVITADOS.map((valor) => ({
          valor,
          etiqueta: t(`opciones.invitados.${valor}`),
        }))}
        error={error('invitados')}
      />
      {mostrarBuscando && (
        <CampoOpciones
          id={id('buscando')}
          nombre="buscando"
          etiqueta={t('preguntas.buscando')}
          multiple
          seleccionInicial={buscandoInicial}
          opciones={BUSQUEDAS.map((valor) => ({
            valor,
            etiqueta: t(`opciones.buscando.${valor}`),
          }))}
          ayuda={t('buscandoAyuda')}
          error={error('buscando')}
        />
      )}

      <fieldset className="flex flex-col gap-5 border-t border-linea pt-8">
        <legend className="etiqueta float-left mb-6 w-full">{t('preguntas.contacto')}</legend>
        <div className="clear-left grid gap-5 sm:grid-cols-2">
          <CampoTexto
            id={id('nombre')}
            name="nombre"
            etiqueta={t('nombre')}
            autoComplete="name"
            error={error('nombre')}
          />
          <CampoTexto
            id={id('empresa')}
            name="empresa"
            etiqueta={t('empresa')}
            autoComplete="organization"
            error={error('empresa')}
          />
          <CampoTexto
            id={id('pais')}
            name="pais"
            etiqueta={t('pais')}
            autoComplete="country-name"
            error={error('pais')}
          />
          <CampoTexto
            id={id('correo')}
            name="correo"
            etiqueta={t('correo')}
            type="email"
            autoComplete="email"
            inputMode="email"
            error={error('correo')}
          />
          <CampoTexto
            id={id('telefono')}
            name="telefono"
            etiqueta={t('telefono')}
            opcional={t('opcional')}
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            error={error('telefono')}
          />
          <CampoTexto
            id={id('fechaAproximada')}
            name="fechaAproximada"
            etiqueta={t('fechaAproximada')}
            ayuda={t('fechaAyuda')}
            error={error('fechaAproximada')}
          />
        </div>
        <CampoAreaTexto
          id={id('mensaje')}
          name="mensaje"
          etiqueta={t('mensaje')}
          opcional={t('opcional')}
          maxLength={2000}
          error={error('mensaje')}
        />
      </fieldset>

      <div className="flex flex-col gap-1">
        <CampoCasilla
          id={id('consentimientoPrivacidad')}
          name="consentimientoPrivacidad"
          etiqueta={t('consentimiento')}
          error={error('consentimientoPrivacidad')}
        />
        <Link href="/privacidad" className="ml-8 text-sm underline underline-offset-4">
          {t('leerAviso')}
        </Link>
      </div>
      <Boton
        type="submit"
        variante="primario"
        disabled={!hidratado}
        className="self-start disabled:cursor-wait disabled:opacity-60"
      >
        {t('enviar')}
      </Boton>
      {validado && <AvisoPiloto ref={aviso} />}
    </form>
  );
}
