import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Pages are ISR/statically rendered, so reads happen at build or revalidation
  // rather than per visitor. The CDN is the right trade there.
  useCdn: true,
  perspective: "published",
});
