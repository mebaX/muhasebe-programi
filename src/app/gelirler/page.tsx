'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/local-db';

export default function Gelirler() {
  const [gelirler, setGelirler] = useState(db.getGelirler());
  const [yeniGelir, setYeniGelir] = useState({
    tarih: new Date().toISOString().split('T')[0],
    miktar: 0,
    aciklama: '',
    kategori: 'makine_satisi' as const,
    taksitliMi: false,
    taksitPlanı: {
      taksitSayisi: 1,
      taksitTutari: 0,
      taksitAraligi: 30,
      baslangicTarihi: new Date().toISOString().split('T')[0]
    },
    tamamlananTaksitler: 0
  });

  useEffect(() => {
    db.loadFromLocalStorage();
    setGelirler(db.getGelirler());
  }, []);

  const handleTaksitDegisiklik = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'taksitliMi') {
      setYeniGelir(prev => ({
        ...prev,
        taksitliMi: checked
      }));
    } else {
      setYeniGelir(prev => ({
        ...prev,
        taksitPlanı: {
          ...prev.taksitPlanı,
          [name]: type === 'number' ? Number(value) : value
        }
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const gelirData = {
      ...yeniGelir,
      tarih: new Date(yeniGelir.tarih),
      miktar: Number(yeniGelir.miktar),
      taksitPlanı: yeniGelir.taksitliMi ? {
        ...yeniGelir.taksitPlanı,
        baslangicTarihi: new Date(yeniGelir.taksitPlanı.baslangicTarihi)
      } : undefined,
      tamamlananTaksitler: 0
    };

    db.addGelir(gelirData);
    db.saveToLocalStorage();
    setGelirler([...db.getGelirler()]);
    
    setYeniGelir({
      tarih: new Date().toISOString().split('T')[0],
      miktar: 0,
      aciklama: '',
      kategori: 'makine_satisi',
      taksitliMi: false,
      taksitPlanı: {
        taksitSayisi: 1,
        taksitTutari: 0,
        taksitAraligi: 30,
        baslangicTarihi: new Date().toISOString().split('T')[0]
      },
      tamamlananTaksitler: 0
    });
  };

  const handleTaksitOde = (id: string) => {
    db.taksitOdeGelir(id);
    db.saveToLocalStorage();
    setGelirler([...db.getGelirler()]);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gelirler</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Yeni Gelir Ekle</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Temel Bilgiler */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Tarih</label>
                <input
                  type="date"
                  value={yeniGelir.tarih}
                  onChange={(e) => setYeniGelir({...yeniGelir, tarih: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Miktar (₺)</label>
                <input
                  type="number"
                  value={yeniGelir.miktar}
                  onChange={(e) => setYeniGelir({...yeniGelir, miktar: Number(e.target.value)})}
                  className="w-full p-2 border rounded"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1">Açıklama</label>
              <input
                type="text"
                value={yeniGelir.aciklama}
                onChange={(e) => setYeniGelir({...yeniGelir, aciklama: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Kategori</label>
              <select
                value={yeniGelir.kategori}
                onChange={(e) => setYeniGelir({...yeniGelir, kategori: e.target.value as any})}
                className="w-full p-2 border rounded"
              >
                <option value="makine_satisi">Makine Satışı</option>
                <option value="yedek_parca">Yedek Parça</option>
                <option value="servis">Servis Geliri</option>
                <option value="diger">Diğer</option>
              </select>
            </div>

            {/* Taksit Bilgileri */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="taksitliMi"
                name="taksitliMi"
                checked={yeniGelir.taksitliMi}
                onChange={handleTaksitDegisiklik}
                className="mr-2"
              />
              <label htmlFor="taksitliMi">Taksitli Ödeme</label>
            </div>

            {yeniGelir.taksitliMi && (
              <div className="bg-gray-50 p-4 rounded space-y-3">
                <h3 className="font-medium">Taksit Planı</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Taksit Sayısı</label>
                    <input
                      type="number"
                      name="taksitSayisi"
                      value={yeniGelir.taksitPlanı.taksitSayisi}
                      onChange={handleTaksitDegisiklik}
                      className="w-full p-2 border rounded"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Taksit Aralığı (gün)</label>
                    <input
                      type="number"
                      name="taksitAraligi"
                      value={yeniGelir.taksitPlanı.taksitAraligi}
                      onChange={handleTaksitDegisiklik}
                      className="w-full p-2 border rounded"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Başlangıç Tarihi</label>
                    <input
                      type="date"
                      name="baslangicTarihi"
                      value={yeniGelir.taksitPlanı.baslangicTarihi}
                      onChange={handleTaksitDegisiklik}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Taksit Tutarı (₺)</label>
                    <input
                      type="text"
                      value={(yeniGelir.miktar / yeniGelir.taksitPlanı.taksitSayisi).toFixed(2)}
                      readOnly
                      className="w-full p-2 border rounded bg-gray-100"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Kaydet
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Gelir Listesi</h2>
          <div className="bg-white rounded shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Tarih</th>
                  <th className="p-2 text-left">Açıklama</th>
                  <th className="p-2 text-left">Miktar</th>
                  <th className="p-2 text-left">Taksit</th>
                  <th className="p-2 text-left">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {gelirler.map((gelir) => (
                  <tr key={gelir.id} className="border-t hover:bg-gray-50">
                    <td className="p-2">{gelir.tarih.toLocaleDateString('tr-TR')}</td>
                    <td className="p-2">{gelir.aciklama}</td>
                    <td className="p-2 text-green-600 font-medium">
                      {gelir.miktar.toFixed(2)} ₺
                    </td>
                    <td className="p-2">
                      {gelir.taksitliMi ? (
                        <div className="text-sm">
                          <div>{gelir.tamamlananTaksitler}/{gelir.taksitPlanı?.taksitSayisi}</div>
                          <div className="w-full bg-gray-200 rounded h-1.5">
                            <div 
                              className="bg-green-500 h-1.5 rounded" 
                              style={{
                                width: `${(gelir.tamamlananTaksitler / gelir.taksitPlanı!.taksitSayisi) * 100}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        'Peşin'
                      )}
                    </td>
                    <td className="p-2">
                      {gelir.taksitliMi && gelir.tamamlananTaksitler < gelir.taksitPlanı!.taksitSayisi && (
                        <button
                          onClick={() => handleTaksitOde(gelir.id)}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                        >
                          Taksit Öde
                        </button>
                      )}
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