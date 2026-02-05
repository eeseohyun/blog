import NotionRenderer from '@/components/notion/notion-renderer';
import notion from '../../server/notion.server';

export const revalidate = 3600; // 최대 1시간마다 revalidate

export default async function Home() {
  const rootPageId = process.env.ROOT_PAGE_ID!;
  const recordMap = await notion.getPage(rootPageId);

  return (
    <div className="mx-auto min-h-[calc(100vh-110px)] max-w-5xl">
      <NotionRenderer recordMap={recordMap} isRootPage />
    </div>
  );
}
