import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export async function POST(req: Request) {
  const { person_id, amount, description, type } = await req.json();
  const db = await openDb();

  const result = await db.run(
    'INSERT INTO transactions (person_id, amount, description, type) VALUES (?, ?, ?, ?)',
    [person_id, amount, description, type]
  );

  return NextResponse.json({ id: result.lastID });
}