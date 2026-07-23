/** Indonesian date/grouping helpers shared by the content pages. */

/** e.g. "15 Juni 2025" */
export function formatDateLong(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * e.g. "15 Juni" — used on Prestasi cards, where the year is already the
 * timeline heading and repeating it on every card is noise.
 */
export function formatDayMonth(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
  });
}

export interface YearGroup<T> {
  year: number;
  items: T[];
}

/**
 * Groups items by the year of a date field, newest year first, preserving the
 * incoming order within each year (queries already sort by publishedAt desc).
 */
export function groupByYear<T>(
  items: readonly T[],
  getDate: (item: T) => string | null | undefined,
): YearGroup<T>[] {
  const byYear = new Map<number, T[]>();

  for (const item of items) {
    const raw = getDate(item);
    if (!raw) continue;
    const year = new Date(raw).getFullYear();
    if (Number.isNaN(year)) continue;
    const bucket = byYear.get(year);
    if (bucket) bucket.push(item);
    else byYear.set(year, [item]);
  }

  return [...byYear.entries()]
    .sort(([a], [b]) => b - a)
    .map(([year, items]) => ({ year, items }));
}
