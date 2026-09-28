'use client';

// Cliente: validación y estados del formulario de descarga de la guía.
import { useId } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { esquemaGuia } from '@/lib/validacion/formularios';
import { Boton } from '@/components/ui/Boton';
import { AvisoPiloto } from './AvisoPiloto';
import { CampoCasilla, CampoTexto } from './Campos';
import { textoDe, useFormularioPiloto } from './useFormularioPiloto';

export function FormularioGuia() {
  const t = useTranslations('Formularios');
  const idioma = useLocale();
  const base = useId();
  // id único en la página; `name` es el nombre del campo en el esquema.
  const id = (campo: string) => `${base}-${campo}`;

  const { errores, validado, aviso, alEnviar, hidratado } = useFormularioPiloto(
    esquemaGuia,
    (datos) => ({
      nombre: textoDe(datos, 'nombre'),
      correo: textoDe(datos, 'correo'),
      consentimientoPrivacidad: datos.get('consentimientoPrivacidad') === 'on',
      aceptaNovedades: datos.get('aceptaNovedades') === 'on',
      idioma,
    }),
  );

  const error = (campo: string) => {
    const codigo = errores[campo];
    return codigo ? t(`errores.${codigo}`) : undefined;
  };

  return (
    <form
      noValidate
      onSubmit={alEnviar}
      data-hidratado={hidratado ? 'si' : 'no'}
      className="flex flex-col gap-5"
    >
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
      </div>
      <div className="flex flex-col gap-1">
        <CampoCasilla
          id={id('consentimientoPrivacidad')}
          name="consentimientoPrivacidad"
          etiqueta={t('consentimientoGuia')}
          error={error('consentimientoPrivacidad')}
        />
        <Link href="/privacidad" className="ml-8 text-sm text-almagre underline underline-offset-4">
          {t('leerAviso')}
        </Link>
      </div>
      <CampoCasilla id={id('aceptaNovedades')} name="aceptaNovedades" etiqueta={t('novedades')} />
      <Boton
        type="submit"
        variante="primario"
        disabled={!hidratado}
        className="self-start disabled:cursor-wait disabled:opacity-60"
      >
        {t('enviarGuia')}
      </Boton>
      {validado && <AvisoPiloto ref={aviso} />}
    </form>
  );
}
