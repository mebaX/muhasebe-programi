import { openDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const db = await openDb();

  // Önce taksitleri sil
  await db.run("DELETE FROM installments WHERE paymentId = ?", [params.id]);

  // Sonra ödemeyi sil
  await db.run("DELETE FROM payments WHERE id = ?", [params.id]);

  return NextResponse.json({ success: true });
}
