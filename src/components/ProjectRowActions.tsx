"use client";

import { useState } from "react";
import { deleteProject, updateProject } from "@/app/admin/actions";
import ToastNotification from "./ToastNotification";

type ProjectData = {
  id: string; title: string; category: string; description: string; techStack: string; imageUrl: string | null;
};

export default function ProjectRowActions({ project }: { project: ProjectData }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Eksekusi Hapus dengan Konfirmasi
  async function handleDelete() {
    if (confirm(`Warning: Are you sure you want to delete "${project.title}"?`)) {
      await deleteProject(project.id);
    }
  }

  // Eksekusi Simpan Edit
  async function handleEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    const formData = new FormData(event.currentTarget);
    await updateProject(project.id, formData);
    setIsPending(false);
    setIsEditOpen(false); // Tutup laci
    
    // Munculkan Toast setelah laci tertutup
    setToastMessage("PROJECT UPDATED SUCCESSFULLY.");
    setShowToast(true);
  }

  return (
    <>
      <button onClick={() => setIsEditOpen(true)} className="hover:text-beige-100 tracking-widest uppercase text-[10px] mr-6 transition-colors">Edit</button>
      <button onClick={handleDelete} className="hover:text-red-400 tracking-widest uppercase text-[10px] text-red-400/50 transition-colors">Delete</button>

      {/* --- PANEL EDIT (Muncul saat tombol Edit diklik) --- */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setIsEditOpen(false)} />
      )}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-navy-900 border-l border-beige-200/10 shadow-2xl z-50 transform transition-transform duration-500 overflow-y-auto text-left ${isEditOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-8">
          <div className="flex justify-between items-center mb-12 border-b border-beige-200/10 pb-6">
            <h2 className="text-2xl font-serif text-beige-100">Edit Project</h2>
            <button onClick={() => setIsEditOpen(false)} className="text-beige-200/50 hover:text-beige-100 text-sm uppercase tracking-widest">[ Close ]</button>
          </div>

          <form onSubmit={handleEdit} className="flex flex-col gap-6 text-sm font-light">
            <div className="flex flex-col gap-2">
              <label className="text-xs tracking-widest uppercase text-beige-200/50">Project Title</label>
              <input type="text" name="title" defaultValue={project.title} required className="bg-navy-800/50 border border-beige-200/20 rounded-sm px-4 py-3 text-beige-100 focus:outline-none focus:border-beige-100 transition-colors" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs tracking-widest uppercase text-beige-200/50">Category</label>
              <input type="text" name="category" defaultValue={project.category} required className="bg-navy-800/50 border border-beige-200/20 rounded-sm px-4 py-3 text-beige-100 focus:outline-none focus:border-beige-100 transition-colors" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs tracking-widest uppercase text-beige-200/50">Tech Stack</label>
              <input type="text" name="techStack" defaultValue={project.techStack} required className="bg-navy-800/50 border border-beige-200/20 rounded-sm px-4 py-3 text-beige-100 focus:outline-none focus:border-beige-100 transition-colors" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs tracking-widest uppercase text-beige-200/50">Description</label>
              <textarea name="description" defaultValue={project.description} required rows={4} className="bg-navy-800/50 border border-beige-200/20 rounded-sm px-4 py-3 text-beige-100 focus:outline-none focus:border-beige-100 transition-colors resize-none"></textarea>
            </div>
            
            <div className="flex flex-col gap-4 p-4 border border-beige-200/20 bg-navy-800/30 rounded-sm">
              <label className="text-xs tracking-widest uppercase text-beige-200/50">Project Image (Cover)</label>
              
              <div className="flex flex-col gap-2">
                <span className="text-[10px] text-beige-200/40">Upload New File (JPG/PNG)</span>
                <input 
                  type="file" 
                  name="imageFile" 
                  accept="image/png, image/jpeg, image/webp"
                  className="text-xs text-beige-100 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-medium file:bg-beige-100 file:text-navy-900 hover:file:bg-white transition-colors cursor-pointer" 
                />
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <span className="text-[10px] text-beige-200/40">Or Keep/Change Image URL</span>
                <input 
                  type="text" 
                  name="imageUrl" 
                  defaultValue={project.imageUrl || ""}
                  placeholder="https://..." 
                  className="bg-navy-800/50 border border-beige-200/20 rounded-sm px-4 py-3 text-beige-100 focus:outline-none focus:border-beige-100 transition-colors" 
                />
              </div>
            </div>

            <button type="submit" disabled={isPending} className="mt-6 w-full py-4 bg-beige-100 text-navy-900 font-medium text-xs tracking-widest uppercase rounded-sm hover:bg-white transition-colors disabled:opacity-50">
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>

      {/* SPEAKER TOAST PROJECT EDIT */}
      <ToastNotification 
        message={toastMessage} 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />
    </>
  );
}