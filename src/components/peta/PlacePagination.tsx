"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PageInfo } from "@/lib/pagination";
import { cn } from "@/lib/utils";

/**
 * The /peta pager. Mirrors the Berita `Pagination` look, but uses buttons and
 * an `onPage` callback instead of links: the list is filtered client-side, so
 * there's no per-page URL to link to — paging is in-memory state.
 */
export function PlacePagination({
  info,
  onPage,
}: {
  info: PageInfo;
  onPage: (page: number) => void;
}) {
  const { page, totalPages, hasPrev, hasNext } = info;
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Navigasi halaman"
      className="mt-8 flex items-center justify-center gap-2"
    >
      <Step
        enabled={hasPrev}
        onClick={() => onPage(page - 1)}
        label="Halaman sebelumnya"
        icon={<ChevronLeft className="size-4" aria-hidden />}
      />

      {pages.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onPage(n)}
          aria-current={n === page ? "page" : undefined}
          className={cn(
            "grid size-9 place-items-center rounded-full font-heading text-xs sm:text-sm font-bold transition-colors",
            n === page
              ? "bg-brand text-white"
              : "bg-white text-foreground hover:bg-black/5",
          )}
        >
          {n}
        </button>
      ))}

      <Step
        enabled={hasNext}
        onClick={() => onPage(page + 1)}
        label="Halaman berikutnya"
        icon={<ChevronRight className="size-4" aria-hidden />}
      />
    </nav>
  );
}

/** Disabled steps render as an inert span — a dead button still takes focus. */
function Step({
  enabled,
  onClick,
  label,
  icon,
}: {
  enabled: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}) {
  const base = "grid size-9 place-items-center rounded-full";

  if (!enabled) {
    return (
      <span aria-hidden className={cn(base, "text-muted-foreground/40")}>
        {icon}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(base, "bg-white transition-colors hover:bg-black/5")}
    >
      {icon}
    </button>
  );
}
