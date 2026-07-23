import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PageInfo } from "@/lib/pagination";
import { cn } from "@/lib/utils";

/**
 * Plain links, no client-side state — so paging works without JavaScript and
 * each page stays independently cacheable and crawlable.
 */
export function Pagination({ info }: { info: PageInfo }) {
  const { page, totalPages, hasPrev, hasNext } = info;
  if (totalPages <= 1) return null;

  const href = (n: number) => (n === 1 ? "/berita" : `/berita?page=${n}`);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Navigasi halaman"
      className="mt-10 flex items-center justify-center gap-2"
    >
      <Step
        href={href(page - 1)}
        enabled={hasPrev}
        label="Halaman sebelumnya"
        icon={<ChevronLeft className="size-4" aria-hidden />}
      />

      {pages.map((n) => (
        <Link
          key={n}
          href={href(n)}
          aria-current={n === page ? "page" : undefined}
          className={cn(
            "grid size-9 place-items-center rounded-full font-heading text-xs sm:text-sm font-bold transition-colors",
            n === page
              ? "bg-brand text-white"
              : "bg-white text-foreground hover:bg-black/5",
          )}
        >
          {n}
        </Link>
      ))}

      <Step
        href={href(page + 1)}
        enabled={hasNext}
        label="Halaman berikutnya"
        icon={<ChevronRight className="size-4" aria-hidden />}
      />
    </nav>
  );
}

/**
 * Rendered as a non-interactive span when disabled — a link to nowhere is
 * still focusable and announced as a link, which misleads screen readers.
 */
function Step({
  href,
  enabled,
  label,
  icon,
}: {
  href: string;
  enabled: boolean;
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
    <Link
      href={href}
      aria-label={label}
      className={cn(base, "bg-white transition-colors hover:bg-black/5")}
    >
      {icon}
    </Link>
  );
}
