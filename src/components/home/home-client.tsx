'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import GalleryCard from './gallery-card';
import { cn } from '@/lib/utils';
import { TAGS } from '@/common/constants';

export type PagesType = {
  object: string;
  id: string;
  created_time: string;
  last_edited_time: string;
  created_by: [];
  last_edited_by: [];
  cover: null;
  icon: null;
  parent: [];
  archived: boolean;
  in_trash: boolean;
  is_locked: boolean;
  properties: PropertiesType;
  url: string;
  public_url: string;
};

export type PropertiesType = {
  이름: {
    title: {
      plain_text: string;
    }[];
  };
  주제: {
    rich_text: {
      plain_text: string;
    }[];
  };
  생성일: {
    created_time: string;
  };
  태그: {
    multi_select: {
      name: string;
      color: string;
      id: string;
    }[];
  };
  상태: {
    status: {
      name: string;
      color: string;
      id: string;
    };
  };
  썸네일: {
    files: {
      file: {
        url: string;
        expiry_time: string;
      };
    }[];
  };
};

export default function HomeClient({
  initialPages,
  initialCursor,
  initialTag,
}: {
  initialPages: PagesType[];
  initialCursor: string | null;
  initialTag: string | null;
}) {
  const router = useRouter();
  const sp = useSearchParams();

  const [items, setItems] = useState(initialPages);
  const [cursor, setCursor] = useState<string | null>(initialCursor);

  useEffect(() => {
    setItems(initialPages);
    setCursor(initialCursor);
  }, [initialPages, initialCursor]);

  const activeTag = initialTag;

  const setTag = (tag?: string) => {
    const next = new URLSearchParams(sp.toString());
    if (!tag) next.delete('tag');
    else next.set('tag', tag);

    router.push(`/?${next.toString()}`, { scroll: false });
  };

  const loadMore = async () => {
    if (!cursor) return;

    const qs = new URLSearchParams();
    if (activeTag) qs.set('tag', activeTag);
    qs.set('cursor', cursor);

    const res = await fetch(`/api/posts?${qs.toString()}`);
    const data = await res.json();

    setItems(prev => [...prev, ...data.pages]);
    setCursor(data.nextCursor);
  };

  return (
    <div className="pt-24 pb-20">
      {/* 태그 */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setTag(undefined)}
          className={cn(
            'cursor-pointer rounded-md border px-2 py-1 text-xs',
            !activeTag ? 'border-primary font-bold' : 'opacity-60',
          )}
        >
          전체
        </button>
        {TAGS.map(t => (
          <button
            key={t}
            onClick={() => setTag(t)}
            className={cn(
              'cursor-pointer rounded-md border px-2 py-1 text-xs',
              activeTag === t ? 'font-bold' : 'opacity-60',
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* 갤러리 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {items.map((p: PagesType) => (
          <GalleryCard key={p.id} item={p} properties={p.properties} />
        ))}
      </div>

      {/* 더보기 */}
      {cursor && (
        <div className="mt-8 flex justify-center">
          <button onClick={loadMore} className="cursor-pointer px-4 py-2 hover:underline">
            More
          </button>
        </div>
      )}
    </div>
  );
}
