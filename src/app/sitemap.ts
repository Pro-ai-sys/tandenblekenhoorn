import type { MetadataRoute } from "next";
import { site, wijken } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/faq",
    "/privacy",
    "/contact",
    "/boeken",
    "/cadeaubon",
  ].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
  }));

  const wijkRoutes = wijken.map((w) => ({
    url: `${site.url}/${w.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...wijkRoutes];
}
