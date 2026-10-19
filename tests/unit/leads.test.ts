import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import en from '@/i18n/mensajes/en.json';
import es from '@/i18n/mensajes/es.json';
import { correoConfirmacionSolicitud, correoSeleccion, escaparHtml } from '@/lib/correo/plantillas';
import {
  LIMITE_ENVIOS,
  LIMITE_GLOBAL,
  LIMITE_POR_CORREO,
  VENTANA_CORREO_MS,
  VENTANA_MS,
  claveEnvio,
  marcarEnviado,
  registrarEnvio,
  registrarIntento,
  reiniciarProteccion,
  yaEnviado,
} from '@/lib/leads/proteccion';

/*
 * Leads y correo (D-055). Resend se simula sustituyendo fetch: ninguna prueba envía correo real.
 * next-intl/server se sustituye por un traductor que lee los mensajes del repositorio.
 */

vi.mock('next-intl/server', () => {
  const mensajes = { en, es } as Record<string, Record<string, unknown>>;
  return {
    getTranslations: async ({ locale, namespace }: { locale: string; namespace: string }) => {
      const buscar = (clave: string) =>
        `${namespace}.${clave}`
          .split('.')
          .reduce<unknown>(
            (nodo, parte) => (nodo as Record<string, unknown> | undefined)?.[parte],
            mensajes[locale],
          );
      const t = (clave: string) => {
        const valor = buscar(clave);
        return typeof valor === 'string' ? valor : clave;
      };
      t.has = (clave: string) => typeof buscar(clave) === 'string';
      return t;
    },
  };
});

describe('plantillas de correo', () => {
  it('escapa el HTML de los datos del visitante', () => {
    expect(escaparHtml('<b onclick="x">Ana & \'Luis\'</b>')).toBe(
      '&lt;b onclick=&quot;x&quot;&gt;Ana &amp; &#39;Luis&#39;&lt;/b&gt;',
    );
  });

  it('Find Your Yucatán sigue el copy del Drive, con el video de cada venue', () => {
    const correo = correoSeleccion({
      resultado: 'Timeless',
      urlSitio: 'https://curatedyucatan.com/',
      venues: [
        {
          nombre: 'Hacienda Sac Chich',
          resumen: 'Resumen breve.',
          enlace: 'https://www.youtube.com/watch?v=e8awa5XKNN4',
          tieneVideo: true,
        },
        {
          nombre: 'Casona 333',
          resumen: 'Otro resumen.',
          enlace: 'https://curatedyucatan.com/venues/casona-333',
          tieneVideo: false,
        },
      ],
    });
    expect(correo.asunto).toBe('Your Yucatán, Curated.');
    for (const formato of [correo.texto, correo.html]) {
      expect(formato).toContain('Thank you for exploring Yucatán with us.');
      expect(formato).toContain('YOUR YUCATÁN IS TIMELESS');
      expect(formato).toContain('01 — Hacienda Sac Chich');
      expect(formato).toContain('02 — Casona 333');
      expect(formato).toContain('WATCH THE VENUE VIDEO →');
      expect(formato).toContain('https://www.youtube.com/watch?v=e8awa5XKNN4');
      expect(formato).toContain('DISCOVER THE VENUE →');
      expect(formato).toContain('CONTINUE EXPLORING YUCATÁN →');
      expect(formato).toContain('Yucatán, curated.');
    }
  });

  it('la confirmación de solicitud sale en el idioma del visitante', () => {
    const datos = { nombre: 'Ana', filas: [['Fecha', 'Marzo 2027']] as [string, string][] };
    const espanol = correoConfirmacionSolicitud({
      ...datos,
      idioma: 'es',
      urlSitio: 'https://x.mx/es',
    });
    expect(espanol.asunto).toContain('Recibimos tu solicitud');
    expect(espanol.html).toContain('lang="es"');
    expect(espanol.texto).toContain('Fecha: Marzo 2027');
    const ingles = correoConfirmacionSolicitud({
      ...datos,
      idioma: 'en',
      urlSitio: 'https://x.mx',
    });
    expect(ingles.asunto).toContain('We received your request');
  });
});

