"use client";
import { useState } from "react";

export default function WordCounterPage() {
  const [text, setText] = useState("");

  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, "").length;
  const lines = text === "" ? 0 : text.split("\n").length;
  const sentences = text === "" ? 0 : text.split(/[.!?]+/).filter(Boolean).length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">📝 Word Counter</h1>
      <p className="text-gray-500 mb-6">Text daalo — words, characters, lines sab count ho jayega</p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Yahan text paste karo ya likhna shuru karo..."
        rows={10}
        className="w-full border rounded-2xl px-4 py-3 text-base focus:outline-none focus:border-orange-400 shadow mb-5"
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Words", value: words, color: "text-orange-600" },
          { label: "Characters", value: chars, color: "text-blue-600" },
          { label: "Chars (no space)", value: charsNoSpace, color: "text-green-600" },
          { label: "Lines", value: lines, color: "text-purple-600" },
          { label: "Sentences", value: sentences, color: "text-red-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow p-4 text-center">
            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-gray-500 text-xs mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {text && (
        <button
          onClick={() => setText("")}
          className="mt-4 text-sm text-gray-500 hover:text-red-500 transition"
        >
          🗑️ Clear Text
        </button>
      )}
    </div>
  );
}
