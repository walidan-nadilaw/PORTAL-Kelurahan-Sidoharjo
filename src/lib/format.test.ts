import { describe, expect, it } from "vitest";
import { formatDateLong, formatDayMonth, groupByYear } from "./format";

describe("date formatting", () => {
  it("formats a long Indonesian date", () => {
    expect(formatDateLong("2025-06-15T10:30:00Z")).toBe("15 Juni 2025");
  });

  it("omits the year for timeline cards", () => {
    expect(formatDayMonth("2025-06-15T10:30:00Z")).toBe("15 Juni");
  });
});

describe("groupByYear", () => {
  const post = (id: string, publishedAt: string) => ({ id, publishedAt });

  it("returns newest year first", () => {
    const groups = groupByYear(
      [
        post("a", "2021-03-01T00:00:00Z"),
        post("b", "2026-01-01T00:00:00Z"),
        post("c", "2023-07-04T00:00:00Z"),
      ],
      (p) => p.publishedAt,
    );

    expect(groups.map((g) => g.year)).toEqual([2026, 2023, 2021]);
  });

  it("collects several posts under one year, preserving input order", () => {
    const groups = groupByYear(
      [
        post("first", "2022-01-01T00:00:00Z"),
        post("second", "2022-09-09T00:00:00Z"),
      ],
      (p) => p.publishedAt,
    );

    expect(groups).toHaveLength(1);
    expect(groups[0].items.map((p) => p.id)).toEqual(["first", "second"]);
  });

  it("skips items with a missing or unparseable date", () => {
    const groups = groupByYear(
      [
        post("ok", "2024-05-05T00:00:00Z"),
        { id: "no-date", publishedAt: null },
        { id: "garbage", publishedAt: "not a date" },
      ],
      (p) => p.publishedAt,
    );

    expect(groups).toHaveLength(1);
    expect(groups[0].items.map((p) => p.id)).toEqual(["ok"]);
  });

  it("returns an empty list for no input", () => {
    expect(groupByYear([], () => null)).toEqual([]);
  });
});
