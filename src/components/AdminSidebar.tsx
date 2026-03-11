"use client";

import { useState } from "react";
import Link from "next/link"; // L kecil ya!
import { useSearchParams } from "next/navigation";
import LogoutButton from "./LogoutButton";

export default function AdminSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Membaca parameter ?tab= dari URL untuk menandai menu mana yang aktif
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";

  return (
    <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-beige-200/10 bg-navy-900/50 flex flex-col justify-between shrink-0 transition-all duration-300 z-50">
      
      {/* Header: Logo WOOZIE & Tombol Hamburger */}
      <div className="flex justify-between items-center p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-serif tracking-[0.2em] text-beige-100 md:mb-12">
          WOOZIE.
        </h2>
        
        {/* Tombol Hamburger (Hanya muncul di HP) */}
        <button 
          className="md:hidden text-beige-200/50 hover:text-beige-100 transition-colors p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            // Ikon X (Tutup)
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            // Ikon Garis Tiga (Buka)
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
          )}
        </button>
      </div>
      
      {/* Daftar Menu & Tombol Logout */}
      <div className={`${isMobileMenuOpen ? "flex" : "hidden"} md:flex flex-col flex-1 px-6 md:px-8 pb-6 md:pb-8 justify-between`}>
        <nav className="flex flex-col gap-6 text-xs tracking-widest uppercase font-light text-beige-200/50 mb-8 md:mb-0">
          
          <Link 
            href="/admin?tab=dashboard" 
            onClick={() => setIsMobileMenuOpen(false)} // Otomatis tutup menu HP saat diklik
            className={`transition-colors ${activeTab === "dashboard" ? "text-beige-100 font-medium" : "hover:text-beige-100"}`}
          >
            Dashboard
          </Link>
          
          <Link 
            href="/admin?tab=profile" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={`transition-colors ${activeTab === "profile" ? "text-beige-100 font-medium" : "hover:text-beige-100"}`}
          >
            Resume & Profile
          </Link>
          
          <Link 
            href="/admin?tab=settings" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={`transition-colors ${activeTab === "settings" ? "text-beige-100 font-medium" : "hover:text-beige-100"}`}
          >
            Settings
          </Link>

        </nav>
        
        <div>
          <LogoutButton />
        </div>
      </div>

    </aside>
  );
}