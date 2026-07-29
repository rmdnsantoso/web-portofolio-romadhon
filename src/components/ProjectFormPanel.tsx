"use client";

import { useState } from "react";
import { createProject } from "@/app/admin/actions";
import ToastNotification from "./ToastNotification";

export default function ProjectFormPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    
    const form = event.currentTarget;
    const formData = new FormData(form);
    
    // --- MULAI: LOGIKA UPLOAD SUPABASE ---
    const imageFile = formData.get('imageFile') as File;

    // Cek apakah user mengunggah file (ukurannya lebih dari 0 byte)
    if (imageFile && imageFile.size > 0) {
      if (imageFile.size > 4 * 1024 * 1024) {
        alert("Ukuran gambar melebihi batas 4MB. Silakan gunakan gambar yang lebih kecil.");
        setIsPending(false);
        return;
      }

      const uploadFormData = new FormData();
      uploadFormData.append('file', imageFile);

      try {
        // Kirim ke API rahasia kita
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });
        
        const uploadData = await response.json();

        if (uploadData.url) {
          // Sukses! Timpa isian 'imageUrl' di formData dengan link Supabase
          formData.set('imageUrl', uploadData.url);
        } else {
          throw new Error(uploadData.error || "Gagal upload");
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert("Gagal mengunggah gambar ke server. Coba lagi.");
        setIsPending(false);
        return; // Hentikan proses simpan
      }
    }
    // Jika tidak ada file, kode akan otomatis menggunakan teks dari input 'imageUrl' (Option 2)
    // --- SELESAI: LOGIKA UPLOAD SUPABASE ---

    // Panggil kurir Server Action dengan paket data yang sudah dimodifikasi
    try {
      await createProject(formData); 
      
      setIsOpen(false); 
      form.reset(); 

      setToastMessage("PROJECT DEPLOYED SUCCESSFULLY.");
      setShowToast(true);
    } catch (error) {
      console.error("Database error:", error);
      alert("Gagal menyimpan ke database.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      {/* Tombol Pemicu di Halaman Utama */}
      <button 
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-beige-100 text-navy-900 text-xs tracking-widest uppercase font-medium hover:bg-white transition-colors rounded-sm shadow-lg shadow-beige-100/10"
      >
        + New Project
      </button>

      {/* Latar Belakang Gelap (Backdrop) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* Slide-over Panel Laci Kanan */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-navy-900 border-l border-beige-200/10 shadow-2xl z-50 transform transition-transform duration-500 ease-in-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-12 border-b border-beige-200/10 pb-6">
            <h2 className="text-2xl font-serif text-beige-100">Add Project</h2>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-beige-200/50 hover:text-beige-100 text-sm uppercase tracking-widest"
              type="button"
            >
              [ Close ]
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-sm font-light">
            
            <div className="flex flex-col gap-2">
              <label className="text-xs tracking-widest uppercase text-beige-200/50">Project Title</label>
              <input type="text" name="title" required placeholder="e.g. ACADEMORA" className="bg-navy-800/50 border border-beige-200/20 rounded-sm px-4 py-3 text-beige-100 focus:outline-none focus:border-beige-100 transition-colors" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs tracking-widest uppercase text-beige-200/50">Category</label>
              <input type="text" name="category" required placeholder="e.g. Web Development" className="bg-navy-800/50 border border-beige-200/20 rounded-sm px-4 py-3 text-beige-100 focus:outline-none focus:border-beige-100 transition-colors" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs tracking-widest uppercase text-beige-200/50">Tech Stack</label>
              <input type="text" name="techStack" required placeholder="Next.js, Tailwind, Prisma" className="bg-navy-800/50 border border-beige-200/20 rounded-sm px-4 py-3 text-beige-100 focus:outline-none focus:border-beige-100 transition-colors" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs tracking-widest uppercase text-beige-200/50">Description</label>
              <textarea name="description" required rows={4} placeholder="Briefly describe the project..." className="bg-navy-800/50 border border-beige-200/20 rounded-sm px-4 py-3 text-beige-100 focus:outline-none focus:border-beige-100 transition-colors resize-none"></textarea>
            </div>

            {/* --- OPSI GANDA GAMBAR (FILE ATAU URL) --- */}
            <div className="flex flex-col gap-4 p-4 border border-beige-200/20 bg-navy-800/30 rounded-sm">
              <label className="text-xs tracking-widest uppercase text-beige-200/50">Project Image (Cover)</label>
              
              <div className="flex flex-col gap-2">
                <span className="text-[10px] text-beige-200/40">Option 1: Upload File (JPG/PNG)</span>
                <input 
                  type="file" 
                  name="imageFile" 
                  accept="image/png, image/jpeg, image/webp"
                  className="text-xs text-beige-100 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-medium file:bg-beige-100 file:text-navy-900 hover:file:bg-white transition-colors cursor-pointer" 
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="h-[1px] flex-1 bg-beige-200/10"></div>
                <span className="text-[10px] tracking-widest uppercase text-beige-200/30">OR</span>
                <div className="h-[1px] flex-1 bg-beige-200/10"></div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[10px] text-beige-200/40">Option 2: Paste Image URL</span>
                <input 
                  type="url" 
                  name="imageUrl" 
                  placeholder="https://..." 
                  className="bg-navy-800/50 border border-beige-200/20 rounded-sm px-4 py-3 text-beige-100 focus:outline-none focus:border-beige-100 transition-colors" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isPending}
              className="mt-6 w-full py-4 bg-beige-100 text-navy-900 font-medium text-xs tracking-widest uppercase rounded-sm hover:bg-white transition-colors disabled:opacity-50"
            >
              {isPending ? "Deploying..." : "Publish Project"}
            </button>
          </form>

        </div>
      </div>

      {/* 4. PASANG KOMPONEN TOAST DI SINI */}
      <ToastNotification 
        message={toastMessage} 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />
    </>
  );
}