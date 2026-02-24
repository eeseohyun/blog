import HomeClient, { PagesType } from '@/components/home/home-client';
import { notionQuery } from '../../server/notion.server';

export const revalidate = 3600; // 최대 1시간마다 revalidate

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const data = await notionQuery({ tag });

  return (
    <div className="mx-auto min-h-[calc(100vh-110px)] max-w-5xl px-2">
      <HomeClient
        initialPages={data.results as PagesType[]}
        initialCursor={data.has_more ? data.next_cursor : null}
        initialTag={tag ?? null}
      />
    </div>
  );
}
