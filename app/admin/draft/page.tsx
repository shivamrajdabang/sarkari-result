"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type JobDraft = {
  title: string; slug: string; department: string; category: string;
  total_vacancy: number; post_wise_vacancy: string;
  eligibility_age: string; eligibility_education: string;
  start_date: string; last_date: string; exam_date: string;
  application_fee: string; how_to_apply: string;
  official_site: string; apply_link: string; notification_pdf: string;
};

export default function DraftPage() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [url, setUrl] = useState("");
  const [rawText, setRawText] = useState("");
  const [inputMode, setInputMode] = useState<"url" | "text">("url");
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<JobDraft | null>(null);
  const [msg, setMsg] = useState("");
  const [publishing, setPublishing] = useState(false);
  const router = useRouter();

  async function extractJob() {
    setLoading(true);
    setMsg("");
    setDraft(null);
    try {
      const res = await fetch("/api/extract-job", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-secret": secret },
        body: JSON.stringify(inputMode === "url" ? { url } : { rawText }),
      });
      const data = await res.json();
      if (data.success) {
        setDraft(data.job);
        setMsg("✅ Draft ready hai — review karke publish karo!");
      } else {
        setMsg("❌ " + data.error);
      }
    } catch {
      setMsg("❌ Network error");
    }
    setLoading(false);
  }

  async function publishJob() {
    if (!draft) return;
    setPublishing(true);
    setMsg("");
    try {
      const res = await fetch("/api/publish-job", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-secret": secret },
        body: JSON.stringify(draft),
      });
      const data = await res.json();
      if (data.success) {
        setMsg(`🚀 Published! Telegram: ${data.telegram_sent ? "✅ Sent" : "❌ Failed"}`);
        setDraft(null);
        setUrl("");
        setRawText("");
      } else {
        setMsg("❌ " + data.error);
      }
    } catch {
      setMsg("❌ Network error");
    }
    setPublishing(false);
  }

  function updateDraft(key: keyof JobDraft, value: string | number) {
    if (!draft) return;
    setDraft({ ...draft, [key]: value });
  }

  if (!authed) {
    return (
      <div className="max-w-sm mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-6">🔒 Admin Login</h1>
        <input type="password" value={secret} onChange={(e) => setSecret(e.target.value)}
          placeholder="Admin Secret Key"
          className="w-full border rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-orange-400"
        />
        <button onClick={() => secret && setAuthed(true)}
          className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition">
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push("/admin")} className="text-gray-500 hover:text-gray-700">← Back</button>
        <h1 className="text-2xl font-bold text-gray-800">🤖 AI Job Extractor</h1>
      </div>

      {msg && (
        <div className={`mb-5 p-4 rounded-xl font-medium ${msg.includes("✅") || msg.includes("🚀") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {msg}
        </div>
      )}

      {/* Input Section */}
      {!draft && (
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <div className="flex gap-3 mb-4">
            <button onClick={() => setInputMode("url")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition ${inputMode === "url" ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-700"}`}>
              🔗 Website URL
            </button>
            <button onClick={() => setInputMode("text")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition ${inputMode === "text" ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-700"}`}>
              📋 Text Paste
            </button>
          </div>

          {inputMode === "url" ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Notification URL</label>
              <input type="url" value={url} onChange={(e) => setUrl(e.target.value)}
                placeholder="https://ssc.gov.in/... ya koi bhi sarkari site"
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 mb-2"
              />
              <p className="text-xs text-gray-400">Tip: Agar URL kaam nahi kare to "Text Paste" use karo</p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Notification Text</label>
              <textarea value={rawText} onChange={(e) => setRawText(e.target.value)}
                placeholder="Kisi bhi sarkari job site se poora text copy karke yahan paste karo..."
                rows={8}
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400"
              />
            </div>
          )}

          <button onClick={extractJob}
            disabled={loading || (inputMode === "url" ? !url : !rawText)}
            className="w-full mt-4 bg-orange-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-orange-700 transition disabled:opacity-50">
            {loading ? "⏳ AI Process kar raha hai..." : "🤖 Extract & Draft Banao"}
          </button>
        </div>
      )}

      {/* Draft Review Section */}
      {draft && (
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex justify-between items-center mb-5 border-b pb-3">
            <h2 className="text-lg font-bold text-gray-800">📝 Draft Review Karo</h2>
            <button onClick={() => setDraft(null)} className="text-sm text-gray-500 hover:text-red-500">
              ✕ Wapas Jao
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <Field label="Job Title *" value={draft.title} onChange={(v) => updateDraft("title", v)} />
            <Field label="Slug (URL)" value={draft.slug} onChange={(v) => updateDraft("slug", v)} />
            <Field label="Department" value={draft.department} onChange={(v) => updateDraft("department", v)} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={draft.category} onChange={(e) => updateDraft("category", e.target.value)}
                className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-400">
                {["Railway","SSC","Bank","State PSC","Police","Army","Other"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <Field label="Total Vacancy" value={String(draft.total_vacancy)} onChange={(v) => updateDraft("total_vacancy", Number(v))} type="number" />
            <Field label="Start Date" value={draft.start_date} onChange={(v) => updateDraft("start_date", v)} />
            <Field label="Last Date *" value={draft.last_date} onChange={(v) => updateDraft("last_date", v)} />
            <Field label="Exam Date" value={draft.exam_date} onChange={(v) => updateDraft("exam_date", v)} />
            <Field label="Age Limit" value={draft.eligibility_age} onChange={(v) => updateDraft("eligibility_age", v)} />
            <Field label="Education" value={draft.eligibility_education} onChange={(v) => updateDraft("eligibility_education", v)} />
            <Field label="Official Site" value={draft.official_site} onChange={(v) => updateDraft("official_site", v)} />
            <Field label="Apply Link" value={draft.apply_link} onChange={(v) => updateDraft("apply_link", v)} />
            <Field label="Notification PDF" value={draft.notification_pdf} onChange={(v) => updateDraft("notification_pdf", v)} />
          </div>

          <TextArea label="Post-wise Vacancy" value={draft.post_wise_vacancy} onChange={(v) => updateDraft("post_wise_vacancy", v)} rows={3} />
          <TextArea label="Application Fee" value={draft.application_fee} onChange={(v) => updateDraft("application_fee", v)} rows={3} />
          <TextArea label="How to Apply" value={draft.how_to_apply} onChange={(v) => updateDraft("how_to_apply", v)} rows={4} />

          <div className="flex gap-3 mt-5">
            <button onClick={() => setDraft(null)}
              className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition">
              ✏️ Edit More
            </button>
            <button onClick={publishJob} disabled={publishing}
              className="flex-2 flex-1 bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition disabled:opacity-50">
              {publishing ? "Publishing..." : "🚀 Publish + Telegram"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-400" />
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 3 }: {
  label: string; value: string; onChange: (v: string) => void; rows?: number;
}) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows}
        className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-400" />
    </div>
  );
}
