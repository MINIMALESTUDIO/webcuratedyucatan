import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const conNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// Procesos para generar las páginas en el build. Por defecto Next usa uno por CPU; en Hostinger
// detecta 48 CPU y el plan compartido limita los procesos, así que el build medido lo fija (D-050).
const cpusBuild = Number(process.env.NEXT_BUILD_CPUS) || undefined;

/*
 * Encabezados de seguridad (D-059). La CSP no restringe scripts ni estilos (Next y la edición
 * visual usan scripts en línea; una CSP estricta exige nonces y se evaluará aparte): limita quién
 * puede incrustar el sitio en un iframe (solo el propio sitio y el Studio de Sanity, que lo
 * muestra en "Editar en la página"), las URL base, los plugins y el destino de los formularios.
 */
const studio = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SANITY_STUDIO_URL ?? '').origin;
  } catch {
    return '';
  }
})();
const marcosPermitidos = [
  ...new Set(
    [
      "'self'",
      'https://*.sanity.studio',
      'https://www.sanity.io',
      'http://localhost:3333',
      studio,
    ].filter(Boolean),
  ),
].join(' ');

const encabezadosSeguridad = [
  {
    key: 'Content-Security-Policy',
    value: `frame-ancestors ${marcosPermitidos}; base-uri 'self'; object-src 'none'; form-action 'self'`,
  },
  // Sin includeSubDomains: algún subdominio del correo (Akky) podría no tener HTTPS.
  { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: encabezadosSeguridad }];
  },
  experimental: cpusBuild ? { cpus: cpusBuild } : {},
  images: {
    // Piloto: optimizador por defecto de Next (sharp) para probar su compatibilidad en Hostinger
    // (D-025). En la fase de CMS las imágenes vendrán del CDN de Sanity con un loader propio.
    formats: ['image/webp'],
    qualities: [60, 75],
    remotePatterns: [
      // Miniaturas de YouTube para el reproductor de entrevistas.
      { protocol: 'https', hostname: 'i.ytimg.com', pathname: '/vi/**' },
    ],
  },
};

export default conNextIntl(nextConfig);
