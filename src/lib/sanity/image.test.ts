import { describe, expect, it } from "vitest";
import imageLoader from "./imageLoader";

const BASE = "https://cdn.sanity.io/images/abc123/production/deadbeef-1600x900.jpg";

describe("imageLoader", () => {
  it("requests the asked-for width from Sanity's CDN", () => {
    const url = new URL(imageLoader({ src: BASE, width: 800 }));
    expect(url.hostname).toBe("cdn.sanity.io");
    expect(url.searchParams.get("w")).toBe("800");
  });

  it("asks for auto format and never upscales", () => {
    const url = new URL(imageLoader({ src: BASE, width: 400 }));
    expect(url.searchParams.get("auto")).toBe("format");
    expect(url.searchParams.get("fit")).toBe("max");
  });

  it("defaults quality to 75 but honours an explicit value", () => {
    const dflt = new URL(imageLoader({ src: BASE, width: 400 }));
    expect(dflt.searchParams.get("q")).toBe("75");

    const explicit = new URL(imageLoader({ src: BASE, width: 400, quality: 90 }));
    expect(explicit.searchParams.get("q")).toBe("90");
  });

  /**
   * The loader is global, so it also receives the static PNGs in
   * public/images/. Those have no CDN behind them and must pass through
   * untouched — rewriting them would produce a 404.
   */
  it("returns local asset paths unchanged", () => {
    expect(imageLoader({ src: "/images/ic-trophy.png", width: 800 })).toBe(
      "/images/ic-trophy.png",
    );
  });

  /**
   * The whole point of the custom loader: image bytes must come from Sanity,
   * not Vercel's optimizer, which is metered on the Hobby plan.
   */
  it("never routes through Vercel's image optimizer", () => {
    expect(imageLoader({ src: BASE, width: 800 })).not.toContain("/_next/image");
  });
});