describe('protección de /api/leads', () => {
  beforeEach(() => reiniciarProteccion());

  it(`permite ${LIMITE_ENVIOS} envíos por IP y ventana`, () => {
    const inicio = 1_000_000;
    for (let i = 0; i < LIMITE_ENVIOS; i++) expect(registrarIntento('ip', inicio + i)).toBe(true);
    expect(registrarIntento('ip', inicio + 10)).toBe(false);
    expect(registrarIntento('otra-ip', inicio + 10)).toBe(true);
    expect(registrarIntento('ip', inicio + VENTANA_MS)).toBe(true);
  });

  it(`limita a ${LIMITE_POR_CORREO} correos por destinatario cada 24 horas (D-059)`, () => {
    for (let i = 0; i < LIMITE_POR_CORREO; i++) {
      expect(registrarEnvio(i % 2 ? 'Victima@Example.com' : 'victima@example.com', i)).toBe(true);
    }
    expect(registrarEnvio('victima@example.com', 100)).toBe(false);
    expect(registrarEnvio('otra@example.com', 100)).toBe(true);
    expect(registrarEnvio('victima@example.com', VENTANA_CORREO_MS)).toBe(true);
  });

  it(`tope global de ${LIMITE_GLOBAL} envíos por hora (D-059)`, () => {
    for (let i = 0; i < LIMITE_GLOBAL; i++)
      expect(registrarEnvio(`p${i}@example.com`, i)).toBe(true);
    expect(registrarEnvio('nueva@example.com', 100)).toBe(false);
  });

  it('la clave de envío es estable y marca duplicados por 24 horas', () => {
    const clave = claveEnvio('seleccion', { correo: 'a@b.com', respuestas: { x: 1 } });
    expect(clave).toBe(claveEnvio('seleccion', { correo: 'a@b.com', respuestas: { x: 1 } }));
    expect(clave).not.toBe(claveEnvio('seleccion', { correo: 'c@b.com', respuestas: { x: 1 } }));
    expect(yaEnviado(clave, 0)).toBe(false);
    marcarEnviado(clave, 0);
    expect(yaEnviado(clave, 1000)).toBe(true);
    expect(yaEnviado(clave, 24 * 60 * 60 * 1000)).toBe(false);
  });
});

