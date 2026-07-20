```

```

# Portal Kelurahan Sidoharjo

## Git

**ABSOLUTELY NO COMMITTING.** Never run `git commit` (or `git push`) unless the
user explicitly asks in that exact message. Leave changes staged/unstaged for
the user to review and commit themselves.

Lightweight, near-zero-cost government website for Kelurahan Sidoharjo.
Solo beginner developer. Build style: "I build, you explain" — implement each
phase directly and explain the reasoning, not a guided-coding curriculum.

## Stack

**Frontend:** Next.js (App Router) + Tailwind + shadcn/ui. Deploy: Vercel Hobby.
**CMS:** Sanity.io + Studio, embedded at `/admin`. Indonesian field labels for
non-tech kelurahan staff.
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
  `contactWhatsapp`, `contactAddress`, `googleMapsUrl`, `orgChartImage`,
  `tourismMapImage` (Wonogiri tourism map shown on `/peta`).
- **`post`** (Berita Kelurahan & Prestasi — merged, since the two had nearly
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

### Assets exported from Figma → `public/images/`

The Figma MCP connector is on a **Starter plan: 6 tool calls/month, all seat
types** (the "200/day" tier is Professional, not Starter). That quota is spent,
so asset URLs can't be pulled programmatically — export by hand from Figma
(select node → Export → PNG 2x, or SVG where it's a clean vector).

**Naming convention:** `ic-<name>.png`, lowercase kebab-case, no spaces.
Place-category icons are named `ic-place-<category>.png` where `<category>` is
the exact `place.category` enum value, so the `/peta` lookup is mechanical
(`` `/images/ic-place-${place.category}.png` ``) with no mapping table.

**All assets are exported and correctly named — this list is complete.** Nothing
further needs pulling from Figma, which matters because the MCP quota is spent.

| File                        | Where used             |
| --------------------------- | ---------------------- |
| `ic-instagram.png`        | header, all pages      |
| `ic-tiktok.png`           | header, all pages      |
| `ic-kantor-kelurahan.png` | homepage Layanan       |
| `ic-peta.png`             | homepage Layanan       |
| `ic-umkm.png`             | homepage Layanan       |
| `ic-prestasi.png`         | homepage Layanan       |
| `ic-place-pemerintahan.png` | `/peta` cards        |
| `ic-place-masjid.png`     | `/peta` cards        |
| `ic-place-sekolah.png`    | `/peta` cards        |
| `ic-place-toko.png`       | `/peta` cards        |
| `ic-place-lainnya.png`    | `/peta` cards        |
| `ic-trophy.png`           | `/prestasi` ×2       |

Two trophies exist, easy to confuse:

- `ic-prestasi` — gold/glossy, homepage Layanan row only.
- `ic-trophy` — white glyph on a **dark-green circle**, used twice on
  `/prestasi`: as the year marker (2026, 2023, …) on the timeline rail, and as
  the thumbnail stand-in on achievement cards with no `coverImage`.

The Figma design uses a third trophy (indigo on a lavender tile) for that
no-cover card. **Deliberately dropped** — `ic-trophy` is reused there instead,
so the design and the build differ on this point on purpose. Don't "fix" it.

**Do NOT export these** — they come from Sanity, uploaded by staff:
`siteSettings.logo` (Wonogiri emblem), `siteSettings.orgChartImage` (Struktur
Organisasi), `siteSettings.tourismMapImage` (Wonogiri tourism map on `/peta` —
currently a Figma placeholder, `image 3`, 630×450 in the desktop frame, but
staff-editable so it's a Sanity field, not a `public/images/` export),
`post.coverImage` / `post.images`, `staffMember.photo`, `umkm.photo`. The
video thumbnail is YouTube's own (iframe embed via `heroVideoUrl`), not an
asset.

**Also do NOT export** generic UI icons — use `lucide-react` (ships with the
shadcn/ui setup): arrows (`lihat semua →`, `lihat lebih lanjut →`), calendar
(post dates), map pin (`lihat peta` buttons), back arrow (`← Kembali`), search.

**Settled:** the 4 Layanan icons are **custom flat-vector assets, not system
emoji.** They read as emoji at a glance (🏛 🗺 🏪 🏆) but are bespoke, and have
been exported. Use the files — do not substitute emoji or an icon font.

### Page background — CSS, not an image

`background (desktop|mobile).png` in `design-reference/` is a plain vertical
gradient, cream → pale mint. **Do not ship it as a PNG** (227 KB for something
CSS renders free). Sampled stops, 1440×960 frame:

- `#F8F6F0` from 0%, held to ~25%
- easing to `#E9F6EB` at 100%

Tailwind: `bg-gradient-to-b from-[#F8F6F0] from-25% to-[#E9F6EB]`. The PNGs stay
in `design-reference/` as a colour reference only.

## Routes (App Router)

`/` `/berita` `/berita/[slug]` `/peta` `/pemerintah-kelurahan` `/umkm`
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
- Assets from Figma: **manual export** to `public/images/` — the
  `plugin:figma:figma` connector is quota-exhausted (see Image storage above).
- Design reference screenshots live in `design-reference/` (gitignored).

## Build roadmap (phased)

- **Phase 0 — Env & deploy skeleton.** Next.js + Tailwind + shadcn/ui scaffold,
  placeholder homepage, Vercel linked and auto-deploying on push. Validates the
  pipeline before any CMS complexity.
- **Phase 1 — Sanity schema + Studio.** Set up the test framework (see
  Verification below) so it's real from here on. All types above; Studio
  embedded at `/admin`. Add the **auto-resize-on-upload** step (client-side
  downscale to ~1600px before the asset uploads) so raw phone photos don't
  fill storage. Milestone: staff can create/edit content in Studio; a big
  photo lands as a small stored original.
- **Phase 2 — Static pages wired to Sanity.** Build `src/lib/sanity/*`, then
  pages easiest→hardest: Header/Footer (siteSettings) → Pemerintah Kelurahan → UMKM →
  Prestasi → Berita (portable text + dynamic routes; paginate the listing) →
  homepage (composes all). Also add the `/api/revalidate` webhook route so
  published posts appear instantly, and serve all images via Sanity CDN
  transform URLs (not Vercel's optimizer).
- **Phase 3 — Map / Places page.** Two-column on desktop (single column stacked
  on mobile): `tourismMapImage` on the left, place list on the right. The map is
  a **static image, not an interactive map** — no map library needed. Right
  column is a search input ("Cari Tempat Umum"), a row of filter pills, then a
  2-up grid of place cards (category icon + name + "lihat peta" button linking
  to `googleMapsUrl`). Icon resolved via `` `/images/ic-place-${category}.png` ``.
  Client-side filter + search — first interactive UI. Two details from the frame:
  the pill row leads with an extra **"Semua"** (all) state that is not a
  category, and the `pemerintahan` enum is displayed as the shorter label
  **"Pemerintah"** — so category → label needs a small display map even though
  category → icon does not.
- **Phase 4 — Demographics charts.** Server component groups `demographicStat`
  by `statType`; one Recharts client component per chart (see below).
- **Phase 5 — Deploy polish + domain.** Vercel env audit, Sanity CDN image
  domain, SEO metadata/sitemap/robots, then `.go.id` via PANDI (kelurahan is a
  government instansi, not eligible for `.desa.id` — needs a request/
  verification letter from the kelurahan or Kecamatan/Dinas Kominfo instead of
  Surat Kuasa + SK Kades; confirm current requirements/cost with PANDI before
  this phase), DNS cutover.

## Verification

**After every phase, before considering it done:** run `npm run build`,
`npm run lint`, and `npm test` — all three must pass clean. Fix failures before
moving to the next phase; don't let them accumulate.

`npm test` doesn't exist yet — no test framework is installed. Set one up at
the **start of Phase 1** (Vitest + React Testing Library is the standard,
lightweight pairing for Next.js) so the three-command check is meaningful from
Phase 1 onward. Phase 0 was verified with build + lint only, since nothing
testable existed yet (a placeholder page has no logic to test).

## Progress checklist

- [X] **Phase 0** — scaffold, placeholder homepage, Vercel linked + auto-deploy
  verified, build/lint clean.
- [ ] **Phase 1** — test framework installed; all schema types in
  `sanity/schemaTypes/`; Studio at `/admin`; auto-resize-on-upload wired;
  staff can create/edit every content type; build/lint/test clean.
- [ ] **Phase 2** — `src/lib/sanity/*` built; Header/Footer, Pemerintah
  Kelurahan, UMKM, Prestasi, Berita (listing + detail, paginated), homepage
  all wired to Sanity; `/api/revalidate` route added; images served via
  Sanity CDN transform URLs; build/lint/test clean.
- [ ] **Phase 3** — Peta page (icon + name + maps button), category filter,
  search bar; build/lint/test clean.
- [ ] **Phase 4** — demographics charts (one per section F metric) wired to
  `demographicStat`; build/lint/test clean.
- [ ] **Phase 5** — Vercel env audit; Sanity CDN image domain configured; SEO
  metadata/sitemap/robots; `.go.id` requirements confirmed and domain
  registered; DNS cutover; build/lint/test clean.

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

All else free tier. Domain cost is **unconfirmed** — see note below.

| Item             | Cost          | Notes                                                                                                                                                                                                                           |
| ---------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Domain`.go.id` | **TBD** | Kelurahan is a government instansi →`.go.id`, not `.desa.id`. Historically often fee-free for verified instansi, but needs confirming with PANDI/Dinas Kominfo before Phase 5 — do not assume the old `.desa.id` price. |
| Vercel           | Rp 0          | Free tier                                                                                                                                                                                                                       |
| Sanity           | Rp 0          | Free tier                                                                                                                                                                                                                       |
| **TOTAL**  | **TBD** | Re-price once`.go.id` requirements are confirmed                                                                                                                                                                              |
