"use client";
import { useState, useRef } from "react";
import { Metadata } from "next";

type Format = "image/jpeg" | "image/png" | "image/webp";

export default function ImageConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [format, setFormat] = useState<Format>("image/jpeg");
  const [quality, setQuality] = useState(90);
  const [converted, setConverted] = useState<string>("");
  const [converting, setConverting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatLabel: Record<Format, string> = {
    "image/jpeg": "JPG",
    "image/png": "PNG",
    "image/webp": "WebP",
  };

  function handleFile(f: File) {
    setFile(f);
    setConverted("");
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) handleFile(f);
  }

  function convert() {
    if (!preview) return;
    setConverting(true);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      if (format === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      const result = canvas.toDataURL(format, quality / 100);
      setConverted(result);
      setConverting(false);
    };
    img.src = preview;
  }

  function download() {
    if (!converted) return;
    const a = document.createElement("a");
    a.href = converted;
    a.download = `converted.${formatLabel[format].toLowerCase()}`;
    a.click();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">🖼️ Image Converter</h1>
      <p className="text-gray-500 mb-6">JPG, PNG, WebP — koi bhi format mein convert karo — free!</p>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-orange-300 rounded-2xl p-10 text-center cursor-pointer hover:bg-orange-50 transition mb-6"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        {preview ? (
          <img src={preview} alt="preview" className="max-h-48 mx-auto rounded-xl" />
        ) : (
          <>
            <p className="text-4xl mb-2">📁</p>
            <p className="text-gray-600 font-medium">Image yahan drop karo ya click karo</p>
            <p className="text-gray-400 text-sm mt-1">JPG, PNG, WebP, GIF support</p>
          </>
        )}
      </div>

      {file && (
        <>
          {/* Options */}
          <div className="bg-white rounded-xl shadow p-5 mb-5">
            <h2 className="font-semibold text-gray-700 mb-3">Convert Settings</h2>
            <div className="flex flex-wrap gap-4 items-center">
              <div>
                <label className="text-sm text-gray-600 block mb-1">Convert To:</label>
                <div className="flex gap-2">
                  {(["image/jpeg", "image/png", "image/webp"] as Format[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFormat(f)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        format === f ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {formatLabel[f]}
                    </button>
                  ))}
                </div>
              </div>
              {format !== "image/png" && (
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Quality: {quality}%</label>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-32"
                  />
                </div>
              )}
            </div>
          </div>

          <button
            onClick={convert}
            disabled={converting}
            className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-orange-700 transition disabled:opacity-50 mb-4"
          >
            {converting ? "Converting..." : `Convert to ${formatLabel[format]}`}
          </button>
        </>
      )}

      {converted && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
          <p className="text-green-700 font-semibold mb-3">✅ Conversion Complete!</p>
          <img src={converted} alt="converted" className="max-h-48 mx-auto rounded-xl mb-4" />
          <button
            onClick={download}
            className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition"
          >
            ⬇️ Download {formatLabel[format]}
          </button>
        </div>
      )}
    </div>
  );
}
