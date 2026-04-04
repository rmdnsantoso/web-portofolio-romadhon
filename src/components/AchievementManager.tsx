"use client";

import { useState } from "react";
import { createAchievement, deleteAchievement } from "@/app/admin/actions";
import ToastNotification from "./ToastNotification";

type AchievementData = {
  id: string; title: string; issuer: string; year: string; description: string | null; imageUrl: string | null;
};

export default function AchievementManager({ achievements }: { achievements: AchievementData[] }) {
  const [isPending, setIsPending] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // State untuk Modal Delete
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handler Tambah Achievement
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    const form = event.currentTarget; 
    const formData = new FormData(form);

    try {
      // Cek apakah ada file gambar/sertifikat yang diupload
      const imageFile = formData.get('imageFile') as File;
      if (imageFile && imageFile.size > 0) {
        const uploadData = new FormData();
        uploadData.append('file', imageFile);

        const res = await fetch('/api/upload', { method: 'POST', body: uploadData });
        const data = await res.json();

        if (data.url) formData.set('imageUrl', data.url);
        else throw new Error("Failed to upload image.");
      }

      await createAchievement(formData);
      form.reset(); 
      setToastMessage("NEW ACHIEVEMENT UNLOCKED.");
      setShowToast(true);
    } catch (error: any) {
      setToastMessage("ERROR: " + (error.message || "DEPLOY FAILED."));
      setShowToast(true);
    } finally {
      setIsPending(false);
    }
  }

  // Handler Hapus
  async function confirmDelete() {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await deleteAchievement(deletingId);
      setToastMessage("SYSTEM ALERT: RECORD PURGED."); 
      setShowToast(true);
    } catch (error) {
      setToastMessage("ERROR: FAILED TO REMOVE RECORD.");
      setShowToast(true);
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  }

  return (
    <div className="flex flex-col xl:flex-row gap-12 items-start relative">
      {/* KIRI: Form Tambah Achievement */}
      <div className="w-full xl:w-1/3 bg-navy-800/20 border border-beige-200/10 p-6 md:p-8 rounded-sm shrink-0">
        <h3 className="text-lg font-serif mb-6 border-b border-beige-200/10 pb-4 tracking-wider">Add New Achievement</h3>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-sm font-light">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] tracking-widest uppercase text-beige-200/50">Title / Award Name</label>
            <input type="text" name="title" required placeholder="e.g. CISA Certification" className="bg-navy-800/50 border border-beige-200/20 rounded-sm px-4 py-3 text-beige-100 focus:outline-none focus:border-beige-100 transition-colors" />
          </div>
          
          <div className="flex gap-4">
            <div className="flex flex-col gap-2 w-2/3">
              <label className="text-[10px] tracking-widest uppercase text-beige-200/50">Issuer / Organization</label>
              <input type="text" name="issuer" required placeholder="e.g. ISACA" className="bg-navy-800/50 border border-beige-200/20 rounded-sm px-4 py-3 text-beige-100 focus:outline-none focus:border-beige-100 transition-colors" />
            </div>
            <div className="flex flex-col gap-2 w-1/3">
              <label className="text-[10px] tracking-widest uppercase text-beige-200/50">Year</label>
              <input type="text" name="year" required placeholder="2026" className="bg-navy-800/50 border border-beige-200/20 rounded-sm px-4 py-3 text-beige-100 focus:outline-none focus:border-beige-100 transition-colors" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] tracking-widest uppercase text-beige-200/50">Description (Optional)</label>
            <textarea name="description" rows={2} placeholder="Brief details..." className="bg-navy-800/50 border border-beige-200/20 rounded-sm px-4 py-3 text-beige-100 focus:outline-none focus:border-beige-100 transition-colors resize-none"></textarea>
          </div>

          <div className="flex flex-col gap-2 p-4 border border-beige-200/20 bg-navy-800/30 rounded-sm">
            <label className="text-[10px] tracking-widest uppercase text-beige-200/50">Certificate/Medal Image (Optional)</label>
            <input type="file" name="imageFile" accept="image/*" className="text-xs text-beige-100 file:mr-4 file:py-1.5 file:px-3 file:rounded-sm file:border-0 file:text-[10px] file:uppercase file:tracking-widest file:font-medium file:bg-beige-100 file:text-navy-900 hover:file:bg-white transition-colors cursor-pointer" />
            <input type="url" name="imageUrl" placeholder="Or paste image URL" className="mt-2 bg-navy-800/50 border border-beige-200/20 rounded-sm px-4 py-2 text-beige-100 focus:outline-none focus:border-beige-100 transition-colors text-xs" />
          </div>

          <button type="submit" disabled={isPending} className="mt-2 w-full py-4 bg-beige-100 text-navy-900 font-medium text-xs tracking-widest uppercase rounded-sm hover:bg-white transition-colors disabled:opacity-50">
            {isPending ? "Saving Record..." : "Log Achievement"}
          </button>
        </form>
      </div>

      {/* KANAN: Daftar Achievement */}
      <div className="w-full xl:w-2/3">
        <h3 className="text-lg font-serif mb-6 border-b border-beige-200/10 pb-4 tracking-wider">Honors Database</h3>
        
        {achievements.length === 0 ? (
          <p className="text-beige-200/40 italic text-sm">No records found. The achievement section will remain hidden on the public site.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((ach) => (
              <div key={ach.id} className="p-5 border border-beige-200/10 bg-navy-800/40 rounded-sm flex flex-col justify-between group hover:border-beige-200/30 transition-colors">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] tracking-widest uppercase text-beige-200/50">{ach.year}</span>
                    <button onClick={() => setDeletingId(ach.id)} className="text-red-400/30 hover:text-red-400 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                  <h4 className="text-lg font-serif text-beige-100 leading-snug">{ach.title}</h4>
                  <p className="text-xs text-beige-200/60 uppercase tracking-wider mt-1 mb-3">{ach.issuer}</p>
                  {ach.description && <p className="text-sm text-beige-200/40 line-clamp-2">{ach.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CUSTOM MODAL DELETE */}
      {deletingId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-[#0A101D] border border-beige-200/10 p-8 rounded-sm max-w-sm w-full text-center shadow-2xl">
            <h3 className="text-beige-100 text-lg font-serif mb-2 tracking-widest uppercase">Purge Record?</h3>
            <p className="text-beige-200/50 text-[11px] mb-8 leading-relaxed font-light tracking-wide">This action is irreversible. The achievement will be removed.</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setDeletingId(null)} className="px-6 py-2.5 text-[10px] tracking-widest uppercase text-beige-200/60 border border-beige-200/20 rounded-sm hover:text-beige-100 transition">Cancel</button>
              <button onClick={confirmDelete} className="px-6 py-2.5 text-[10px] tracking-widest uppercase text-red-400 bg-red-900/20 border border-red-500/30 rounded-sm hover:bg-red-500/20 transition">{isDeleting ? "Processing..." : "Confirm"}</button>
            </div>
          </div>
        </div>
      )}

      <ToastNotification message={toastMessage} isVisible={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
}