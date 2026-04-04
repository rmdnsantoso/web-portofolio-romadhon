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
    <nav className="w-full py-4 md:py-6 px-4 md:px-8 flex justify-center items-center fixed top-0 z-50 bg-navy-900/80 backdrop-blur-md border-b border-beige-200/20">
      
      {/* PERUBAHAN UNTUK MOBILE: 
        1. gap-6 (HP) -> gap-12 (PC) 
        2. text-[10px] (HP) -> text-sm (PC) 
        3. Tambahan active:text-beige-100 untuk respons sentuhan jari
      */}
      <div className="flex gap-6 md:gap-12 text-beige-200 text-[10px] md:text-sm tracking-widest uppercase font-light">
        <Link 
          href="#home" 
          className="hover:text-beige-100 active:text-beige-100 active:scale-95 transition-all duration-300 md:hover:-translate-y-1 p-2"
        >
          Home
        </Link>
        <Link 
          href="#project" 
          className="hover:text-beige-100 active:text-beige-100 active:scale-95 transition-all duration-300 md:hover:-translate-y-1 p-2"
        >
          Project
        </Link>
        <Link 
          href="#about" 
          className="hover:text-beige-100 active:text-beige-100 active:scale-95 transition-all duration-300 md:hover:-translate-y-1 p-2"
        >
          About
        </Link>
      </div>
    </nav>
  );
}