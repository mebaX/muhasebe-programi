"use client";

import formatNumber from "@/lib/formatNumber";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

interface ChartData {
  month: string;
  total: number;
}

interface MonthlySummary {
  month: string;
  income: number;
  expense: number;
  net: number;
}

interface ReportChartsProps {
  incomeData: ChartData[];
  expenseData: ChartData[];
  salesData?: ChartData[]; // Satış verisi eklendi
  monthlySummary: MonthlySummary[];
}

export default function ReportCharts({
  incomeData,
  expenseData,
  salesData = [],
  monthlySummary,
}: ReportChartsProps) {

  console.log("salesData", salesData);

  // Her ay için gelir ve satışları birleştir
  const monthlySalesMap = Object.fromEntries(
    salesData.map((item) => [item.month, item.total])
  );
  const monthlyIncomeMap = Object.fromEntries(
    incomeData.map((item) => [item.month, item.total])
  );

  const mergedMonthlySummary = monthlySummary.map((item) => {
    const sales = monthlySalesMap[item.month] || 0;
    const income = monthlyIncomeMap[item.month] || 0;
    const totalIncome = income + sales;
    return {
      ...item,
      income: totalIncome, // Gelir + Satış
      net: totalIncome - item.expense,
    };
  });

  // Gelir Dağılımı için gelir ve satışları birleştir
  const combinedIncomeData = [...incomeData, ...salesData];

  console.log("incomeData", incomeData);
  console.log("salesData", salesData);
  console.log("expenseData", expenseData);
  console.log("monthlySummary", monthlySummary);
  console.log("mergedMonthlySummary", mergedMonthlySummary);

  return (
    <div className="space-y-8">
      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Aylık Kar/Zarar</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mergedMonthlySummary}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [`${formatNumber(value)} ₺`, ""]}
                labelFormatter={(label: string) => `Ay: ${label}`}
              />
              <Legend />
              <Bar dataKey="income" name="Gelir + Satış" fill="#4ade80" />
              <Bar dataKey="expense" name="Gider" fill="#f87171" />
              <Bar dataKey="net" name="Net" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Gelir Dağılımı</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={combinedIncomeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="total"
                  nameKey="month"
                  label={(props) => {
                    const name = props.name ?? "Bilinmeyen";
                    const percent = props.percent ?? 0;
                    return `${name}: %${(percent * 100).toFixed(1)}`;
                  }}
                >
                  {combinedIncomeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    `${formatNumber(value)} ₺`,
                    "",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Gider Dağılımı</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="total"
                  nameKey="month"
                  label={(props) => {
                    const name = props.name ?? "Bilinmeyen";
                    const percent = props.percent ?? 0;
                    return `${name}: %${(percent * 100).toFixed(1)}`;
                  }}
                >
                  {expenseData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${formatNumber(value)} ₺`, ""]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Özet Tablo</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ay
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Toplam Gelir
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Toplam Gider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Net
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mergedMonthlySummary.map((item) => (
                <tr key={item.month}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.month}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    {formatNumber(item.income)} ₺
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    {formatNumber(item.expense)} ₺
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      item.net >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatNumber(item.net)} ₺
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
