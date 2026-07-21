import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Konten")
    .items([
      S.listItem()
        .title("Pengaturan Situs")
        .id("siteSettings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
      S.divider(),
      S.listItem()
        .title("Berita")
        .schemaType("post")
        .child(
          S.documentList()
            .title("Berita")
            .schemaType("post")
            .filter('_type == "post" && category == "berita"')
            .initialValueTemplates([S.initialValueTemplateItem("post-berita")]),
        ),
      S.listItem()
        .title("Prestasi")
        .schemaType("post")
        .child(
          S.documentList()
            .title("Prestasi")
            .schemaType("post")
            .filter('_type == "post" && category == "prestasi"')
            .initialValueTemplates([
              S.initialValueTemplateItem("post-prestasi"),
            ]),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !["siteSettings", "post"].includes(item.getId() ?? ""),
      ),
    ]);
