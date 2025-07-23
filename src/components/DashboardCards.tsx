import { ArrowUp, ArrowDown, ShoppingCart } from 'lucide-react';

interface DashboardCardsProps {
  totalIncome: number;
  totalExpense: number;
  totalSales: number;
}

export default function DashboardCards({ 
  totalIncome, 
  totalExpense,
  totalSales
}: DashboardCardsProps) {
  const netProfit = totalIncome - totalExpense;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Gelir Kartı */}
      <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
        <h3 className="text-sm font-medium text-gray-500">Toplam Gelir</h3>
        <div className="flex items-center mt-2">
          <ArrowUp className="text-green-500 mr-2" />
          <span className="text-2xl font-bold">{totalIncome.toFixed(2)} ₺</span>
        </div>
      </div>

      {/* Gider Kartı */}
      <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
        <h3 className="text-sm font-medium text-gray-500">Toplam Gider</h3>
        <div className="flex items-center mt-2">
          <ArrowDown className="text-red-500 mr-2" />
          <span className="text-2xl font-bold">{totalExpense.toFixed(2)} ₺</span>
        </div>
      </div>

      {/* Net Kar Kartı */}
      <div className={`bg-white p-4 rounded-lg shadow border-l-4 ${
        netProfit >= 0 ? 'border-green-500' : 'border-red-500'
      }`}>
        <h3 className="text-sm font-medium text-gray-500">Net Kar</h3>
        <div className="flex items-center mt-2">
          {netProfit >= 0 ? (
            <ArrowUp className="text-green-500 mr-2" />
          ) : (
            <ArrowDown className="text-red-500 mr-2" />
          )}
          <span className={`text-2xl font-bold ${
            netProfit >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {netProfit.toFixed(2)} ₺
          </span>
        </div>
      </div>

      {/* Satış Kartı */}
      <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
        <h3 className="text-sm font-medium text-gray-500">Toplam Satış</h3>
        <div className="flex items-center mt-2">
          <ShoppingCart className="text-blue-500 mr-2" />
          <span className="text-2xl font-bold">{totalSales}</span>
        </div>
      </div>
    </div>
  );
}