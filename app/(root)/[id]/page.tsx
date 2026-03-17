import NotionRenderer from '@/components/notion/notion-renderer';
import notion from '../../../server/notion.server';
import { notFound } from 'next/navigation';
import Giscus from '@/components/giscus';
import type { Block, ExtendedRecordMap } from 'notion-types';
import { Metadata } from 'next';

type DetailPageProps = {
  params: Promise<{ id: string }>;
};

type BlockValue = Block | undefined;

function isBlockValue(value: unknown): value is Block {
  return !!value && typeof value === 'object' && 'type' in value;
}

function getBlockValues(recordMap: ExtendedRecordMap): Block[] {
  return Object.values(recordMap.block)
    .map(entry => entry?.value)
    .filter(isBlockValue);
}

function getPlainText(
  value: Block['properties'] extends infer P
    ? P extends Record<string, unknown>
      ? P[keyof P]
      : unknown
    : unknown,
): string {
  if (!Array.isArray(value)) return '';

  return value
    .map(item => {
      if (Array.isArray(item) && typeof item[0] === 'string') {
        return item[0];
      }
      return '';
    })
    .join(' ')
    .trim();
}

function extractPageMeta(recordMap: ExtendedRecordMap) {
  const blocks = getBlockValues(recordMap);

  const pageBlock = blocks.find(block => block.type === 'page') as BlockValue;

  const title = getPlainText(pageBlock?.properties?.title) || 'Untitled Post';

  const textBlocks = blocks.filter(block =>
    [
      'text',
      'bulleted_list',
      'numbered_list',
      'quote',
      'callout',
      'to_do',
      'toggle',
    ].includes(block.type),
  );

  const description =
    textBlocks
      .map(block => getPlainText(block.properties?.title))
      .find(text => text.length > 0)
      ?.slice(0, 160) || '개발과 기술에 대한 글입니다.';

  return {
    title,
    description,
  };
}

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { id } = await params;

  if (!id) {
    return {
      title: 'Post Not Found',
    };
  }

  const recordMap = (await notion.getPage(id, {
    fetchMissingBlocks: true,
  })) as ExtendedRecordMap;

  const { title, description } = extractPageMeta(recordMap);
  const url = `https://blog-c9md.vercel.app/${id}`;

  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      siteName: 'Mayo Blog',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function Detail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) notFound();
  const recordMap = await notion.getPage(id, { fetchMissingBlocks: true });

  return (
    <article className="mx-auto min-h-[calc(100vh-110px)] w-full max-w-200 space-y-8 px-2 py-14">
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
