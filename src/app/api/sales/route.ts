import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export async function GET() {
  const db = await openDb();
  const satislar = await db.all('SELECT * FROM sales');
  return NextResponse.json(satislar);
}

export async function POST(req: Request) {
  const { product_name, customer_name, amount, quantity, sale_date } = await req.json();
  const db = await openDb();

  try {
    const result = await db.run(
      'INSERT INTO sales (product_name, customer_name, amount, quantity, sale_date) VALUES (?, ?, ?, ?, ?)',
      [product_name, customer_name, amount, quantity, sale_date]
    );
    return NextResponse.json({ success: true, id: result.lastID });
  } catch (error) {
    console.error('Kayıt hatası:', error);
    return NextResponse.json({ success: false, error: 'Kayıt başarısız' }, { status: 500 });
  }
}

// Silme işlemi
export async function DELETE(req: Request) {
  const { id } = await req.json();
  const db = await openDb();

  try {
    await db.run('DELETE FROM sales WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Silme hatası:', error);
    return NextResponse.json({ success: false, error: 'Silme başarısız' }, { status: 500 });
  }
}