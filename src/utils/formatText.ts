export const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

export const generateTicketCode = (id: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let hash = (id * 2654435761) >>> 0;
  hash = (hash ^ (hash >>> 16)) >>> 0;
  
  let code = '';
  for(let i = 0; i < 5; i++) {
    code += chars[hash % chars.length];
    hash = Math.floor(hash / chars.length);
  }
  return code;
};
