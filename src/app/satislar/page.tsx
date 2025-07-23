"use client";

import { useState, useEffect } from "react";

export default function Satislar() {
  const [satislar, setSatislar] = useState([]);
  const [yeniSatis, setYeniSatis] = useState({
    product_name: "",
    customer_name: "",
    amount: 0,
    quantity: 1,
    sale_date: new Date().toISOString().split("T")[0],
  });

  // Satışları API'den çek
  useEffect(() => {
    fetch("/api/sales")
      .then((res) => res.json())
      .then(setSatislar);
  }, []);

  useEffect(() => {
    fetch("/api/sales")
      .then((res) => res.json())
      .then((data) => {
        console.log("API'den gelen satışlar:", data);
        setSatislar(data);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(yeniSatis),
    });
    // Satışları tekrar çek
    fetch("/api/sales")
      .then((res) => res.json())
      .then(setSatislar);
    setYeniSatis({
      product_name: "",
      customer_name: "",
      amount: 0,
      quantity: 1,
      sale_date: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Satışlar</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Yeni Satış Ekle</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Tarih</label>
              <input
                type="date"
                value={yeniSatis.sale_date}
                onChange={(e) =>
                  setYeniSatis({ ...yeniSatis, sale_date: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Ürün Adı</label>
              <input
                type="text"
                value={yeniSatis.product_name}
                onChange={(e) =>
                  setYeniSatis({ ...yeniSatis, product_name: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Müşteri</label>
              <input
                type="text"
                value={yeniSatis.customer_name}
                onChange={(e) =>
                  setYeniSatis({ ...yeniSatis, customer_name: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Miktar</label>
              <input
                type="number"
                value={yeniSatis.quantity}
                onChange={(e) =>
                  setYeniSatis({
                    ...yeniSatis,
                    quantity: Number(e.target.value),
                  })
                }
                className="w-full p-2 border rounded"
                required
                min="1"
              />
            </div>
            <div>
              <label className="block mb-1">Birim Fiyat (₺)</label>
              <input
                type="number"
                value={yeniSatis.amount}
                onChange={(e) =>
                  setYeniSatis({ ...yeniSatis, amount: Number(e.target.value) })
                }
                className="w-full p-2 border rounded"
                required
                min="0"
                step="0.01"
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Satış Ekle
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Satış Listesi</h2>
          <div className="bg-white rounded shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Tarih</th>
                  <th className="p-2 text-left">Ürün</th>
                  <th className="p-2 text-left">Müşteri</th>
                  <th className="p-2 text-right">Miktar</th>
                  <th className="p-2 text-right">Birim Fiyat</th>
                  <th className="p-2 text-right">Toplam</th>
                </tr>
              </thead>
              <tbody>
                {satislar.map((satis: any) => (
                  <tr key={satis.id} className="border-t">
                    <td className="p-2">
                      {new Date(satis.sale_date).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="p-2">{satis.product_name}</td>
                    <td className="p-2">{satis.customer_name}</td>
                    <td className="p-2 text-right">{satis.quantity}</td>
                    <td className="p-2 text-right">
                      {Number(satis.amount).toFixed(2)} ₺
                    </td>
                    <td className="p-2 text-right text-green-600">
                      {(Number(satis.quantity) * Number(satis.amount)).toFixed(
                        2
                      )}{" "}
                      ₺
                    </td>
                    <td className="p-2 text-right">
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        onClick={async () => {
                          await fetch("/api/sales", {
                            method: "DELETE",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ id: satis.id }),
                          });
                          // Silme sonrası listeyi güncelle
                          fetch("/api/sales")
                            .then((res) => res.json())
                            .then(setSatislar);
                        }}
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
