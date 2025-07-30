import nodemailer from 'nodemailer';
import { openDb } from './db';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Sabit iki e-posta adresi
const recipients = [
  'pdmproje@gmail.com',
  'bahamert010@gmail.com',
  'farmtektr@gmail.com'
];

export async function sendPaymentReminder() {
  const db = await openDb();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split('T')[0];

  // Yarın ödemesi olan giderleri çek
  const expenses = await db.all(`
    SELECT t.amount, t.date, p.name ,t.description
    FROM transactions t
    JOIN persons p ON t.person_id = p.id
    WHERE t.type = 'expense' AND t.date = ?
  `, [dateStr]);

  const incomes = await db.all(`
    SELECT t.amount, t.date, p.name ,t.description
    FROM transactions t
    JOIN persons p ON t.person_id = p.id
    WHERE t.type = 'income' AND t.date = ?
  `, [dateStr]);

  if (expenses.length === 0) return;
  if (incomes.length === 0) return;

  for (const recipient of recipients) {
    try {
      await transporter.sendMail({
        from: `"Ödeme Takip Sistemi" <${process.env.EMAIL_USER}>`,
        to: recipient,
        subject: 'Yarın ödenecek giderler',
        html: `
          <h3>Yarın ödenmesi gereken giderler:</h3>
          <ul>
            ${expenses.map(expense => `
              <li>
                <strong>${expense.name}</strong> - 
                ${expense.amount} ₺ - 
                <strong>${expense.description}</strong>
                Tarih: ${new Date(expense.date).toLocaleDateString('tr-TR')}
              </li>
            `).join('')}
          </ul>
          <p><em>Bu otomatik bir hatırlatıcıdır.</em></p>
        `,
      });
      console.log(`${recipient} adresine e-posta gönderildi`);
    } catch (error) {
      console.error(`${recipient} gönderilemedi:`, error);
    }
  }
}