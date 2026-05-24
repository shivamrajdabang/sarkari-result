"use client";
import { useState } from "react";

export default function AgeCalculatorPage() {
  const [dob, setDob] = useState("");
  const [result, setResult] = useState<{ years: number; months: number; days: number } | null>(null);

  function calculate() {
    if (!dob) return;
    const birth = new Date(dob);
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();
    if (days < 0) { months--; days += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }
    setResult({ years, months, days });
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">🎂 Age Calculator</h1>
      <p className="text-gray-500 mb-6">Date of birth daalo — exact age milegi years, months, days mein</p>

      <div className="bg-white rounded-2xl shadow p-6">
        <label className="block text-gray-700 font-medium mb-2">Date of Birth</label>
        <input
          type="date"
          value={dob}
          onChange={(e) => { setDob(e.target.value); setResult(null); }}
          max={new Date().toISOString().split("T")[0]}
          className="w-full border rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-orange-400 mb-4"
        />
        <button
          onClick={calculate}
          disabled={!dob}
          className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-orange-700 transition disabled:opacity-50"
        >
          Calculate Age
        </button>
      </div>

      {result && (
        <div className="mt-6 bg-orange-50 border border-orange-200 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-orange-800 mb-4 text-center">Tumhari Age Hai:</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white rounded-xl p-4 shadow">
              <div className="text-4xl font-bold text-orange-600">{result.years}</div>
              <div className="text-gray-600 text-sm mt-1">Years</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow">
              <div className="text-4xl font-bold text-orange-600">{result.months}</div>
              <div className="text-gray-600 text-sm mt-1">Months</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow">
              <div className="text-4xl font-bold text-orange-600">{result.days}</div>
              <div className="text-gray-600 text-sm mt-1">Days</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
