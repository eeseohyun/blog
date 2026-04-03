import type { MetadataRoute } from 'next';
import notion from '../server/notion.server';

export const dynamic = 'force-dynamic';

const SITE_URL = 'https://blog-c9md.vercel.app';

type NotionSearchResult = {
  id: string;
  lastEditedTime?: string;
  last_edited_time?: string;
  last_edited_time_ms?: number;
};

type SitemapItem = {
  id: string;
  lastModified?: string | number;
};

async function getAllPostPages(): Promise<SitemapItem[]> {
  const rootPageId = process.env.ROOT_PAGE_ID;

  if (!rootPageId) {
    throw new Error('ROOT_PAGE_ID is missing');
  }

  const data = await notion.search({
    ancestorId: rootPageId,
    query: '',
    limit: 200,
  });

  const rawResults: NotionSearchResult[] = data?.results ?? [];

  console.log('sitemap rawResults length:', rawResults.length);

  return rawResults
    .filter(r => Boolean(r?.id))
    .map(r => ({
      id: r.id.replace(/-/g, ''),
      lastModified: r.lastEditedTime ?? r.last_edited_time ?? r.last_edited_time_ms,
    }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const posts = await getAllPostPages();

    return [
      {
        url: SITE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      ...posts.map(post => ({
        url: `${SITE_URL}/${post.id}`,
        lastModified: post.lastModified ? new Date(post.lastModified) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
    ];
  } catch (error) {
    console.error('sitemap generation failed:', error);

    return [
      {
        url: SITE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];
  }
}
