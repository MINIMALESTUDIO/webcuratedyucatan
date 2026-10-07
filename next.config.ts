import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const conNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// Procesos para generar las páginas en el build. Por defecto Next usa uno por CPU; en Hostinger
// detecta 48 CPU y el plan compartido limita los procesos, así que el build medido lo fija (D-050).
const cpusBuild = Number(process.env.NEXT_BUILD_CPUS) || undefined;

const nextConfig: NextConfig = {
  poweredByHeader: false,
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
