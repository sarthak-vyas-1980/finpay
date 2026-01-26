import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { BalanceCard } from "../../../components/BalanceCard";
import { Center } from "@repo/ui/center";

async function getBalance() {
    const session = await getServerSession(authOptions);
    const balance = await prisma.balance.findFirst({
        where: {
            userId: Number(session?.user?.id)
        }
    });
    return { // We don't want every detail to be shared that's why not returning the whole balance
        amount: balance?.amount || 0,
        locked: balance?.locked || 0
    }
}

export default async function() {
    const balance = await getBalance();
    return <div className="w-screen">
        {/* <div className="text-4xl text-[#20438E] pt-8 mb-8 font-bold">
            Dashboard
        </div> */}
            <BalanceCard amount={balance.amount} locked={balance.locked} />
    </div>
}
