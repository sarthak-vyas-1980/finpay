import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "@repo/db/client";

export const authOptions = {
  providers: [
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
        if (credentials.password.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }
        if (credentials.phone.length !== 10) {
          throw new Error("Phone number must be 10 digits");
        }

        const user = await prisma.user.findFirst({
          where: { number: credentials.phone },
        });

        // ---------- SIGN IN ----------
        if (credentials.mode === "signin") {
          if (!user) {
            throw new Error("User not found");
          }

          // 🔥 FIX: handle Google-only users properly
          if (!user.password) {
            throw new Error("This account was created using Google. Please sign in with Google.");
          }

          const valid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!valid) {
            throw new Error("Invalid phone or password");
          }

          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email ?? undefined,
          };
        }
        // ---------- SIGN UP ----------
        if (credentials.mode === "signup") {
          if (!credentials.name) return null;
          if (user) {
            throw new Error("User already exists");
          }

          const hashedPassword = await bcrypt.hash(
            credentials.password,
            10
          );

          const newUser = await prisma.user.create({
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
    //GOOGLE OAUTH (signin OR signup)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  
  callbacks: {
    async signIn({ user, account }: any) {
      // Only for Google OAuth
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findFirst({
          where: { email: user.email ?? "" },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              name: user.name ?? "Google User",
              email: user.email,
              avatar: user.image
            },
          });
        }
      }
      return true;
    },

    async jwt({ token, user, account }: any) {
      // On first login (credentials OR google)
      if (user) {
        // If credentials login, user.id already = DB id
        if (account?.provider === "credentials") {
          token.dbId = user.id.toString();
        }

        // If Google login, find DB user by email
        if (account?.provider === "google") {
          const dbUser = await prisma.user.findFirst({
            where: { email: user.email! },
          });

          if (dbUser) {
            token.dbId = dbUser.id.toString();
          }
        }
      }
      //ALWAYS fetch avatar from DB
      if (token.dbId && !token.avatar) {
        const dbUser = await prisma.user.findUnique({
          where: { id: Number(token.dbId) },
          select: { avatar: true }
        })
        token.avatar = dbUser?.avatar
      }
      return token;
    },

    async session({ session, token }: any) {
      if (session.user && token.dbId) {
        session.user.id = token.dbId;
        session.user.avatar = token.avatar;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
