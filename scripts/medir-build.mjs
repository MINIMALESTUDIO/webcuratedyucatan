// Ejecuta `next build` y muestra la memoria pico del árbol de procesos (decisión D-030).
// Uso: npm run build:medido  (es el comando de build configurado en Hostinger)
// La medición nunca hace fallar el build: el código de salida es el de `next build`.
//
// Ajustes para el plan compartido de Hostinger (D-050), que limita los procesos por cuenta:
// - `--webpack`: Turbopack abre un proceso de Node aparte para PostCSS (Tailwind) y Hostinger lo
//   cierra antes de conectarse; webpack procesa el CSS dentro del mismo proceso.
// - NEXT_BUILD_CPUS=2 (si no viene definido): menos procesos para generar las páginas.
import { execFile, spawn } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';

const require = createRequire(import.meta.url);
const MB = 1024 * 1024;
const aMB = (bytes) => `${Math.round(bytes / MB)} MB`;

/** Límite de memoria del contenedor (cgroup v2 o v1), si existe. */
function limiteCgroup() {
  for (const ruta of ['/sys/fs/cgroup/memory.max', '/sys/fs/cgroup/memory/memory.limit_in_bytes']) {
    try {
      if (!existsSync(ruta)) continue;
      const valor = readFileSync(ruta, 'utf8').trim();
      if (valor === 'max') return 'sin límite';
      const bytes = Number(valor);
      // Valores enormes significan "sin límite" en cgroup v1.
      if (Number.isFinite(bytes) && bytes < os.totalmem() * 4) return aMB(bytes);
    } catch {
      // Sin permisos de lectura: se omite.
    }
  }
  return 'no disponible';
}

/** Suma el RSS de un árbol de procesos a partir de su PID raíz. */
function sumarArbol(raiz, procesos) {
  const padres = new Map(procesos.map((p) => [p.pid, p.ppid]));
  let total = 0;
  for (const { pid, bytes } of procesos) {
    let actual = pid;
    let pasos = 0;
    while (actual !== raiz && padres.has(actual) && pasos++ < 64) actual = padres.get(actual);
    if (actual === raiz) total += bytes;
  }
  return total;
}

function procesosLinux() {
  const procesos = [];
  for (const nombre of readdirSync('/proc')) {
    if (!/^\d+$/.test(nombre)) continue;
    try {
      const stat = readFileSync(`/proc/${nombre}/stat`, 'utf8');
      const campos = stat.slice(stat.lastIndexOf(')') + 2).split(' ');
      const status = readFileSync(`/proc/${nombre}/status`, 'utf8');
      const rss = status.match(/VmRSS:\s+(\d+) kB/);
      procesos.push({
        pid: Number(nombre),
        ppid: Number(campos[1]),
        bytes: rss ? Number(rss[1]) * 1024 : 0,
      });
    } catch {
      // El proceso terminó mientras se leía.
    }
  }
  return Promise.resolve(procesos);
}

function ejecutar(comando, argumentos) {
  return new Promise((resolver) => {
    execFile(comando, argumentos, { windowsHide: true, maxBuffer: 16 * MB }, (error, salida) =>
      resolver(error ? '' : salida),
    );
  });
}

async function procesosWindows() {
  const csv = await ejecutar('powershell.exe', [
    '-NoProfile',
    '-Command',
    'Get-CimInstance Win32_Process | Select-Object ProcessId,ParentProcessId,WorkingSetSize | ConvertTo-Csv -NoTypeInformation',
  ]);
  return csv
    .split(/\r?\n/)
    .slice(1)
    .map((linea) => linea.replaceAll('"', '').split(','))
    .filter((c) => c.length === 3)
    .map(([pid, ppid, bytes]) => ({ pid: Number(pid), ppid: Number(ppid), bytes: Number(bytes) }));
}

async function procesosPs() {
  const salida = await ejecutar('ps', ['-A', '-o', 'pid=,ppid=,rss=']);
  return salida
    .trim()
    .split('\n')
    .map((linea) => linea.trim().split(/\s+/).map(Number))
    .map(([pid, ppid, kb]) => ({ pid, ppid, bytes: kb * 1024 }));
}

const leerProcesos =
  process.platform === 'linux'
    ? procesosLinux
    : process.platform === 'win32'
      ? procesosWindows
      : procesosPs;
const intervalo = process.platform === 'win32' ? 2000 : 500;

console.log(
  `[medir-build] Node ${process.version} · ${process.platform}/${process.arch} · CPU: ${os.cpus().length} · ` +
    `memoria del sistema: ${aMB(os.totalmem())} (libre ${aMB(os.freemem())}) · límite del contenedor: ${limiteCgroup()}`,
);

const argumentos = ['build', '--webpack', ...process.argv.slice(2)];
const entorno = { ...process.env, NEXT_BUILD_CPUS: process.env.NEXT_BUILD_CPUS || '2' };
console.log(
  `[medir-build] next ${argumentos.join(' ')} · NEXT_BUILD_CPUS=${entorno.NEXT_BUILD_CPUS}`,
);

const inicio = Date.now();
const hijo = spawn(process.execPath, [require.resolve('next/dist/bin/next'), ...argumentos], {
  stdio: 'inherit',
  env: entorno,
});

let pico = 0;
let midiendo = false;
const temporizador = setInterval(async () => {
  if (midiendo || !hijo.pid) return;
  midiendo = true;
  try {
    pico = Math.max(pico, sumarArbol(hijo.pid, await leerProcesos()));
  } catch {
    // La medición es informativa; los errores se ignoran.
  } finally {
    midiendo = false;
  }
}, intervalo);

hijo.on('exit', (codigo, senal) => {
  clearInterval(temporizador);
  const segundos = Math.round((Date.now() - inicio) / 1000);
  console.log(
    `[medir-build] Memoria pico del build (árbol de procesos, muestreo cada ${intervalo} ms): ${aMB(pico)} · ` +
      `duración: ${segundos} s · resultado: ${codigo === 0 ? 'correcto' : `falló (${codigo ?? senal})`}`,
  );
  process.exit(codigo ?? 1);
});
