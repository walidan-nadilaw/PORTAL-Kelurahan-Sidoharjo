import { defineArrayMember, defineField, defineType } from "sanity";

export const blockContent = defineType({
  name: "blockContent",
  title: "Konten",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
    }),
    defineArrayMember({
      type: "image",
      title: "Gambar",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Teks Alternatif",
          description:
            "Deskripsi singkat gambar, ditampilkan jika gambar gagal dimuat",
          type: "string",
        }),
      ],
    }),
  ],
});
