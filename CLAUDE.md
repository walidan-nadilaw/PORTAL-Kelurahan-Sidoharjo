# Desa Sidoharjo Portal

## Git

**ABSOLUTELY NO COMMITTING.** Never run `git commit` (or `git push`) unless the
user explicitly asks in that exact message. Leave changes staged/unstaged for
the user to review and commit themselves.

Lightweight, near-zero-cost village government website for Desa Sidoharjo.
Solo beginner developer. Build style: "I build, you explain" — implement each
phase directly and explain the reasoning, not a guided-coding curriculum.

## Stack

**Frontend:** Next.js (App Router) + Tailwind + shadcn/ui. Deploy: Vercel Hobby.
**CMS:** Sanity.io + Studio, embedded at `/admin`. Indonesian field labels for
non-tech village staff.
**Charts:** Recharts, fed by Sanity `demographicStat` data.

No database. All content is Sanity-authored; the site is fully read-only
(static/ISR). No complaints form, no Supabase, no server-side writes.

Single user: the admin, who edits content via Sanity Studio at `/admin`.
No public accounts, no login on the public site, no per-editor roles.

## Content model (Sanity)

`sanity/schemaTypes/`, one file per type, aggregated in `index.ts`. All field
titles in Bahasa Indonesia (editors are non-technical staff).

- **`siteSettings`** (singleton): `logo`, `tiktokUrl`, `instagramUrl`,
  `villageName`, `heroVideoUrl` (YouTube embed), `contactEmail`,
  `contactWhatsapp`, `contactAddress`, `googleMapsUrl`, `orgChartImage`.
- **`post`** (Berita Desa & Prestasi — merged, since the two had nearly
  identical fields; still two separate pages, `/berita` and `/prestasi`,
  each filtering by `category`): `title`, `slug`, `category`
  (`berita`|`prestasi`), `publishedAt`
  (berita entries only), `date` (prestasi entries only — used to group
  achievements by year and shown on the achievement card), `coverImage`
  (listing thumbnail), `images` (array, rendered in a "Dokumentasi" section
  on the detail page), `excerpt`, `body` (portable text).
- **`place`** (Peta & Tempat Umum): `name`, `category`
  (`pemerintahan`|`masjid`|`sekolah`|`toko`|`lainnya` — drives icon AND
  filter), `googleMapsUrl`. No photo/description/address.
- **`staffMember`**: `name`, `position`, `photo`, `order` (manual sort).
- **`umkm`**: `businessName`, `description`, `photo`, `contactUrl` (link to
  preferred contact channel — WhatsApp, Line, etc.), `category`.
- **`demographicStat`** (flat rows — trivial for staff to add one at a time):
  `statType`, `year`, `label`, `value`, `unit`. See Demographics below.
- **`blockContent`**: portable text object used by `post.body`.

## Image storage

No separate storage service. Two homes:

- **Sanity CDN** (`cdn.sanity.io`) — every `image` field above. Staff upload via
  Studio; render through `src/lib/sanity/image.ts`. Use for anything staff edit.
- **`public/images/`** — fixed design assets from Figma (icons, illustrations)
  that never change and aren't staff-editable. Rendered via `<Image>`.

**Asset storage is the one metered resource that grows over time** (mostly from
news images). Two separate concerns — both must be handled:

- **Display (bandwidth/speed):** serve via **Sanity CDN transform URLs**
  (`?w=…&auto=format` → auto-WebP, resized), NOT Vercel's image optimizer —
  avoids Vercel Hobby's optimization quota. `src/lib/sanity/image.ts` builds
  these. This is automatic once wired; the admin does nothing.
- **Storage (the 5 GB ceiling):** Sanity stores the **raw original**, and
  `auto=format` does NOT shrink it. So the stored file must go in already small.
  The admin is non-technical and will upload raw phone photos, so **do not rely
  on upload discipline** — add an **auto-resize-on-upload** step in Sanity Studio
  (client-side downscale to ~1600px wide before the asset is sent). Admin still
  just drags a phone photo; the shrink is invisible. This turns storage from
  "~1–8 years" into "effectively never" without any admin habit.
- Rule of thumb: **web-sized originals in, WebP variants out.**
- Set `cdn.sanity.io` in `next.config.js` image domains.

## Routes (App Router)

