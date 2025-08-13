import { MetadataRoute } from 'next'
import { personalityTypes } from '@/data/personality-types'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://quiz.theagilecoach.com'
  
  // Base pages
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    }
  ]

  // Add dynamic personality type pages for SEO
  // These would be example result pages that demonstrate each personality type
  personalityTypes.forEach(personality => {
    routes.push({
      url: `${baseUrl}/results/example-${personality.shortName.toLowerCase()}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  })

  return routes
}