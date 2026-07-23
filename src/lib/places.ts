import type { Place, PlaceCategory } from "@/lib/sanity/types";

/**
 * The categories in the order their filter pills should appear (matches the
 * mockup). Also the single source of truth for iterating categories — the icon
 * for each is `/images/ic-place-<category>.png`, resolved mechanically.
 */
export const PLACE_CATEGORIES: readonly PlaceCategory[] = [
  "sekolah",
  "masjid",
  "pemerintahan",
  "toko",
  "lainnya",
];

/** How many place cards show per page in the /peta list (paginated client-side,
 * since search + filter run in the browser). Even number fills the 2-up grid. */
export const PLACES_PER_PAGE = 8;

/** "pemerintahan" → "Pemerintahan". Every category capitalises cleanly, so no
 * lookup table is needed. */
export function categoryLabel(category: PlaceCategory): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

/**
 * Which category pills to show: only those with at least one place, kept in
 * PLACE_CATEGORIES order so the pill row is stable regardless of data order.
 */
export function presentCategories(places: Place[]): PlaceCategory[] {
  return PLACE_CATEGORIES.filter((category) =>
    places.some((place) => place.category === category),
  );
}

/**
 * Narrows the list by the active category and a name search. `category` of
 * "semua" (or null) means no category filter; the search is a case-insensitive
 * substring match on the name. Both conditions combine with AND.
 */
export function filterPlaces(
  places: Place[],
  { query, category }: { query: string; category: PlaceCategory | "semua" | null },
): Place[] {
  const needle = query.trim().toLowerCase();
  return places.filter((place) => {
    const matchesCategory =
      !category || category === "semua" || place.category === category;
    const matchesQuery =
      !needle || place.name.toLowerCase().includes(needle);
    return matchesCategory && matchesQuery;
  });
}
