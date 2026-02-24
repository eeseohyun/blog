export function notionTagClass(color?: string) {
  switch (color) {
    case 'gray':
      return 'bg-zinc-100 text-zinc-700 border-zinc-200';
    case 'brown':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'orange':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'yellow':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'green':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'blue':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'purple':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'pink':
      return 'bg-pink-100 text-pink-800 border-pink-200';
    case 'red':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'default':
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}
