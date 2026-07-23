"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The "← Kembali" back control at the top-left of every inner page. Plain text
 * on mobile, a white pill from `sm:` up — per the mockups.
 *
 * Goes back through browser history when there is any, so a reader who opened
 * an article from the homepage returns to the homepage rather than being sent
 * to /berita. `href` stays as the real destination: it is what renders in the
 * markup, so the button still works with JavaScript disabled, and it is where
 * someone arriving from a shared link or search result is sent.
 */
export function BackButton({
  href = "/",
  className,
}: {
  href?: string;
  className?: string;
}) {
  const router = useRouter();

  return (
    <Link
      href={href}
      onClick={(event) => {
        // Modified clicks (new tab, etc.) must keep their default behaviour.
        if (event.metaKey || event.ctrlKey || event.shiftKey) return;
        if (window.history.length > 1) {
          event.preventDefault();
          router.back();
        }
      }}
      className={cn(
        "inline-flex items-center gap-2 rounded-full font-heading text-xs sm:text-sm font-bold transition-shadow hover:text-brand sm:bg-white/30 sm:px-5 sm:py-2.5 sm:shadow-sm sm:hover:shadow-md",
        className,
      )}
    >
      <ArrowLeft className="size-4" aria-hidden />
      Kembali
    </Link>
  );
}
