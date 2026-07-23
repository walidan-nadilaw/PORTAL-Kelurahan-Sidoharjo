import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Every image is resized by Sanity's CDN rather than Vercel's optimizer,
    // which is metered on the Hobby plan. Configured globally because
    // next/image is a Client Component and a `loader` function prop can't be
    // passed to one from a server component.
    //
    // No `remotePatterns` needed: a custom loader bypasses /_next/image
    // entirely, so Next never fetches remote images itself and has nothing to
    // validate the host against.
    loader: "custom",
    loaderFile: "./src/lib/sanity/imageLoader.ts",
  },
};

export default nextConfig;
