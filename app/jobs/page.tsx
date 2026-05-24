import { Metadata } from "next";
import Link from "next/link";
import { JobPost } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Latest Sarkari Jobs",
  description: "Latest government job notifications — Railway, SSC, Bank, Police, Army aur State PSC.",
};

const CATEGORIES = ["All", "Railway", "SSC", "Bank", "State PSC", "Police", "Army", "Other"];

async function getJobs(category: string): Promise<JobPost[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    let query = supabase.from("job_posts").select("*").eq("published", true).order("created_at", { ascending: false });
    if (category !== "All") query = query.eq("category", category);
    const { data } = await query;
    return (data as JobPost[]) || [];
  } catch { return []; }
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const category = params.category || "All";
  const jobs = await getJobs(category);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">💼 Latest Sarkari Jobs</h1>
      <p className="text-gray-500 mb-6">Sabse latest government job notifications — daily update hota hai</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={cat === "All" ? "/jobs" : `/jobs?category=${cat}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              category === cat
                ? "bg-orange-600 text-white"
                : "bg-white text-gray-600 border hover:border-orange-400"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-lg">Abhi koi job post nahi hai.</p>
          <a href="https://t.me/sarkarijob1111" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-blue-600 hover:underline">
            📢 Telegram join karo — turant notification milega
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Link key={job.id} href={`/jobs/${job.slug}`} className="block bg-white rounded-xl shadow p-5 hover:shadow-md border border-transparent hover:border-orange-300 transition">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium mb-1 inline-block">{job.category}</span>
                  <h2 className="text-lg font-bold text-gray-800">{job.title}</h2>
                  <p className="text-gray-500 text-sm">{job.department}</p>
                </div>
                <div className="text-right text-sm">
                  <div className="text-orange-600 font-semibold">👥 {job.total_vacancy} Posts</div>
                  <div className="text-red-500 mt-1">⏰ Last: {job.last_date}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
