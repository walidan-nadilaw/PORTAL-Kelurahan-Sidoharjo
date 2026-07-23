# Portal Kelurahan Sidoharjo

Government website for Kelurahan Sidoharjo. See [CLAUDE.md](./CLAUDE.md) for
the full architecture, content model, and build roadmap.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Image storage budget

**The one metered resource that grows over time.** Sanity's free tier allows
**5 GB of assets**, and Sanity always keeps the *original* upload — serving a
resized copy does not shrink what's stored. Nothing else in this project
accumulates: the site is static, there's no database, and traffic is free.

### The trade that was made

Studio ships a custom asset source (`sanity/assetSources/`) that downscales
images to ~1600px **in the browser, before upload**. It is reachable via the
**Select** button on any image field.

It is *not* the only upload path. Drag-and-drop is deliberately left enabled
(`directUploads: true` in `sanity.config.ts`). Disabling it did guarantee every
photo was shrunk, but it made Sanity render a greyed-out upload row reading
**"Can't upload files here"** — which non-technical staff reasonably read as a
broken field. Usability was chosen over the guarantee; image field descriptions
now recommend Select instead of forcing it.

**The cost of that choice is time.** Rough figures — a raw phone photo is
~4 MB, a resized one ~300 KB, and a berita post carries about 9 images
(1 cover + ~8 in the Dokumentasi gallery):

| Posting rate | If staff drag-and-drop raw photos | If staff use Select |
| --- | --- | --- |
| 1 post / month | ~12 years | beyond any planning horizon |
| 2 posts / month | ~6 years | ~80 years |
| 1 post / week | ~3 years | ~35 years |

The Dokumentasi gallery dominates this. A post with 2 photos instead of 8
roughly triples every figure in the left column.

### What a future developer should do

The realistic failure mode is uploads silently starting to fail some years
after handover, once nobody is maintaining the site. If you are picking this
project up:

1. **Check actual usage first** — sanity.io/manage → project → Usage. Do not
   act on the estimates above; they assume a posting rate nobody has verified.
2. **If storage is climbing faster than expected**, the cheapest fix is to set
   `directUploads: false` in `sanity.config.ts`, which forces every upload back
   through the resize source. Expect the confusing "Can't upload files here"
   message to return — pair it with a note in the staff guide.
3. **If the quota is already close**, old originals can be replaced with
   resized versions; the raw file is what's being stored, not what's served.
4. Only then consider a paid tier. It contradicts the Rp 0 goal, and the
   kelurahan may have no budget process for a recurring foreign card charge.
