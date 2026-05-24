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

const EMPTY: JobDraft = {
  title: "", slug: "", department: "", category: "SSC",
  total_vacancy: 0, post_wise_vacancy: "",
  eligibility_age: "", eligibility_education: "",
  start_date: "", last_date: "", exam_date: "",
  application_fee: "", how_to_apply: "",
  official_site: "", apply_link: "", notification_pdf: "",
};

export default function DraftPage() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [draft, setDraft] = useState<JobDraft | null>(null);
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [msg, setMsg] = useState("");
  const [publishing, setPublishing] = useState(false);
  const router = useRouter();

  function loadJson() {
    try {
      const parsed = JSON.parse(jsonInput);
      setDraft({ ...EMPTY, ...parsed });
      setJsonError("");
    } catch {
      setJsonError("❌ Invalid JSON — Claude se dobara banwao");
    }
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
        setJsonInput("");
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
        <h1 className="text-2xl font-bold text-gray-800">🤖 Claude Draft Loader</h1>
      </div>

      {msg && (
        <div className={`mb-5 p-4 rounded-xl font-medium ${msg.includes("✅") || msg.includes("🚀") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {msg}
        </div>
      )}

      {/* Step 1 - Instructions */}
      {!draft && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
            <h2 className="font-bold text-blue-800 mb-2">📋 Kaise Use Karein?</h2>
            <ol className="text-blue-700 text-sm space-y-1 list-decimal list-inside">
              <li>Kisi sarkari job site se job notification ka <strong>text copy karo</strong></li>
              <li><strong>Claude Code</strong> mein paste karo aur bolo: <em>"Is text se job post ka JSON banao"</em></li>
              <li>Claude jo JSON de, use <strong>neeche paste karo</strong></li>
              <li>Review karke <strong>Publish</strong> dabao</li>
            </ol>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Claude ka JSON Yahan Paste Karo:
            </label>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder={`{\n  "title": "SSC CGL 2025",\n  "department": "Staff Selection Commission",\n  ...\n}`}
              rows={12}
              className="w-full border rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:border-orange-400"
            />
            {jsonError && <p className="text-red-600 text-sm mt-1">{jsonError}</p>}
            <button onClick={loadJson} disabled={!jsonInput}
              className="w-full mt-3 bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition disabled:opacity-50">
              📝 Draft Load Karo
            </button>
          </div>
        </div>
      )}

      {/* Step 2 - Review & Edit */}
      {draft && (
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex justify-between items-center mb-5 border-b pb-3">
            <h2 className="text-lg font-bold text-gray-800">✏️ Review & Edit Karo</h2>
            <button onClick={() => setDraft(null)} className="text-sm text-gray-500 hover:text-red-500">
              ← Wapas Jao
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
            <Field label="Start Date (DD-MM-YYYY)" value={draft.start_date} onChange={(v) => updateDraft("start_date", v)} />
            <Field label="Last Date * (DD-MM-YYYY)" value={draft.last_date} onChange={(v) => updateDraft("last_date", v)} />
            <Field label="Exam Date" value={draft.exam_date} onChange={(v) => updateDraft("exam_date", v)} />
            <Field label="Age Limit" value={draft.eligibility_age} onChange={(v) => updateDraft("eligibility_age", v)} />
            <Field label="Education" value={draft.eligibility_education} onChange={(v) => updateDraft("eligibility_education", v)} />
            <Field label="Official Site URL" value={draft.official_site} onChange={(v) => updateDraft("official_site", v)} />
            <Field label="Apply Online Link" value={draft.apply_link} onChange={(v) => updateDraft("apply_link", v)} />
            <Field label="Notification PDF Link" value={draft.notification_pdf} onChange={(v) => updateDraft("notification_pdf", v)} />
          </div>

          <TextArea label="Post-wise Vacancy" value={draft.post_wise_vacancy} onChange={(v) => updateDraft("post_wise_vacancy", v)} rows={3} />
          <TextArea label="Application Fee" value={draft.application_fee} onChange={(v) => updateDraft("application_fee", v)} rows={3} />
          <TextArea label="How to Apply" value={draft.how_to_apply} onChange={(v) => updateDraft("how_to_apply", v)} rows={4} />

          <div className="flex gap-3 mt-5">
            <button onClick={() => setDraft(null)}
              className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition">
              ← Wapas
            </button>
            <button onClick={publishJob} disabled={publishing || !draft.title || !draft.last_date}
              className="flex-1 bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition disabled:opacity-50">
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
