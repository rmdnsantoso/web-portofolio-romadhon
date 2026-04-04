"use client";

import { useState } from "react";

// Mendefinisikan tipe data agar TypeScript tidak protes
type AchievementData = {
  id: string; 
  title: string; 
  issuer: string; 
  year: string; 
  description: string | null; 
  imageUrl: string | null;
};

export default function AchievementClient({ achievements }: { achievements: AchievementData[] }) {
  // State untuk menyimpan URL gambar yang sedang diperbesar (Jika null, modal tertutup)
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  return (
    <section className="pt-32 pb-32 relative">
      {/* Garis estetik diubah posisinya agar melayang (tidak menempel ke atas) */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[1px] h-16 bg-gradient-to-b from-transparent via-beige-200/30 to-transparent"></div>
      
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        
        {/* Header Section */}
        <div className="mb-20 text-center">
          <p className="text-xs text-beige-200/40 tracking-[0.3em] uppercase mb-4">Hall of Fame</p>
          <h2 className="text-3xl md:text-5xl font-serif text-beige-100 tracking-wide">
            Honors & Awards.
          </h2>
        </div>

        {/* List View Achievement (Timeline Style) */}
        <div className="flex flex-col gap-8 md:gap-12">
          {achievements.map((ach) => (
            <div key={ach.id} className="group flex flex-col md:flex-row gap-4 md:gap-12 items-start">
              
              {/* Kiri: Tahun */}
              <div className="md:w-32 shrink-0 pt-1">
                <span className="text-[10px] font-medium tracking-[0.2em] text-beige-200/50 uppercase border border-beige-200/10 px-3 py-1.5 rounded-sm bg-navy-900/50 block w-max">
                  {ach.year}
                </span>
              </div>

              {/* Kanan: Detail & Media Thumbnail */}
              <div className="flex-1 relative pb-8 md:border-l border-beige-200/10 md:pl-10">
                {/* Titik dekoratif di garis timeline */}
                <div className="hidden md:block absolute left-[-5px] top-3 w-2 h-2 rounded-full bg-navy-800 border border-beige-200/30 group-hover:border-beige-200/60 group-hover:bg-beige-200/20 transition-all"></div>

                <h3 className="text-xl md:text-2xl font-serif text-beige-100 mb-2 group-hover:text-white transition-colors">
                  {ach.title}
                </h3>
                
                <p className="text-[10px] tracking-widest text-beige-200/50 uppercase mb-4">
                  {ach.issuer}
                </p>
                
                {ach.description && (
                  <p className="text-sm font-light text-beige-200/60 leading-relaxed max-w-2xl">
                    {ach.description}
                  </p>
                )}

                {/* Media Thumbnail Box (Mobile-Friendly & Interactive) */}
                {ach.imageUrl && (
                  <div 
                    tabIndex={0} 
                    className="mt-6 relative inline-block group/img outline-none select-none"
                  >
                    <img 
                      src={ach.imageUrl} 
                      alt={`Credential for ${ach.title}`} 
                      onClick={() => setZoomedImage(ach.imageUrl)} 
                      className="
                        h-24 md:h-32 w-auto object-contain p-2 rounded-sm transition-all duration-300 cursor-zoom-in
                        border border-beige-200/10 md:group-hover/img:border-beige-200/30 
                        bg-navy-800/40 
                        opacity-100 md:opacity-70 md:group-hover/img:opacity-100 
                        active:scale-95
                      "
                    />
                    
                    {/* Overlay Tulisan Tap/Click (Pintar mendeteksi HP atau PC) */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-100 md:opacity-0 md:group-hover/img:opacity-100 pointer-events-none transition-opacity">
                       <span className="bg-black/60 text-beige-100 text-[9px] uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-md">
                         <span className="md:hidden">Tap to Enlarge</span>
                         <span className="hidden md:inline">Click to Enlarge</span>
                       </span>
                    </div>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* --- LIGHTBOX MODAL (MUNCUL MENGAMBANG SAAT GAMBAR DIKLIK) --- */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-12 animate-in fade-in duration-300"
          onClick={() => setZoomedImage(null)} // Tutup jika area luar gambar diklik
        >
          {/* Tombol Tutup (Silang) - Diperbesar area sentuhnya untuk HP */}
          <button 
            className="absolute top-4 right-4 md:top-10 md:right-10 text-beige-200/50 hover:text-white transition-colors p-4 active:scale-90 outline-none"
            onClick={() => setZoomedImage(null)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          {/* Gambar Besar */}
          <img 
            src={zoomedImage} 
            alt="Enlarged Credential" 
            className="max-w-full max-h-full object-contain rounded-sm shadow-2xl border border-beige-200/10"
            onClick={(e) => e.stopPropagation()} // Mencegah gambar tertutup jika gambarnya yang diklik
          />
        </div>
      )}
    </section>
  );
}