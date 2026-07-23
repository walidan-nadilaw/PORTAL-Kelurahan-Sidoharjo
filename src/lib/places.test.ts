import { describe, expect, it } from "vitest";
import {
  categoryLabel,
  filterPlaces,
  presentCategories,
} from "./places";
import type { Place } from "@/lib/sanity/types";

/** Minimal place factory — only the fields the filters touch. */
function place(name: string, category: Place["category"]): Place {
  return { _id: name, name, category, googleMapsUrl: "https://maps.example" };
}

const places: Place[] = [
  place("SD Negeri 01", "sekolah"),
  place("SMP Negeri 02", "sekolah"),
  place("Masjid Al-Ikhlas", "masjid"),
  place("Kantor Kelurahan", "pemerintahan"),
];

describe("categoryLabel", () => {
  it("capitalises the category, keeping the full word", () => {
    expect(categoryLabel("pemerintahan")).toBe("Pemerintahan");
    expect(categoryLabel("toko")).toBe("Toko");
  });
});

describe("presentCategories", () => {
  it("returns only categories that appear, in fixed order", () => {
    // sekolah + masjid come before pemerintahan per PLACE_CATEGORIES, and
    // toko/lainnya are absent so they're dropped.
    expect(presentCategories(places)).toEqual([
      "sekolah",
      "masjid",
      "pemerintahan",
    ]);
  });

  it("returns an empty array for no places", () => {
    expect(presentCategories([])).toEqual([]);
  });
});

describe("filterPlaces", () => {
  it("returns everything for the 'semua' category with no query", () => {
    expect(filterPlaces(places, { query: "", category: "semua" })).toHaveLength(
      4,
    );
  });

  it("narrows to a single category", () => {
    const result = filterPlaces(places, { query: "", category: "sekolah" });
    expect(result.map((p) => p.name)).toEqual(["SD Negeri 01", "SMP Negeri 02"]);
  });

  it("matches the name case-insensitively as a substring", () => {
    const result = filterPlaces(places, { query: "masjid", category: "semua" });
    expect(result.map((p) => p.name)).toEqual(["Masjid Al-Ikhlas"]);
  });

  it("ignores surrounding whitespace in the query", () => {
    const result = filterPlaces(places, { query: "  negeri ", category: "semua" });
    expect(result).toHaveLength(2);
  });

  it("combines query and category with AND", () => {
    const result = filterPlaces(places, { query: "smp", category: "sekolah" });
    expect(result.map((p) => p.name)).toEqual(["SMP Negeri 02"]);

    // Same query, wrong category → no match.
    expect(filterPlaces(places, { query: "smp", category: "masjid" })).toEqual(
      [],
    );
  });

  it("treats a null category like 'semua'", () => {
    expect(filterPlaces(places, { query: "", category: null })).toHaveLength(4);
  });
});
