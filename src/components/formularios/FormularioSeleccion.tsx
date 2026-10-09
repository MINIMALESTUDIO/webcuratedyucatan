'use client';

// Cliente: "Want to save your Curated selection?" de Find Your Yucatán (sección 14).
import { useId } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import type { RespuestasEncuentra } from '@/lib/descubrimiento/encuentra';
import { Link } from '@/i18n/navigation';
import { Boton } from '@/components/ui/Boton';
import { AvisoPiloto } from './AvisoPiloto';
import { CampoCasilla, CampoTexto } from './Campos';
import { textoDe, useFormularioPiloto } from './useFormularioPiloto';

// El esquema (y zod) se descarga solo al enviar (D-031).
const cargarEsquema = () =>
  import('@/lib/validacion/formularios').then((modulo) => modulo.esquemaSeleccion);

/** Name, Company, Email y Country, con el resultado, las respuestas y los venues adjuntos. */
export function FormularioSeleccion({
  resultado,
  venues,
  respuestas,
}: {
  resultado: string;
  venues: string[];
  respuestas?: RespuestasEncuentra;
}) {
  const t = useTranslations('Formularios');
  const idioma = useLocale();
  const base = useId();
  const id = (campo: string) => `${base}-${campo}`;

  const { errores, validado, aviso, alEnviar, hidratado } = useFormularioPiloto(
    cargarEsquema,
    (datos) => ({
      nombre: textoDe(datos, 'nombre'),
      empresa: textoDe(datos, 'empresa'),
      correo: textoDe(datos, 'correo'),
      pais: textoDe(datos, 'pais'),
      consentimientoPrivacidad: datos.get('consentimientoPrivacidad') === 'on',
      resultado,
      venues,
      respuestas,
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
          id={id('empresa')}
          name="empresa"
          etiqueta={t('empresa')}
          autoComplete="organization"
          error={error('empresa')}
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
          id={id('pais')}
          name="pais"
          etiqueta={t('pais')}
          autoComplete="country-name"
          error={error('pais')}
        />
      </div>
      <div className="flex flex-col gap-1">
        <CampoCasilla
          id={id('consentimientoPrivacidad')}
          name="consentimientoPrivacidad"
          etiqueta={t('consentimientoSeleccion')}
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
        {t('guardarSeleccion')}
      </Boton>
      {validado && <AvisoPiloto ref={aviso} />}
    </form>
  );
}
