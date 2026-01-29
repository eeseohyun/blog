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

export const notionQuery = async () => {
  const page = await notionClient.dataSources.query({
    data_source_id: '2f4d897f-d0c2-80f8-a8f6-000b23cf547b',
    filter: {
      property: '상태',
      status: {
        equals: '진행 중',
      },
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
