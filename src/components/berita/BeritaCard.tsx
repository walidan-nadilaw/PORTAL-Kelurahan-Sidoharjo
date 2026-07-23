import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { formatDateLong } from "@/lib/format";
import { imageProps } from "@/lib/sanity/image";
import type { PostSummary } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";

/**
 * Used by /berita and the homepage's "Berita Kelurahan" row.
 *
 * Kept separate from PrestasiCard on purpose: that one shows day+month (its
 * year is the timeline heading) and has a no-cover trophy variant. Merging
 * them would mean a component with two unrelated modes.
 */
export function BeritaCard({
  post,
  className,
}: {
  post: PostSummary;
  /** Layout only — the homepage carousel sizes items differently to the grid. */
  className?: string;
}) {
  const cover = imageProps(post.coverImage);

  return (
    <li
      className={cn(
        // `relative` anchors the stretched link below, which makes the whole
        // card tappable. `group` lets hover on any part tint the link.
        "group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-lg",
        className,
      )}
    >
      {/*
       * 3/5 image, 2/5 text. Split by flex-basis rather than a fixed aspect
       * ratio so the proportion holds whatever height the row settles on —
       * grid and flex both stretch every card to match the tallest one, so
       * the images line up across a row even when titles differ in length.
       */}
      {/* min-h floor: with no cover the div is empty, and a percentage basis
          of a content-sized row would collapse it to nothing (visible in the
          mobile carousel, where nothing else sets the height). */}
      <div className="relative min-h-40 basis-3/5 bg-muted">
        {cover && (
          <Image
            {...cover}
            alt={post.title}
            sizes="(min-width: 1024px) 30vw, 100vw"
            className="size-full object-cover"
          />
        )}
      </div>

      <div className="flex basis-2/5 flex-col gap-2 p-5">
        <h3 className="text-base font-semibold text-brand-navy sm:text-lg">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="line-clamp-3 text-xs sm:text-sm text-muted-foreground">
            {post.excerpt}
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
          {/*
           * after:absolute after:inset-0 stretches an invisible overlay across
           * the whole card, so tapping anywhere opens the article — while
           * keeping exactly one real <a> in the markup. Wrapping the card in a
           * link instead would nest <a> inside <a>, which is invalid.
           */}
          <Link
            href={`/berita/${post.slug}`}
            className="inline-flex items-center gap-2 font-heading text-xs sm:text-sm font-semibold after:absolute after:inset-0 group-hover:text-brand"
          >
            lihat lebih lanjut
            <ArrowRight className="size-4" aria-hidden />
          </Link>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium   text-muted-foreground">
            <Calendar className="size-3.5" aria-hidden />
            {formatDateLong(post.publishedAt)}
          </span>
        </div>
      </div>
    </li>
  );
}
