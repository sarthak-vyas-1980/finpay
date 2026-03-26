import prisma from "@repo/db";

export async function getProfileCompletion(userId: number) {
    const user = await prisma.user.findUnique({
        where:{ id:userId }
    });

    if(!user) return 0;
    let score = 0;

    if(user.name) score += 25;
    if(user.email) score += 25;
    if(user.number) score += 25;
    if(user.password) score += 25;
    return score;
}