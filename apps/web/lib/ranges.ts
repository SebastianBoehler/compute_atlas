export const parseRange = (range: string | null) => {
  if (range === '24h' || range === '7d' || range === '30d' || range === '1y') {
    return range;
  }
  return '30d';
};
