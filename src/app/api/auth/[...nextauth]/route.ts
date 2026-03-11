import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
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
  // 👇 PASTIKAN BLOK INI ADA! 👇
  pages: {
    signIn: '/login', // Ini yang memaksa NextAuth memakai UI buatan kita!
  }
});

export { handler as GET, handler as POST };