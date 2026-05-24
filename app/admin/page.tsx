"use client";
import { useState } from "react";

const EMPTY = {
  title: "", slug: "", department: "", category: "SSC",
  total_vacancy: "", post_wise_vacancy: "",
  eligibility_age: "", eligibility_education: "",
  start_date: "", last_date: "", exam_date: "",
  application_fee: "", how_to_apply: "",
  official_site: "", apply_link: "", notification_pdf: "",
};

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  function update(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
    if (k === "title" && !form.slug) {
      setForm((f) => ({
        ...f,
        title: v,
        slug: v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      }));
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/publish-job", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-secret": secret },
        body: JSON.stringify({ ...form, total_vacancy: Number(form.total_vacancy) }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg(`✅ Post published! Telegram: ${data.telegram_sent ? "✅ Sent" : "❌ Failed"}`);
        setForm(EMPTY);
      } else {
        setMsg(`❌ Error: ${data.error}`);
      }
    } catch {
      setMsg("❌ Network error");
    }
    setLoading(false);
  }

  if (!authed) {
    return (
      <div className="max-w-sm mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-6">🔒 Admin Login</h1>
        <input
          type="password"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder="Admin Secret Key"
          className="w-full border rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-orange-400"
        />
        <button
          onClick={() => secret && setAuthed(true)}
          className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">📋 New Job Post</h1>
      {msg && (
        <div className={`mb-5 p-4 rounded-xl font-medium ${msg.includes("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {msg}
        </div>
      )}
      <form onSubmit={submit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Job Title *" value={form.title} onChange={(v) => update("title", v)} required />
          <Field label="Slug (URL) *" value={form.slug} onChange={(v) => update("slug", v)} required />
          <Field label="Department *" value={form.department} onChange={(v) => update("department", v)} required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-400"
            >
              {["Railway","SSC","Bank","State PSC","Police","Army","Other"].map(c => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <Field label="Total Vacancy *" value={form.total_vacancy} onChange={(v) => update("total_vacancy", v)} type="number" required />
          <Field label="Start Date" value={form.start_date} onChange={(v) => update("start_date", v)} type="date" />
          <Field label="Last Date *" value={form.last_date} onChange={(v) => update("last_date", v)} type="date" required />
          <Field label="Exam Date" value={form.exam_date} onChange={(v) => update("exam_date", v)} type="date" />
          <Field label="Age Limit" value={form.eligibility_age} onChange={(v) => update("eligibility_age", v)} />
          <Field label="Education" value={form.eligibility_education} onChange={(v) => update("eligibility_education", v)} />
          <Field label="Official Site URL" value={form.official_site} onChange={(v) => update("official_site", v)} />
          <Field label="Apply Online Link" value={form.apply_link} onChange={(v) => update("apply_link", v)} />
          <Field label="Notification PDF Link" value={form.notification_pdf} onChange={(v) => update("notification_pdf", v)} />
        </div>
        <TextArea label="Post-wise Vacancy" value={form.post_wise_vacancy} onChange={(v) => update("post_wise_vacancy", v)} rows={3} />
        <TextArea label="Application Fee" value={form.application_fee} onChange={(v) => update("application_fee", v)} rows={3} />
        <TextArea label="How to Apply" value={form.how_to_apply} onChange={(v) => update("how_to_apply", v)} rows={4} />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-700 transition disabled:opacity-50"
        >
          {loading ? "Publishing..." : "🚀 Publish + Send to Telegram"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required = false }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-400"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 3 }: {
  label: string; value: string; onChange: (v: string) => void; rows?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-400"
      />
    </div>
  );
}
