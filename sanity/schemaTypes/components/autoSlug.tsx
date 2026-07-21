import { useEffect, useRef } from "react";
import { set, useFormValue } from "sanity";
import type { FieldProps, ObjectInputProps, SlugValue } from "sanity";

const PUBLISHED_AT_DESCRIPTIONS: Record<string, string> = {
  berita:
    "Terisi otomatis dengan tanggal hari ini — ubah hanya jika ingin memakai tanggal lain",
  prestasi:
    "Terisi otomatis dengan tanggal hari ini — juga dipakai untuk mengelompokkan prestasi per tahun",
};

/** Swaps the help text under Tanggal Publikasi depending on Berita vs Prestasi. */
export function PublishedAtField(props: FieldProps) {
  const category = useFormValue(["category"]) as string | undefined;
  const description = category
    ? PUBLISHED_AT_DESCRIPTIONS[category]
    : props.description;
  return props.renderDefault({ ...props, description });
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

/**
 * Derives the slug from title + creation date at the *document* level, so the
 * slug field itself can stay `hidden: true` in the schema.
 *
 * This has to live here rather than on the slug field: `hidden: true` removes a
 * field from the form entirely, which would unmount a field-level input and stop
 * it syncing. A document-level input stays mounted no matter which fields render.
 */
export function AutoSlugDocumentInput(props: ObjectInputProps) {
  const { onChange } = props;
  const title = useFormValue(["title"]) as string | undefined;
  const createdAt = useFormValue(["_createdAt"]) as string | undefined;
  const currentSlug = (useFormValue(["slug"]) as SlugValue | undefined)?.current;
  const fallbackDateRef = useRef(new Date().toISOString());

  useEffect(() => {
    if (!title) return;
    const datePart = (createdAt ?? fallbackDateRef.current).slice(0, 10);
    const next = `${slugify(title)}-${datePart}`;
    if (currentSlug !== next) {
      onChange(set({ _type: "slug", current: next }, ["slug"]));
    }
  }, [title, createdAt, currentSlug, onChange]);

  return props.renderDefault(props);
}
