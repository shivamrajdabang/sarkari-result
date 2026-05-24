import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Online Tools",
  description: "Free online tools — image converter, age calculator, percentage calculator aur bahut kuch.",
};

const TOOLS = [
  { name: "Image Converter", desc: "JPG, PNG, WebP format mein convert karo — free & instant", icon: "🖼️", href: "/tools/image-converter", color: "bg-purple-50 border-purple-200" },
  { name: "Age Calculator", desc: "Date of birth se exact age nikalo", icon: "🎂", href: "/tools/age-calculator", color: "bg-pink-50 border-pink-200" },
  { name: "Percentage Calculator", desc: "Marks ya koi bhi value ka percentage nikalo", icon: "📊", href: "/tools/percentage-calculator", color: "bg-green-50 border-green-200" },
  { name: "Number Compare", desc: "Do ya zyada numbers compare karo — bada/chota/equal", icon: "🔢", href: "/tools/number-compare", color: "bg-blue-50 border-blue-200" },
  { name: "Date Calculator", desc: "Kisi date tak kitne din/mahine/saal bache", icon: "📅", href: "/tools/date-calculator", color: "bg-yellow-50 border-yellow-200" },
  { name: "Word Counter", desc: "Text mein kitne words, characters aur lines hain", icon: "📝", href: "/tools/word-counter", color: "bg-orange-50 border-orange-200" },
];

export default function ToolsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">🛠️ Free Online Tools</h1>
      <p className="text-gray-500 mb-8">Sab tools bilkul free hain — koi registration nahi, koi login nahi</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {TOOLS.map((tool) => (
          <Link
            key={tool.name}
            href={tool.href}
            className={`block border rounded-2xl p-6 hover:shadow-md transition ${tool.color}`}
          >
            <div className="text-4xl mb-3">{tool.icon}</div>
            <h2 className="text-lg font-bold text-gray-800">{tool.name}</h2>
            <p className="text-gray-600 text-sm mt-1">{tool.desc}</p>
            <div className="mt-4 text-orange-600 text-sm font-medium">Use Now →</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
