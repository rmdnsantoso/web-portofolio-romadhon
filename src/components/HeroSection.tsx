import { prisma } from "@/lib/prisma";

export default async function HeroSection() {
  // 1. Ambil data banner yang statusnya AKTIF saja
  const activeBanners = await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  });

  // 2. Ambil data profil untuk teks hero
  const profile = await prisma.profile.findUnique({
    where: { id: "woozie-admin" }
  });

  // Siapkan data teks (dengan nilai bawaan jika database kosong)
  const name = profile?.name || "Romadhon Santoso";
  const role = profile?.role || "Informatics Engineering";
  
  // Siapkan array gambar. Jika admin belum upload banner, pakai gambar estetika bawaan
  const bannerImages = activeBanners.length > 0 
    ? activeBanners.map(b => b.imageUrl)
    : [
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
      ];

  // Kalkulasi durasi animasi berdasarkan jumlah gambar (biar nggak terlalu cepat/lambat)
  const animationDuration = bannerImages.length * 20;

  return (
    <section id="home" className="w-full min-h-screen flex flex-col justify-center items-center text-center relative">
      
      {/* --- CSS INJECTIONS KHUSUS ANIMASI HERO --- */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          animation: scroll ${animationDuration}s linear infinite;
          width: max-content;
        }
      `}} />

      {/* --- BACKGROUND BERGERAK (DARI DATABASE) --- */}
      <div className="absolute inset-0 z-0 overflow-hidden flex items-center mix-blend-luminosity opacity-40">
         <div className="flex animate-infinite-scroll">
           {/* Gandakan array agar putarannya tidak pernah putus */}
           {[...Array(2)].map((_, i) => (
             <div key={i} className="flex">
               {bannerImages.map((img, idx) => (
                 <div key={idx} className="w-[100vw] md:w-[50vw] h-screen flex-shrink-0">
                   <img 
                     src={img} 
                     alt={`Hero Banner ${idx}`} 
                     className="w-full h-full object-cover pointer-events-none" 
                   />
                 </div>
               ))}
             </div>
           ))}
         </div>
      </div>

      {/* --- GRADIENT OVERLAY (AGAR TEKS TERBACA) --- */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-navy-900 via-navy-900/80 to-navy-900/50 pointer-events-none"></div>

      {/* --- KONTEN TEKS UTAMA --- */}
      <div className="relative z-20 flex flex-col items-center px-8 mt-12">
        <p className="text-sm md:text-base text-beige-200/80 tracking-[0.3em] uppercase mb-4 drop-shadow-md">
          {role}
        </p>
        
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-beige-100 mb-8 tracking-wider leading-tight drop-shadow-2xl">
          Full-Stack Vision, <br /> <span className="text-beige-200/90 italic">Intelligent Logic.</span>
        </h1>
        
        <p className="text-base md:text-lg text-beige-100 mb-12 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-lg">
          Hello, I'm <strong className="font-medium text-white">{name}</strong>. Bridging complex logic with elegant design, I build scalable web ecosystems and intuitive interfaces that solve real-world problems.
        </p>
        
        {/* TOMBOL RESPONSIVE (DENGAN EFEK SENTUH MOBILE) */}
        <a 
          href="#project" 
          className="
            px-8 py-4 border border-beige-200/50 rounded-sm tracking-widest text-xs uppercase group backdrop-blur-sm shadow-lg shadow-black/20
            text-beige-100 transition-all duration-500 outline-none select-none
            md:hover:bg-beige-100 md:hover:text-navy-900 
            active:bg-beige-100 active:text-navy-900 active:scale-95
          "
        >
          Explore Selected Works 
          <span className="inline-block ml-2 md:group-hover:translate-x-1 group-active:translate-x-1 transition-transform duration-300">→</span>
        </a>
      </div>
    </section>
  );
}