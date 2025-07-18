'use client';

import { useState } from 'react';
import { db } from '../../lib/local-db';

export default function Satislar() {
  const [satislar, setSatislar] = useState(db.getSatislar());
  const [yeniSatis, setYeniSatis] = useState({
    tarih: new Date().toISOString().split('T')[0],
    urunAdi: '',
    miktar: 1,
    birimFiyat: 0,
    musteri: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    db.addSatis({
      ...yeniSatis,
      tarih: new Date(yeniSatis.tarih),
      miktar: Number(yeniSatis.miktar),
      birimFiyat: Number(yeniSatis.birimFiyat)
    });
    setSatislar(db.getSatislar());
    setYeniSatis({
      tarih: new Date().toISOString().split('T')[0],
      urunAdi: '',
      miktar: 1,
      birimFiyat: 0,
      musteri: ''
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
                value={yeniSatis.tarih}
                onChange={(e) => setYeniSatis({...yeniSatis, tarih: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Ürün Adı</label>
              <input
                type="text"
                value={yeniSatis.urunAdi}
                onChange={(e) => setYeniSatis({...yeniSatis, urunAdi: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Miktar</label>
              <input
                type="number"
                value={yeniSatis.miktar}
                onChange={(e) => setYeniSatis({...yeniSatis, miktar: Number(e.target.value)})}
                className="w-full p-2 border rounded"
                required
                min="1"
              />
            </div>
            <div>
              <label className="block mb-1">Birim Fiyat (₺)</label>
              <input
                type="number"
                value={yeniSatis.birimFiyat}
                onChange={(e) => setYeniSatis({...yeniSatis, birimFiyat: Number(e.target.value)})}
                className="w-full p-2 border rounded"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block mb-1">Müşteri</label>
              <input
                type="text"
                value={yeniSatis.musteri}
                onChange={(e) => setYeniSatis({...yeniSatis, musteri: e.target.value})}
                className="w-full p-2 border rounded"
                required
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
                  <th className="p-2 text-right">Toplam</th>
                </tr>
              </thead>
              <tbody>
                {satislar.map((satis) => (
                  <tr key={satis.id} className="border-t">
                    <td className="p-2">{satis.tarih.toLocaleDateString('tr-TR')}</td>
                    <td className="p-2">{satis.urunAdi}</td>
                    <td className="p-2">{satis.musteri}</td>
                    <td className="p-2 text-right">{satis.miktar}</td>
                    <td className="p-2 text-right text-green-600">
                      {(satis.miktar * satis.birimFiyat).toFixed(2)} ₺
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