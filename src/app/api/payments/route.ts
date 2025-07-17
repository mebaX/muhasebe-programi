import { NextResponse } from "next/server";
import { openDb } from "@/lib/db";

export async function GET() {
  const db = await openDb();
  const payments = await db.all(`SELECT * FROM payments`);

  for (const payment of payments) {
    const installments = await db.all(
      `SELECT * FROM installments WHERE paymentId = ?`,
      [payment.id]
    );
    payment.installments = installments;
  }

  return NextResponse.json(payments);
}

export async function POST(req: Request) {
  const { name, totalAmount, installments } = await req.json();

  const db = await openDb();
  const result = await db.run(
    `INSERT INTO payments (name, totalAmount) VALUES (?, ?)`,
    [name, totalAmount]
  );
  const paymentId = result.lastID;

  for (const i of installments) {
    await db.run(
      `INSERT INTO installments (paymentId, dueDate, amount, paid) VALUES (?, ?, ?, ?)`,
      [paymentId, i.dueDate, i.amount, i.paid ? 1 : 0] // ✅ Burada `i.paid` okunmalı
    );
  }

  return NextResponse.json({ success: true });
}
