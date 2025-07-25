import { openDb } from "@/lib/db";
import RecentTransactions from "@/components/RecentTransactions";
import { ArrowUp, ArrowDown } from "lucide-react";
import formatNumber from "@/lib/formatNumber";

// src/app/dashboard/page.tsx
export default async function DashboardPage() {
  const db = await openDb();

  // Gelir ve satışları birleştirerek toplam geliri hesapla
  const [income, expense, totalSales] = await Promise.all([
    db.get(
      'SELECT SUM(amount) as total FROM transactions WHERE type = "income"'
    ),
    db.get(
      'SELECT SUM(amount) as total FROM transactions WHERE type = "expense"'
    ),
    db.get("SELECT SUM(amount) as total FROM sales"),
  ]);

  const totalIncome = (income?.total || 0) + (totalSales?.total || 0);

  // Son 5 gelir ve satışı birleştir
  const recentIncome = await db.all(`
    SELECT 
      id, 
      amount, 
      description as title, 
      date,
      'transaction' as type
    FROM transactions 
    WHERE type = 'income'
    ORDER BY date DESC 
    LIMIT 5
  `);

  const recentExpenses = await db.all(`
  SELECT 
    id, 
    amount, 
    description as title, 
    date,
    'expense' as type
  FROM transactions 
  WHERE type = 'expense'
  ORDER BY date DESC 
  LIMIT 5
`);

  const recentSales = await db.all(`
    SELECT 
      id, 
      amount, 
      product_name as title, 
      sale_date as date,
      'sale' as type
    FROM sales 
    ORDER BY sale_date DESC 
    LIMIT 5
  `);

  // Gelir ve satışları birleştir, tarihe göre sırala
  const recentTransactions = [
    ...recentIncome,
    ...recentSales,
    ...recentExpenses,
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5); // sadece son 5 işlem

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold">Genel Bakış</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Gelir Kartı (Artık satışları da içeriyor) */}
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500">Toplam Gelir</h3>
          <div className="flex items-center mt-2">
            <ArrowUp className="text-green-500 mr-2" />
            <span className="text-2xl font-bold">
              {formatNumber(totalIncome)} ₺
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            (İşlemler: {income?.total || 0} ₺ + Satışlar:{" "}
            {totalSales?.total || 0} ₺)
          </p>
        </div>

        {/* Gider Kartı */}
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <h3 className="text-sm font-medium text-gray-500">Toplam Gider</h3>
          <div className="flex items-center mt-2">
            <ArrowDown className="text-red-500 mr-2" />
            <span className="text-2xl font-bold">
              {formatNumber(expense?.total || 0)} ₺
            </span>
          </div>
        </div>

        {/* Net Kar Kartı */}
        <div
          className={`bg-white p-4 rounded-lg shadow border-l-4 ${
            (income?.total || 0) +
              (totalSales?.total || 0) -
              (expense?.total || 0) >=
            0
              ? "border-green-500"
              : "border-red-500"
          }`}
        >
          <h3 className="text-sm font-medium text-gray-500">Net Kar</h3>
          <div className="flex items-center mt-2">
            {(income?.total || 0) +
              (totalSales?.total || 0) -
              (expense?.total || 0) >=
            0 ? (
              <ArrowUp className="text-green-500 mr-2" />
            ) : (
              <ArrowDown className="text-red-500 mr-2" />
            )}
            <span
              className={`text-2xl font-bold ${
                (income?.total || 0) +
                  (totalSales?.total || 0) -
                  (expense?.total || 0) >=
                0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {formatNumber(
                (income?.total || 0) +
                  (totalSales?.total || 0) -
                  (expense?.total || 0)
              )}{" "}
              ₺
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <RecentTransactions
          transactions={recentTransactions.filter(
            (t) => t.type === "transaction" || t.type === "sale"
          )}
          title="Son Gelirler & Satışlar"
        />
        <RecentTransactions
          transactions={recentTransactions.filter((t) => t.type === "expense")}
          title="Son Giderler"
        />
      </div>
    </div>
  );
}
