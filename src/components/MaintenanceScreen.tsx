"use client";

import { useState, useEffect } from "react";
import SecretEasterEgg from "./SecretEasterEgg";

export default function MaintenanceScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [anomalies, setAnomalies] = useState<{ id: number; left: number; top: number }[]>([]);
  const [gameOver, setGameOver] = useState(false);
  
  // Waktu Khusus Maintenance (Real-time)
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Deteksi tombol spasi untuk memulai Easter Egg
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !isPlaying) {
        setIsPlaying(true);
        setScore(0);
        setGameOver(false);
        setAnomalies([]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying]);

  // Logika Game: Memunculkan partikel cahaya
  useEffect(() => {
    if (!isPlaying || gameOver) return;
    const speed = Math.max(600, 2000 - score * 50); 
    const interval = setInterval(() => {
      setAnomalies((current) => {
        if (current.length > 5) {
          setGameOver(true);
          return current;
        }
        return [...current, { id: Date.now(), left: 10 + Math.random() * 80, top: 10 + Math.random() * 80 }];
      });
    }, speed);
    return () => clearInterval(interval);
  }, [isPlaying, gameOver, score]);

  const catchAnomaly = (id: number) => {
    if (gameOver) return;
    setAnomalies((current) => current.filter((a) => a.id !== id));
    setScore((s) => s + 1);
  };

  // Format Angka Jam (menambahkan '0' di depan jika < 10)
  const hours = time?.getHours().toString().padStart(2, '0') || "00";
  const minutes = time?.getMinutes().toString().padStart(2, '0') || "00";
  const seconds = time?.getSeconds().toString().padStart(2, '0') || "00";

  return (

    <main className="min-h-screen bg-navy-900 flex flex-col items-center justify-center relative overflow-hidden text-beige-100 cursor-default select-none px-6">
      
    <SecretEasterEgg />

      {/* Background Soft Glow */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-20 pointer-events-none">
        <div className="w-[50rem] h-[50rem] bg-beige-200/10 rounded-full blur-[150px]"></div>
      </div>

      <div className={`flex flex-col items-center z-10 w-full transition-opacity duration-1000 ${isPlaying && !gameOver ? "opacity-5 pointer-events-none" : "opacity-100"}`}>
        
        {/* Teks Elegan Atas */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif tracking-wide text-beige-100 mb-8 md:mb-12 text-center drop-shadow-lg">
          Refining Experience.
        </h1>

        {/* --- JAM SINEAMATIK RAKSASA (SIMETRIS) --- */}
        <div className="flex items-center justify-center font-serif text-beige-100 drop-shadow-[0_0_40px_rgba(245,245,220,0.15)] my-2">
          
          {/* Jam */}
          <span className="text-6xl md:text-[9rem] lg:text-[12rem] leading-none tracking-tight">{hours}</span>
          
          {/* Pemisah 1 */}
          <span className="text-4xl md:text-[6rem] lg:text-[8rem] leading-none text-beige-200/30 animate-pulse mx-2 md:mx-6 mb-2 md:mb-8">:</span>
          
          {/* Menit */}
          <span className="text-6xl md:text-[9rem] lg:text-[12rem] leading-none tracking-tight">{minutes}</span>
          
          {/* Pemisah 2 */}
          <span className="text-4xl md:text-[6rem] lg:text-[8rem] leading-none text-beige-200/30 animate-pulse mx-2 md:mx-6 mb-2 md:mb-8">:</span>
          
          {/* Detik (Sama Besar) */}
          <span className="text-6xl md:text-[9rem] lg:text-[12rem] leading-none tracking-tight text-beige-100/90">{seconds}</span>
          
        </div>

        {/* Teks Keterangan Bawah */}
        <p className="mt-8 md:mt-12 text-beige-200/60 tracking-widest uppercase text-xs md:text-sm text-center max-w-lg leading-relaxed">
          Overthinking the pixel alignments so you don't have to. <br className="hidden md:block" /> Normal operations will resume shortly.
        </p>
        
        {/* Petunjuk Easter Egg */}
        <p className="mt-20 text-[10px] text-beige-200/30 uppercase tracking-[0.4em] transition-all">
          {gameOver ? `CALIBRATION COMPLETE - SCORE: ${score}` : "[ PRESS SPACE TO PASS THE TIME ]"}
        </p>
      </div>

      {/* Area Render Game Easter Egg */}
      {isPlaying && !gameOver && anomalies.map((a) => (
        <div 
          key={a.id}
          onClick={() => catchAnomaly(a.id)}
          className="absolute z-20 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-300 group"
          style={{ left: `${a.left}%`, top: `${a.top}%` }}
        >
          {/* Lingkaran luar glowing */}
          <div className="absolute inset-0 rounded-full border border-beige-200/10 bg-beige-200/5 shadow-[0_0_20px_rgba(245,245,220,0.15)] group-hover:bg-beige-200/20 group-hover:border-beige-200/40 transition-all backdrop-blur-sm"></div>
          {/* Inti Cahaya */}
          <div className="w-3 h-3 rounded-full bg-beige-100 shadow-[0_0_10px_rgba(245,245,220,1)] group-hover:bg-white transition-colors"></div>
        </div>
      ))}

    </main>
  );
}