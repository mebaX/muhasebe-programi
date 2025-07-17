import { openDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const db = await openDb();
  const { paid } = await req.json();

  await db.run(`UPDATE installments SET paid = ? WHERE id = ?`, [paid ? 1 : 0, params.id]);
  return NextResponse.json({ success: true });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const db = await openDb();
  await db.run(`DELETE FROM installments WHERE id = ?`, [params.id]);
  return NextResponse.json({ success: true });
}
