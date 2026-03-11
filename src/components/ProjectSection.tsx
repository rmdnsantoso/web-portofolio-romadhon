import { prisma } from "@/lib/prisma";

export default async function ProjectSection() {
  // Ambil data proyek dari database dan urutkan dari yang terbaru
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <section id="project" className="w-full min-h-screen pt-32 px-6 md:px-12 max-w-6xl mx-auto relative z-10 bg-navy-900">
      
      {/* Header Bagian */}
      <div className="flex items-center gap-6 mb-16">
        <h2 className="text-3xl md:text-4xl font-serif tracking-wider text-beige-100">Selected Projects.</h2>
        <div className="h-[1px] bg-beige-200/20 flex-grow"></div>
      </div>

      {projects.length === 0 ? (
        // Tampilan jika belum ada proyek
        <div className="h-96 border border-dashed border-beige-200/20 flex flex-col items-center justify-center text-beige-200/50 italic rounded-sm">
          <p className="text-sm tracking-widest uppercase">No projects deployed yet.</p>
        </div>
      ) : (
        // Grid Galeri Proyek
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {projects.map((project) => (
            <div key={project.id} className="group relative flex flex-col border border-beige-200/10 bg-navy-800/30 rounded-sm overflow-hidden hover:border-beige-200/30 hover:bg-navy-800/50 transition-all duration-500 shadow-lg shadow-black/20">
              
              {/* Gambar Proyek (Thumbnail) */}
              <div className="w-full aspect-video overflow-hidden bg-navy-900 relative">
                {project.imageUrl ? (
                  <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-beige-200/20 text-[10px] tracking-widest uppercase">
                    [ No Image Data ]
                  </div>
                )}
                
                {/* Badge Kategori di pojok kanan atas gambar */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-navy-900/90 backdrop-blur-md border border-beige-200/10 text-[9px] tracking-widest uppercase text-beige-100 rounded-sm shadow-lg">
                  {project.category}
                </div>
              </div>

              {/* Detail Konten Proyek */}
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-serif text-beige-100 mb-4 group-hover:text-white transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-beige-200/70 font-light leading-relaxed mb-8 flex-grow">
                  {project.description}
                </p>
                
                {/* Tech Stack (Dipecah menjadi badge kecil-kecil berdasarkan koma) */}
                <div className="flex flex-wrap gap-2 mt-auto pt-6 border-t border-beige-200/10">
                  {project.techStack.split(',').map((tech, idx) => (
                    <span key={idx} className="text-[10px] tracking-widest uppercase text-beige-200/60 bg-navy-900 px-2 py-1 border border-beige-200/10 rounded-sm">
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}