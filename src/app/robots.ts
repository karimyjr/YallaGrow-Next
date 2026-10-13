import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/affiliate-dashboard.html', '/api/'],
      },
    ],
    sitemap: 'https://yallagrow.net/sitemap.xml',
    host: 'https://yallagrow.net',
  }
}
