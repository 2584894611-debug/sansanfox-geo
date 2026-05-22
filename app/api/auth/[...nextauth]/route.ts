import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyUser } from "@/lib/stores/user-store";

process.env.NEXTAUTH_URL ||= "http://localhost:3000";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "sansanfox-local-development-secret",
  session: {
    strategy: "jwt"
  },
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        return verifyUser(credentials.email, credentials.password);
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.plan = (user as { plan?: string }).plan || "FREE";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || "";
        session.user.plan = (token.plan as string) || "FREE";
      }
      return session;
    }
  },
  pages: {
    signIn: "/login"
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
