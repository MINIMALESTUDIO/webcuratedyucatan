import 'server-only';
import { stegaClean } from 'next-sanity';
import { getTranslations } from 'next-intl/server';
import { z } from 'zod';
import { getPathname } from '@/i18n/navigation';
import type { Idioma, RutaInterna } from '@/i18n/routing';
import {
  obtenerColecciones,
  obtenerProveedor,
  obtenerVenue,
  obtenerVenuesTarjeta,
} from '@/lib/contenido';
import {
  MAX_PRIORIDADES,
  OPCIONES_ENTORNO,
  OPCIONES_HOSPEDAJE,
  PRIORIDADES_ENCUENTRA,
  RANGOS_INVITADOS_ENCUENTRA,
  TIPOS_EVENTO_ENCUENTRA,
  recomendarVenues,
} from '@/lib/descubrimiento/encuentra';
import { configuracionCorreo, enviarCorreo } from '@/lib/correo/resend';
import {
  correoConfirmacionSolicitud,
  correoEquipo,
  correoSeleccion,
  type VenueRecomendado,
} from '@/lib/correo/plantillas';
import { localizar } from '@/lib/i18n/localizar';
import { urlSitio } from '@/lib/sitio';
import type { DatosSeleccion, DatosSolicitud } from '@/lib/validacion/formularios';
import { claveEnvio, marcarEnviado, yaEnviado } from './proteccion';

/*
 * Servicio de leads (D-055). Por cada formulario válido:
 * 1. Correo al visitante: confirmación de la solicitud, o su selección de Find Your Yucatán con
 *    los venues recomendados y el video de cada uno en El Lugar de Tu Historia.
 * 2. Notificación al equipo (CORREO_EQUIPO) con todos los datos: es el registro interno mientras
 *    no exista la base MariaDB. Responder ese correo contesta directo al visitante.
 * Los venues recomendados se recalculan aquí con las mismas reglas que la página (D-053): el
 * servidor no confía en la lista que manda el navegador.
 */

export type ResultadoLead =
  | { ok: true; envio: 'enviado' | 'duplicado' }
  | { ok: false; error: 'no-configurado' | 'envio-fallido' | 'datos-invalidos' };

const esquemaRespuestas = z.object({
  evento: z.enum(TIPOS_EVENTO_ENCUENTRA),
  atmosfera: z.string().min(1).max(40),
  hospedaje: z.enum(OPCIONES_HOSPEDAJE),
  entorno: z.enum(OPCIONES_ENTORNO),
  prioridades: z.array(z.enum(PRIORIDADES_ENCUENTRA)).max(MAX_PRIORIDADES),
  invitados: z.enum(RANGOS_INVITADOS_ENCUENTRA.map((r) => r.id) as [string, ...string[]]),
});

const limpiar = (texto: string) => stegaClean(texto).trim();

function urlDe(ruta: Parameters<typeof getPathname>[0]['href'], idioma: Idioma): string {
  return `${urlSitio()}${getPathname({ href: ruta, locale: idioma })}`;
}

const fechaUtc = () => new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';

/** Envía el correo del visitante y el del equipo; el del visitante es el que decide el éxito. */
async function enviarPar(
  clave: string,
  visitante: Parameters<typeof enviarCorreo>[0],
  equipo: Omit<Parameters<typeof enviarCorreo>[0], 'para'>,
): Promise<ResultadoLead> {
  const configuracion = configuracionCorreo();
  if (!configuracion) return { ok: false, error: 'no-configurado' };
  if (yaEnviado(clave)) return { ok: true, envio: 'duplicado' };

  const [alVisitante, alEquipo] = await Promise.all([
    enviarCorreo(visitante),
    enviarCorreo({ ...equipo, para: configuracion.equipo }),
  ]);
  if (!alEquipo.ok) console.error(`[leads] Falló la notificación al equipo (${clave})`);
  if (!alVisitante.ok) {
    console.error(`[leads] Falló el correo al visitante (${clave})`);
    return { ok: false, error: 'envio-fallido' };
  }
  marcarEnviado(clave);
  console.info(`[leads] Enviado ${clave}`);
  return { ok: true, envio: 'enviado' };
}

// --- Find Your Yucatán ------------------------------------------------------------------

