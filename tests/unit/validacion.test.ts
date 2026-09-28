import { describe, expect, it } from 'vitest';
import {
  erroresPorCampo,
  esquemaDisponibilidad,
  esquemaGuia,
  hoyEnMerida,
} from '@/lib/validacion/formularios';

const valido = {
  nombre: 'Ana López',
  correo: 'ana@example.com',
  telefono: '',
  pais: 'Canada',
  fechaBoda: '2099-05-20',
  fechaFlexible: false,
  invitadosAprox: '120',
  mensaje: '',
  consentimientoPrivacidad: true,
  venueSlug: 'demo-hacienda-ejemplo-norte',
  idioma: 'en',
};

function errores(datos: Record<string, unknown>) {
  const resultado = esquemaDisponibilidad.safeParse(datos);
  return resultado.success ? {} : erroresPorCampo(resultado.error);
}

describe('esquemaDisponibilidad', () => {
  it('acepta una solicitud válida y convierte invitados a número', () => {
    const resultado = esquemaDisponibilidad.safeParse(valido);
    expect(resultado.success).toBe(true);
    expect(resultado.data?.invitadosAprox).toBe(120);
  });

  it('marca como requeridos los campos vacíos', () => {
    expect(
      errores({ ...valido, nombre: ' ', correo: '', pais: '', invitadosAprox: '' }),
    ).toMatchObject({
      nombre: 'requerido',
      correo: 'requerido',
      pais: 'requerido',
      invitadosAprox: 'requerido',
    });
  });

  it('valida el formato del correo y el rango de invitados', () => {
    expect(errores({ ...valido, correo: 'ana@', invitadosAprox: '0' })).toEqual({
      correo: 'correoInvalido',
      invitadosAprox: 'numeroInvalido',
    });
    expect(errores({ ...valido, invitadosAprox: '12.5' })).toEqual({
      invitadosAprox: 'numeroInvalido',
    });
  });

  it('exige una fecha futura o marcarla como flexible', () => {
    expect(errores({ ...valido, fechaBoda: '' })).toEqual({ fechaBoda: 'fechaOFlexible' });
    expect(errores({ ...valido, fechaBoda: '', fechaFlexible: true })).toEqual({});
    expect(errores({ ...valido, fechaBoda: '2020-01-01' })).toEqual({ fechaBoda: 'fechaPasada' });
    expect(errores({ ...valido, fechaBoda: hoyEnMerida() })).toEqual({ fechaBoda: 'fechaPasada' });
    expect(errores({ ...valido, fechaBoda: '2099-02-30' })).toEqual({ fechaBoda: 'fechaInvalida' });
  });

  it('exige el consentimiento de privacidad', () => {
    expect(errores({ ...valido, consentimientoPrivacidad: false })).toEqual({
      consentimientoPrivacidad: 'consentimiento',
    });
  });
});

describe('esquemaGuia', () => {
  it('acepta datos válidos y rechaza sin consentimiento', () => {
    const datos = {
      nombre: 'Ana',
      correo: 'ana@example.com',
      consentimientoPrivacidad: true,
      aceptaNovedades: false,
      idioma: 'es',
    };
    expect(esquemaGuia.safeParse(datos).success).toBe(true);
    const sinConsentimiento = esquemaGuia.safeParse({ ...datos, consentimientoPrivacidad: false });
    expect(sinConsentimiento.success).toBe(false);
  });
});

describe('hoyEnMerida', () => {
  it('usa la zona horaria de Mérida (UTC-6)', () => {
    // 2026-01-01 03:00 UTC todavía es 31 de diciembre en Mérida.
    expect(hoyEnMerida(new Date('2026-01-01T03:00:00Z'))).toBe('2025-12-31');
  });
});
