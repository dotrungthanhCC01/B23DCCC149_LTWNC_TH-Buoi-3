import type { MetadataRoute } from "next";
import { getDeadlines, getSubjects } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const deadlines = await getDeadlines();
  const now = new Date();

  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/deadlines`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    ...getSubjects().map((s) => ({
      url: `${SITE_URL}/subjects/${s.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...deadlines.map((d) => ({
      url: `${SITE_URL}/deadlines/${d.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
