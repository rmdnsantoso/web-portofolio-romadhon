"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ToastNotification from "./ToastNotification";

export default function SecretEasterEgg() {
  const router = useRouter();
  const [accessGranted, setAccessGranted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    let pressedKeys = "";
    const secretCode = "woozie";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (accessGranted) return; 
      
      pressedKeys += e.key.toLowerCase();
      if (pressedKeys.length > secretCode.length) {
        pressedKeys = pressedKeys.slice(1);
      }
      
      if (pressedKeys === secretCode) {
        setAccessGranted(true);
        setShowToast(true); // Panggil notifikasi hijau
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [accessGranted]);

  useEffect(() => {
    if (!accessGranted) return;

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5; 
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        router.push("/admin"); 
      }
    }, 100);

    return () => clearInterval(interval);
  }, [accessGranted, router]);

  // Jika belum diketik, jangan render apa-apa
  if (!accessGranted) return null;

  return (
    // Layar transisi hitam penuh
    <div 
      className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-[#080c16] text-[#f5f5dc]"
      style={{ animation: 'fadeIn 0.5s ease-out forwards' }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      
      <div className="text-center flex flex-col items-center">
        <h2 className="text-3xl md:text-5xl font-serif mb-6 tracking-widest drop-shadow-[0_0_15px_rgba(245,245,220,0.5)]">
          ACCESS GRANTED.
        </h2>
        <p className="text-xs tracking-[0.4em] uppercase opacity-70 mb-8 animate-pulse">
          Authenticating Admin Protocol...
        </p>
        
        <div className="w-64 h-[2px] bg-white/10 overflow-hidden relative rounded-full">
          <div 
            className="absolute top-0 left-0 h-full bg-[#f5f5dc] transition-all duration-100 ease-linear shadow-[0_0_10px_#f5f5dc]"
            style={{ width: `${progress}%` }} 
          ></div>
        </div>
      </div>

      {/* PERBAIKAN: Toast dimasukkan ke DALAM kotak hitam agar dijamin muncul dan tidak terpotong! */}
      <ToastNotification 
        message="ADMIN CREDENTIALS ACCEPTED." 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />
    </div>
  );
}