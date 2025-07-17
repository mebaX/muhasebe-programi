"use client";

import { useState } from "react";

export default function AddPaymentForm({ onAdded }: { onAdded: () => void }) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"gelir" | "gider">("gelir");
  const [installments, setInstallments] = useState([
    { dueDate: "", amount: 0, paid: false },
  ]);
  const [loading, setLoading] = useState(false);

  const totalAmount = installments.reduce(
    (sum, i) => sum + Number(i.amount || 0),
    0
  );

  const handleSubmit = async () => {
    setLoading(true);
    await fetch("/api/payments", {
      method: "POST",
      body: JSON.stringify({
        name,
        totalAmount,
        type,
        installments: installments.map((i) => ({
          dueDate: i.dueDate,
          amount: i.amount,
          paid: i.paid ?? false,
        })),
      }),
    });
    setLoading(false);
    setName("");
    setInstallments([{ dueDate: "", amount: 0, paid: false }]);
    onAdded();
  };

  return (
    <div className="p-4 bg-white rounded shadow mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        Yeni Ödeme Ekle
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Ad Soyad"
          className="border p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="border p-2"
          value={type}
          onChange={(e) => setType(e.target.value as "gelir" | "gider")}
        >
          <option value="gelir">Alacak (Gelir)</option>
          <option value="gider">Borç (Gider)</option>
        </select>
      </div>

      <div className="mb-2 text-sm font-medium text-gray-700">
        Toplam Tutar: {totalAmount}₺
      </div>

      <div className="space-y-2 mb-4">
        {installments.map((i, idx) => (
          <div
            key={idx}
            className="grid grid-cols-4 items-center gap-2 text-sm"
          >
            <input
              type="date"
              className="border p-1"
              value={i.dueDate}
              onChange={(e) => {
                const updated = [...installments];
                updated[idx].dueDate = e.target.value;
                setInstallments(updated);
              }}
            />
            <input
              type="number"
              className="border p-1"
              value={i.amount}
              onChange={(e) => {
                const updated = [...installments];
                updated[idx].amount = parseFloat(e.target.value);
                setInstallments(updated);
              }}
            />
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={i.paid}
                onChange={(e) => {
                  const updated = [...installments];
                  updated[idx].paid = e.target.checked;
                  setInstallments(updated);
                }}
              />
              Ödendi
            </label>
            <button
              type="button"
              onClick={() => {
                const updated = [...installments];
                updated.splice(idx, 1);
                setInstallments(updated);
              }}
              className="text-red-500 hover:underline"
            >
              ❌
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() =>
          setInstallments([
            ...installments,
            { dueDate: "", amount: 0, paid: false },
          ])
        }
        className="text-blue-600 text-sm hover:underline mb-4"
      >
        + Yeni Taksit Ekle
      </button>

      <br />

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        disabled={loading}
      >
        Kaydet
      </button>
    </div>
  );
}
