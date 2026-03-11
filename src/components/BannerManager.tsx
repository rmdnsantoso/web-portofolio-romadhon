"use client";

import { useState } from "react";
import { createBanner, deleteBanner, toggleBannerStatus } from "@/app/admin/actions";
import ToastNotification from "./ToastNotification";

export default function BannerManager({ banners }: { banners: any[] }) {
  const [isPending, setIsPending] = useState(false);

  // State untuk Toast Notification
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Handler 1: Tambah Banner (DENGAN SUPABASE UPLOAD)
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    
    const form = event.currentTarget; 
    const formData = new FormData(form);

    try {
      // --- CEGAT FILE GAMBAR BANNER ---
      const imageFile = formData.get('imageFile') as File;

      if (imageFile && imageFile.size > 0) {
        const uploadData = new FormData();
        uploadData.append('file', imageFile);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        });

        const data = await res.json();

        if (data.url) {
          // Ganti input 'imageUrl' dengan link asli dari Supabase
          formData.set('imageUrl', data.url);
        } else {
          throw new Error("Gagal mengunggah banner ke cloud.");
        }
      }

      // Kirim data yang sudah berisi URL Supabase ke Server Action
      await createBanner(formData);
      
      form.reset(); 
      setToastMessage("NEW BANNER DEPLOYED.");
      setShowToast(true);
    } catch (error: any) {
      console.error("Banner Error:", error);
      setToastMessage("ERROR: " + (error.message || "DEPLOY FAILED."));
      setShowToast(true);
    } finally {
      setIsPending(false);
    }
  }

  // Handler 2: Hapus Banner
  async function handleDeleteBanner(id: string) {
    if (confirm("Delete this banner?")) {
      await deleteBanner(id);
      setToastMessage("SYSTEM ALERT: BANNER REMOVED."); // Mengandung kata 'REMOVED' (merah)
      setShowToast(true);
    }
  }

  // Handler 3: Sakelar On/Off Banner
  async function handleToggleBanner(id: string, currentStatus: boolean) {
    await toggleBannerStatus(id, currentStatus);
    setToastMessage(currentStatus ? "BANNER SET TO OFFLINE." : "BANNER SET TO ONLINE.");
    setShowToast(true);
  }

  return (
    <div className="flex flex-col xl:flex-row gap-12 items-start relative">
      
      {/* KIRI: Form Tambah Banner Baru */}
      <div className="w-full xl:w-1/3 bg-navy-800/20 border border-beige-200/10 p-6 md:p-8 rounded-sm shrink-0">
        <h3 className="text-lg font-serif mb-6 border-b border-beige-200/10 pb-4 tracking-wider">Deploy New Banner</h3>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-sm font-light">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] tracking-widest uppercase text-beige-200/50">Banner Text / Title</label>
            <input type="text" name="title" required placeholder="e.g. LATEST PROJECT" className="bg-navy-800/50 border border-beige-200/20 rounded-sm px-4 py-3 text-beige-100 focus:outline-none focus:border-beige-100 transition-colors" />
          </div>

          <div className="flex flex-col gap-4 p-4 border border-beige-200/20 bg-navy-800/30 rounded-sm mt-2">
            <label className="text-[10px] tracking-widest uppercase text-beige-200/50">Background Image</label>
            
            <div className="flex flex-col gap-2">
              <span className="text-[9px] text-beige-200/40">1: Upload File (JPG/PNG)</span>
              <input 
                type="file" 
                name="imageFile" 
                accept="image/png, image/jpeg, image/webp" 
                className="text-xs text-beige-100 file:mr-4 file:py-1.5 file:px-3 file:rounded-sm file:border-0 file:text-[10px] file:uppercase file:tracking-widest file:font-medium file:bg-beige-100 file:text-navy-900 hover:file:bg-white transition-colors cursor-pointer" 
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-beige-200/10"></div>
              <span className="text-[9px] tracking-widest uppercase text-beige-200/30">OR</span>
              <div className="h-[1px] flex-1 bg-beige-200/10"></div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[9px] text-beige-200/40">2: Paste Image URL</span>
              <input 
                type="url" 
                name="imageUrl" 
                placeholder="https://..." 
                className="bg-navy-800/50 border border-beige-200/20 rounded-sm px-4 py-3 text-beige-100 focus:outline-none focus:border-beige-100 transition-colors" 
              />
            </div>
          </div>

          <button type="submit" disabled={isPending} className="mt-4 w-full py-4 bg-beige-100 text-navy-900 font-medium text-xs tracking-widest uppercase rounded-sm hover:bg-white transition-colors disabled:opacity-50">
            {isPending ? "Deploying..." : "Add to Rotation"}
          </button>
        </form>
      </div>

      {/* KANAN: Daftar Banner Aktif */}
      <div className="w-full xl:w-2/3">
        <h3 className="text-lg font-serif mb-6 border-b border-beige-200/10 pb-4 tracking-wider">Active Rotation Sequence</h3>
        
        {banners.length === 0 ? (
          <p className="text-beige-200/40 italic text-sm">No banners in rotation. The hero section will be empty.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banners.map((b) => (
              <div key={b.id} className="group relative overflow-hidden rounded-sm border border-beige-200/10 aspect-video bg-navy-800">
                {/* Gambar Background */}
                <img src={b.imageUrl} alt={b.title} className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${b.isActive ? "opacity-40 group-hover:scale-105 group-hover:opacity-60" : "opacity-10 grayscale"}`} />
                
                {/* Overlay Konten */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                  <div className="flex justify-between items-start">
                    <span className={`px-2 py-1 text-[8px] tracking-[0.2em] uppercase rounded-sm border backdrop-blur-md ${b.isActive ? "border-green-500/30 bg-green-500/20 text-green-300" : "border-red-500/30 bg-red-500/20 text-red-300"}`}>
                      {b.isActive ? "ONLINE" : "OFFLINE"}
                    </span>
                    
                    <button onClick={() => handleDeleteBanner(b.id)} className="text-red-400/50 hover:text-red-400 bg-navy-900/50 hover:bg-navy-900 p-2 rounded-sm transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-serif text-beige-100 mb-3">{b.title}</h4>
                    <button 
                      onClick={() => handleToggleBanner(b.id, b.isActive)}
                      className="text-[10px] tracking-widest uppercase border border-beige-200/20 hover:bg-beige-100 hover:text-navy-900 text-beige-100 px-4 py-2 transition-colors backdrop-blur-sm"
                    >
                      {b.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SPEAKER TOAST BANNER MANAGER */}
      <ToastNotification 
        message={toastMessage} 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />

    </div>
  );
}