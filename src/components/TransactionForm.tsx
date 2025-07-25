"use client";
import { useState } from "react";

interface TransactionFormProps {
  type: "income" | "expense";
  onAdded?: () => void; // Yeni eklenen prop
}

export default function TransactionForm({
  type,
  onAdded,
}: TransactionFormProps) {
  const [form, setForm] = useState({
    person: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.person || !form.amount) {
      alert("Lütfen zorunlu alanları doldurun");
      return;
    }

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          person: form.person,
          amount: parseFloat(form.amount),
          description: form.description,
          date: form.date,
          type,
        }),
      });

      if (response.ok) {
        alert("İşlem başarıyla kaydedildi!");
        setForm({
          person: "",
          amount: "",
          description: "",
          date: new Date().toISOString().split("T")[0],
        });

        // Veri eklendikten sonra parent bileşeni tetikle
        if (onAdded) onAdded();
      }
    } catch (error) {
      console.error("Hata:", error);
      alert("Kayıt sırasında hata oluştu");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border rounded bg-white"
    >
      <h2 className="text-lg font-semibold">
        {type === "income" ? "Yeni Alacak" : "Yeni Borç"} Ekle
      </h2>

      <div>
        <label className="block mb-1 text-sm font-medium">
          {type === "income" ? "Müşteri" : "Tedarikçi"} *
        </label>
        <input
          type="text"
          value={form.person}
          onChange={(e) => setForm({ ...form, person: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Tutar (₺) *</label>
        <input
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Açıklama</label>
        <input
          type="text"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Tarih</label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        type="submit"
        className={`w-full px-4 py-2 text-white rounded ${
          type === "income"
            ? "bg-green-600 hover:bg-green-700"
            : "bg-red-600 hover:bg-red-700"
        }`}
      >
        {type === "income" ? "Alacak Ekle" : "Borç Ekle"}
      </button>
    </form>
  );
}
