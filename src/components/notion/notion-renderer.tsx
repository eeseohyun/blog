'use client';
import { Theme } from '@/common/constants';
import { useTheme } from 'next-themes';
import { useMemo } from 'react';
import type { ExtendedRecordMap } from 'notion-types';
import { NotionRenderer as ReactNotionRenderer } from 'react-notion-x';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';

export default function NotionRenderer({
  recordMap,
  isRootPage,
}: {
  recordMap: ExtendedRecordMap;
  isRootPage?: boolean;
}) {
  const { theme } = useTheme();
  const Code = dynamic(
    () => import('react-notion-x/build/third-party/code').then(m => m.Code),
    {
      ssr: false,
    },
  );
  const Collection = dynamic(
    () => import('react-notion-x/build/third-party/collection').then(m => m.Collection),
    {
      ssr: false,
    },
  );
  const Equation = dynamic(
    () => import('react-notion-x/build/third-party/equation').then(m => m.Equation),
    {
      ssr: false,
    },
  );
  const Modal = dynamic(
    () => import('react-notion-x/build/third-party/modal').then(m => m.Modal),
    {
      ssr: false,
    },
  );
  const isBlogPost = useMemo(() => {
    const keys = Object.keys(recordMap?.block || {});
    const block = recordMap?.block?.[keys[0]]?.value;
    console.log('block', block);
    return block?.type === 'page' && block?.parent_table === 'collection';
  }, [recordMap]);

  return (
    <ReactNotionRenderer
      className={isRootPage ? 'notion-root-page' : ''}
      recordMap={recordMap}
      darkMode={theme === Theme.DARK}
      components={{
        Code,
        Collection,
        Equation,
        Modal,
        nextImage: Image,
        nextLink: Link,
      }}
      fullPage={isBlogPost}
      previewImages={!!recordMap.preview_images}
      showTableOfContents={isBlogPost}
      minTableOfContentsItems={10}
      disableHeader={true}
    />
  );
}
