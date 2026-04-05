"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="relative w-full max-w-md bg-navy-800/40 border border-red-900/30 p-10 md:p-14 rounded-sm shadow-2xl backdrop-blur-xl">
      
      <div className="text-center mb-10">
        {/* Label Peringatan Merah */}
        <div className="inline-block px-3 py-1 border border-red-500/20 bg-red-500/5 mb-6">
           <p className="text-[9px] text-red-400/80 tracking-[0.4em] uppercase">
             Security Alert
           </p>
        </div>
        
        {/* H1 Disamakan persis dengan Login (mb-2) */}
        <h1 className="text-3xl font-serif text-beige-100 tracking-wider mb-2">
          Access Denied
        </h1>
        
        {/* P Disamakan persis dengan Login (text-beige-200/40, tanpa leading-relaxed) */}
        <p className="text-xs text-beige-200/40 font-light tracking-widest">
          {error === "AccessDenied" 
            ? "Unidentified entity detected. Access prohibited." 
            : "Anomaly occurred during authentication process."}
        </p>
      </div>

      {/* Tombol Kembali */}
      <Link 
        href="/login"
        className="w-full group relative flex items-center justify-center gap-4 px-6 py-4 bg-transparent border border-beige-200/20 text-beige-100 hover:bg-beige-100 hover:text-navy-900 transition-all duration-500 rounded-sm"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase font-medium">
          Return to Safe Zone
        </span>
      </Link>

      {/* Footer info */}
      <div className="mt-12 flex flex-col items-center gap-4">
        <div className="w-8 h-[1px] bg-red-500/20"></div>
        <p className="text-[8px] text-red-400/40 tracking-[0.3em] uppercase text-center leading-relaxed">
          Incident Logged <br/> Secure Gateway 2.0
        </p>
      </div>

    </div>
  );
}

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Glow Merah untuk nuansa Error */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <Suspense fallback={<div className="text-beige-200/40 text-xs tracking-widest uppercase animate-pulse">Verifying Clearance...</div>}>
        <ErrorContent />
      </Suspense>
      
    </div>
  );
}