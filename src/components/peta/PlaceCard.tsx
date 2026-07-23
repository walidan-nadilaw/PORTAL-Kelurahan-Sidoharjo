import Image from "next/image";
import { MapPin } from "lucide-react";
import type { Place } from "@/lib/sanity/types";

/**
 * One public place: a mint icon square, the name, and a "lihat peta" button to
 * Google Maps. The icon is resolved mechanically from the category —
 * `ic-place-<category>.png` — so there's no mapping table to keep in sync.
 */
export function PlaceCard({ place }: { place: Place }) {
  return (
    <li className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm transition-shadow hover:shadow-lg sm:gap-4 sm:p-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand/10">
        <Image
          src={`/images/ic-place-${place.category}.png`}
          alt=""
          width={24}
          height={24}
          className="size-6 object-contain"
        />
      </span>

      <h2 className="min-w-0 flex-1 truncate text-sm font-bold text-brand-navy sm:text-base">
        {place.name}
      </h2>

      <a
        href={place.googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-black/15 px-3 py-2 text-xs sm:text-sm font-medium transition-colors hover:bg-black/5"
      >
        <MapPin className="size-4" aria-hidden />
        lihat peta
      </a>
    </li>
  );
}
