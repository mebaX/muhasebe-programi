// app/api/send-reminder/route.ts
import { sendPaymentReminder } from '@/lib/email';
import { NextResponse } from 'next/server';

export async function GET() {
  await sendPaymentReminder();
  return NextResponse.json({ success: true });
}