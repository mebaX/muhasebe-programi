// app/api/cron/route.ts
import { startCronJob } from '@/lib/cron';

export async function GET() {
  startCronJob();
  return new Response('Cron job başlatıldı');
}