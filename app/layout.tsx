import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Sarkari Result — Latest Govt Jobs & Free Online Tools",
    template: "%s | Sarkari Result",
  },
  description:
    "Latest sarkari job notifications, form details, vacancy info aur free online tools jaise image converter, age calculator aur bahut kuch.",
  keywords: [
    "sarkari result",
    "sarkari job",
    "govt jobs",
    "online tools",
    "image converter",
    "age calculator",
  ],
  openGraph: {
    type: "website",
    locale: "hi_IN",
    siteName: "Sarkari Result",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi">
      <body className={`${geist.className} bg-gray-50 min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
