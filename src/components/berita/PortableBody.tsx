import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { imageProps } from "@/lib/sanity/image";
import type { PortableTextBlock, SanityImage } from "@/lib/sanity/types";

/**
 * Renderers for `post.body`. The image one matters most: without it, an image
 * dropped into the body renders as an unusable asset reference rather than a
 * picture.
 */
const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: SanityImage & { alt?: string } }) => {
      const props = imageProps(value);
      if (!props) return null;
      return (
        <Image
          {...props}
          alt={value.alt ?? ""}
          sizes="(min-width: 1024px) 800px, 100vw"
          className="my-6 h-auto w-full rounded-xl"
        />
      );
    },
  },
  block: {
    // Subheadings inside the article body follow the page heading weight, so
    // they can never end up heavier than the article's own <h1>.
    h2: ({ children }) => (
      <h2 className="mt-8 text-lg sm:text-2xl">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 text-base sm:text-lg">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-brand/40 pl-4 italic">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => <p className="mt-4 text-justify">{children}</p>,
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-4 list-disc space-y-1 pl-6">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mt-4 list-decimal space-y-1 pl-6">{children}</ol>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand underline underline-offset-2"
      >
        {children}
      </a>
    ),
  },
};

export function PortableBody({ value }: { value: PortableTextBlock[] | null }) {
  if (!value?.length) return null;
  return (
    <div className="text-sm text-muted-foreground sm:text-base">
      <PortableText value={value} components={components} />
    </div>
  );
}
