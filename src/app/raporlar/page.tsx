import ReportCharts from "@/components/ReportCharts";
import { openDb } from "@/lib/db";

export default async function RaporlarPage() {
  const db = await openDb();

  // Gelir verilerini çek
  const incomeData = await db.all(`
    SELECT strftime('%Y-%m', date) as month,
           SUM(amount) as total
    FROM transactions
    WHERE type = 'income'
    GROUP BY strftime('%Y-%m', date)
    ORDER BY month
  `);

  // Gider verilerini çek
  const expenseData = await db.all(`
    SELECT strftime('%Y-%m', date) as month,
           SUM(amount) as total
    FROM transactions
    WHERE type = 'expense'
    GROUP BY strftime('%Y-%m', date)
    ORDER BY month
  `);

  // Satış verilerini çek
  const salesData = await db.all(`
  SELECT 
    strftime('%Y-%m', sale_date) as month,
    SUM(amount) as total
  FROM sales
  GROUP BY strftime('%Y-%m', sale_date)
  ORDER BY month
`);

  const monthlySummary = incomeData.map((income) => {
    const expense = expenseData.find((e) => e.month === income.month) || {
      total: 0,
    };
    const sale = salesData.find((s) => s.month === income.month) || {
      total: 0,
    };
    const totalIncome = income.total + sale.total;
    return {
      month: income.month,
      income: totalIncome,
      expense: expense.total,
      net: totalIncome - expense.total,
    };
  });

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold">Raporlar</h1>

      <ReportCharts
        incomeData={incomeData}
        expenseData={expenseData}
        salesData={salesData}
        monthlySummary={monthlySummary}
      />
    </div>
  );
}
