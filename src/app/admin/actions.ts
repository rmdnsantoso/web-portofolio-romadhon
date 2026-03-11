"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile } from "fs/promises";
import path from "path";

// --- MESIN PENGOLAH FILE ---
// Fungsi ini menerima file fisik, menyimpannya ke folder public/uploads, 
// dan mengembalikan alamat file-nya agar bisa disimpan ke database.
async function saveFileLocally(file: File | null) {
  if (!file || file.size === 0) return null;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Bersihkan nama file dari spasi agar aman di URL
  const safeName = file.name.replace(/\s+/g, '-');
  const fileName = `${Date.now()}-${safeName}`;
  const filePath = path.join(process.cwd(), "public/uploads", fileName);

  await writeFile(filePath, buffer);
  return `/uploads/${fileName}`;
}

// --- FUNGSI CRUD PROJECT (Sudah di-upgrade untuk menerima File atau URL) ---
export async function createProject(formData: FormData) {
  // Ambil input file DAN input text URL
  const imageFile = formData.get("imageFile") as File | null;
  const imageUrlInput = formData.get("imageUrl") as string;

  // Logika Pemilihan: Prioritaskan File fisik. Jika kosong, pakai URL text.
  let finalImageUrl = imageUrlInput || null;
  if (imageFile && imageFile.size > 0) {
    finalImageUrl = await saveFileLocally(imageFile);
  }

  await prisma.project.create({
    data: {
      title: formData.get("title") as string,
      category: formData.get("category") as string,
      description: formData.get("description") as string,
      techStack: formData.get("techStack") as string,
      imageUrl: finalImageUrl, // Sekarang bisa menampung "/uploads/..." atau "https://..."
      liveUrl: (formData.get("liveUrl") as string) || null,
      githubUrl: (formData.get("githubUrl") as string) || null,
      status: "Published",
    },
  });
  revalidatePath("/admin");
}

export async function updateProject(id: string, formData: FormData) {
  const imageFile = formData.get("imageFile") as File | null;
  const imageUrlInput = formData.get("imageUrl") as string;

  // Siapkan data yang pasti di-update
  const dataToUpdate: any = {
    title: formData.get("title") as string,
    category: formData.get("category") as string,
    description: formData.get("description") as string,
    techStack: formData.get("techStack") as string,
  };

  // Jika user mengunggah file BARU, proses file-nya
  if (imageFile && imageFile.size > 0) {
    dataToUpdate.imageUrl = await saveFileLocally(imageFile);
  } 
  // Jika tidak ada file baru tapi ada ketikan URL, pakai URL-nya
  else if (imageUrlInput) {
    dataToUpdate.imageUrl = imageUrlInput;
  }

  await prisma.project.update({
    where: { id },
    data: dataToUpdate,
  });
  revalidatePath("/admin");
}

export async function deleteProject(id: string) {
  await prisma.project.delete({ where: { id } });
  revalidatePath("/admin");
}

// --- FUNGSI UPDATE PROFIL & RESUME ---
export async function updateProfile(formData: FormData) {
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const about = formData.get("about") as string;
  
  const avatarFile = formData.get("avatarFile") as File | null;
  const resumeFile = formData.get("resumeFile") as File | null;

  const dataToUpdate: any = { name, role, about };

  // Jika ada file foto yang diunggah
  if (avatarFile && avatarFile.size > 0) {
    dataToUpdate.avatarUrl = await saveFileLocally(avatarFile);
  }
  
  // Jika ada file PDF CV yang diunggah
  if (resumeFile && resumeFile.size > 0) {
    dataToUpdate.resumeUrl = await saveFileLocally(resumeFile);
  }

  // Upsert: Update jika data sudah ada, Create jika database masih kosong
  await prisma.profile.upsert({
    where: { id: "woozie-admin" },
    update: dataToUpdate,
    create: {
      id: "woozie-admin",
      ...dataToUpdate
    }
  });

  revalidatePath("/admin");
}

// --- FUNGSI MANAJEMEN BANNER ---
export async function createBanner(formData: FormData) {
  const title = formData.get("title") as string;
  const imageFile = formData.get("imageFile") as File | null;
  const imageUrlInput = formData.get("imageUrl") as string;

  // Logika Pemilihan: Prioritaskan File fisik. Jika kosong, pakai URL text.
  let finalImageUrl = imageUrlInput || "";
  if (imageFile && imageFile.size > 0) {
    const uploadedPath = await saveFileLocally(imageFile);
    if (uploadedPath) finalImageUrl = uploadedPath;
  }

  await prisma.banner.create({
    data: {
      title,
      imageUrl: finalImageUrl,
      isActive: true, // Default langsung aktif
    }
  });
  revalidatePath("/admin");
}

export async function deleteBanner(id: string) {
  await prisma.banner.delete({ where: { id } });
  revalidatePath("/admin");
}

export async function toggleBannerStatus(id: string, currentStatus: boolean) {
  await prisma.banner.update({
    where: { id },
    data: { isActive: !currentStatus }
  });
  revalidatePath("/admin");
}

// --- FUNGSI TOGGLE MAINTENANCE ---
export async function toggleMaintenance(currentStatus: boolean) {
  await prisma.profile.update({
    where: { id: "woozie-admin" },
    data: { isMaintenance: !currentStatus }
  });
  revalidatePath("/");
  revalidatePath("/admin");
}