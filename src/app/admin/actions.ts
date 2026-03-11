"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- FUNGSI CRUD PROJECT ---
export async function createProject(formData: FormData) {
  // Sekarang kita hanya mengambil imageUrl yang sudah diisi oleh Frontend (Supabase URL)
  const imageUrl = formData.get("imageUrl") as string;

  await prisma.project.create({
    data: {
      title: formData.get("title") as string,
      category: formData.get("category") as string,
      description: formData.get("description") as string,
      techStack: formData.get("techStack") as string,
      imageUrl: imageUrl || null, 
      status: "Published",
    },
  });
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function updateProject(id: string, formData: FormData) {
  const imageUrl = formData.get("imageUrl") as string;

  const dataToUpdate: any = {
    title: formData.get("title") as string,
    category: formData.get("category") as string,
    description: formData.get("description") as string,
    techStack: formData.get("techStack") as string,
  };

  if (imageUrl) {
    dataToUpdate.imageUrl = imageUrl;
  }

  await prisma.project.update({
    where: { id },
    data: dataToUpdate,
  });
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deleteProject(id: string) {
  await prisma.project.delete({ where: { id } });
  revalidatePath("/admin");
  revalidatePath("/");
}

// --- FUNGSI UPDATE PROFIL & RESUME ---
export async function updateProfile(formData: FormData) {
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const about = formData.get("about") as string;
  
  // Mengambil URL yang sudah di-upload ke Supabase oleh ProfileForm.tsx
  const avatarUrl = formData.get("avatarUrl") as string;
  const resumeUrl = formData.get("resumeUrl") as string;

  const dataToUpdate: any = { name, role, about };

  if (avatarUrl) dataToUpdate.avatarUrl = avatarUrl;
  if (resumeUrl) dataToUpdate.resumeUrl = resumeUrl;

  await prisma.profile.upsert({
    where: { id: "woozie-admin" },
    update: dataToUpdate,
    create: {
      id: "woozie-admin",
      ...dataToUpdate
    }
  });

  revalidatePath("/admin");
  revalidatePath("/");
}

// --- FUNGSI MANAJEMEN BANNER ---
export async function createBanner(formData: FormData) {
  const title = formData.get("title") as string;
  const imageUrl = formData.get("imageUrl") as string;

  await prisma.banner.create({
    data: {
      title,
      imageUrl: imageUrl || "",
      isActive: true,
    }
  });
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deleteBanner(id: string) {
  await prisma.banner.delete({ where: { id } });
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function toggleBannerStatus(id: string, currentStatus: boolean) {
  await prisma.banner.update({
    where: { id },
    data: { isActive: !currentStatus }
  });
  revalidatePath("/admin");
  revalidatePath("/");
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