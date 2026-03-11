"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export default function ToastNotification({ message, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    // PERUBAHAN: Sekarang meluncur dari Atas (top-8) ke Kanan (right-8)
    <div className="fixed top-8 right-8 z-[9999] flex items-center gap-4 bg-[#0a0f18] border border-beige-200/20 px-6 py-4 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.9)] animate-in slide-in-from-top-8 fade-in duration-300">
      
      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
      
      <p className="text-[10px] md:text-xs tracking-widest uppercase text-beige-100 font-mono">
        {message}
      </p>

      <button onClick={onClose} className="ml-4 text-beige-200/40 hover:text-beige-100 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

    </div>
  );
}