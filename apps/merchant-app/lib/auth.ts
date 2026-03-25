import GoogleProvider from "next-auth/providers/google";
import db from "@repo/db/client";
import { AuthType } from "@prisma/client";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
    })
  ],

  callbacks: {
    async signIn({ user, account }: any) {

      if (!user?.email) {
        throw new Error("Google account missing email");
      }

      const providerType =
        account?.provider === "google"
          ? AuthType.Google
          : AuthType.Github;

      await db.merchant.upsert({
        where: { email: user.email },
        create: {
          email: user.email,
          name: user.name,
          auth_type: providerType
        },
        update: {
          name: user.name,
          auth_type: providerType
        }
      });

      return true;
    }
  },

  secret: process.env.NEXTAUTH_SECRET || "secret"
};