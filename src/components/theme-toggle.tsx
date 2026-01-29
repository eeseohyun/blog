'use client';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import { MdOutlineWbSunny } from 'react-icons/md';
import { HiOutlineMoon } from 'react-icons/hi';
import { Theme } from '@/common/constants';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  console.log('theme', theme);
  return (
    <Button
      size={'icon-sm'}
      className="rounded-md"
      onClick={() => setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT)}
    >
      {theme === Theme.LIGHT ? (
        <MdOutlineWbSunny size="20" />
      ) : (
        <HiOutlineMoon size="20" />
      )}
    </Button>
  );
}

export default ThemeToggle;
