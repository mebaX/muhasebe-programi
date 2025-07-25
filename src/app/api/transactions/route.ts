import { NextResponse } from "next/server";
import { openDb } from "@/lib/db";

export async function POST(req: Request) {
  const { person, amount, description, date, type } = await req.json();
  const db = await openDb();

  try {
    const result = await db.run(
      `INSERT INTO transactions 
      (person, amount, description, date, type) 
      VALUES (?, ?, ?, ?, ?)`,
      [person, amount, description, date, type]
    );

    return NextResponse.json({
      success: true,
      id: result.lastID,
      person,
      amount,
      description,
      date,
      type,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, error: "Kayıt başarısız" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  const db = await openDb();

  try {
    await db.run("DELETE FROM transactions WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Silme başarısız" },
      { status: 500 }
    );
  }
}
