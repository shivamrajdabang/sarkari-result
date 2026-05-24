import Link from "next/link";

const TOOLS = [
  { name: "Image Converter", desc: "JPG, PNG, WebP convert karo", icon: "🖼️", href: "/tools/image-converter" },
  { name: "Age Calculator", desc: "Date of birth se age nikalo", icon: "🎂", href: "/tools/age-calculator" },
  { name: "Percentage Calculator", desc: "Marks se percentage nikalo", icon: "📊", href: "/tools/percentage-calculator" },
  { name: "Number Compare", desc: "Numbers ko compare karo", icon: "🔢", href: "/tools/number-compare" },
  { name: "Date Calculator", desc: "Kisi date tak kitne din bache", icon: "📅", href: "/tools/date-calculator" },
  { name: "Word Counter", desc: "Text mein words count karo", icon: "📝", href: "/tools/word-counter" },
];

const CATEGORIES = [
  { name: "Railway", icon: "🚂", href: "/jobs?category=Railway" },
  { name: "SSC", icon: "📋", href: "/jobs?category=SSC" },
  { name: "Bank", icon: "🏦", href: "/jobs?category=Bank" },
  { name: "State PSC", icon: "🏛️", href: "/jobs?category=State+PSC" },
  { name: "Police", icon: "👮", href: "/jobs?category=Police" },
  { name: "Army", icon: "⚔️", href: "/jobs?category=Army" },
];

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* Hero */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-2xl p-8 mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          🏛️ Sarkari Result
        </h1>
        <p className="text-orange-100 text-lg mb-5">
          Latest Govt Jobs + Free Online Tools — Sab Ek Jagah
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/jobs"
            className="bg-white text-orange-600 px-6 py-2 rounded-full font-semibold hover:bg-orange-50 transition"
          >
            💼 Latest Jobs Dekho
          </Link>
          <a
            href="https://t.me/sarkarijob1111"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-600 transition"
          >
            📢 Telegram Join Karo
          </a>
        </div>
      </section>

      {/* Job Categories */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📂 Job Categories</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="bg-white rounded-xl shadow p-4 text-center hover:shadow-md hover:border-orange-400 border border-transparent transition"
            >
              <div className="text-3xl mb-1">{cat.icon}</div>
              <div className="text-sm font-semibold text-gray-700">{cat.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Jobs */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">🔴 Latest Jobs</h2>
          <Link href="/jobs" className="text-orange-600 text-sm font-medium hover:underline">
            Sab Dekho →
          </Link>
        </div>
        <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
          <p className="text-4xl mb-2">📋</p>
          <p>Abhi koi job post nahi hai. Jald hi aayega!</p>
          <a
            href="https://t.me/sarkarijob1111"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-blue-600 text-sm hover:underline"
          >
            Telegram join karo — turant notification milega
          </a>
        </div>
      </section>

      {/* Free Tools */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">🛠️ Free Online Tools</h2>
          <Link href="/tools" className="text-orange-600 text-sm font-medium hover:underline">
            Sab Dekho →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {TOOLS.map((tool) => (
            <Link
              key={tool.name}
              href={tool.href}
              className="bg-white rounded-xl shadow p-5 hover:shadow-md hover:border-orange-400 border border-transparent transition"
            >
              <div className="text-3xl mb-2">{tool.icon}</div>
              <div className="font-semibold text-gray-800">{tool.name}</div>
              <div className="text-sm text-gray-500 mt-1">{tool.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Telegram CTA */}
      <section className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
        <h3 className="text-xl font-bold text-blue-800 mb-2">📢 Telegram pe Join Karo</h3>
        <p className="text-blue-600 mb-4">Naya job nikle to turant notification milega — free!</p>
        <a
          href="https://t.me/sarkarijob1111"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-600 transition inline-block"
        >
          Join @sarkarijob1111
        </a>
      </section>

    </div>
  );
}
