import ReportCharts from '@/components/ReportCharts';
import { openDb } from '@/lib/db';

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

  // Aylık net kârı hesapla
  const monthlySummary = incomeData.map(income => {
    const expense = expenseData.find(e => e.month === income.month) || { total: 0 };
    return {
      month: income.month,
      income: income.total,
      expense: expense.total,
      net: income.total - expense.total
    };
  });

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold">Raporlar</h1>
      
      <ReportCharts 
        incomeData={incomeData} 
        expenseData={expenseData}
        monthlySummary={monthlySummary}
      />
    </div>
  );
}