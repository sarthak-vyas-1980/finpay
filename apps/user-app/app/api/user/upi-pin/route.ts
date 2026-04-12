export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import prisma from "@repo/db";
import bcrypt from "bcrypt";
import { z } from "zod";

const upiPinSchema = z
  .object({
    pin: z
      .string()
      .regex(/^\d{4}$/, "UPI PIN must be 4 digits")
      .min(4)
      .max(4),
  })
  .strict();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = upiPinSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const pinHash = await bcrypt.hash(parsed.data.pin, 10);

  await prisma.user.update({
    where: { id: Number(session.user.id) },
    data: { upiPinHash: pinHash },
  });

  return NextResponse.json({ ok: true });
}
