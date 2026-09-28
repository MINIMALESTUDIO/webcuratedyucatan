import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const conNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  poweredByHeader: false,
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
