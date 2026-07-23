import { describe, expect, it } from "vitest";
import { toEmbedUrl } from "./youtube";

const EMBED = "https://www.youtube.com/embed/dQw4w9WgXcQ";

describe("toEmbedUrl", () => {
  it("converts a watch URL", () => {
    expect(toEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(EMBED);
  });

  it("converts a watch URL with extra params", () => {
    expect(
      toEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s&list=abc"),
    ).toBe(EMBED);
  });

  it("converts a youtu.be share link", () => {
    expect(toEmbedUrl("https://youtu.be/dQw4w9WgXcQ")).toBe(EMBED);
  });

  it("converts a shorts link", () => {
    expect(toEmbedUrl("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toBe(EMBED);
  });

  it("passes an already-embed URL through", () => {
    expect(toEmbedUrl(EMBED)).toBe(EMBED);
  });

  it("tolerates a missing www and surrounding whitespace", () => {
    expect(toEmbedUrl("  https://youtube.com/watch?v=dQw4w9WgXcQ  ")).toBe(EMBED);
  });

  /**
   * Staff paste whatever they have; anything unusable must return null so the
   * homepage skips the section instead of embedding a broken player.
   */
  it.each([
    ["empty", ""],
    ["null", null],
    ["undefined", undefined],
    ["not a URL", "just some text"],
    ["wrong host", "https://vimeo.com/12345678"],
    ["youtube but no video id", "https://www.youtube.com/"],
    ["malformed id", "https://www.youtube.com/watch?v=tooshort"],
  ])("returns null for %s", (_label, input) => {
    expect(toEmbedUrl(input)).toBeNull();
  });
});
