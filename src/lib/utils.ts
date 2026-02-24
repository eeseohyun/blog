import { PropertiesType } from '@/components/home/home-client';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTitle(p: PropertiesType) {
  const prop = p.이름;
  if (!prop) return 'Untitled';

  return prop.title[0]?.plain_text ?? '';
}

export function getTopic(p: PropertiesType) {
  const prop = p.주제;
  return prop?.rich_text?.[0]?.plain_text ?? '';
}

export function getDate(p: PropertiesType) {
  const prop = p.생성일;
  return prop?.created_time ?? '';
}

export function getTags(p: PropertiesType) {
  const prop = p.태그;
  return prop?.multi_select ?? [];
}

export function getCover(p: PropertiesType) {
  const prop = p.썸네일;
  return prop?.files?.[0]?.file?.url ?? '';
}
