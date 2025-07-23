import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { is_paid } = await req.json();
  const db = await openDb();

  await db.run(
    'UPDATE transactions SET is_paid = ? WHERE id = ?',
    [is_paid ? 1 : 0, params.id]
  );

  return NextResponse.json({ success: true });
}