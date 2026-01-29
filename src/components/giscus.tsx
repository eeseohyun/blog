'use client';
import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';

type GiscusProps = {
  repo: string; // "owner/repo"
  repoId: string; // "R_kgDO..."
  category: string; // "Comments"
  categoryId: string; // "DIC_kwDO..."
  mapping?: 'pathname' | 'url' | 'title' | 'og:title' | 'specific';
  term?: string; // mapping="specific"일 때만 사용
  theme?: string; // "light", "dark", "preferred_color_scheme" 등
  lang?: string; // "ko"
};

export default function Giscus({
  repo,
  repoId,
  category,
  categoryId,
  mapping = 'pathname',
  term,
  lang = 'ko',
}: GiscusProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!ref.current) return;

    // 같은 페이지에서 리렌더 시 중복 주입 방지
    ref.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';

    script.setAttribute('data-repo', repo);
    script.setAttribute('data-repo-id', repoId);
    script.setAttribute('data-category', category);
    script.setAttribute('data-category-id', categoryId);

    script.setAttribute('data-mapping', mapping);
    if (mapping === 'specific' && term) script.setAttribute('data-term', term);

    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', resolvedTheme === 'dark' ? 'dark' : 'light');
    script.setAttribute('data-lang', lang);
    script.setAttribute('data-loading', 'lazy');

    ref.current.appendChild(script);
  }, [repo, repoId, category, categoryId, mapping, term, lang]);

  useEffect(() => {
    const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');

    if (!iframe) return;

    iframe.contentWindow?.postMessage(
      {
        giscus: {
          setConfig: {
            theme: resolvedTheme === 'dark' ? 'dark' : 'light',
          },
        },
      },
      'https://giscus.app',
    );
  }, [resolvedTheme]);

  return <section ref={ref} />;
}
