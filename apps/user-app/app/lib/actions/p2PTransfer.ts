"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db";
import { z } from "zod";
import bcrypt from "bcrypt";

const transferSchema = z.object({
    to: z.string().min(10, "Invalid phone number").max(10, "Invalid phone number").regex(/^[0-9]+$/, "Phone must contain only digits"),
    amount: z.number().positive("Amount must be positive").max(100000000, "Transfer amount too large"),
    upiPin: z.string().regex(/^\d{4}$/, "UPI PIN must be 4 digits"),
});

export async function p2PTransfer(to: string, amount: number, upiPin: string) {
    const parsed = transferSchema.safeParse({
        to,
        amount,
        upiPin,
    });
    if(!parsed.success){
        return {
            message: parsed.error.issues[0]?.message
        };
    }
    const session = await getServerSession(authOptions);
    const from = session?.user?.id;
    if (!from) {
        return {
            message: "Error while sending"
        }
    }

    const fromUser = await prisma.user.findUnique({
        where: { id: Number(from) },
        select: { upiPinHash: true },
    });

    if (!fromUser?.upiPinHash) {
        return { message: "Please set your UPI PIN before making transfers" };
    }

    const pinOk = await bcrypt.compare(parsed.data.upiPin, fromUser.upiPinHash);
    if (!pinOk) {
        return { message: "Incorrect UPI PIN" };
    }
    const toUser = await prisma.user.findFirst({
        where: {
            number: to
        }
    });
    if (!toUser) {
        return {
            message: "User not found"
        }
    }
    if(Number(from) === toUser.id) return { message: "Cannot transfer to yourself" }

    await prisma.$transaction(async (tx) => {
        //Locking this transaction for particular user to prevent concurrent transaction:
        await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`; 
        const fromBalance = await tx.balance.findUnique({
            where: { userId: Number(from) },
        });
        if (!fromBalance || fromBalance.amount - fromBalance.locked < amount) {
            throw new Error('Insufficient funds');
        }

        await tx.balance.upsert({
            where: { userId: Number(from) },
                update: {
                amount: { decrement: amount },
            },
            create: {
                userId: Number(from),
                amount: -amount,
                locked: 0,
            },
        });


        await tx.balance.upsert({
            where: { userId: toUser.id },
            update: {
                amount: { increment: amount },
            },
            create: {
                userId: toUser.id,
                amount,
                locked: 0,
            },
        });


        await tx.p2PTransfer.create({
            data : {
                fromUserId: Number(from), 
                toUserId: toUser.id,
                amount,
                timestamp: new Date(),
            }
        })
    });
    return { message: "Transfer successful" };
}
