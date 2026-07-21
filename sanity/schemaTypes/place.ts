import { defineField, defineType } from "sanity";

export const place = defineType({
  name: "place",
  title: "Tempat Umum",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nama",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Kategori",
      description: "Menentukan ikon dan filter yang ditampilkan di halaman peta",
      type: "string",
      options: {
        list: [
          { title: "Pemerintahan", value: "pemerintahan" },
          { title: "Masjid", value: "masjid" },
          { title: "Sekolah", value: "sekolah" },
          { title: "Toko", value: "toko" },
          { title: "Lainnya", value: "lainnya" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "googleMapsUrl",
      title: "Tautan Google Maps",
      type: "url",
      validation: (Rule) =>
        Rule.required().uri({ scheme: ["http", "https"] }),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category",
    },
  },
});
