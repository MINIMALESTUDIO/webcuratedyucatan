import { describe, expect, it } from 'vitest';
import { erroresPorCampo, esquemaSeleccion, esquemaSolicitud } from '@/lib/validacion/formularios';

const solicitud = {
  tipoEvento: 'boda',
  invitados: '100-200',
  buscando: ['venue', 'fotografia'],
  nombre: 'Ana López',
  empresa: 'Estudio Ejemplo',
  pais: 'Canada',
  correo: 'ana@example.com',
  telefono: '',
  fechaAproximada: 'March 2027',
  mensaje: '',
  consentimientoPrivacidad: true,
  origen: 'general',
  idioma: 'en',
};

function errores(esquema: typeof esquemaSolicitud | typeof esquemaSeleccion, datos: object) {
  const resultado = esquema.safeParse(datos);
  return resultado.success ? {} : erroresPorCampo(resultado.error);
}

describe('esquemaSolicitud (Plan Your Event)', () => {
  it('acepta una solicitud válida', () => {
    expect(esquemaSolicitud.safeParse(solicitud).success).toBe(true);
  });

  it('solo el teléfono y el mensaje son opcionales', () => {
    expect(
      errores(esquemaSolicitud, { ...solicitud, telefono: undefined, mensaje: undefined }),
    ).toEqual({});
    expect(errores(esquemaSolicitud, { ...solicitud, empresa: '' })).toEqual({
      empresa: 'requerido',
    });
    expect(errores(esquemaSolicitud, { ...solicitud, fechaAproximada: ' ' })).toEqual({
      fechaAproximada: 'requerido',
    });
  });

  it('las opciones son las del documento', () => {
    expect(errores(esquemaSolicitud, { ...solicitud, tipoEvento: 'cumpleaños' })).toEqual({
      tipoEvento: 'requerido',
    });
    expect(errores(esquemaSolicitud, { ...solicitud, invitados: undefined })).toEqual({
      invitados: 'requerido',
    });
    expect(errores(esquemaSolicitud, { ...solicitud, buscando: [] })).toEqual({
      buscando: 'eligeUno',
    });
  });

  it('valida correo, largo y consentimiento', () => {
    expect(
      errores(esquemaSolicitud, {
        ...solicitud,
        correo: 'ana@',
        nombre: 'A',
        mensaje: 'x'.repeat(2001),
        consentimientoPrivacidad: false,
      }),
    ).toEqual({
      correo: 'correoInvalido',
      nombre: 'muyCorto',
      mensaje: 'muyLargo',
      consentimientoPrivacidad: 'consentimiento',
    });
  });
});

describe('esquemaSeleccion (Find Your Yucatán)', () => {
  const seleccion = {
    nombre: 'Ana López',
    empresa: 'Estudio Ejemplo',
    correo: 'ana@example.com',
    pais: 'Canada',
    consentimientoPrivacidad: true,
    resultado: 'timeless',
    venues: ['hacienda-xtepen'],
    idioma: 'es',
  };

  it('acepta Name, Company, Email y Country con el resultado', () => {
    expect(esquemaSeleccion.safeParse(seleccion).success).toBe(true);
  });

  it('exige los cuatro campos de contacto', () => {
    expect(errores(esquemaSeleccion, { ...seleccion, pais: '', empresa: '' })).toEqual({
      pais: 'requerido',
      empresa: 'requerido',
    });
  });
});
