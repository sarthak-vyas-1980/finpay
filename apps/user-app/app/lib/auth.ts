import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@repo/db/client";
import bcrypt from "bcrypt";
import prisma from "@repo/db/client";

export const authOptions = {
  providers: [
    //GOOGLE OAUTH (signin OR signup)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "text" },
        phone: { label: "Phone", type: "text", required: true },
        password: { label: "Password", type: "password", required: true },
        mode: { label: "Mode", type: "text" }, // signup | signin
      },

      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.password) return null;

        const user = await db.user.findFirst({
          where: { number: credentials.phone },
        });

        // ---------- SIGN IN ----------
        if (credentials.mode === "signin") {
          if (!user) return null;

          if (!user.password) {
            return null;
          }

          const valid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!valid) return null;

          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email ?? undefined,
          };
        }
        // ---------- SIGN UP ----------
        if (credentials.mode === "signup") {
          if (!credentials.name) return null;
          if (user) return null;

          const hashedPassword = await bcrypt.hash(
            credentials.password,
            10
          );

          const newUser = await db.user.create({
            data: {
              name: credentials.name,
              number: credentials.phone,
              password: hashedPassword,
            },
          });

          return {
            id: newUser.id.toString(),
            name: newUser.name,
            email: newUser.number,
          };
        }

        return null;
      },
    }),
  ],

  callbacks: {
    async session({ session, token }:any) {
      if (session.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
        });

        if (dbUser) {
          session.user.id = dbUser.id.toString(); // ✅ DB ID
        }
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
