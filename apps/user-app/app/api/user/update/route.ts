import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import prisma from "@repo/db/client";
import bcrypt from "bcrypt";
import { z } from "zod";

const updateSchema = z.object({
    name: z.string().min(2),
    email: z.string().email().optional(),
    number: z.string().regex(/^[0-9]{10}$/).optional(),
    password: z.string().min(6).optional(),
});

type updateType = {
    name: string,
    email: string,
    number: string,
    password?: string,
    avatar?: string
}

export const GET = async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
        where: {
            id : Number(session.user.id)
        },
        select: {
            id: true,
            name: true,
            email: true,
            number: true,
            password: true,
            avatar: true,
        },
    })
    return NextResponse.json({
        id: user?.id,
        name: user?.name,
        email: user?.email,
        number: user?.number,
        avatar: user?.avatar,
        hasPassword: !!user?.password,
    });
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
        where: {
            id : Number(session.user.id)
        },
    })
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: parsed.error.issues[0]?.message },
            { status: 400 }
        );
    }
    const updateData: updateType = {
        name: body.name,
        email: body.email,
        number: body.number,
    };
    if (body.password && user?.password) {
        const isSame = await bcrypt.compare(body.password, user.password);
        if (isSame) {
            return NextResponse.json({
                error: "New password must be different" }, { status: 400 }
            )
        }
        updateData.password = await bcrypt.hash(body.password, 10);
    }
    if (body.email) {
        const existingEmail = await prisma.user.findFirst({
            where: {
                email: body.email,
                NOT: { id: Number(session.user.id) }
            }
        });
        if (existingEmail) {
            return NextResponse.json(
                { error: "Email already in use" }, { status: 400 }
            );
        }
    }
    if (body.number) {
        const existingNumber = await prisma.user.findUnique({
            where: {
                number: body.number,
            }
        });
        if (existingNumber && existingNumber.id != body.id) {
            return NextResponse.json(
                { error: "Number already in use" }, { status: 400 }
            );
        }
    }

    const updatedUser = await prisma.user.update({
        where: { id: Number(session.user.id) },
        data: updateData,
    });

    return NextResponse.json(updatedUser);
}