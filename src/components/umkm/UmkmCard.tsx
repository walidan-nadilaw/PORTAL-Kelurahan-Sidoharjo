import Image from "next/image";
import { MapPin } from "lucide-react";
import { imageProps } from "@/lib/sanity/image";
import type { Umkm } from "@/lib/sanity/types";

export function UmkmCard({ item }: { item: Umkm }) {
  const photo = imageProps(item.photo);

  return (
    <li className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative aspect-[16/10] bg-muted">
        {photo && (
          <Image
            {...photo}
            alt={item.businessName}
            sizes="(min-width: 1024px) 30vw, 100vw"
            className="size-full object-cover"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h2 className="text-base font-bold text-brand-navy sm:text-lg">
          {item.businessName}
        </h2>
        {item.description && (
          <p className="text-xs sm:text-sm text-muted-foreground">{item.description}</p>
        )}

        <div className="mt-auto flex flex-wrap gap-3 pt-2">
          {item.contactUrl && (
            <a
              href={item.contactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-lg bg-brand px-6 py-2.5 text-center font-heading text-xs sm:text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              Hubungi
            </a>
          )}
          {/* Optional field — the button only exists when staff filled it in. */}
          {item.googleMapsUrl && (
            <a
              href={item.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-black/15 px-4 py-2.5 text-xs sm:text-sm font-medium transition-colors hover:bg-black/5"
            >
              <MapPin className="size-4" aria-hidden />
              lihat peta
            </a>
          )}
        </div>
      </div>
    </li>
  );
}
