import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client'; // Adjust this import path to your Sanity client setup

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.rumanest.com';

  // 1. Static Core App Pages
  const staticRoutes = [
    { path: '', changeFrequency: 'daily', priority: 1.0 },
    { path: '/properties', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/roommate', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/car-lifts', changeFrequency: 'weekly', priority: 0.8 },
  ] as const;

  const coreUrls = staticRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // 2. Fetch Active Blog Slugs and Modification Dates dynamically from Sanity
  let blogUrls: MetadataRoute.Sitemap = [];
  
  try {
    const posts = await client.fetch(`
      *[_type == "post" && defined(slug.current)]{
        "slug": slug.current,
        "_updatedAt": _updatedAt
      }
    `);

    blogUrls = posts.map((post: { slug: string; _updatedAt: string }) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post._updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Failed to fetch blog slugs for sitemap:", error);
  }

  return [...coreUrls, ...blogUrls];
}