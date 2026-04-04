import { prisma } from "@/lib/prisma";
import AchievementClient from "./AchievementClient";

export default async function AchievementSection() {
  // 1. Ambil data dari database 
  const achievements = await prisma.achievement.findMany({
    orderBy: { year: 'desc' } 
  });

  // 2. Jika array data kosong, jangan render apa-apa
  if (achievements.length === 0) {
    return null; 
  }

  // 3. Jika ada data, lemparkan ke Client Component untuk di-render
  return <AchievementClient achievements={achievements} />;
}