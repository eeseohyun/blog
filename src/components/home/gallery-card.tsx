import Link from 'next/link';
import Image from 'next/image';
import { PagesType, PropertiesType } from './home-client';
import { cn, getCover, getDate, getTags, getTitle, getTopic } from '@/lib/utils';
import { notionTagClass } from '@/lib/notion-color';

export default function GalleryCard({
  item,
  properties,
}: {
  item: PagesType;
  properties: PropertiesType;
}) {
  const title = getTitle(properties);
  const date = getDate(properties);
  const tags = getTags(properties);
  const topic = getTopic(properties);
  const cover = getCover(properties);
  return (
    <Link
      key={item.id}
      href={`/${item.id}`}
      className="group block overflow-hidden rounded-2xl border transition hover:shadow-lg"
    >
      {/* Cover */}
      {cover && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={cover}
            alt={title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
      )}

      <div className="p-4">
        {/* 제목 */}
        <h2 className="mt-1 text-lg leading-snug font-semibold">{title}</h2>

        {/* 주제 */}
        <h2 className="mt-1 text-sm leading-snug">{topic}</h2>

        {/* 날짜 */}
        <div className="text-muted-foreground mt-1 text-xs">
          {new Date(date).toLocaleDateString().slice(0, 10)}
        </div>

        {/* 태그 */}
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map(tag => (
            <span
              key={tag.id}
              className={cn(
                'rounded-md border px-2 py-1 text-xs',
                notionTagClass(tag.color),
              )}
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
