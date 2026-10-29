// Map between a 1-based league ordinal and its URL slug: 1 <-> "a", 2 <-> "b", ...
export const leagueSlug = (index: number) => String.fromCharCode(96 + index);

export const slugToIndex = (slug: string) => {
  const s = slug.toLowerCase();
  if (!/^[a-z]$/.test(s)) return NaN;
  return s.charCodeAt(0) - 96;
};
