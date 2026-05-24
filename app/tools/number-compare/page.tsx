"use client";
import { useState } from "react";

export default function NumberComparePage() {
  const [nums, setNums] = useState(["", ""]);
  const [result, setResult] = useState<string | null>(null);

  function addField() {
    if (nums.length < 6) setNums([...nums, ""]);
  }

  function update(i: number, v: string) {
    const n = [...nums];
    n[i] = v;
    setNums(n);
    setResult(null);
  }

  function compare() {
    const parsed = nums.map(Number).filter((n, i) => nums[i] !== "");
    if (parsed.length < 2) return;
    const max = Math.max(...parsed);
    const min = Math.min(...parsed);
    const allEqual = parsed.every((n) => n === parsed[0]);
    if (allEqual) {
      setResult(`Sab numbers equal hain: ${parsed[0]}`);
    } else {
      setResult(`Sabse Bada: ${max} | Sabse Chota: ${min}`);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">🔢 Number Compare</h1>
      <p className="text-gray-500 mb-6">Do ya zyada numbers compare karo — bada/chota/equal</p>

      <div className="bg-white rounded-2xl shadow p-6 space-y-3">
        {nums.map((n, i) => (
          <input
            key={i}
            type="number"
            value={n}
            onChange={(e) => update(i, e.target.value)}
            placeholder={`Number ${i + 1}`}
            className="w-full border rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-orange-400"
          />
        ))}
        <div className="flex gap-3">
          {nums.length < 6 && (
            <button
              onClick={addField}
              className="flex-1 border-2 border-dashed border-orange-300 py-2 rounded-xl text-orange-600 font-medium hover:bg-orange-50 transition"
            >
              + Add Number
            </button>
          )}
          <button
            onClick={compare}
            className="flex-1 bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition"
          >
            Compare
          </button>
        </div>
      </div>

      {result && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
          <p className="text-2xl font-bold text-blue-800">{result}</p>
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {nums.filter((n) => n !== "").map((n, i) => (
              <span key={i} className={`px-4 py-2 rounded-full text-sm font-semibold ${
                Number(n) === Math.max(...nums.filter(x => x !== "").map(Number))
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-gray-100 text-gray-600"
              }`}>
                {n}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
