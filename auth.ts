import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"
import Credentials from "next-auth/providers/credentials"
// You can add more providers here (like Google, GitHub, etc.)

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        let user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })

        // Here we auto-create the user if they don't exist to allow any login for demo
        if (!user) {
          user = await prisma.user.create({
            data: {
              email: credentials.email as string,
              name: "Demo User",
            }
          })
        }

        if (user) {
          return user
        }

        return null
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    }
  },
  pages: {
    signIn: "/login",
  }
})
