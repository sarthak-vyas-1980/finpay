import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                phone: {
                    label: "Phone number",
                    type: "text",
                    placeholder: "1231231231",
                    required: true
                },
                password: {
                    label: "Password",
                    type: "password",
                    required: true
                }
            },

            async authorize(credentials: any) {

                if (!credentials?.phone || !credentials?.password) {
                    throw new Error("Phone and password required");
                }

                const existingUser = await db.user.findUnique({
                    where: {
                        number: credentials.phone
                    }
                });

                // ---------- SIGN IN ----------
                if (existingUser) {

                    if (!existingUser.password) {
                        throw new Error("Account created via Google. Use Google login.");
                    }

                    const passwordValidation = await bcrypt.compare(
                        credentials.password,
                        existingUser.password
                    );

                    if (!passwordValidation) {
                        throw new Error("Invalid credentials");
                    }

                    return {
                        id: existingUser.id.toString(),
                        name: existingUser.name,
                        email: existingUser.number
                    };
                }

                // ---------- SIGN UP ----------
                const hashedPassword = await bcrypt.hash(
                    credentials.password,
                    10
                );

                const user = await db.user.create({
                    data: {
                        name: "User",
                        number: credentials.phone,
                        password: hashedPassword
                    }
                });

                return {
                    id: user.id.toString(),
                    name: user.name,
                    email: user.number
                };
            }
        })
    ],

    secret: process.env.JWT_SECRET || "secret",

    callbacks: {
        async session({ token, session }: any) {

            if (session.user) {
                session.user.id = token.sub;
            }

            return session;
        }
    }
};