import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Romadhon | Web Portofolio",
  description: "Portofolio Muhammad Romadhon Santoso",
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