"use client";

import { useState } from "react";
import { updateProfile } from "@/app/admin/actions";
import ToastNotification from "./ToastNotification";

export default function ProfileForm({ profile }: { profile: any }) {
  const [isPending, setIsPending] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    const formData = new FormData(event.currentTarget);
    await updateProfile(formData);
    setIsPending(false);
    
    // Panggil Toast menggantikan alert()
    setToastMessage("IDENTITY MATRIX UPDATED.");
    setShowToast(true);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full">
      
      {/* Baris 1: Nama & Peran */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs tracking-widest uppercase text-beige-200/50">Display Name</label>
          <input type="text" name="name" defaultValue={profile?.name || "Romadhon Santoso"} required className="bg-navy-800/50 border border-beige-200/20 rounded-sm px-4 py-3 text-beige-100 focus:outline-none focus:border-beige-100 transition-colors" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs tracking-widest uppercase text-beige-200/50">Primary Role / Tech Skills</label>
          <input type="text" name="role" defaultValue={profile?.role || "Web Programming & UI/UX Design"} required className="bg-navy-800/50 border border-beige-200/20 rounded-sm px-4 py-3 text-beige-100 focus:outline-none focus:border-beige-100 transition-colors" />
        </div>
      </div>

      {/* Baris 2: About Me */}
      <div className="flex flex-col gap-2">
        <label className="text-xs tracking-widest uppercase text-beige-200/50">About Me Summary</label>
        <textarea name="about" defaultValue={profile?.about || ""} rows={5} placeholder="I am a developer specializing in..." className="bg-navy-800/50 border border-beige-200/20 rounded-sm px-4 py-3 text-beige-100 focus:outline-none focus:border-beige-100 transition-colors resize-none"></textarea>
      </div>

      {/* Baris 3: Area Upload File */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border border-beige-200/10 p-6 bg-navy-800/20 rounded-sm">
        
        {/* Upload Avatar */}
        <div className="flex flex-col gap-4">
          <label className="text-xs tracking-widest uppercase text-beige-200/50">Profile Picture (JPG/PNG)</label>
          {profile?.avatarUrl && (
             <div className="text-[10px] text-green-400/80 tracking-widest uppercase mb-1">✓ Current File Active</div>
          )}
          <input type="file" name="avatarFile" accept="image/png, image/jpeg, image/webp" className="text-xs text-beige-100 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-medium file:bg-beige-100 file:text-navy-900 hover:file:bg-white transition-colors cursor-pointer" />
        </div>

        {/* Upload Resume PDF */}
        <div className="flex flex-col gap-4">
          <label className="text-xs tracking-widest uppercase text-beige-200/50">Resume/CV (PDF)</label>
          {profile?.resumeUrl && (
             <div className="text-[10px] text-green-400/80 tracking-widest uppercase mb-1">✓ Current CV Active</div>
          )}
          <input type="file" name="resumeFile" accept="application/pdf" className="text-xs text-beige-100 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-medium file:bg-beige-100 file:text-navy-900 hover:file:bg-white transition-colors cursor-pointer" />
        </div>

      </div>

      <button type="submit" disabled={isPending} className="self-end px-8 py-4 bg-beige-100 text-navy-900 font-medium text-xs tracking-widest uppercase rounded-sm hover:bg-white transition-colors disabled:opacity-50 shadow-lg shadow-beige-100/10">
        {isPending ? "Syncing Data..." : "Save Identity"}
      </button>

      {/* SPEAKER TOAST PROFILE */}
      <ToastNotification 
        message={toastMessage} 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />
    </form>
  );
}