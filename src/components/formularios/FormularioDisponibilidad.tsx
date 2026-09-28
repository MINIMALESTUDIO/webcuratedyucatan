'use client';

// Cliente: validación y estados del formulario de disponibilidad de un venue.
import { useId } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { esquemaDisponibilidad } from '@/lib/validacion/formularios';
import { Boton } from '@/components/ui/Boton';
import { AvisoPiloto } from './AvisoPiloto';
import { CampoAreaTexto, CampoCasilla, CampoTexto } from './Campos';
import { textoDe, useFormularioPiloto } from './useFormularioPiloto';

export function FormularioDisponibilidad({ venueSlug }: { venueSlug: string }) {
  const t = useTranslations('Formularios');
  const idioma = useLocale();
  const base = useId();
  const id = (campo: string) => `${base}-${campo}`;

  const { errores, validado, aviso, alEnviar, hidratado } = useFormularioPiloto(
    esquemaDisponibilidad,
    (datos) => ({
      nombre: textoDe(datos, 'nombre'),
      correo: textoDe(datos, 'correo'),
      telefono: textoDe(datos, 'telefono'),
      pais: textoDe(datos, 'pais'),
      fechaBoda: textoDe(datos, 'fechaBoda'),
      fechaFlexible: datos.get('fechaFlexible') === 'on',
      invitadosAprox: textoDe(datos, 'invitadosAprox'),
      mensaje: textoDe(datos, 'mensaje'),
      consentimientoPrivacidad: datos.get('consentimientoPrivacidad') === 'on',
      venueSlug,
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
      className="flex flex-col gap-5"
    >
      {cantidadErrores > 0 && (
        <p role="alert" className="text-sm font-semibold text-almagre">
          {t('errores.resumen', { cantidad: cantidadErrores })}
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <CampoTexto
          id={id('nombre')}
          name="nombre"
          etiqueta={t('nombre')}
          autoComplete="name"
          error={error('nombre')}
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
          id={id('pais')}
          name="pais"
          etiqueta={t('pais')}
          autoComplete="country-name"
          error={error('pais')}
        />
        <div className="flex flex-col gap-1">
          <CampoTexto
            id={id('fechaBoda')}
            name="fechaBoda"
            etiqueta={t('fechaBoda')}
            type="date"
            error={error('fechaBoda')}
          />
          <CampoCasilla
            id={id('fechaFlexible')}
            name="fechaFlexible"
            etiqueta={t('fechaFlexible')}
          />
        </div>
        <CampoTexto
          id={id('invitadosAprox')}
          name="invitadosAprox"
          etiqueta={t('invitados')}
          type="number"
          inputMode="numeric"
          min={1}
          max={2000}
          step={1}
          error={error('invitadosAprox')}
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
      <div className="flex flex-col gap-1">
        <CampoCasilla
          id={id('consentimientoPrivacidad')}
          name="consentimientoPrivacidad"
          etiqueta={t('consentimientoVenue')}
          error={error('consentimientoPrivacidad')}
        />
        <Link href="/privacidad" className="ml-8 text-sm text-almagre underline underline-offset-4">
          {t('leerAviso')}
        </Link>
      </div>
      <Boton
        type="submit"
        variante="primario"
        disabled={!hidratado}
        className="self-start disabled:cursor-wait disabled:opacity-60"
      >
        {t('enviarSolicitud')}
      </Boton>
      {validado && <AvisoPiloto ref={aviso} />}
    </form>
  );
}
