"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // Sembunyikan Navbar secara otomatis di halaman admin dan login
  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
    return null; 
  }

  return (
    // Mengubah border-navy-800/50 menjadi border-beige-200/20 agar garisnya lebih menyala
    <nav className="w-full py-6 px-8 flex justify-center items-center fixed top-0 z-50 bg-navy-900/80 backdrop-blur-md border-b border-beige-200/20">
      <div className="flex gap-12 text-beige-200 text-sm tracking-widest uppercase font-light">
        <Link href="#home" className="hover:text-beige-100 transition-all duration-300 hover:-translate-y-1">
          Home
        </Link>
        <Link href="#project" className="hover:text-beige-100 transition-all duration-300 hover:-translate-y-1">
          Project
        </Link>
        <Link href="#about" className="hover:text-beige-100 transition-all duration-300 hover:-translate-y-1">
          About
        </Link>
      </div>
    </nav>
  );
}