export async function procesarSeleccion(datos: DatosSeleccion): Promise<ResultadoLead> {
  const respuestas = esquemaRespuestas.safeParse(datos.respuestas);
  if (!respuestas.success) return { ok: false, error: 'datos-invalidos' };
  const r = respuestas.data as Parameters<typeof recomendarVenues>[1];

  const [colecciones, tarjetas] = await Promise.all([obtenerColecciones(), obtenerVenuesTarjeta()]);
  const coleccion = colecciones.find((c) => stegaClean(c.slug) === r.atmosfera);
  if (!coleccion) return { ok: false, error: 'datos-invalidos' };

  const recomendados = recomendarVenues(tarjetas, r);
  const fichas = await Promise.all(recomendados.map((v) => obtenerVenue(v.slug)));
  const venues: VenueRecomendado[] = recomendados.map((tarjeta, i) => {
    const ficha = fichas[i];
    const youtubeId = ficha?.pelicula?.youtubeId ? stegaClean(ficha.pelicula.youtubeId) : null;
    return {
      nombre: limpiar(tarjeta.nombre),
      resumen: limpiar(localizar(ficha?.resumen, 'en')),
      enlace: youtubeId
        ? `https://www.youtube.com/watch?v=${youtubeId}`
        : urlDe({ pathname: '/venues/[slug]', params: { slug: tarjeta.slug } }, 'en'),
      tieneVideo: Boolean(youtubeId),
    };
  });

  const resultado = limpiar(localizar(coleccion.resultado, 'en'));
  const correo = datos.correo.trim().toLowerCase();
  const clave = claveEnvio('seleccion', {
    correo,
    nombre: datos.nombre.trim(),
    respuestas: r,
  });

  const visitante = correoSeleccion({ resultado, venues, urlSitio: urlDe('/', 'en') });

  const t = await getTranslations({ locale: 'es', namespace: 'Encuentra.preguntas' });
  const opcion = (pregunta: string, valor: string) => {
    const clave = `${pregunta}.opciones.${valor}`;
    return t.has(clave as never) ? t(clave as never) : valor;
  };
  const titulo = (pregunta: string) => t(`${pregunta}.titulo` as never);
  const equipo = correoEquipo({
    asunto: `Find Your Yucatán · ${resultado} · ${datos.nombre.trim()}`,
    secciones: [
      {
        titulo: 'Visitante',
        filas: [
          ['Nombre', datos.nombre.trim()],
          ['Empresa', datos.empresa.trim()],
          ['Correo', correo],
          ['País', datos.pais.trim()],
          ['Idioma del sitio', datos.idioma],
          ['Aviso de privacidad', 'Aceptado'],
          ['Fecha', fechaUtc()],
        ],
      },
      {
        titulo: 'Respuestas',
        filas: [
          [titulo('evento'), opcion('evento', r.evento)],
          [titulo('atmosfera'), limpiar(localizar(coleccion.nombre, 'es'))],
          [titulo('hospedaje'), opcion('hospedaje', r.hospedaje)],
          [titulo('entorno'), opcion('entorno', r.entorno)],
          [
            titulo('prioridades'),
            r.prioridades.map((p) => opcion('prioridades', p)).join(', ') || '—',
          ],
          [titulo('invitados'), opcion('invitados', r.invitados)],
        ],
      },
      {
        titulo: `Resultado: ${resultado}`,
        filas:
          venues.length > 0
            ? venues.map((v, i) => [`${String(i + 1).padStart(2, '0')} — ${v.nombre}`, v.enlace])
            : [['Venues', 'Ninguno cumple los requisitos']],
      },
    ],
  });

  return enviarPar(
    clave,
    {
      para: [correo],
      ...visitante,
      responderA: configuracionCorreo()?.equipo[0],
      claveIdempotencia: `${clave}-visitante`,
    },
    { ...equipo, responderA: correo, claveIdempotencia: `${clave}-equipo` },
  );
}

// --- Solicitud: Plan Your Event, venue, partner o Design & Production --------------------

