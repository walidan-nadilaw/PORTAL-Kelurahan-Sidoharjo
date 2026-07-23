import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar } from "lucide-react";
import { PortableBody } from "@/components/berita/PortableBody";
import { BackButton } from "@/components/layout/BackButton";
import { formatDateLong } from "@/lib/format";
import { client } from "@/lib/sanity/client";
import { imageProps } from "@/lib/sanity/image";
import { allPostSlugsQuery, postBySlugQuery } from "@/lib/sanity/queries";
import type { PostDetail } from "@/lib/sanity/types";

export const revalidate = 3600;

type Params = { params: Promise<{ slug: string }> };

/**
 * Every post, both categories — Prestasi articles live at this route too.
 * Filtering to `berita` here would leave every Prestasi card 404ing.
 */
export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(allPostSlugsQuery);
  return slugs.map((slug) => ({ slug }));
}

async function getPost(slug: string) {
  return client.fetch<PostDetail | null>(postBySlugQuery, { slug });
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return { title: "Tidak ditemukan" };
  return {
    title: `${post.title} — Portal Kelurahan Sidoharjo`,
    description: post.excerpt ?? undefined,
  };
}

export default async function ArticlePage({ params }: Params) {
  const post = await getPost((await params).slug);
  if (!post) notFound();

  const cover = imageProps(post.coverImage);
  // flatMap rather than map+filter so `props` narrows to non-null.
  const gallery = (post.images ?? []).flatMap((image) => {
    const props = imageProps(image);
    return props ? [{ image, props }] : [];
  });

  // Prestasi articles are reached from /prestasi, so send readers back there.
  const backHref = post.category === "prestasi" ? "/prestasi" : "/berita";

  return (
    <article>
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <BackButton href={backHref} />
      </div>

      {/* Same max-w and padding as the BackButton above, so both share a
          left edge. Change one, change the other. */}
      <div className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <p className="flex items-center gap-2 font-heading text-xs sm:text-sm font-bold">
          <Calendar className="size-4" aria-hidden />
          {formatDateLong(post.publishedAt)}
        </p>

        <h1 className="mt-2 text-xl sm:text-4xl">{post.title}</h1>
      </div>

      {cover && (
        <Image
          {...cover}
          // Empty alt: the headline sits directly above, so naming the photo
          // again would only repeat it to screen readers.
          alt=""
          priority
          sizes="100vw"
          className="aspect-[16/7] w-full object-cover"
        />
      )}

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <PortableBody value={post.body} />

        {gallery.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg sm:text-3xl">Dokumentasi Kegiatan</h2>
            <ul className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {gallery.map(({ image, props }, i) => (
                <li key={props.src}>
                  <Image
                    {...props}
                    alt={image.alt ?? `${post.title} — dokumentasi ${i + 1}`}
                    sizes="(min-width: 640px) 33vw, 50vw"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  );
}
