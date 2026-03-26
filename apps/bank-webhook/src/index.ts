import express from "express";
import db from "@repo/db";
import cors from "cors";
import path from "path";

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.static("public"));
app.use(cors({ origin: "*" }));

app.post("/confirm-payment", async (req, res) => {
  const { token, user_identifier, amount } = req.body;
  try {
    await db.$transaction(async (tx: any) => {
      const transaction = await tx.onRampTransaction.findUnique({
        where: { token },
      });

      if (!transaction) {
        throw new Error("Transaction not found");
      }
      if (transaction.status === "Success") {
        console.log("⚠️ Transaction already processed");
        return;
      }
      if (transaction.status !== "Processing") {
        throw new Error("Invalid transaction state");
      }

      await tx.balance.upsert({
        where: { userId: Number(user_identifier) },
        update: {
          amount: { increment: Number(amount) },
        },
        create: {
          userId: Number(user_identifier),
          amount: Number(amount),
          locked: 0,
        },
      });

      await tx.onRampTransaction.update({
        where: { token },
        data: { status: "Success" },
      });
    });

    console.log(`✅ Payment success for user ${user_identifier}`);
    res.redirect("https://finpay.vercel.app/dashboard");

  } catch (e) {
    console.error("ERROR:", e);
    res.status(500).send("Payment Failed");
  }
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Bank webhook running on port ${PORT}`);
});