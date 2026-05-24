"use client";
import { useState } from "react";

export default function PercentageCalculatorPage() {
  const [obtained, setObtained] = useState("");
  const [total, setTotal] = useState("");
  const [result, setResult] = useState<string | null>(null);

  function calculate() {
    const o = parseFloat(obtained);
    const t = parseFloat(total);
    if (!o || !t || t === 0) return;
    setResult(((o / t) * 100).toFixed(2));
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">📊 Percentage Calculator</h1>
      <p className="text-gray-500 mb-6">Marks daalo — percentage turant milegi</p>

      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Obtained Marks</label>
          <input
            type="number"
            value={obtained}
            onChange={(e) => { setObtained(e.target.value); setResult(null); }}
            placeholder="e.g. 450"
            className="w-full border rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-orange-400"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Total Marks</label>
          <input
            type="number"
            value={total}
            onChange={(e) => { setTotal(e.target.value); setResult(null); }}
            placeholder="e.g. 600"
            className="w-full border rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-orange-400"
          />
        </div>
        <button
          onClick={calculate}
          disabled={!obtained || !total}
          className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-orange-700 transition disabled:opacity-50"
        >
          Calculate Percentage
        </button>
      </div>

      {result && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
          <p className="text-gray-600 mb-2">Tumhara Percentage:</p>
          <p className="text-6xl font-bold text-green-600">{result}%</p>
          <p className="text-gray-500 mt-3 text-sm">{obtained} out of {total} marks</p>
        </div>
      )}
    </div>
  );
}
