import { defineField, defineType } from "sanity";

export const umkm = defineType({
  name: "umkm",
  title: "UMKM",
  type: "document",
  fields: [
    defineField({
      name: "businessName",
      title: "Nama Usaha",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Deskripsi Singkat",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "photo",
      title: "Foto",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "contactUrl",
      title: "Tautan Kontak",
      description: "Contoh: tautan WhatsApp atau Line resmi usaha",
      type: "url",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
  ],
  preview: {
    select: {
      title: "businessName",
      subtitle: "description",
      media: "photo",
    },
  },
});
