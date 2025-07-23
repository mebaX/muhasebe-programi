// lib/cron.ts
import cron from 'node-cron';
import { sendPaymentReminder } from './email';

export function startCronJob() {
  // Her gün sabah 09:00'de çalıştır
  cron.schedule('0 9 * * *', () => {
    console.log('Ödeme hatırlatıcıları kontrol ediliyor...');
    sendPaymentReminder();
  }, {
    timezone: "Europe/Istanbul"
  });
}