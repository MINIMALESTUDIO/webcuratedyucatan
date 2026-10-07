import type { MetadataRoute } from 'next';
import { sitioIndexable, urlSitio } from '@/lib/sitio';

// Mientras el sitio tenga datos DEMO, robots.txt bloquea todo (D-028).
export default function robots(): MetadataRoute.Robots {
  if (!sitioIndexable()) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/studio'] },
    sitemap: `${urlSitio()}/sitemap.xml`,
  };
}
