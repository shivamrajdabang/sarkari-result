"use client";
import { useState } from "react";

export default function DateCalculatorPage() {
  const [targetDate, setTargetDate] = useState("");
  const [result, setResult] = useState<{ days: number; months: number; years: number; passed: boolean } | null>(null);

  function calculate() {
    if (!targetDate) return;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const target = new Date(targetDate); target.setHours(0, 0, 0, 0);
    const diff = target.getTime() - today.getTime();
    const passed = diff < 0;
    const absDiff = Math.abs(diff);
    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    setResult({ days, months, years, passed });
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">📅 Date Calculator</h1>
      <p className="text-gray-500 mb-6">Kisi date tak kitne din, mahine, saal bache — ya beet gaye</p>

      <div className="bg-white rounded-2xl shadow p-6">
        <label className="block text-gray-700 font-medium mb-2">Target Date</label>
        <input
          type="date"
          value={targetDate}
          onChange={(e) => { setTargetDate(e.target.value); setResult(null); }}
          className="w-full border rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-orange-400 mb-4"
        />
        <button
          onClick={calculate}
          disabled={!targetDate}
          className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-orange-700 transition disabled:opacity-50"
        >
          Calculate
        </button>
      </div>

      {result && (
        <div className={`mt-6 rounded-2xl p-6 text-center border ${
          result.passed ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"
        }`}>
          <p className={`text-lg font-semibold mb-4 ${result.passed ? "text-red-700" : "text-green-700"}`}>
            {result.passed ? "⏰ Ye date beet gayi" : "⏳ Is date mein abhi bacha hai:"}
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 shadow">
              <div className={`text-4xl font-bold ${result.passed ? "text-red-600" : "text-green-600"}`}>{result.days}</div>
              <div className="text-gray-500 text-sm mt-1">Days</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow">
              <div className={`text-4xl font-bold ${result.passed ? "text-red-600" : "text-green-600"}`}>{result.months}</div>
              <div className="text-gray-500 text-sm mt-1">~Months</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow">
              <div className={`text-4xl font-bold ${result.passed ? "text-red-600" : "text-green-600"}`}>{result.years}</div>
              <div className="text-gray-500 text-sm mt-1">~Years</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
