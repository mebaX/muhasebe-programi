// src/app/api/transactions/route.ts
import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export async function POST(req: Request) {
  const { personName, personId, amount, description, date, type } = await req.json();
  const db = await openDb();

  try {
    // Eğer personId yoksa yeni kişi oluştur
    let finalPersonId = personId;
    if (!personId) {
      const personType = type === 'income' ? 'customer' : 'supplier';
      const personRes = await db.run(
        'INSERT INTO persons (name, type) VALUES (?, ?)',
        [personName, personType]
      );
      finalPersonId = personRes.lastID;
    }

    // İşlemi kaydet
    const result = await db.run(
      `INSERT INTO transactions 
      (person_id, amount, description, date, type) 
      VALUES (?, ?, ?, ?, ?)`,
      [finalPersonId, amount, description, date, type]
    );

    return NextResponse.json({ 
      success: true,
      id: result.lastID 
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Kayıt başarısız' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  const db = await openDb();

  try {
    await db.run('DELETE FROM transactions WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Silme başarısız' }, { status: 500 });
  }
}