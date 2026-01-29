import type { MetadataRoute } from 'next';
import notion from '../server/notion.server';
/* eslint-disable @typescript-eslint/no-explicit-any */

const SITE_URL = 'https://blog-c9md.vercel.app';
const ROOT_PAGE_ID = process.env.ROOT_PAGE_ID!;

async function getAllPostPages(limit = 200) {
  const res = await notion.search({
    ancestorId: ROOT_PAGE_ID,
    query: '',
    limit,
  });

  const results = res?.results ?? res ?? [];
  console.log('sitemap - fetched posts:', results);

  return results
    .filter((r: any) => r?.id)
    .map((r: any) => ({
      id: r.id.replaceAll('-', ''),
      lastEdited:
        r?.lastEditedTime || r?.last_edited_time || r?.last_edited_time_ms || Date.now(),
    }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let posts: { id: string; lastEdited?: string }[] = [];

  try {
    posts = await getAllPostPages(200);
  } catch (e) {
    posts = [];
  }

  const postEntries: MetadataRoute.Sitemap = posts.map(p => ({
    url: `${SITE_URL}/${p.id.replaceAll('-', '')}`,
    lastModified: p.lastEdited ? new Date(p.lastEdited) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...postEntries,
  ];
}