/** Nombre y página de lo que originó la solicitud (venue o partner), si existe. */
async function origenDe(
  datos: DatosSolicitud,
): Promise<{ nombre: string; ruta: { en: string; es: string } } | null> {
  const slug = datos.origenSlug;
  if (datos.origen === 'diseno') {
    return {
      nombre: 'Design & Production',
      ruta: { en: urlDe('/diseno-y-produccion', 'en'), es: urlDe('/diseno-y-produccion', 'es') },
    };
  }
  if (!slug) return null;
  if (datos.origen === 'venue') {
    const venue = await obtenerVenue(slug);
    if (!venue) return null;
    const href = { pathname: '/venues/[slug]' as const, params: { slug } };
    return {
      nombre: limpiar(venue.nombre),
      ruta: { en: urlDe(href, 'en'), es: urlDe(href, 'es') },
    };
  }
  if (datos.origen === 'proveedor') {
    for (const tipo of ['catering', 'fotografia'] as const) {
      const proveedor = await obtenerProveedor(tipo, slug);
      if (!proveedor) continue;
      const pathname: RutaInterna = tipo === 'catering' ? '/catering/[slug]' : '/fotografia/[slug]';
      const href = { pathname, params: { slug } } as Parameters<typeof getPathname>[0]['href'];
      return {
        nombre: limpiar(proveedor.nombre),
        ruta: { en: urlDe(href, 'en'), es: urlDe(href, 'es') },
      };
    }
  }
  return null;
}

export async function procesarSolicitud(datos: DatosSolicitud): Promise<ResultadoLead> {
  const idioma = datos.idioma;
  const origen = await origenDe(datos);
  const correo = datos.correo.trim().toLowerCase();
  const clave = claveEnvio('solicitud', {
    correo,
    tipoEvento: datos.tipoEvento,
    invitados: datos.invitados,
    buscando: [...datos.buscando].sort(),
    fecha: datos.fechaAproximada.trim(),
    mensaje: datos.mensaje?.trim() ?? '',
    origen: datos.origen,
    origenSlug: datos.origenSlug ?? '',
  });

  /** Resumen localizado de la solicitud, para el visitante (su idioma) o el equipo (es). */
  async function filas(locale: Idioma): Promise<[string, string][]> {
    const t = await getTranslations({ locale, namespace: 'Formularios' });
    const lista: [string, string][] = [
      [t('preguntas.tipoEvento'), t(`opciones.tipoEvento.${datos.tipoEvento}`)],
      [t('preguntas.invitados'), t(`opciones.invitados.${datos.invitados}`)],
      [t('preguntas.buscando'), datos.buscando.map((b) => t(`opciones.buscando.${b}`)).join(', ')],
      [t('fechaAproximada'), datos.fechaAproximada.trim()],
    ];
    if (origen) lista.unshift([locale === 'es' ? 'Sobre' : 'About', origen.nombre]);
    if (datos.mensaje?.trim()) lista.push([t('mensaje'), datos.mensaje.trim()]);
    return lista;
  }

  const [filasVisitante, filasEquipo] = await Promise.all([filas(idioma), filas('es')]);
  const visitante = correoConfirmacionSolicitud({
    idioma,
    nombre: datos.nombre.trim(),
    filas: filasVisitante,
    urlSitio: urlDe('/', idioma),
  });

  const etiquetasOrigen = {
    general: 'Plan Your Event',
    venue: 'Ficha de venue',
    proveedor: 'Ficha de partner',
    diseno: 'Design & Production',
  } as const;
  const equipo = correoEquipo({
    asunto: `Nueva solicitud · ${origen?.nombre ?? etiquetasOrigen[datos.origen]} · ${datos.nombre.trim()}`,
    secciones: [
      {
        titulo: 'Contacto',
        filas: [
          ['Nombre', datos.nombre.trim()],
          ['Empresa', datos.empresa.trim()],
          ['Correo', correo],
          ['Teléfono', datos.telefono?.trim() || '—'],
          ['País', datos.pais.trim()],
          ['Idioma del sitio', idioma],
          ['Aviso de privacidad', 'Aceptado'],
          ['Fecha', fechaUtc()],
        ],
      },
      { titulo: 'Solicitud', filas: filasEquipo },
      {
        titulo: 'Origen',
        filas: [
          ['Formulario', etiquetasOrigen[datos.origen]],
          ...(origen ? ([['Página', origen.ruta.es]] as [string, string][]) : []),
        ],
      },
    ],
  });

  return enviarPar(
    clave,
    {
      para: [correo],
      ...visitante,
      responderA: configuracionCorreo()?.equipo[0],
      claveIdempotencia: `${clave}-visitante`,
    },
    { ...equipo, responderA: correo, claveIdempotencia: `${clave}-equipo` },
  );
}
