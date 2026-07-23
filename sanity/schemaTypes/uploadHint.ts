/**
 * Drag-and-drop is enabled, so staff can upload however they like — but a raw
 * phone photo is ~4 MB against a 5 GB quota, while the "Select" source shrinks
 * it to ~300 KB first. Every image field therefore nudges towards Select
 * rather than forcing it.
 *
 * Forcing it was the original design; it made Sanity render a greyed-out
 * "Can't upload files here", which non-technical staff read as a broken field.
 * See the storage budget note in README.md for what this trade costs.
 */
export const UPLOAD_HINT =
  'Sebaiknya unggah lewat "Select" agar ukuran foto otomatis diperkecil.';

/** Appends the hint to a field's own description. */
export function withUploadHint(description?: string): string {
  return description ? `${UPLOAD_HINT} ${description}` : UPLOAD_HINT;
}
