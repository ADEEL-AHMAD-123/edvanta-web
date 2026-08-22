import { MetadataRoute } from 'next';

const BASE_URL = 'https://marksly.pk';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/', '/login', '/register', '/pricing', '/features', '/help', '/contact', '/blog',
        ],
        // Every authenticated dashboard route (per-role portals) and the
        // password-reset/verify-email token pages have no SEO value and
        // shouldn't be crawled or show up in search results.
        disallow: ['/student', '/admin', '/superadmin', '/teacher', '/parent', '/verify-email', '/forgot-password/reset'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
