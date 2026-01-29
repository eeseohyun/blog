'use client';
import Link from 'next/link';
import SearchDialog from './search-dialog';
import ThemeToggle from './theme-toggle';
import { FaGithub } from 'react-icons/fa';
import { Button } from './ui/button';
import Image from 'next/image';

function CustomHeader() {
  return (
    <header className="bg-background shadow-foreground/10 fixed z-999 h-16 w-full px-10 shadow-sm">
      <div className="mx-auto flex h-full w-full items-center justify-between md:max-w-5xl">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Logo" width={30} height={20} />
          <span className="text-2xl font-bold">Mayo Blog</span>
        </Link>
        <div className="flex items-center gap-2">
          <SearchDialog />
          <ThemeToggle />
          <Link
            href="https://github.com/eeseohyun"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size={'icon-sm'} className="rounded-md">
              <FaGithub />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default CustomHeader;
