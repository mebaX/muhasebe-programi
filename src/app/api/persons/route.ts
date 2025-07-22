import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export async function GET() {
  const db = await openDb();
  const persons = await db.all('SELECT * FROM persons ORDER BY name');
  return NextResponse.json(persons);
}

export async function POST(req: Request) {
  const { name, type } = await req.json();
  const db = await openDb();

  try {
    const result = await db.run(
      'INSERT INTO persons (name, type) VALUES (?, ?)',
      [name, type]
    );
    return NextResponse.json({ id: result.lastID });
  } catch (error) {
    return NextResponse.json(
      { error: 'Kişi eklenemedi. Bu isimde biri zaten var.' },
      { status: 400 }
    );
  }
}