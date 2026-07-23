/**
 * Turns whatever YouTube URL staff paste into an embeddable one.
 *
 * They'll copy from the address bar, the Share button, or the mobile app, and
 * those give three different shapes. Anything unrecognisable returns null so
 * callers can skip rendering rather than showing a broken player.
 */
export function toEmbedUrl(input: string | null | undefined): string | null {
  if (!input) return null;

  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "");
  let id: string | null = null;

  if (host === "youtu.be") {
    // https://youtu.be/<id>
    id = url.pathname.slice(1) || null;
  } else if (host === "youtube.com" || host === "m.youtube.com") {
    if (url.pathname === "/watch") {
      id = url.searchParams.get("v");
    } else if (url.pathname.startsWith("/embed/")) {
      id = url.pathname.slice("/embed/".length) || null;
    } else if (url.pathname.startsWith("/shorts/")) {
      id = url.pathname.slice("/shorts/".length) || null;
    }
  }

  // Video IDs are 11 chars of [A-Za-z0-9_-]; anything else is a bad paste.
  if (!id || !/^[\w-]{11}$/.test(id)) return null;

  return `https://www.youtube.com/embed/${id}`;
}
