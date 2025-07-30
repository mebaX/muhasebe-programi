import { NextResponse } from "next/server";
import { openDb } from "@/lib/db";

export async function POST(req : Request) {
  try {
    const invoices = await req.json();
    console.log("GELEN FATURALAR:", invoices);

    if (!Array.isArray(invoices)) {
      throw new Error("Beklenen format: Array");
    }

    const db = await openDb();

    for (const inv of invoices) {
      if (Array.isArray(inv.items)) {
        for (const item of inv.items) {
          await db.run(
            `INSERT INTO invoice_items 
              (invoice_number, invoice_date, receiver_name, description, name, quantity, unit_price, total)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              inv.invoice_number,
              inv.invoice_date,
              inv.receiver_name,
              item.description || null,
              item.name || null,
              item.quantity,
              item.unit_price,
              item.total,
            ]
          );
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Fatura aktarım hatası:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
