import NotionRenderer from '@/components/notion/notion-renderer';
import notion from '../../server/notion.server';

export default async function Home() {
  const rootPageId = process.env.ROOT_PAGE_ID!;
  const recordMap = await notion.getPage(rootPageId);

  return (
    <div className="mx-auto min-h-[calc(100vh-110px)] max-w-5xl">
      <NotionRenderer recordMap={recordMap} isRootPage />
    </div>
  );
}
