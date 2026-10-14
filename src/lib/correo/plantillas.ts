/*
 * Plantillas de correo (D-055): HTML sencillo con tablas, compatible con clientes de correo, y
 * versión de texto plano. Cada plantilla recibe datos ya resueltos (textos localizados, URLs
 * absolutas) para poder probarla sin servidor. Todo valor que viene del visitante se escapa.
 *
 * - Find Your Yucatán: copy del documento "Correo de respuesta Find your yucatan" del Drive,
 *   palabra por palabra. El Drive solo trae la versión en inglés.
 * - Solicitud (Plan Your Event, venue o partner): el Drive no trae copy; el texto es derivado
 *   (D-055) y está en los dos idiomas.
 * - Notificaciones al equipo: internas, en español, con todos los datos del lead.
 */

const COLOR = {
  papel: '#ffffff',
  papelCalido: '#f7f5f1',
  linea: '#d6cdc0',
  tinta: '#111111',
  tintaSuave: '#5f5850',
};
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";

export interface CorreoGenerado {
  asunto: string;
  html: string;
  texto: string;
}

export function escaparHtml(valor: string): string {
  return valor
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function marca(): string {
  return `<p style="margin:0;font-family:${SERIF};font-size:13px;letter-spacing:0.32em;text-transform:uppercase;color:${COLOR.tinta};">Curated Yucatán</p>`;
}

function enlaceAccion(texto: string, url: string): string {
  return `<a href="${escaparHtml(url)}" style="font-family:${SANS};font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${COLOR.tinta};text-decoration:none;border-bottom:1px solid ${COLOR.tinta};padding-bottom:3px;">${escaparHtml(texto)}</a>`;
}

function parrafo(texto: string, estilo = ''): string {
  return `<p style="margin:0 0 16px;font-family:${SANS};font-size:15px;line-height:1.6;color:${COLOR.tinta};${estilo}">${escaparHtml(texto)}</p>`;
}

/** Marco común: columna de 600 px centrada, con la marca arriba y abajo. */
function documento(idioma: string, titulo: string, cuerpo: string): string {
  return `<!doctype html>
<html lang="${idioma}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escaparHtml(titulo)}</title>
</head>
<body style="margin:0;padding:0;background:${COLOR.papelCalido};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLOR.papelCalido};">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${COLOR.papel};">
<tr><td align="center" style="padding:40px 32px 24px;border-bottom:1px solid ${COLOR.linea};">${marca()}</td></tr>
<tr><td style="padding:40px 32px;">${cuerpo}</td></tr>
<tr><td align="center" style="padding:24px 32px 40px;border-top:1px solid ${COLOR.linea};">${marca()}</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

// --- Find Your Yucatán ------------------------------------------------------------------

export interface VenueRecomendado {
  nombre: string;
  /** Descripción breve (resumen de la ficha). */
  resumen: string;
  /** Video de El Lugar de Tu Historia o, si el venue no tiene, su ficha en el sitio. */
  enlace: string;
  tieneVideo: boolean;
}

export interface DatosCorreoSeleccion {
  /** Palabra del resultado: Timeless, Organic o Contemporary. */
  resultado: string;
  venues: VenueRecomendado[];
  urlSitio: string;
}

const COPY_SELECCION = {
  asunto: 'Your Yucatán, Curated.',
  titular: 'Your Yucatán, Curated.',
  gracias: 'Thank you for exploring Yucatán with us.',
  intro:
    "Based on your answers, we've put together a selection of venues that reflect the atmosphere and experience you're looking for.",
  resultado: (resultado: string) => `YOUR YUCATÁN IS ${resultado.toUpperCase()}`,
  lugares: 'Discover the places selected for you:',
  video: 'WATCH THE VENUE VIDEO →',
  // Derivado (D-055): el copy no prevé venues sin video; se enlaza su ficha.
  ficha: 'DISCOVER THE VENUE →',
  cierre:
    'Every venue tells a different story. We invite you to discover the architecture, landscapes and atmosphere that make each place unique.',
  explorar: 'CONTINUE EXPLORING YUCATÁN →',
  firma: 'Yucatán, curated.',
};

const numero = (indice: number) => String(indice + 1).padStart(2, '0');

export function correoSeleccion(datos: DatosCorreoSeleccion): CorreoGenerado {
  const c = COPY_SELECCION;

  const venuesHtml = datos.venues
    .map(
      (venue, i) => `
<tr><td style="padding:24px 0;border-top:1px solid ${COLOR.linea};">
<p style="margin:0 0 8px;font-family:${SERIF};font-size:20px;line-height:1.3;color:${COLOR.tinta};">${numero(i)} — ${escaparHtml(venue.nombre)}</p>
${parrafo(venue.resumen, `color:${COLOR.tintaSuave};`)}
${enlaceAccion(venue.tieneVideo ? c.video : c.ficha, venue.enlace)}
</td></tr>`,
    )
    .join('');

  const cuerpo = `
<h1 style="margin:0 0 24px;font-family:${SERIF};font-size:30px;font-weight:normal;line-height:1.2;text-align:center;color:${COLOR.tinta};">${escaparHtml(c.titular)}</h1>
${parrafo(c.gracias)}
${parrafo(c.intro)}
<p style="margin:32px 0 8px;font-family:${SERIF};font-size:16px;letter-spacing:0.18em;text-align:center;color:${COLOR.tinta};">${escaparHtml(c.resultado(datos.resultado))}</p>
${
  datos.venues.length > 0
    ? `${parrafo(c.lugares, 'margin-top:32px;')}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${venuesHtml}</table>`
    : ''
}
<div style="height:16px;"></div>
${parrafo(c.cierre)}
<p style="margin:24px 0 32px;text-align:center;">${enlaceAccion(c.explorar, datos.urlSitio)}</p>
<p style="margin:0;font-family:${SERIF};font-size:16px;font-style:italic;text-align:center;color:${COLOR.tinta};">${escaparHtml(c.firma)}</p>`;

  const venuesTexto = datos.venues
    .map(
      (venue, i) =>
        `${numero(i)} — ${venue.nombre}\n${venue.resumen}\n${venue.tieneVideo ? c.video : c.ficha}\n${venue.enlace}`,
    )
    .join('\n\n');

  const texto = [
    'CURATED YUCATÁN',
    c.titular,
    c.gracias,
    c.intro,
    c.resultado(datos.resultado),
    ...(datos.venues.length > 0 ? [c.lugares, venuesTexto] : []),
    c.cierre,
    `${c.explorar}\n${datos.urlSitio}`,
    c.firma,
    'CURATED YUCATÁN',
  ].join('\n\n');

  return { asunto: c.asunto, html: documento('en', c.asunto, cuerpo), texto };
}

// --- Confirmación de solicitud (Plan Your Event, venue o partner) ------------------------

export interface DatosCorreoSolicitud {
  idioma: 'en' | 'es';
  nombre: string;
  /** Resumen de la solicitud ya localizado: [etiqueta, valor]. */
  filas: [string, string][];
  urlSitio: string;
}

const COPY_SOLICITUD = {
  en: {
    asunto: 'We received your request · Curated Yucatán',
    titular: (nombre: string) => `Thank you, ${nombre}.`,
    texto:
      "We've received your request. The Curated Yucatán team will be in touch soon to continue planning your event in Yucatán.",
    resumen: 'Your request',
    explorar: 'CONTINUE EXPLORING YUCATÁN →',
    firma: 'Yucatán, curated.',
  },
  es: {
    asunto: 'Recibimos tu solicitud · Curated Yucatán',
    titular: (nombre: string) => `Gracias, ${nombre}.`,
    texto:
      'Recibimos tu solicitud. El equipo de Curated Yucatán te contactará pronto para seguir planeando tu evento en Yucatán.',
    resumen: 'Tu solicitud',
    explorar: 'SIGUE EXPLORANDO YUCATÁN →',
    firma: 'Yucatán, curated.',
  },
};

function tablaFilas(filas: [string, string][]): string {
  const celdas = filas
    .map(
      ([etiqueta, valor]) => `
<tr>
<td valign="top" style="padding:8px 16px 8px 0;font-family:${SANS};font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${COLOR.tintaSuave};white-space:nowrap;">${escaparHtml(etiqueta)}</td>
<td valign="top" style="padding:8px 0;font-family:${SANS};font-size:14px;line-height:1.5;color:${COLOR.tinta};white-space:pre-line;">${escaparHtml(valor)}</td>
</tr>`,
    )
    .join('');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${COLOR.linea};border-bottom:1px solid ${COLOR.linea};">${celdas}</table>`;
}

const filasTexto = (filas: [string, string][]) =>
  filas.map(([etiqueta, valor]) => `${etiqueta}: ${valor}`).join('\n');

export function correoConfirmacionSolicitud(datos: DatosCorreoSolicitud): CorreoGenerado {
  const c = COPY_SOLICITUD[datos.idioma];
  const cuerpo = `
<h1 style="margin:0 0 24px;font-family:${SERIF};font-size:28px;font-weight:normal;line-height:1.2;text-align:center;color:${COLOR.tinta};">${escaparHtml(c.titular(datos.nombre))}</h1>
${parrafo(c.texto)}
<p style="margin:32px 0 8px;font-family:${SANS};font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${COLOR.tintaSuave};">${escaparHtml(c.resumen)}</p>
${tablaFilas(datos.filas)}
<p style="margin:32px 0;text-align:center;">${enlaceAccion(c.explorar, datos.urlSitio)}</p>
<p style="margin:0;font-family:${SERIF};font-size:16px;font-style:italic;text-align:center;color:${COLOR.tinta};">${escaparHtml(c.firma)}</p>`;

  const texto = [
    'CURATED YUCATÁN',
    c.titular(datos.nombre),
    c.texto,
    `${c.resumen.toUpperCase()}\n${filasTexto(datos.filas)}`,
    `${c.explorar}\n${datos.urlSitio}`,
    c.firma,
    'CURATED YUCATÁN',
  ].join('\n\n');

  return { asunto: c.asunto, html: documento(datos.idioma, c.asunto, cuerpo), texto };
}

// --- Notificación interna al equipo -----------------------------------------------------

export interface DatosCorreoEquipo {
  asunto: string;
  /** Secciones con título y filas [etiqueta, valor]. */
  secciones: { titulo: string; filas: [string, string][] }[];
}

export function correoEquipo(datos: DatosCorreoEquipo): CorreoGenerado {
  const cuerpo = datos.secciones
    .map(
      (seccion) => `
<p style="margin:24px 0 8px;font-family:${SANS};font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${COLOR.tintaSuave};">${escaparHtml(seccion.titulo)}</p>
${tablaFilas(seccion.filas)}`,
    )
    .join('');
  const texto = datos.secciones
    .map((seccion) => `${seccion.titulo.toUpperCase()}\n${filasTexto(seccion.filas)}`)
    .join('\n\n');
  return {
    asunto: datos.asunto,
    html: documento(
      'es',
      datos.asunto,
      `<h1 style="margin:0 0 8px;font-family:${SERIF};font-size:22px;font-weight:normal;color:${COLOR.tinta};">${escaparHtml(datos.asunto)}</h1>${cuerpo}`,
    ),
    texto: `${datos.asunto}\n\n${texto}`,
  };
}
