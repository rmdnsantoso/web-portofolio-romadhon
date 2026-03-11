import { prisma } from "@/lib/prisma";
import ProjectFormPanel from "@/components/ProjectFormPanel";
import ProjectRowActions from "@/components/ProjectRowActions";
import AdminSidebar from "@/components/AdminSidebar";
import ProfileForm from "@/components/ProfileForm";
import BannerManager from "@/components/BannerManager";
import DigitalClock from "@/components/DigitalClock";
import { toggleMaintenance } from "@/app/admin/actions";

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>; 
}) {
  
  const resolvedParams = await searchParams;
  const activeTab = resolvedParams.tab || "dashboard";

  // 1. Ambil data project (Kurung sudah diperbaiki)
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' } 
  });

  // 2. Ambil data profil tunggal (Kurung sudah rapi)
  const profile = await prisma.profile.findUnique({
    where: { id: "woozie-admin" }
  });

  // 3. Ambil data Banner
const banners = await prisma.banner.findMany({
  orderBy: { createdAt: 'desc' }
});

  return (
    <div className="h-screen bg-navy-900 text-beige-100 flex flex-col md:flex-row font-sans overflow-hidden">
      
      {/* Sidebar Kiri */}
      <AdminSidebar />

      {/* Area Kerja Utama */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto w-full relative">
      
      {/* --- TOP BAR: CLOCK (Pojok Kanan Atas, Muncul di Semua Tab) --- */}
        <div className="w-full flex justify-end mb-8 md:mb-12">
          <DigitalClock />
        </div>

        {/* ========================================= */}
        {/* TAB 1: DASHBOARD & PROJECTS (Default) */}
        {/* ========================================= */}
        {activeTab === "dashboard" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-12 flex justify-between items-end">
              <div>
                <p className="text-xs text-beige-200/50 tracking-[0.2em] uppercase mb-2">Control Room</p>
                <h1 className="text-2xl md:text-4xl font-serif tracking-wide">Welcome back, Romadhon.</h1>
              </div>
                  <ProjectFormPanel />
            </header>

            {/* Statistik */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="p-6 border border-beige-200/10 bg-navy-800/30 rounded-sm">
                <p className="text-xs text-beige-200/50 tracking-widest uppercase mb-4">Total Works</p>
                <p className="text-4xl font-serif">{projects.length}</p>
              </div>
              <div className="p-6 border border-beige-200/10 bg-navy-800/30 rounded-sm">
                <p className="text-xs text-beige-200/50 tracking-widest uppercase mb-4">Active Modules</p>
                <p className="text-4xl font-serif">3</p>
              </div>
              <div className="p-6 border border-beige-200/10 bg-navy-800/30 rounded-sm flex flex-col justify-between">
                <p className="text-xs text-beige-200/50 tracking-widest uppercase mb-4">System Status</p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  <p className="text-sm tracking-widest uppercase text-green-400/80">Secure & Online</p>
                </div>
              </div>
            </div>

            {/* Tabel Data */}
            <div className="bg-navy-800/20 border border-beige-200/10 p-6 md:p-8 rounded-sm overflow-x-auto">
              <h3 className="text-lg font-serif mb-6 border-b border-beige-200/10 pb-4 tracking-wider">Recent Data</h3>
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="text-xs tracking-widest text-beige-200/40 uppercase border-b border-beige-200/10">
                    <th className="pb-4 font-normal">Project Title</th>
                    <th className="pb-4 font-normal">Category</th>
                    <th className="pb-4 font-normal">Status</th>
                    <th className="pb-4 font-normal text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-light text-beige-200/80">
                  {projects.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-beige-200/40 italic">No projects found.</td>
                    </tr>
                  )}
                  {projects.map((p) => (
                    <tr key={p.id} className="border-b border-beige-200/5 hover:bg-navy-800/40 transition-colors group">
                      <td className="py-5 text-beige-100 font-medium group-hover:translate-x-1 transition-transform">{p.title}</td>
                      <td className="py-5">{p.category}</td>
                      <td className="py-5">
                        <span className={`px-3 py-1 text-[10px] tracking-widest uppercase rounded-sm border ${p.status === 'Published' ? 'border-green-500/20 bg-green-500/10 text-green-400' : 'border-yellow-500/20 bg-yellow-500/10 text-yellow-400'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-5 text-right">
                        <ProjectRowActions project={{ id: p.id, title: p.title, category: p.category, description: p.description, techStack: p.techStack, imageUrl: p.imageUrl }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* TAB 2: RESUME & PROFILE */}
        {/* ========================================= */}
        {activeTab === "profile" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-12">
              <p className="text-xs text-beige-200/50 tracking-[0.2em] uppercase mb-2">Identity Matrix</p>
              <h1 className="text-2xl md:text-4xl font-serif tracking-wide">Resume & Profile.</h1>
            </header>
            
            {/* Form Profil Dipanggil Di Sini */}
            <ProfileForm profile={profile} />
          </div>
        )}

        {/* ========================================= */}
        {/* TAB 3: SETTINGS */}
        {/* ========================================= */}
        {activeTab === "settings" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-12">
              <p className="text-xs text-beige-200/50 tracking-[0.2em] uppercase mb-2">System Config</p>
              <h1 className="text-2xl md:text-4xl font-serif tracking-wide">Settings.</h1>
            </header>
          {/* SAKELAR SHUTDOWN / MAINTENANCE */}
          <div className="mb-12 p-8 border border-red-500/20 bg-red-500/5 rounded-sm flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-red-400 font-serif text-xl mb-2">System Override: Maintenance Mode</h3>
              <p className="text-beige-200/60 text-sm font-light">Mencegah pengunjung publik mengakses portofolio. Sistem akan menampilkan layar "Under Maintenance".</p>
            </div>
            <form action={async () => { "use server"; await toggleMaintenance(profile?.isMaintenance || false); }}>
              <button type="submit" className={`px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase rounded-sm transition-all shadow-lg ${profile?.isMaintenance ? "bg-red-500 text-white hover:bg-red-600 animate-pulse" : "bg-navy-800 border border-beige-200/20 text-beige-200 hover:border-red-500 hover:text-red-500"}`}>
                {profile?.isMaintenance ? "SYSTEM IS OFFLINE (RESTORE)" : "INITIATE SHUTDOWN"}
              </button>
            </form>
          </div>
            {/* Langsung panggil komponennya di sini tanpa bungkus p/div dashed */}
            <BannerManager banners={banners} />

          </div>
        )}

      </main>
    </div>
  );
}