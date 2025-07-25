import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import { openDb } from "@/lib/db";

export default async function GiderlerPage() {
  const db = await openDb();
  const transactions = await db.all(`
  SELECT *, person as person_name
  FROM transactions
  WHERE type = 'expense'
  ORDER BY date DESC
`);

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold">Borçlar (Giderler)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <TransactionForm type="expense" />
        </div>

        <div className="lg:col-span-2">
          <TransactionList transactions={transactions} type="expense" />
        </div>
      </div>
    </div>
  );
}
