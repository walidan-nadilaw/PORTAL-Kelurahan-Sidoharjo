export const POSTS_PER_PAGE = 12;

export interface PageInfo {
  page: number;
  totalPages: number;
  /** GROQ slice bounds: [$start...$end] */
  start: number;
  end: number;
  hasPrev: boolean;
  hasNext: boolean;
}

/**
 * Parses a `?page=` value that arrives as an untrusted string (or array, or
 * nothing) and returns null for anything that isn't a whole number >= 1, so
 * the page can 404 rather than silently showing page 1.
 */
export function parsePageParam(raw: string | string[] | undefined): number | null {
  if (raw === undefined) return 1;
  if (Array.isArray(raw)) return null;
  if (!/^\d+$/.test(raw)) return null;
  const page = Number(raw);
  return page >= 1 ? page : null;
}

export function getPageInfo(
  page: number,
  total: number,
  perPage = POSTS_PER_PAGE,
): PageInfo {
  // An empty list still has one (empty) page, so the UI has something to show.
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  return {
    page,
    totalPages,
    start,
    end: start + perPage,
    hasPrev: page > 1,
    hasNext: page < totalPages,
  };
}
