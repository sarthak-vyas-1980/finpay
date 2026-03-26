"use server";

import prisma from "@repo/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { revalidatePath } from "next/cache";

export async function lockBalance(amount: number) {
    const session = await getServerSession(authOptions);
    if(!session?.user?.id) return;

    const userId = Number(session.user.id);
    const balance = await prisma.balance.findFirst({
        where:{ userId }
    });

    if(!balance) return;
    if(balance.amount - balance.locked < amount){
        throw new Error("Not enough unlocked balance");
    }
    
    await prisma.balance.update({
        where:{ id: balance.id },
        data:{
            locked:{
                increment: amount
            }
        }
    });
    revalidatePath("/dashboard");
}

export async function unlockBalance(amount: number){
    const session = await getServerSession(authOptions);
    if(!session?.user?.id) return;

    const userId = Number(session.user.id);
    const balance = await prisma.balance.findFirst({
        where:{ userId }
    });

    if(!balance) return;
    if(balance.locked < amount){
        throw new Error("Not enough locked balance");
    }

    await prisma.balance.update({
        where:{ id: balance.id },
        data:{
            locked:{
                decrement: amount
            }
        }
    });
    revalidatePath("/dashboard");
}