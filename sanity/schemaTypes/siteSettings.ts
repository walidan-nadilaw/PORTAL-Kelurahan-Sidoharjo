import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Pengaturan Situs",
  type: "document",
  fields: [
    defineField({
      name: "villageName",
      title: "Nama Kelurahan",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
    }),
    defineField({
      name: "heroVideoUrl",
      title: "Video Beranda (YouTube)",
      description: "Tautan video YouTube yang ditampilkan di halaman utama",
      type: "url",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "orgChartImage",
      title: "Struktur Organisasi",
      type: "image",
    }),
    defineField({
      name: "kelurahanMapImage",
      title: "Peta Sidoharjo",
      description: "Ditampilkan di halaman Peta & Tempat Umum",
      type: "image",
    }),
    defineField({
      name: "contactEmail",
      title: "Email Kontak",
      type: "string",
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: "contactWhatsapp",
      title: "Nomor WhatsApp",
      description: "Termasuk kode negara, contoh: 6281234567890",
      type: "string",
    }),
    defineField({
      name: "googleMapsUrl",
      title: "Tautan Google Maps Kantor",
      type: "url",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "instagramUrl",
      title: "Tautan Instagram",
      type: "url",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "tiktokUrl",
      title: "Tautan TikTok",
      type: "url",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Pengaturan Situs" };
    },
  },
});
