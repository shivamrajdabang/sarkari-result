"use client";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-orange-600 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          🏛️ Sarkari Result
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-orange-200 transition">Home</Link>
          <Link href="/jobs" className="hover:text-orange-200 transition">Sarkari Jobs</Link>
          <Link href="/tools" className="hover:text-orange-200 transition">Free Tools</Link>
          <a
            href="https://t.me/sarkarijob1111"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-orange-600 px-3 py-1 rounded-full text-xs font-bold hover:bg-orange-100 transition"
          >
            📢 Telegram Join
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden bg-orange-700 px-4 py-3 flex flex-col gap-3 text-sm font-medium">
          <Link href="/" onClick={() => setMenuOpen(false)}>🏠 Home</Link>
          <Link href="/jobs" onClick={() => setMenuOpen(false)}>💼 Sarkari Jobs</Link>
          <Link href="/tools" onClick={() => setMenuOpen(false)}>🛠️ Free Tools</Link>
          <a href="https://t.me/sarkarijob1111" target="_blank" rel="noopener noreferrer">
            📢 Telegram Join
          </a>
        </div>
      )}
    </header>
  );
}
