import { Client } from '@notionhq/client';
import { NotionAPI } from 'notion-client';
import 'server-only';

const notion = new NotionAPI();

export const notionClient = new Client({
  auth: process.env.NOTION_API!,
});

export const notionRetrieve = async () => {
  const page = await notionClient.databases.retrieve({
    database_id: process.env.NOTION_DATABASE!,
  });
  return page;
};

let cachedDataSourceId: string = '';

export async function getPostDataSourceId() {
  if (cachedDataSourceId) return cachedDataSourceId;

  const db = await notionClient.databases.retrieve({
    database_id: process.env.NOTION_DATABASE!,
  });

  const ds = (db as any).data_sources?.[0];
  if (!ds?.id) {
    throw new Error('No data_sources found in this database.');
  }

  cachedDataSourceId = ds.id;
  return cachedDataSourceId;
}

export const notionQuery = async (params?: { tag?: string; cursor?: string }) => {
  const { tag, cursor } = params ?? {};
  const data_source_id = await getPostDataSourceId();
  const page = await notionClient.dataSources.query({
    data_source_id,
    start_cursor: cursor,
    page_size: 12,
    filter: {
      and: [
        { property: '상태', status: { equals: '완료' } },
        ...(tag ? [{ property: '태그', multi_select: { contains: tag } }] : []),
      ],
    },
    sorts: [
      {
        property: '생성일',
        direction: 'descending',
      },
    ],
  });
  return page;
};

export const notionPageMetadata = async () => {
  try {
    const [pageRetrieve, pageQuery] = await Promise.all([
      notionRetrieve(),
      notionQuery(),
    ]);
    console.log('page metadata', { pageRetrieve, pageQuery });

    return {
      ...pageRetrieve,
    };
  } catch (error) {
    console.error(error);
    return {
      // id: pageId,
      properties: {},
      cover: null,
      icon: null,
      url: null,
    };
  }
};

export default notion;
