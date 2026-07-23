import { defineField, defineType } from "sanity";
import {
  PostDocumentInput,
  PublishedAtField,
} from "./components/postDocumentInput";
import { withUploadHint } from "./uploadHint";

export const post = defineType({
  name: "post",
  title: "Artikel",
  type: "document",
  components: { input: PostDocumentInput },
  fields: [
    defineField({
      name: "title",
      title: "Judul",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Kategori",
      description:
        "Ditentukan otomatis dari menu \"Buat Berita\" / \"Buat Prestasi\" saat dokumen dibuat",
      type: "string",
      options: {
        list: [
          { title: "Berita", value: "berita" },
          { title: "Prestasi", value: "prestasi" },
        ],
      },
      hidden: true,
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Tanggal Publikasi",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      components: { field: PublishedAtField },
    }),
    defineField({
      name: "body",
      title: "Isi",
      type: "blockContent",
    }),
    defineField({
      name: "excerpt",
      title: "Deskripsi Singkat",
      description:
        "Terisi otomatis dari baris pertama Isi — boleh diubah bila ingin ringkasan sendiri. Ditampilkan di halaman daftar",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "coverImage",
      title: "Gambar Sampul",
      description: withUploadHint(
        "Ditampilkan sebagai thumbnail di halaman daftar",
      ),
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "images",
      title: "Dokumentasi",
      description: withUploadHint(
        "Kumpulan foto tambahan, ditampilkan di halaman detail",
      ),
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    // Auto-derived by PostDocumentInput; last in the list so that even if a
    // future Studio version starts rendering hidden fields, it lands at the
    // bottom of the form instead of splitting the visible fields apart.
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      hidden: true,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      publishedAt: "publishedAt",
      media: "coverImage",
    },
    prepare({ title, publishedAt, media }) {
      return {
        title,
        subtitle: publishedAt
          ? new Date(publishedAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : undefined,
        media,
      };
    },
  },
});
