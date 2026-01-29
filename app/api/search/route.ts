import { NextRequest } from 'next/server';
import notion from '../../../server/notion.server';

type SearchItemDTO = {
  id: string;
  title: string; // HTML (bold 포함)
  subtitle: string; // HTML (bold 포함)
  score?: number;
};

const pickFirst = (...vals: (string | undefined)[]) =>
  vals.find(v => typeof v === 'string' && v.trim().length > 0) ?? '';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? '';
  if (!q) return Response.json({ results: [] as SearchItemDTO[], total: 0 });

  const rootPageId = process.env.ROOT_PAGE_ID!;
  const data = await notion.search({
    ancestorId: rootPageId,
    query: q,
  });

  const results: SearchItemDTO[] = (data?.results ?? []).map((r: any) => {
    const h = r.highlights ?? {};
    return {
      id: r.id,
      title: pickFirst(h.titleHighlight, h.pathTextHighlight),
      subtitle: pickFirst(h.collectionTextHighlight, h.textHighlights?.[0]?.text),
      score: r.score,
    };
  });

  return Response.json({
    results,
    total: data?.total ?? results.length,
  });
}
