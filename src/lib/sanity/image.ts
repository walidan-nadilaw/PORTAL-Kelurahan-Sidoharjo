import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "./env";
import type { SanityImage } from "./types";

const builder = createImageUrlBuilder({ projectId, dataset });

/**
 * Base CDN URL for a Sanity image, with no sizing params applied yet — the
 * resizing params are added by the global loader in imageLoader.ts.
 */
export function urlFor(source: SanityImage) {
  return builder.image(source);
}

/**
 * Everything a component needs to render a Sanity image without layout shift.
 * Returns null when the field is empty so callers can branch on it.
 *
 * Deliberately no `loader` here — it's configured globally in next.config.ts,
 * because a function prop can't cross the server/client component boundary.
 */
export function imageProps(image: SanityImage | null | undefined) {
  if (!image?.asset) return null;
  const { dimensions, lqip } = image.asset.metadata;
  return {
    src: urlFor(image).url(),
    width: dimensions.width,
    height: dimensions.height,
    blurDataURL: lqip,
    placeholder: "blur" as const,
  };
}

/**
 * Same, minus width/height — for <Image fill>, where the image stretches to a
 * sized parent and Next rejects explicit dimensions.
 */
export function imageFillProps(image: SanityImage | null | undefined) {
  const props = imageProps(image);
  if (!props) return null;
  const { width: _w, height: _h, ...rest } = props;
  void _w;
  void _h;
  return rest;
}
