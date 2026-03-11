"use client";

import { useState, useRef } from "react";

// --- KOMPONEN KOTAK SATUAN DENGAN EFEK LAMPU GLOWING ---
const TechBadge = ({ tech }: { tech: any }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  // Radar pelacak kursor
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className="relative group hover:-translate-y-1 transition-transform duration-300"
    >
      {/* 1. LAYER LAMPU DI BELAKANG (Bocor keluar kotak) */}
      <div
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300 rounded-sm"
        style={{
          opacity: opacity,
          // Cahaya membulat yang mengikuti X dan Y dari kursor
          background: `radial-gradient(100px circle at ${position.x}px ${position.y}px, ${tech.bg}, transparent 70%)`,
          filter: "blur(15px)", // Memberikan efek "bias cahaya" dari belakang
          transform: "scale(1.1)", // Ditarik sedikit lebih besar dari kotaknya
        }}
      />

      {/* 2. KOTAK FISIK ASLI (Menutupi cahaya di tengah, membiarkan pinggirnya glowing) */}
      <div 
        className="relative z-10 flex items-center gap-3 px-5 py-3 border border-beige-200/20 rounded-sm shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-default w-full h-full"
        style={{ backgroundColor: tech.bg, color: tech.text }}
      >
        <div>{tech.svg}</div>
        <span className="text-[10px] tracking-widest uppercase font-medium">
          {tech.name}
        </span>
      </div>
    </div>
  );
};

export default function TechStackSection() {
  // Data aslimu tidak ada yang saya ubah!
  const techStack = [
    { name: "Next.js", bg: "#000000", text: "#ffffff", svg: <svg viewBox="0 0 128 128" className="w-5 h-5 fill-current"><path d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64c11.2 0 21.7-2.9 30.8-7.9L48.4 55.3v36.6h-8.7V36.2h9.8l50.5 73.8c16.3-12.2 26.8-31.6 26.8-53.6 0-35.3-28.7-64-64-64zM93 42.6h8.7v30l-8.7-11.8V42.6z"/></svg> },
    { name: "Laravel", bg: "#FF2D20", text: "#ffffff", svg: <svg viewBox="0 0 128 128" className="w-5 h-5 fill-current"><path d="M123.7 40.7L67.6 8.3c-2.2-1.3-5-1.3-7.2 0L4.3 40.7c-2.2 1.3-3.6 3.6-3.6 6.1v64.8c0 2.5 1.4 4.8 3.6 6.1l56.1 32.4c2.2 1.3 5 1.3 7.2 0l56.1-32.4c2.2-1.3 3.6-3.6 3.6-6.1V46.8c0-2.5-1.4-4.8-3.6-6.1zM64 107.5l-44.6-25.8V35.1L64 60.9l44.6-25.8v46.6L64 107.5z"/></svg> },
    { name: "Kotlin", bg: "#7F52FF", text: "#ffffff", svg: <svg viewBox="0 0 128 128" className="w-5 h-5 fill-current"><path d="M128 128H0V0h128L64 64z"/></svg> },
    { name: "Python", bg: "#FFD43B", text: "#000000", svg: <svg viewBox="0 0 128 128" className="w-5 h-5 fill-current"><path d="M63.9 0C30.5 0 15 14.8 15 35.6v19.4h49.6v7H21.2C9.5 62 0 70.8 0 85.3c0 15.6 11.2 24.5 25.5 24.5h11v-20c0-14 11.4-25.4 25.4-25.4h27.4V36.8c0-21-16.1-36.8-25.4-36.8zM44.4 16.2c4.3 0 7.8 3.5 7.8 7.8s-3.5 7.8-7.8 7.8-7.8-3.5-7.8-7.8 3.5-7.8 7.8-7.8zm62.4 22.5c0-15.6-11.2-24.5-25.5-24.5h-11v20c0 14-11.4 25.4-25.4 25.4H17.5v27.6C17.5 108.2 33.6 124 43 124c33.4 0 48.9-14.8 48.9-35.6V69h-49.6v-7h43.4C97.4 62 107 53.2 107 38.7zM83.6 111.8c-4.3 0-7.8-3.5-7.8-7.8s3.5-7.8 7.8-7.8 7.8 3.5 7.8 7.8-3.5 7.8-7.8 7.8z"/></svg> },
    { name: "CNN / AI", bg: "#10B981", text: "#ffffff", svg: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
    { name: "Tailwind", bg: "#06B6D4", text: "#ffffff", svg: <svg viewBox="0 0 128 128" className="w-5 h-5 fill-current"><path d="M64 25.6c-19.2 0-32 9.6-38.4 28.8 6.4-12.8 16-16 25.6-12.8 6.5 2.2 11.2 7 16.4 12.4 8.2 8.4 17.5 18 34.8 18 19.2 0 32-9.6 38.4-28.8-6.4 12.8-16 16-25.6 12.8-6.5-2.2-11.2-7-16.4-12.4-8.2-8.4-17.5-18-34.8-18zm-38.4 32c-19.2 0-32 9.6-38.4 28.8 6.4-12.8 16-16 25.6-12.8 6.5 2.2 11.2 7 16.4 12.4 8.2 8.4 17.5 18 34.8 18 19.2 0 32-9.6 38.4-28.8-6.4 12.8-16 16-25.6 12.8-6.5-2.2-11.2-7-16.4-12.4-8.2-8.4-17.5-18-34.8-18z"/></svg> },
    { name: "Figma", bg: "#F24E1E", text: "#ffffff", svg: <svg viewBox="0 0 128 128" className="w-5 h-5 fill-current"><path d="M37 64c0-10.8 8.8-19.6 19.6-19.6h14.8v39.2H56.6C45.8 83.6 37 74.8 37 64zm34.4-19.6V5.2h19.6C101.8 5.2 110.6 14 110.6 24.8S101.8 44.4 91 44.4H71.4zm0 39.2V44.4H91c10.8 0 19.6 8.8 19.6 19.6S101.8 83.6 91 83.6H71.4zm0 0v39.2c0 10.8-8.8 19.6-19.6 19.6S32.2 133.2 32.2 122.4 41 102.8 51.8 102.8h19.6zm-34.4-63.6C37 14 45.8 5.2 56.6 5.2h14.8v39.2H56.6C45.8 44.4 37 35.6 37 24.8z"/></svg> },
  ];

  return (
    <section id="tech-stack" className="w-full pt-12 pb-32 px-6 md:px-12 max-w-6xl mx-auto relative z-10">
      <div className="flex items-center gap-6 mb-12">
        <h2 className="text-2xl md:text-3xl font-serif tracking-wider text-beige-100">Tech Arsenal.</h2>
        <div className="h-[1px] bg-beige-200/20 flex-grow"></div>
      </div>

      <div className="flex flex-wrap gap-4">
        {/* Render menggunakan komponen TechBadge yang baru */}
        {techStack.map((tech, idx) => (
          <TechBadge key={idx} tech={tech} />
        ))}
      </div>
    </section>
  );
}