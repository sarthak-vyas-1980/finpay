import prisma from "@repo/db/client";

export async function getMonthlySpending(userId: number) {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0,0,0,0);

  const transfers = await prisma.p2PTransfer.aggregate({
    where: {
      fromUserId: userId,
      timestamp: {
        gte: startOfMonth
      }
    },
    _sum: {
      amount: true
    }
  });

  return transfers._sum.amount ?? 0;
}