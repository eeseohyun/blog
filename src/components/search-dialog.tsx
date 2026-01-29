'use client';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { IoSearch } from 'react-icons/io5';
import { IoIosCloseCircle } from 'react-icons/io';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import { Input } from './ui/input';
import Link from 'next/link';

type SearchItem = {
  id: string;
  title: string;
  subtitle: string;
};

function SearchDialog() {
  const [keyword, setKeyword] = useState('');
  const [data, setData] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const reset = () => {
    setKeyword('');
    setData([]);
  };

  useEffect(() => {
    const q = keyword.trim();
    if (!q) {
      setData([]);
      return;
    }

    const controller = new AbortController();
    const t = window.setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error('Search failed');
        const json = await res.json();
        setData(json.results ?? []);
        console.log('search results', json);
      } catch (e) {
        // abort면 무시
        if ((e as Error)?.name !== 'AbortError') setData([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(t);
    };
  }, [keyword]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={'icon-sm'} className="rounded-md">
          <IoSearch />
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="top-1/5 border-0 p-0">
        <DialogHeader>
          <DialogTitle>
            <Input
              className="placeholder:text-muted-foreground h-12 w-full rounded-t-md rounded-b-none font-medium"
              placeholder="게시물 검색"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
            />
            {keyword && (
              <IoIosCloseCircle
                className="text-foreground/40 absolute top-3.5 right-3.5 text-xl"
                onClick={reset}
              />
            )}
          </DialogTitle>
          {data && (
            <DialogDescription className="max-h-[calc(80vh-56px)] overflow-y-auto">
              {loading ? (
                <p className="text-muted-foreground px-4 py-8">검색 중...</p>
              ) : data.length > 0 ? (
                data.map(item => <SearchResult key={item.id} data={item} />)
              ) : keyword.trim() ? (
                <p className="text-primary px-4 py-8">검색 결과가 없습니다.</p>
              ) : (
                <p className="text-muted-foreground px-4 py-8">검색어를 입력해주세요.</p>
              )}
            </DialogDescription>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default SearchDialog;

const SearchResult = ({ data }: { data: SearchItem }) => {
  return (
    <div className="hover:bg-accent rounded-md px-4 py-6 not-last:border-b-1">
      <DialogClose asChild>
        <Link href={`/${data.id}`} className="block space-y-1">
          <h3
            className="text-foreground text-lg font-medium"
            dangerouslySetInnerHTML={{ __html: data.title.replaceAll('gzkNfoUU', 'b') }}
          />

          {data.subtitle && (
            <p
              className="text-muted-foreground text-sm"
              dangerouslySetInnerHTML={{
                __html: data.subtitle.replaceAll('gzkNfoUU', 'b'),
              }}
            />
          )}
        </Link>
      </DialogClose>
    </div>
  );
};
