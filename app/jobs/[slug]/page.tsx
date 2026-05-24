import { Metadata } from "next";
import { notFound } from "next/navigation";
import { JobPost } from "@/lib/types";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

async function getJob(slug: string): Promise<JobPost | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data } = await supabase.from("job_posts").select("*").eq("slug", slug).eq("published", true).single();
    return data as JobPost | null;
  } catch { return null; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJob(slug);
  if (!job) return { title: "Job Not Found" };
  return { title: job.title, description: `${job.department} — Last Date: ${job.last_date}` };
}

export default async function JobDetailPage({ params }: Props) {
  const { slug } = await params;
  const job = await getJob(slug);
  if (!job) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-orange-600 text-white rounded-2xl p-6 mb-6">
        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{job.category}</span>
        <h1 className="text-2xl md:text-3xl font-bold mt-2">{job.title}</h1>
        <p className="text-orange-100 mt-1">{job.department}</p>
      </div>

      <div className="bg-white rounded-xl shadow p-5 mb-5">
        <h2 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">📅 Important Dates</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          {job.start_date && <div><span className="text-gray-500">Start Date:</span><br /><strong>{job.start_date}</strong></div>}
          <div><span className="text-gray-500">Last Date:</span><br /><strong className="text-red-600">{job.last_date}</strong></div>
          {job.exam_date && <div><span className="text-gray-500">Exam Date:</span><br /><strong>{job.exam_date}</strong></div>}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-5 mb-5">
        <h2 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">👥 Vacancy Details</h2>
        <div className="mb-2">
          <span className="text-gray-500 text-sm">Total Vacancy:</span>
          <span className="ml-2 text-2xl font-bold text-orange-600">{job.total_vacancy}</span>
        </div>
        {job.post_wise_vacancy && <div className="text-sm text-gray-700 mt-2 whitespace-pre-line">{job.post_wise_vacancy}</div>}
      </div>

      <div className="bg-white rounded-xl shadow p-5 mb-5">
        <h2 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">✅ Eligibility</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-500">Age Limit:</span><p className="font-medium mt-1">{job.eligibility_age}</p></div>
          <div><span className="text-gray-500">Education:</span><p className="font-medium mt-1">{job.eligibility_education}</p></div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-5 mb-5">
        <h2 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">💰 Application Fee</h2>
        <p className="text-sm whitespace-pre-line">{job.application_fee}</p>
      </div>

      <div className="bg-white rounded-xl shadow p-5 mb-5">
        <h2 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">📝 How to Apply</h2>
        <p className="text-sm whitespace-pre-line">{job.how_to_apply}</p>
      </div>

      <div className="bg-white rounded-xl shadow p-5 mb-5">
        <h2 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">🔗 Important Links</h2>
        <div className="flex flex-wrap gap-3">
          {job.apply_link && (
            <a href={job.apply_link} target="_blank" rel="noopener noreferrer" className="bg-orange-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-orange-700 transition">Apply Online</a>
          )}
          {job.notification_pdf && (
            <a href={job.notification_pdf} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">📄 Notification PDF</a>
          )}
          {job.official_site && (
            <a href={job.official_site} target="_blank" rel="noopener noreferrer" className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 transition">Official Website</a>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
        <p className="font-semibold text-blue-800">📢 Aur jobs ke liye Telegram join karo</p>
        <a href="https://t.me/sarkarijob1111" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-blue-600 transition">
          Join @sarkarijob1111
        </a>
      </div>
    </div>
  );
}
