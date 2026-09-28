// Genera las imágenes de relleno [DEMO] del piloto en public/demo/ (decisión D-025).
// Uso: npm run demo:imagenes
// Usa sharp, que ya viene como dependencia opcional de Next.js.
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const DESTINO = join(process.cwd(), 'public', 'demo');

// Degradados derivados de la paleta de marca (D-006): [claro, medio, oscuro, color del texto].
const PALETAS = [
  ['#EAE2D4', '#C9A987', '#8F6547', '#221E1A'], // piedra y ocre
  ['#8FA793', '#4A6650', '#233128', '#F7F3EC'], // henequén
  ['#8BBDBA', '#106C74', '#0B3A40', '#F7F3EC'], // cenote
  ['#E6BFAF', '#A13F2B', '#4E1D14', '#F7F3EC'], // almagre
  ['#F7F3EC', '#D5C8B4', '#7D6F5E', '#221E1A'], // cal
];

function escapar(texto) {
  return texto.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

/** Arco de medio punto con base en (x, base), ancho a y alto total h. */
function arco(x, base, a, h) {
  const r = a / 2;
  return `M${x} ${base}V${base - h + r}A${r} ${r} 0 0 1 ${x + a} ${base - h + r}V${base}Z`;
}

/**
 * Las imágenes de hero se usan a pantalla completa con el titular encima: llevan el texto
 * arriba y más pequeño (cabe en el recorte vertical del móvil) para no chocar con el titular.
 */
function svg({ ancho, alto, paleta, etiqueta, hero = false }) {
  const [claro, medio, oscuro, colorTexto] = paleta;
  const vertical = alto > ancho;
  const base = alto;
  const cantidad = vertical ? 1 : 3;
  const separacion = ancho * 0.04;
  const anchoArco = vertical
    ? ancho * 0.62
    : (ancho * 0.8 - separacion * (cantidad - 1)) / cantidad;
  const altoArco = vertical ? alto * 0.62 : alto * 0.58;
  const inicio = (ancho - (anchoArco * cantidad + separacion * (cantidad - 1))) / 2;
  const arcos = Array.from({ length: cantidad }, (_, i) =>
    arco(inicio + i * (anchoArco + separacion), base, anchoArco, altoArco),
  ).join(' ');

  const lado = Math.min(ancho, alto);
  const grande = Math.round(lado * (hero ? 0.08 : 0.1));
  const mediano = Math.round(lado * (hero ? 0.026 : 0.036));
  const chico = Math.round(lado * (hero ? 0.02 : 0.028));
  const centro = alto * (hero ? 0.24 : 0.42);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${ancho}" height="${alto}" viewBox="0 0 ${ancho} ${alto}">
  <defs>
    <linearGradient id="fondo" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0" stop-color="${claro}"/>
      <stop offset="0.55" stop-color="${medio}"/>
      <stop offset="1" stop-color="${oscuro}"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#fondo)"/>
  <path d="${arcos}" fill="${oscuro}" fill-opacity="0.35"/>
  <g font-family="Georgia, 'Times New Roman', serif" text-anchor="middle" fill="${colorTexto}">
    <text x="${ancho / 2}" y="${centro}" font-size="${grande}" font-weight="700" letter-spacing="${grande * 0.04}">[DEMO]</text>
    <text x="${ancho / 2}" y="${centro + mediano * 1.9}" font-size="${mediano}">Foto pendiente · Photo pending</text>
    <text x="${ancho / 2}" y="${centro + mediano * 1.9 + chico * 1.8}" font-size="${chico}" fill-opacity="0.85">${escapar(etiqueta)}</text>
  </g>
</svg>`;
}

// Inventario: [archivo, ancho, alto, etiqueta, esHero]. Debe coincidir con src/lib/demo/.
const imagenes = [['inicio-hero.jpg', 2400, 1500, 'Inicio · Home', true]];

const venues = [
  'Hacienda Ejemplo Norte',
  'Casona Ejemplo Centro',
  'Casa de Playa Ejemplo',
  'Hacienda Ejemplo del Cenote',
  'Patio Boutique Ejemplo',
  'Club de Playa Ejemplo',
];
const medidasGaleria = [
  [1600, 1067],
  [1067, 1600],
  [1600, 1067],
  [1600, 1067],
  [1067, 1600],
];
venues.forEach((nombre, i) => {
  const n = i + 1;
  imagenes.push([`venue-${n}-hero.jpg`, 2400, 1500, nombre, true]);
  medidasGaleria.forEach(([ancho, alto], k) => {
    imagenes.push([`venue-${n}-galeria-${k + 1}.jpg`, ancho, alto, `${nombre} · ${k + 1}/5`]);
  });
});

for (const [slug, nombre] of [
  ['merida-centro', 'Mérida centro'],
  ['haciendas', 'Haciendas'],
  ['costa', 'Costa'],
]) {
  imagenes.push([`region-${slug}.jpg`, 1200, 1500, nombre]);
}
for (let n = 1; n <= 6; n++) imagenes.push([`proveedor-${n}.jpg`, 1200, 900, `Proveedor ${n}`]);
for (let n = 1; n <= 3; n++) imagenes.push([`historia-${n}.jpg`, 1600, 1067, `Historia ${n}`]);
for (let n = 1; n <= 3; n++) imagenes.push([`tradicion-${n}.jpg`, 1200, 1500, `Tradición ${n}`]);
imagenes.push(['guia-portada.jpg', 1200, 1600, 'Guía · Guide 2027']);

await mkdir(DESTINO, { recursive: true });

// Los heros alternan entre las paletas oscuras (henequén, cenote, almagre) para que el texto
// claro del titular se lea bien.
const PALETAS_HERO = [PALETAS[1], PALETAS[2], PALETAS[3]];

let total = 0;
let heros = 0;
for (const [i, [archivo, ancho, alto, etiqueta, hero = false]] of imagenes.entries()) {
  const paleta = hero ? PALETAS_HERO[heros++ % PALETAS_HERO.length] : PALETAS[i % PALETAS.length];
  const salida = join(DESTINO, archivo);
  const info = await sharp(Buffer.from(svg({ ancho, alto, paleta, etiqueta, hero })))
    .jpeg({ quality: 72, mozjpeg: true, progressive: true })
    .toFile(salida);
  total += info.size;
}

console.log(
  `[demo:imagenes] ${imagenes.length} imágenes en public/demo (${(total / 1024).toFixed(0)} KB en total)`,
);
