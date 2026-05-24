import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-white font-bold text-lg mb-2">🏛️ Sarkari Result</h3>
          <p className="text-sm">Latest govt job notifications, form details aur free online tools — sab ek jagah.</p>
          <a
            href="https://t.me/sarkarijob1111"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 transition"
          >
            📢 Telegram Channel Join Karo
          </a>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-1 text-sm">
            <li><Link href="/jobs" className="hover:text-white transition">Sarkari Jobs</Link></li>
            <li><Link href="/jobs?category=Railway" className="hover:text-white transition">Railway Jobs</Link></li>
            <li><Link href="/jobs?category=SSC" className="hover:text-white transition">SSC Jobs</Link></li>
            <li><Link href="/jobs?category=Bank" className="hover:text-white transition">Bank Jobs</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-2">Free Tools</h4>
          <ul className="space-y-1 text-sm">
            <li><Link href="/tools/image-converter" className="hover:text-white transition">Image Converter</Link></li>
            <li><Link href="/tools/age-calculator" className="hover:text-white transition">Age Calculator</Link></li>
            <li><Link href="/tools/percentage-calculator" className="hover:text-white transition">Percentage Calculator</Link></li>
            <li><Link href="/tools/number-compare" className="hover:text-white transition">Number Compare</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 text-center py-3 text-xs text-gray-500">
        © {new Date().getFullYear()} Sarkari Result. All rights reserved.
      </div>
    </footer>
  );
}
