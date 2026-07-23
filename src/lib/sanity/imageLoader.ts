import type { ImageLoaderProps } from "next/image";

/**
 * Global image loader, wired up via `images.loaderFile` in next.config.ts.
 *
 * It has to be configured globally rather than passed as a `loader` prop:
 * next/image is a Client Component, and functions can't be passed from a Server
 * Component to a Client Component. Every content page here is a server
 * component, so the prop form throws at render.
 *
 * Being global, this runs for *all* images — including the static PNGs in
 * public/images/ — so anything that isn't a Sanity asset is returned untouched.
 */
export default function imageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  // Local/static assets: no CDN to resize them, so hand back the path as-is.
  if (!src.startsWith("https://cdn.sanity.io/")) return src;

  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  // auto=format serves WebP/AVIF where supported; fit=max never upscales past
  // the stored original.
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "max");
  return url.toString();
}
