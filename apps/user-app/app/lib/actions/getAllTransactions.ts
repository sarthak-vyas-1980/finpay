import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export type Transaction = //Type for the main export type
    | {
        type: "ON_RAMP";
        time: Date;
        amount: number;
        status: string;
        provider: string;
      }
    | {
        type: "P2P";
        time: Date;
        amount: number;
        from: number;
        to: number;
        direction: "SENT" | "RECEIVED";
      };

async function getOnRampTransactions(userId: number): Promise<Transaction[]> {
  const txns = await prisma.onRampTransaction.findMany({
    where: { userId },
  });

  return txns.map((t) => ({
    type: "ON_RAMP",
    time: t.startTime,
    amount: t.amount,
    status: t.status,
    provider: t.provider,
  }));
}

async function getp2PTransactions(userId: number): Promise<Transaction[]> {
  const txns = await prisma.p2PTransfer.findMany({
    where: {
      OR: [{ fromUserId: userId }, { toUserId: userId }],
    },
  });

  return txns.map((t) => ({
    type: "P2P",
    time: t.timestamp,
    amount: t.amount,
    from: t.fromUserId,
    to: t.toUserId,
    direction: t.fromUserId === userId ? "SENT" : "RECEIVED",
  }));
}

/* -------------------- MAIN EXPORT -------------------- */

export async function getAllTransactions(): Promise<Transaction[]> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = Number(session.user.id);

  //   const [onRamp, p2p] = await Promise.all([
  //     getOnRampTransactions(userId),
  //     getp2PTransactions(userId),
  //   ]);
  const onRamp = await getOnRampTransactions(userId);
  const p2P = await getp2PTransactions(userId);

  return [...onRamp, ...p2P].sort(
    (a, b) => b.time.getTime() - a.time.getTime(),
  );
}
