import NotionRenderer from '@/components/notion/notion-renderer';
import notion from '../../../server/notion.server';
import { notFound } from 'next/navigation';
import Giscus from '@/components/giscus';

export default async function Detail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) notFound();
  const recordMap = await notion.getPage(id, { fetchMissingBlocks: true });

  return (
    <article className="mx-auto min-h-[calc(100vh-110px)] max-w-[800px] space-y-8 py-14">
      <NotionRenderer recordMap={recordMap} />
      <Giscus
        repo="eeseohyun/blog"
        repoId={process.env.REPO_ID!}
        category="Announcements"
        categoryId={process.env.CATEGORY_ID!}
        mapping="pathname"
        theme={'preferred_color_scheme'}
        lang="ko"
      />
    </article>
  );
}