describe('servicio de leads (Resend simulado, datos DEMO)', () => {
  const llamadas: { cuerpo: Record<string, unknown>; clave: string | null }[] = [];

  beforeEach(() => {
    reiniciarProteccion();
    llamadas.length = 0;
    vi.stubEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', '');
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://curatedyucatan.com');
    vi.stubEnv('RESEND_API_KEY', 're_prueba');
    vi.stubEnv('CORREO_REMITENTE', 'Curated Yucatán <hola@curatedyucatan.com>');
    vi.stubEnv('CORREO_EQUIPO', 'equipo@curatedyucatan.com');
    vi.stubGlobal(
      'fetch',
      vi.fn(async (_url: string, opciones: RequestInit) => {
        const encabezados = new Headers(opciones.headers);
        llamadas.push({
          cuerpo: JSON.parse(String(opciones.body)),
          clave: encabezados.get('Idempotency-Key'),
        });
        return new Response(JSON.stringify({ id: `correo-${llamadas.length}` }), { status: 200 });
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  const seleccion = {
    nombre: 'Ana López',
    empresa: 'Estudio Ejemplo',
    correo: 'Ana@Example.com',
    pais: 'Canada',
    consentimientoPrivacidad: true as const,
    resultado: 'timeless',
    // El servidor ignora esta lista y recalcula los venues.
    venues: ['inventado'],
    respuestas: {
      evento: 'boda',
      atmosfera: 'timeless',
      hospedaje: 'no-necesario',
      entorno: 'indistinto',
      prioridades: ['arquitectura-historia'],
      invitados: '100-200',
    },
    idioma: 'en' as const,
  };

  it('envía la selección al visitante y la notificación al equipo, sin duplicar', async () => {
    const { procesarSeleccion } = await import('@/lib/leads/servicio');
    expect(await procesarSeleccion(seleccion)).toEqual({ ok: true, envio: 'enviado' });
    expect(llamadas).toHaveLength(2);

    const alVisitante = llamadas.find((l) => (l.cuerpo.to as string[])[0] === 'ana@example.com');
    const alEquipo = llamadas.find(
      (l) => (l.cuerpo.to as string[])[0] === 'equipo@curatedyucatan.com',
    );
    expect(alVisitante?.cuerpo.subject).toBe('Your Yucatán, Curated.');
    expect(alVisitante?.cuerpo.text).toContain('YOUR YUCATÁN IS TIMELESS');
    expect(alVisitante?.cuerpo.text).toMatch(
      /01 — .+\n.+\n(WATCH THE VENUE VIDEO|DISCOVER THE VENUE) →/,
    );
    expect(alVisitante?.cuerpo.text).not.toContain('inventado');
    expect(alVisitante?.cuerpo.reply_to).toBe('equipo@curatedyucatan.com');
    expect(alEquipo?.cuerpo.reply_to).toBe('ana@example.com');
    expect(alEquipo?.cuerpo.text).toContain('Arquitectura e historia');
    expect(alVisitante?.clave).toMatch(/^seleccion-[0-9a-f]{40}-visitante$/);

    // El mismo formulario otra vez: no se vuelve a llamar a Resend.
    expect(await procesarSeleccion(seleccion)).toEqual({ ok: true, envio: 'duplicado' });
    expect(llamadas).toHaveLength(2);
  });

  it('rechaza respuestas fuera de las opciones del quiz', async () => {
    const { procesarSeleccion } = await import('@/lib/leads/servicio');
    const invalida = { ...seleccion, respuestas: { ...seleccion.respuestas, atmosfera: 'otra' } };
    expect(await procesarSeleccion(invalida)).toEqual({ ok: false, error: 'datos-invalidos' });
    expect(llamadas).toHaveLength(0);
  });

  it('sin RESEND_API_KEY responde no-configurado y no llama a Resend', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    const { procesarSolicitud } = await import('@/lib/leads/servicio');
    const resultado = await procesarSolicitud({
      tipoEvento: 'boda',
      invitados: '100-200',
      buscando: ['venue'],
      nombre: 'Ana',
      empresa: 'Estudio',
      pais: 'Canada',
      correo: 'ana@example.com',
      fechaAproximada: 'March 2027',
      consentimientoPrivacidad: true,
      origen: 'general',
      idioma: 'es',
    });
    expect(resultado).toEqual({ ok: false, error: 'no-configurado' });
    expect(llamadas).toHaveLength(0);
  });

  it('la solicitud confirma en el idioma del visitante y avisa al equipo en español', async () => {
    const { procesarSolicitud } = await import('@/lib/leads/servicio');
    const resultado = await procesarSolicitud({
      tipoEvento: 'boda',
      invitados: '100-200',
      buscando: ['venue', 'fotografia'],
      nombre: 'Ana',
      empresa: 'Estudio',
      pais: 'Canada',
      correo: 'ana@example.com',
      fechaAproximada: 'March 2027',
      mensaje: 'Queremos una cena al aire libre.',
      consentimientoPrivacidad: true,
      origen: 'general',
      idioma: 'es',
    });
    expect(resultado).toEqual({ ok: true, envio: 'enviado' });
    const alVisitante = llamadas.find((l) => (l.cuerpo.to as string[])[0] === 'ana@example.com');
    const alEquipo = llamadas.find((l) => (l.cuerpo.to as string[])[0] !== 'ana@example.com');
    expect(alVisitante?.cuerpo.subject).toContain('Recibimos tu solicitud');
    expect(alVisitante?.cuerpo.text).toContain('Venue, Fotografía');
    expect(alEquipo?.cuerpo.subject).toBe('Nueva solicitud · Plan Your Event · Ana');
    // El mensaje libre solo llega al equipo (D-059).
    expect(alVisitante?.cuerpo.text).not.toContain('cena al aire libre');
    expect(alEquipo?.cuerpo.text).toContain('cena al aire libre');
  });
});
