import { defineField, defineType } from "sanity";

export const demographicStat = defineType({
  name: "demographicStat",
  title: "Data Demografi",
  type: "document",
  fields: [
    defineField({
      name: "statType",
      title: "Jenis Data",
      type: "string",
      options: {
        list: [
          { title: "Distribusi Usia", value: "distribusi-usia" },
          { title: "Tingkat Pendidikan", value: "tingkat-pendidikan" },
          { title: "Mata Pencaharian", value: "mata-pencaharian" },
          { title: "Akses Infrastruktur", value: "akses-infrastruktur" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "year",
      title: "Tahun",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "label",
      title: "Label",
      description: "Contoh: \"0–14 tahun\", \"SMA/SMK\", \"Petani\"",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "value",
      title: "Nilai",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "unit",
      title: "Satuan",
      description: "Contoh: \"%\", \"jiwa\", \"KK\"",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "label",
      statType: "statType",
      year: "year",
      value: "value",
      unit: "unit",
    },
    prepare({ title, statType, year, value, unit }) {
      return {
        title,
        subtitle: `${statType} · ${year} · ${value}${unit ?? ""}`,
      };
    },
  },
});
