import { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sarkari-result.vercel.app";

  let jobUrls: MetadataRoute.Sitemap = [];

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data: jobs } = await supabase
        .from("job_posts")
        .select("slug, created_at")
        .eq("published", true);

      jobUrls = (jobs || []).map((job) => ({
        url: `${siteUrl}/jobs/${job.slug}`,
        lastModified: new Date(job.created_at),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    } catch {}
  }

  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/jobs`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/tools`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/tools/image-converter`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/tools/age-calculator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/tools/percentage-calculator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/tools/number-compare`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    ...jobUrls,
  ];
}
