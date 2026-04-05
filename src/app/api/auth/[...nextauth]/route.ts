import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      
      // 👇 INI MANTRA RAHASIANYA 👇
      // Memaksa Google untuk selalu memunculkan pop-up "Pilih Akun"
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
      
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user.email === "muhammad.romadhonsan@gmail.com") {
        return true; 
      }
      return false; 
    },
  },
  pages: {
    signIn: '/login', 
    error: '/error', 
  }
});

export { handler as GET, handler as POST };