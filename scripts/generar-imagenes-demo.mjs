// Genera las imágenes de relleno [DEMO] en public/demo/ (decisiones D-025 y D-037).
// Uso: npm run demo:imagenes
// Usa sharp, que ya viene como dependencia opcional de Next.js.
//
// Son marcadores neutros (arena, piedra y taupe), planos y sin arcos: el color del sitio lo
// pondrá la fotografía real (D-037). Borra public/demo antes de generar para no dejar archivos
// que ya no se usan.
import { mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const DESTINO = join(process.cwd(), 'public', 'demo');

// Tonos neutros: [fondo, filete, color del texto].
const TONOS = [
  ['#E9E4DC', '#C9BFB1', '#3D3730'],
  ['#DDD5CA', '#BFB3A3', '#3D3730'],
  ['#CFC5B7', '#AFA291', '#2E2924'],
  ['#BDB1A1', '#9C8F7E', '#1F1C19'],
];
// Los heros llevan texto blanco encima (con velo): tonos más oscuros.
const TONOS_HERO = [
  ['#8A7D6E', '#A29585', '#F7F5F1'],
  ['#77695B', '#8F8172', '#F7F5F1'],
  ['#6B5F52', '#83776A', '#F7F5F1'],
];

function escapar(texto) {
  return texto.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

/**
 * Marcador plano con un filete interior y una línea de horizonte, como un encuadre de foto.
 * En los heros el texto va arriba y pequeño para no chocar con el titular.
 */
function svg({ ancho, alto, tono, etiqueta, hero = false }) {
  const [fondo, filete, colorTexto] = tono;
  const lado = Math.min(ancho, alto);
  const margen = Math.round(lado * 0.045);
  const grande = Math.round(lado * (hero ? 0.045 : 0.07));
  const chico = Math.round(lado * (hero ? 0.018 : 0.026));
  const centro = hero ? alto * 0.2 : alto * 0.47;
  const horizonte = Math.round(alto * 0.68);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${ancho}" height="${alto}" viewBox="0 0 ${ancho} ${alto}">
  <rect width="100%" height="100%" fill="${fondo}"/>
  <rect x="${margen}" y="${margen}" width="${ancho - margen * 2}" height="${alto - margen * 2}" fill="none" stroke="${filete}" stroke-width="${Math.max(2, Math.round(lado * 0.003))}"/>
  <line x1="${margen}" y1="${horizonte}" x2="${ancho - margen}" y2="${horizonte}" stroke="${filete}" stroke-width="${Math.max(2, Math.round(lado * 0.002))}"/>
  <g font-family="'Century Gothic', 'Questrial', Arial, sans-serif" text-anchor="middle" fill="${colorTexto}">
    <text x="${ancho / 2}" y="${centro}" font-size="${grande}" letter-spacing="${grande * 0.18}">[DEMO]</text>
    <text x="${ancho / 2}" y="${centro + grande * 0.9}" font-size="${chico}" letter-spacing="${chico * 0.2}">PHOTO PENDING · FOTO PENDIENTE</text>
    <text x="${ancho / 2}" y="${centro + grande * 0.9 + chico * 2}" font-size="${chico}" letter-spacing="${chico * 0.12}" fill-opacity="0.8">${escapar(etiqueta.toUpperCase())}</text>
  </g>
</svg>`;
}

// Inventario: [archivo, ancho, alto, etiqueta, esHero]. Debe coincidir con src/lib/demo/.
const H = [1600, 1067];
const V = [1200, 1500];
const imagenes = [
  ['inicio-hero.jpg', 2400, 1500, 'Home · Hero', true],
  ['inicio-planea.jpg', 2400, 1400, 'Plan your event', true],
];

for (const tema of [
  'arquitectura',
  'cultura',
  'gastronomia',
  'historia',
  'naturaleza',
  'haciendas',
  'experiencias',
]) {
  imagenes.push([`tema-${tema}.jpg`, ...V, `Discover · ${tema}`]);
}
for (const area of ['venues', 'catering', 'fotografia', 'diseno']) {
  imagenes.push([`explora-${area}.jpg`, 1600, 1200, `Explore · ${area}`]);
}
for (const coleccion of ['contemporary', 'organic', 'timeless']) {
  imagenes.push([`coleccion-${coleccion}.jpg`, ...V, `Collection · ${coleccion}`]);
}

const medidasGaleria = [H, V, H, H, V];
for (let n = 1; n <= 6; n++) {
  imagenes.push([`venue-${n}-hero.jpg`, 2400, 1500, `Venue ${n}`, true]);
  medidasGaleria.forEach(([ancho, alto], k) => {
    imagenes.push([`venue-${n}-galeria-${k + 1}.jpg`, ancho, alto, `Venue ${n} · ${k + 1}/5`]);
  });
}

imagenes.push(['descubre-hero.jpg', 2400, 1500, 'Discover Yucatán', true]);
for (const ancla of [
  'merida',
  'haciendas',
  'cultura',
  'gastronomia',
  'naturaleza',
  'experiencias',
]) {
  imagenes.push([`descubre-${ancla}-1.jpg`, ...H, `${ancla} · 1`]);
  imagenes.push([`descubre-${ancla}-2.jpg`, ...V, `${ancla} · 2`]);
}

for (const tipo of ['catering', 'fotografia']) {
  for (let n = 1; n <= 4; n++) {
    imagenes.push([`${tipo}-${n}.jpg`, 1600, 1200, `${tipo} ${n}`]);
    [V, H, V].forEach(([ancho, alto], k) => {
      imagenes.push([
        `${tipo}-${n}-galeria-${k + 1}.jpg`,
        ancho,
        alto,
        `${tipo} ${n} · ${k + 1}/3`,
      ]);
    });
  }
}

imagenes.push(['diseno-hero.jpg', 2400, 1500, 'Design & Production', true]);
for (const area of ['mobiliario', 'mesa', 'floral', 'decoracion', 'produccion']) {
  imagenes.push([`diseno-${area}-1.jpg`, ...H, `${area} · 1`]);
  imagenes.push([`diseno-${area}-2.jpg`, ...V, `${area} · 2`]);
}

for (let n = 1; n <= 5; n++) imagenes.push([`articulo-${n}.jpg`, ...H, `Journal ${n}`]);
imagenes.push(['nosotros.jpg', ...H, 'About Curated']);

await rm(DESTINO, { recursive: true, force: true });
await mkdir(DESTINO, { recursive: true });

let total = 0;
let heros = 0;
for (const [i, [archivo, ancho, alto, etiqueta, hero = false]] of imagenes.entries()) {
  const tono = hero ? TONOS_HERO[heros++ % TONOS_HERO.length] : TONOS[i % TONOS.length];
  const info = await sharp(Buffer.from(svg({ ancho, alto, tono, etiqueta, hero })))
    .jpeg({ quality: 70, mozjpeg: true, progressive: true })
    .toFile(join(DESTINO, archivo));
  total += info.size;
}

console.log(
  `[demo:imagenes] ${imagenes.length} imágenes en public/demo (${(total / 1024).toFixed(0)} KB en total)`,
);
