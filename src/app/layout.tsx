import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  // Pilih salah satu title yang paling sesuai dengan kepribadianmu!
  title: "Romadhon | Fullstack Developer & Part-Time Overthinker",
  
  // Deskripsi yang lebih elegan, profesional, dan SEO-friendly
  description: "Digital ecosystem architect. Bridging complex logic with elegant design, powered by Next.js, late-night coffee, and zero sleep.",
  
  // Bonus: Tambahan warna tema untuk browser HP (opsional tapi bikin keren)
  themeColor: "#080c16", 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="bg-[#080c16] text-beige-100 antialiased relative">
        {children}
      </body>
    </html>
  );
}