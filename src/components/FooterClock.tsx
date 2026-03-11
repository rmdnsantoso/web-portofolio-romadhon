"use client";

import { useState, useEffect } from "react";

export default function FooterClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!time) return <div className="h-8 opacity-0">Loading...</div>;

  // Format Tanggal (Contoh: TUESDAY, 10 MARCH 2026)
  const dateStr = time.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).toUpperCase();

  // Format Jam (Contoh: 13:08:51)
  const timeStr = time.toLocaleTimeString('id-ID', {
    hour12: false
  });

  return (
    <div className="flex flex-col items-center gap-2 mb-8 cursor-default">
      <p className="text-[10px] tracking-[0.3em] uppercase text-beige-200/50 font-mono">
        {dateStr} <span className="mx-2 text-beige-200/20">|</span> {timeStr} WIB
      </p>
      <div className="flex items-center gap-2 text-[8px] tracking-[0.4em] uppercase text-beige-200/30">
        <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.8)]"></span>
        SYSTEM ACTIVE — BANDAR LAMPUNG, ID
      </div>
    </div>
  );
}