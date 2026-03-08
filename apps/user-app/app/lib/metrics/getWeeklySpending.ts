import prisma from "@repo/db/client";

export async function getWeeklySpending(userId: number) {
    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);

    const transfers = await prisma.p2PTransfer.findMany({
        where: {
            fromUserId: userId,
            timestamp: {
                gte: weekAgo
            }
        }
    });
    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"] as const;
    type Day = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";

    const result: Record <Day, number> = {
        Sun:0, Mon:0, Tue:0, Wed:0, Thu:0, Fri:0, Sat:0
    };

    transfers.forEach((tx) => {
        const index = new Date(tx.timestamp).getDay();
        const day = days[index] as Day;

        result[day] += tx.amount;

    });
    return Object.entries(result).map(([name, amount]) => ({
        name,
        amount: amount / 100
    }));
}