import { prisma } from "@/lib/prisma";

export default async function AboutSection() {
  const profile = await prisma.profile.findUnique({
    where: { id: "woozie-admin" }
  });

  const name = profile?.name || "Romadhon Santoso";
  const role = profile?.role || "Web Programming & UI/UX Design";
  const about = profile?.about || "System initializing... Please update profile in Control Room.";
  const avatarUrl = profile?.avatarUrl;
  const resumeUrl = profile?.resumeUrl;

  return (
    <section id="about" className="py-24 px-6 md:px-12 max-w-6xl mx-auto border-t border-beige-200/10">
      
      {/* Header Bagian */}
      <div className="mb-16">
        <div className="flex items-center gap-4 mb-4">
          <span className="w-8 h-[1px] bg-beige-200/50"></span>
          <p className="text-[10px] tracking-[0.3em] uppercase text-beige-200/50">Identity Matrix</p>
        </div>
        <h2 className="text-3xl md:text-5xl font-serif text-beige-100">About Me.</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-12 lg:gap-20 items-center md:items-start">
        
        {/* KIRI: Foto Profil */}
        <div className="w-full md:w-1/3 shrink-0 relative group cursor-pointer">
          <div className="aspect-square relative rounded-sm overflow-hidden border border-beige-200/10 bg-navy-800/50">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={name} 
                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-beige-200/20">
                <span className="text-[10px] tracking-widest uppercase">No Visual Data</span>
              </div>
            )}
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b border-r border-beige-200/20 transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>
        </div>

        {/* KANAN: Data Teks & Resume */}
          <div className="w-full md:w-2/3 flex flex-col gap-6">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-beige-200/50 mb-2">{role}</p>
              <h3 className="text-3xl md:text-4xl font-serif text-beige-100 tracking-wide">{name}</h3>
            </div>

            {/* KODE AJAIB: Menghapus semua "Enter" tersembunyi (\n) dan meratakannya (text-justify) */}
            <p className="text-sm font-light text-beige-200/80 leading-relaxed text-justify">
              {about.replace(/\r?\n|\r/g, ' ')}
            </p>

          {/* Tombol Download CV */}
          <div className="mt-8 pt-8 border-t border-beige-200/10">
            {resumeUrl ? (
              <a 
                href={resumeUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-4 px-8 py-4 border border-beige-200/20 text-beige-100 hover:bg-beige-100 hover:text-navy-900 transition-all duration-500 rounded-sm text-[10px] tracking-[0.2em] uppercase font-medium group"
              >
                Access Resume
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </a>
            ) : (
              <button disabled className="px-8 py-4 border border-beige-200/5 text-beige-200/20 cursor-not-allowed rounded-sm text-[10px] tracking-[0.2em] uppercase font-medium">
                Resume Not Deployed
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}