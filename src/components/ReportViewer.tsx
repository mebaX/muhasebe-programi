"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import * as XLSX from "xlsx";
import saveAs from "file-saver";

type Installment = {
  id: number;
  paymentId: number;
  dueDate: string;
  amount: number;
  paid: boolean | number;
};

type Payment = {
  id: number;
  name: string;
  totalAmount: number;
  type?: "gelir" | "gider";
  installments: Installment[];
};

export default function ReportViewer() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState<number | "all">("all");
  const [onlyUnpaid, setOnlyUnpaid] = useState(false);
  const [showCharts, setShowCharts] = useState(false);

  useEffect(() => {
    fetch("/api/payments")
      .then((res) => res.json())
      .then(setPayments);
  }, []);

  const filteredInstallments = payments
    .flatMap((p) =>
      p.installments.map((i) => ({
        ...i,
        dueDate: new Date(i.dueDate),
      }))
    )
    .filter(
      (i) =>
        i.dueDate.getFullYear() === year &&
        (month === "all" || i.dueDate.getMonth() === month - 1) &&
        (!onlyUnpaid || !i.paid)
    );

  const total = filteredInstallments.reduce((sum, i) => sum + i.amount, 0);
  const paid = filteredInstallments
    .filter((i) => !!i.paid)
    .reduce((sum, i) => sum + i.amount, 0);
  const unpaid = total - paid;

  const userTotals = payments
    .map((p) => {
      const relevant = p.installments
        .map((i) => ({ ...i, dueDate: new Date(i.dueDate) }))
        .filter(
          (i) =>
            i.dueDate.getFullYear() === year &&
            (month === "all" || i.dueDate.getMonth() === month - 1) &&
            (!onlyUnpaid || !i.paid)
        );

      const total = relevant.reduce((sum, i) => sum + i.amount, 0);
      const paid = relevant
        .filter((i) => !!i.paid)
        .reduce((sum, i) => sum + i.amount, 0);
      const unpaid = total - paid;

      return {
        name: p.name,
        paid,
        unpaid,
        total,
      };
    })
    .filter((u) => u.total > 0);

  const gelirler = userTotals.filter(
    (u) => payments.find((p) => p.name === u.name)?.type === "gelir"
  );
  const giderler = userTotals.filter(
    (u) => payments.find((p) => p.name === u.name)?.type === "gider"
  );

  const exportToExcel = () => {
    const excelData = userTotals.map((u) => ({
      Kişi: u.name,
      "Toplam Tutar": u.total,
      Ödenen: u.paid,
      Bekleyen: u.unpaid,
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Rapor");

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      `rapor-${year}-${month || "yıl"}.xlsx`
    );
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-xl font-bold mb-2">📊 Aylık/Yıllık Ödeme Raporu</h2>

      <div className="flex space-x-2 mb-4">
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border p-1 rounded"
        >
          {Array.from({ length: 5 }).map((_, i) => {
            const y = new Date().getFullYear() - i;
            return (
              <option key={y} value={y}>
                {y}
              </option>
            );
          })}
        </select>
        <select
          value={month}
          onChange={(e) =>
            setMonth(e.target.value === "all" ? "all" : Number(e.target.value))
          }
          className="border p-1 rounded"
        >
          <option value="all">Tüm Yıl</option>
          {Array.from({ length: 12 }).map((_, i) => (
            <option key={i} value={i + 1}>
              {i + 1}. Ay
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center space-x-2 mb-4">
        <input
          type="checkbox"
          checked={onlyUnpaid}
          onChange={(e) => setOnlyUnpaid(e.target.checked)}
        />
        <span>Sadece ödenmemişleri göster</span>
      </label>

      <p>
        <strong>Toplam Taksit Tutarı:</strong> {total}₺
      </p>
      <p className="text-green-600">
        <strong>Ödenen:</strong> {paid}₺
      </p>
      <p className="text-red-600">
        <strong>Ödenmemiş:</strong> {unpaid}₺
      </p>

      <h3 className="text-md font-semibold mt-4 mb-1">
        💰 Alacak (Gelir) Dağılımı:
      </h3>
      <table className="w-full text-sm mb-4">
        <thead>
          <tr className="border-b">
            <th className="text-left">Kişi</th>
            <th>Toplam</th>
            <th className="text-green-600">Ödenen</th>
            <th className="text-red-600">Bekleyen</th>
          </tr>
        </thead>
        <tbody>
          {gelirler.map((u) => (
            <tr key={u.name} className="border-b">
              <td>{u.name}</td>
              <td>{u.total}₺</td>
              <td className="text-green-600">{u.paid}₺</td>
              <td className="text-red-600">{u.unpaid}₺</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="text-md font-semibold mt-4 mb-1">
        💸 Borç (Gider) Dağılımı:
      </h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left">Kişi</th>
            <th>Toplam</th>
            <th className="text-green-600">Ödenen</th>
            <th className="text-red-600">Bekleyen</th>
          </tr>
        </thead>
        <tbody>
          {giderler.map((u) => (
            <tr key={u.name} className="border-b">
              <td>{u.name}</td>
              <td>{u.total}₺</td>
              <td className="text-green-600">{u.paid}₺</td>
              <td className="text-red-600">{u.unpaid}₺</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={exportToExcel}
        className="bg-blue-600 text-white px-4 py-1 rounded mt-4"
      >
        📄 Excel'e Aktar
      </button>

      <div className="mt-4">
        <button
          onClick={() => setShowCharts(!showCharts)}
          className="bg-gray-200 text-sm px-3 py-1 rounded"
        >
          {showCharts ? "📉 Grafiği Gizle" : "📊 Grafiği Göster"}
        </button>
      </div>

      {showCharts && (
        <>
          <h3 className="text-md font-semibold mt-6 mb-1">
            📊 Ödeme Dağılımı Grafiği
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={userTotals}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="paid" fill="#4ade80" name="Ödenen" />
              <Bar dataKey="unpaid" fill="#f87171" name="Bekleyen" />
            </BarChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="100%" height={250} className="mt-6">
            <PieChart>
              <Pie
                data={[
                  { name: "Ödenen", value: paid },
                  { name: "Bekleyen", value: unpaid },
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                <Cell fill="#4ade80" />
                <Cell fill="#f87171" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}
