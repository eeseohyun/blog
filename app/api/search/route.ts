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

const getPropText = (prop: any): string => {
  if (!Array.isArray(prop)) return '';
  let out = '';
  for (const row of prop) {
    if (!Array.isArray(row)) continue;
    for (const seg of row) {
      const t = Array.isArray(seg) ? seg[0] : seg;
      if (typeof t === 'string') out += t;
    }
  }
  return out.trim();
};

const getPageMetaById = async (
  pageId: string,
): Promise<{ title: string; subtitle: string }> => {
  try {
    const recordMap = await notion.getPage(pageId);
    const pageBlock = recordMap?.block?.[pageId]?.value;
    const props = pageBlock?.properties ?? {};

    const title = getPropText(props?.title);

    // subtitle: 너가 말한 [QMX 같은 컬렉션 프로퍼티
    const subtitle = getPropText(props?.['[QMX']);

    return { title, subtitle };
  } catch (e) {
    return { title: '', subtitle: '' };
  }
};

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? '';
  if (!q) return Response.json({ results: [] as SearchItemDTO[], total: 0 });

  const rootPageId = process.env.ROOT_PAGE_ID!;
  const data = await notion.search({
    ancestorId: rootPageId,
    query: q,
  });

  const rawResults = data?.results ?? [];

  // 🔥 하이라이트 없는 애들만 page title 조회
  const metasByIndex = await Promise.all(
    rawResults.map(async (r: any) => {
      const h = r?.highlights ?? {};

      const hasTitle = Boolean(pickFirst(h.titleHighlight, h.pathTextHighlight));
      const hasSubtitle = Boolean(pickFirst(h.collectionTextHighlight));

      // 둘 다 있으면 굳이 getPage 안 함
      if (hasTitle && hasSubtitle) return null;

      const meta = await getPageMetaById(r.id);
      return meta;
    }),
  );

  const results: SearchItemDTO[] = rawResults.map((r: any, index: number) => {
    const h = r.highlights ?? {};
    const meta = metasByIndex[index];
    const highlightedTitle = pickFirst(h.titleHighlight, h.pathTextHighlight);
    const highlightedSubtitle = pickFirst(
      h.collectionTextHighlight,
      h.textHighlights?.[0]?.text,
    );

    const title = highlightedTitle || meta?.title || r.id.slice(0, 8);
    const subtitle = highlightedSubtitle || meta?.subtitle || '';

    return {
      id: r.id,
      title,
      subtitle,
      score: r.score,
    };
  });

  return Response.json({
    results,
    total: data?.total ?? results.length,
  });
}
