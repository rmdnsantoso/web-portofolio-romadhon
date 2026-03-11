"use client";

import { useState, useEffect } from "react";

// Kita tambahkan parameter className agar letaknya mudah disesuaikan
export default function DigitalClock({ className = "" }: { className?: string }) {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date()); 
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!time) return <span className="opacity-0">00:00:00</span>;

  return (
    <div className={`inline-flex items-center gap-4 font-light text-beige-100 text-lg md:text-xl tracking-[0.2em] px-6 py-3 border border-beige-200/20 rounded-sm bg-navy-800/30 backdrop-blur-md shadow-[0_0_15px_rgba(245,245,220,0.05)] ${className}`}>
      {/* Titik nadi (pulse) elegan berwarna emas/beige terang, bukan merah */}
      <span className="w-2 h-2 bg-beige-100 rounded-full animate-pulse shadow-[0_0_8px_rgba(245,245,220,0.8)]"></span>
      {time.toLocaleTimeString('id-ID', { hour12: false })}
    </div>
  );
}