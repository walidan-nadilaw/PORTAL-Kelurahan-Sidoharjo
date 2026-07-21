import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { resizeUploadAssetSource } from "./sanity/assetSources/resizeUploadAssetSource";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.SANITY_API_VERSION || "2024-01-01";

export default defineConfig({
  name: "default",
  title: "Portal Kelurahan Sidoharjo",
  basePath: "/admin",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    templates: (prev) =>
      prev
        .filter((template) => template.id !== "post")
        .concat([
          {
            id: "post-berita",
            title: "Berita",
            schemaType: "post",
            value: { category: "berita" },
          },
          {
            id: "post-prestasi",
            title: "Prestasi",
            schemaType: "post",
            value: { category: "prestasi" },
          },
        ]),
  },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
  form: {
    image: {
      assetSources: () => [resizeUploadAssetSource],
      directUploads: false,
    },
  },
  document: {
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type !== "global") return prev;
      return prev.filter(
        (item) => item.templateId !== "siteSettings" && item.templateId !== "post",
      );
    },
  },
});
