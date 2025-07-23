import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import { openDb } from '@/lib/db';

export default async function GelirlerPage() {
  const db = await openDb();
  const transactions = await db.all(`
    SELECT t.*, p.name as person_name 
    FROM transactions t
    JOIN persons p ON t.person_id = p.id
    WHERE t.type = 'income'
    ORDER BY t.date DESC
  `);

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold">Alacaklar (Gelirler)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <TransactionForm type="income" />
        </div>

        <div className="lg:col-span-2">
          <TransactionList transactions={transactions} type="income" />
        </div>
      </div>
    </div>
  );
}
