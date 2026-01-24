"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function p2PTransfer(to: string, amount: number) {
    const session = await getServerSession(authOptions);
    const from = session?.user?.id;
    if (!from) {
        return {
            message: "Error while sending"
        }
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
    await prisma.$transaction(async (tx) => {
        //Locking this transaction for particular user to prevent concurrent transaction:
        await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`; 
        const fromBalance = await tx.balance.findUnique({
            where: { userId: Number(from) },
          });
          if (!fromBalance || fromBalance.amount < amount) {
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
}
