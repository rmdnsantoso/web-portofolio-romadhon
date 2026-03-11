import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    // Jika belum login, lemparkan ke halaman bawaan NextAuth
    signIn: "/api/auth/signin",
  },
});

// Menentukan rute mana saja yang mau digembok
export const config = {
  // Tanda /:path* artinya /admin dan SEMUA sub-halamannya akan dikunci
  matcher: ["/admin/:path*"], 
};