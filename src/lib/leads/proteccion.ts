import 'server-only';
import { createHash } from 'node:crypto';

/*
 * Protecciones de /api/leads mientras no exista la base MariaDB (D-055):
 * - Límite de envíos por IP en memoria: 5 por 10 minutos (el número de D-011). Hostinger corre
 *   un solo proceso de Node, así que la memoria es compartida; se reinicia con cada despliegue.
 *   Con la base se pasará a la tabla limites_envio de D-011.
 * - La IP nunca se guarda en claro: se usa su hash con IP_HASH_SALT.
 * - Clave de envío: hash del contenido del formulario. Sirve de Idempotency-Key en Resend (24 h)
 *   y para responder sin reenviar si el mismo formulario llega dos veces.
 */

export const LIMITE_ENVIOS = 5;
export const VENTANA_MS = 10 * 60 * 1000;
/** Tope de entradas en memoria: si se supera, se descartan las vencidas (y si no, todas). */
const MAX_ENTRADAS = 5000;

const ventanas = new Map<string, { inicio: number; conteo: number }>();
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

/** Cuenta un envío; devuelve false si la IP ya superó el límite en la ventana actual. */
export function registrarIntento(ipHash: string, ahora = Date.now()): boolean {
  podar(ventanas, (v) => ahora - v.inicio >= VENTANA_MS);
  const ventana = ventanas.get(ipHash);
  if (!ventana || ahora - ventana.inicio >= VENTANA_MS) {
    ventanas.set(ipHash, { inicio: ahora, conteo: 1 });
    return true;
  }
  ventana.conteo += 1;
  return ventana.conteo <= LIMITE_ENVIOS;
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
