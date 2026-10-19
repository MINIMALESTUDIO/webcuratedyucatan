import 'server-only';
import { createHash } from 'node:crypto';

/*
 * Protecciones de /api/leads mientras no exista la base MariaDB (D-055):
 * - Límites en memoria (Hostinger corre un solo proceso de Node; se reinician con cada
 *   despliegue; con la base pasarán a la tabla limites_envio de D-011):
 *   - por IP: 5 cada 10 minutos (D-011). La IP sale de X-Forwarded-For y se puede falsear, por
 *     eso hay dos límites más que no dependen de ella (D-059);
 *   - por destinatario: 5 cada 24 horas, para que nadie use el sitio para llenar de correos la
 *     bandeja de otra persona;
 *   - global: 60 cada hora, como techo ante un ataque distribuido.
 * - La IP nunca se guarda en claro: se usa su hash con IP_HASH_SALT.
 * - Clave de envío: hash del contenido del formulario. Sirve de Idempotency-Key en Resend (24 h)
 *   y para responder sin reenviar si el mismo formulario llega dos veces.
 */

export const LIMITE_ENVIOS = 5;
export const VENTANA_MS = 10 * 60 * 1000;
export const LIMITE_POR_CORREO = 5;
export const VENTANA_CORREO_MS = 24 * 60 * 60 * 1000;
export const LIMITE_GLOBAL = 60;
export const VENTANA_GLOBAL_MS = 60 * 60 * 1000;
/** Tope de entradas en memoria: si se supera, se descartan las vencidas (y si no, todas). */
const MAX_ENTRADAS = 5000;

const ventanas = new Map<string, { inicio: number; conteo: number; duracion: number }>();
const enviados = new Map<string, number>();

export function hashIp(ip: string): string {
  const sal = process.env.IP_HASH_SALT ?? '';
  return createHash('sha256').update(`${sal}:${ip}`).digest('hex').slice(0, 32);
}

/** IP del visitante según el proxy de Hostinger (primer valor de X-Forwarded-For). */
export function ipDe(encabezados: Headers): string {
  const reenviada = encabezados.get('x-forwarded-for')?.split(',')[0]?.trim();
  return reenviada || encabezados.get('x-real-ip')?.trim() || 'desconocida';
}

function podar<V>(mapa: Map<string, V>, vencida: (valor: V) => boolean) {
  if (mapa.size < MAX_ENTRADAS) return;
  for (const [clave, valor] of mapa) if (vencida(valor)) mapa.delete(clave);
  if (mapa.size >= MAX_ENTRADAS) mapa.clear();
}

/** Cuenta un intento para `clave`; devuelve false si ya superó `limite` en la ventana actual. */
function contar(clave: string, limite: number, duracion: number, ahora: number): boolean {
  podar(ventanas, (v) => ahora - v.inicio >= v.duracion);
  const ventana = ventanas.get(clave);
  if (!ventana || ahora - ventana.inicio >= duracion) {
    ventanas.set(clave, { inicio: ahora, conteo: 1, duracion });
    return true;
  }
  ventana.conteo += 1;
  return ventana.conteo <= limite;
}

/** Límite por IP (antes de validar). */
export function registrarIntento(ipHash: string, ahora = Date.now()): boolean {
  return contar(`ip:${ipHash}`, LIMITE_ENVIOS, VENTANA_MS, ahora);
}

/** Límite por destinatario y global (después de validar, antes de enviar). */
export function registrarEnvio(correo: string, ahora = Date.now()): boolean {
  const destinatario = createHash('sha256')
    .update(`${process.env.IP_HASH_SALT ?? ''}:${correo.trim().toLowerCase()}`)
    .digest('hex')
    .slice(0, 32);
  // Las dos cuentas avanzan siempre, para que un destinatario bloqueado también sume al global.
  const porCorreo = contar(`correo:${destinatario}`, LIMITE_POR_CORREO, VENTANA_CORREO_MS, ahora);
  const global = contar('global', LIMITE_GLOBAL, VENTANA_GLOBAL_MS, ahora);
  return porCorreo && global;
}

/** Hash estable del contenido: el mismo formulario enviado dos veces da la misma clave. */
export function claveEnvio(tipo: string, contenido: unknown): string {
  return `${tipo}-${createHash('sha256').update(JSON.stringify(contenido)).digest('hex').slice(0, 40)}`;
}

const DURACION_DUPLICADO_MS = 24 * 60 * 60 * 1000;

export function yaEnviado(clave: string, ahora = Date.now()): boolean {
  const momento = enviados.get(clave);
  return momento !== undefined && ahora - momento < DURACION_DUPLICADO_MS;
}

export function marcarEnviado(clave: string, ahora = Date.now()) {
  podar(enviados, (momento) => ahora - momento >= DURACION_DUPLICADO_MS);
  enviados.set(clave, ahora);
}

/** Solo para pruebas. */
export function reiniciarProteccion() {
  ventanas.clear();
  enviados.clear();
}
