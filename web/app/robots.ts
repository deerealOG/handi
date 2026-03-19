import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://handiapp.com.ng";
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/profile/', '/checkout/', '/wallet/', '/api/'], // Prevent crawling of private/auth areas
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
