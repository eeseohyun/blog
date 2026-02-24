import { NextResponse } from 'next/server';
import { notionQuery } from '../../../server/notion.server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tag = searchParams.get('tag') ?? undefined;
  const cursor = searchParams.get('cursor') ?? undefined;

  const data = await notionQuery({ tag, cursor });

  return NextResponse.json({
    pages: data.results,
    nextCursor: data.has_more ? data.next_cursor : null,
  });
}
