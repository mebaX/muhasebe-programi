"use client";

import { calculateRemaining } from "@/lib/calculateRemaining";
import { useState } from "react";

type Installment = {
  id: number;
  dueDate: string;
  amount: number;
  paid: boolean;
};

type Payment = {
  id: number;
  name: string;
  totalAmount: number;
  type: "gelir" | "gider";
  installments: Installment[];
};

export default function PaymentTable({
  data,
  onUpdated,
}: {
  data: Payment[];
  onUpdated: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedName, setEditedName] = useState("");

  const togglePaid = async (installmentId: number, current: boolean) => {
    setLoading(true);
    await fetch(`/api/installments/${installmentId}`, {
      method: "PATCH",
      body: JSON.stringify({ paid: !current }),
    });
    console.log("✅ Taksit güncellendi");
    onUpdated();
  };

  const toggleEdit = (id: number, currentName: string) => {
    if (editingId === id) {
      setEditingId(null);
    } else {
      setEditingId(id);
      setEditedName(currentName);
    }
  };

  const saveEdit = async (id: number) => {
    await fetch(`/api/payments/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ name: editedName }),
    });
    setEditingId(null);
    onUpdated();
  };

  return (
    <div className="p-4">
      {data.map((user) => {
        const isGelir = user.type === "gelir";

        return (
          <div
            key={user.id}
            className={`mb-6 border-l-4 p-4 rounded shadow ${
              isGelir
                ? "border-green-500 bg-green-50"
                : "border-red-500 bg-red-50"
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              {editingId === user.id ? (
                <input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="border px-2 py-1 rounded text-black"
                />
              ) : (
                <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
              )}
              <div className="flex items-center space-x-4">
                {editingId === user.id ? (
                  <button
                    onClick={() => saveEdit(user.id)}
                    className="text-sm bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Kaydet
                  </button>
                ) : (
                  <button
                    onClick={() => toggleEdit(user.id, user.name)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Düzenle
                  </button>
                )}
                <button
                  onClick={async () => {
                    if (
                      confirm(
                        `${user.name} adlı kişiyi silmek istediğinize emin misiniz?`
                      )
                    ) {
                      await fetch(`/api/payments/${user.id}`, {
                        method: "DELETE",
                      });
                      console.log("✅ Silme tamamlandı");
                      onUpdated();
                    }
                  }}
                  className="text-red-600 hover:underline text-sm"
                >
                  Sil
                </button>
              </div>
            </div>

            <p className="text-gray-700">Toplam Tutar: {user.totalAmount}₺</p>
            <p className="text-gray-700 mb-2">
              Kalan Tutar: {calculateRemaining(user.installments)}₺
            </p>

            <table className="mt-2 w-full text-left text-sm text-gray-800">
              <thead>
                <tr className="border-b">
                  <th>#</th>
                  <th>Vade</th>
                  <th>Tutar</th>
                  <th>Durum</th>
                </tr>
              </thead>
              <tbody>
                {user.installments.map((i) => (
                  <tr key={i.id} className="border-b">
                    <td>{i.id}</td>
                    <td>{new Date(i.dueDate).toLocaleDateString("tr-TR")}</td>
                    <td>{i.amount}₺</td>
                    <td>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={!!i.paid}
                          onChange={() => togglePaid(i.id, !!i.paid)}
                          disabled={loading}
                        />
                        <span
                          className={
                            i.paid
                              ? "text-green-600 font-semibold"
                              : "text-red-600 font-semibold"
                          }
                        >
                          {i.paid ? "Ödendi" : "Bekliyor"}
                        </span>
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
