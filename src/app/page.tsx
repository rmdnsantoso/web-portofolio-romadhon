import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/HeroSection";
import ProjectSection from "@/components/ProjectSection";
import AboutSection from "@/components/AboutSection";
import TechStackSection from "@/components/TechStackSection";
import TerminalContact from "@/components/TerminalContact";
import Footer from "@/components/Footer";
import SecretEasterEgg from "@/components/SecretEasterEgg";
import MaintenanceScreen from "@/components/MaintenanceScreen";
import ScrollReveal from "@/components/ScrollReveal";
import Navbar from "@/components/Navbar"; // Pastikan Navbar di-import di sini

export default async function Home() {
  // Ambil status profil dan maintenance dari database
  const profile = await prisma.profile.findUnique({
    where: { id: "woozie-admin" }
  });

  // JIKA MAINTENANCE AKTIF: Tampilkan layar maintenance saja tanpa Navbar
  if (profile?.isMaintenance) {
    return <MaintenanceScreen />;
  }

  return (
    <div className="bg-[#080c16] min-h-screen relative">
      
      {/* Animasi Fade-In Halus Website */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pageFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-page-fade {
          animation: pageFadeIn 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}} />

      {/* Komponen Easter Egg (z-index tertinggi) */}
      <SecretEasterEgg />

      <main className="animate-page-fade bg-navy-900 text-beige-100 flex flex-col items-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-10 rounded-b-xl border-b border-beige-200/5">
        
        {/* NAVBAR diletakkan di sini agar sinkron dengan konten utama */}
        <Navbar />

        {/* Hero Section langsung terlihat tanpa delay scroll */}
        <HeroSection />
        
        {/* Seksi-seksi di bawah ini akan muncul perlahan saat di-scroll */}
        <ScrollReveal>
          <ProjectSection />
        </ScrollReveal>
        
        <ScrollReveal>
          <div className="w-full relative z-10 bg-navy-900">
            <AboutSection />
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <TechStackSection />
        </ScrollReveal>
        
        <ScrollReveal>
          <TerminalContact />
        </ScrollReveal>

      </main>

      {/* Footer juga menggunakan efek Scroll Reveal */}
      <ScrollReveal>
        <Footer />
      </ScrollReveal>

    </div>
  );
}