`/` `/berita` `/berita/[slug]` `/peta` `/pemerintah-desa` `/umkm`
`/prestasi` `/demografi` `/admin` (Studio) `/api/revalidate` (webhook target).
All content pages are ISR. Readers are served Vercel's edge cache — Sanity is
queried only at build/revalidation, so load scales with content changes, not
traffic.

**On-demand revalidation (not optional for a news site):** a Sanity webhook →
`src/app/api/revalidate/route.ts` makes new posts appear instantly instead of
waiting up to an hour. Build it in Phase 2.

**Paginate `/berita`:** GROQ-slice the listing (e.g. `[0...12]`) with load-more
or page numbers — never render all posts at once. Design the query with a limit
from the start.

## Conventions

- `src/lib/sanity/{client,queries,image}.ts` — central query/client/image layer.
- `src/components/{layout,home,berita,peta,pemerintah,umkm,prestasi,demografi/charts}/*`
- Staff-editable images (e.g. org chart) go through Sanity, not `/public`.
- Assets from Figma via `plugin:figma:figma` connector (authorize first),
  fallback = manual export to `public/images/`.

## Build roadmap (phased)

- **Phase 0 — Env & deploy skeleton.** Next.js + Tailwind + shadcn/ui scaffold,
  placeholder homepage, Vercel linked and auto-deploying on push. Validates the
  pipeline before any CMS complexity.
- **Phase 1 — Sanity schema + Studio.** All types above; Studio embedded at
  `/admin`. Add the **auto-resize-on-upload** step (client-side downscale to
  ~1600px before the asset uploads) so raw phone photos don't fill storage.
  Milestone: staff can create/edit content in Studio; a big photo lands as a
  small stored original.
- **Phase 2 — Static pages wired to Sanity.** Build `src/lib/sanity/*`, then
  pages easiest→hardest: Header/Footer (siteSettings) → Pemerintah Desa → UMKM →
  Prestasi → Berita (portable text + dynamic routes; paginate the listing) →
  homepage (composes all). Also add the `/api/revalidate` webhook route so
  published posts appear instantly, and serve all images via Sanity CDN
  transform URLs (not Vercel's optimizer).
- **Phase 3 — Map / Places page.** List of icon + name + "Buka di Google Maps"
  button. Icon chosen via `place.category` lookup. Client-side category filter
  + search bar (filter by name) — first interactive UI.
- **Phase 4 — Demographics charts.** Server component groups `demographicStat`
  by `statType`; one Recharts client component per chart (see below).
- **Phase 5 — Deploy polish + domain.** Vercel env audit, Sanity CDN image
  domain, SEO metadata/sitemap/robots, then `.desa.id` via PANDI (needs Surat
  Kuasa + SK Kades), DNS cutover.

## Demographics page (investor/collaborator lens)

Priority order, each fed by `demographicStat` rows:

1. **Distribusi Usia / Rasio Usia Produktif** (bar/pyramid, 0–14/15–64/65+) —
   labor pool size and dependency ratio.
2. **Tingkat Pendidikan** (horizontal bar: Tidak Sekolah→SD→SMP→SMA/SMK→D/S1+) —
   workforce skill/trainability.
3. **Mata Pencaharian** (pie/bar: Petani, Pedagang/UMKM, Buruh, Jasa, PNS,
   Lainnya) — clearest signal of local economic activity.
4. **Akses Infrastruktur** (grouped bar/stat tiles: % listrik, air bersih,
   sanitasi, internet) — hard gating factor for investment.
5. **Tren Pertumbuhan Populasi** (line, 5–10yr) — trajectory signal.
6. *(Optional, if data exists & appropriate)* **Klasifikasi Kesejahteraan**.

Deprioritized (resident nice-to-know, not investor-relevant): religion, marital
status, gender ratio alone. Flat schema supports adding these with no changes.

## Cost 2026

Only domain costs money. All else free tier.

| Item               | Cost                      | Notes                                    |
| ------------------ | ------------------------- | ---------------------------------------- |
| Domain`.desa.id` | Rp 55k–65k               | PANDI price. Need Surat Kuasa + SK Kades |
| Vercel             | Rp 0                      | Free tier                                |
| Sanity             | Rp 0                      | Free tier                                |
| PPN 11%            | ~Rp 7k                    | Tax on domain                            |
| **TOTAL**    | **~Rp 62k–72k/yr** |                                          |
