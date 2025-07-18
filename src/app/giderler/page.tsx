'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/local-db';

export default function Giderler() {
  const [giderler, setGiderler] = useState(db.getGiderler());
  const [yeniGider, setYeniGider] = useState({
    tarih: new Date().toISOString().split('T')[0],
    miktar: 0,
    aciklama: '',
    kategori: 'maas' as const,
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
    setGiderler(db.getGiderler());
  }, []);

  const handleTaksitDegisiklik = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'taksitliMi') {
      setYeniGider(prev => ({
        ...prev,
        taksitliMi: checked
      }));
    } else {
      setYeniGider(prev => ({
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
    
    const giderData = {
      ...yeniGider,
      tarih: new Date(yeniGider.tarih),
      miktar: Number(yeniGider.miktar),
      taksitPlanı: yeniGider.taksitliMi ? {
        ...yeniGider.taksitPlanı,
        baslangicTarihi: new Date(yeniGider.taksitPlanı.baslangicTarihi)
      } : undefined,
      tamamlananTaksitler: 0
    };

    db.addGider(giderData);
    db.saveToLocalStorage();
    setGiderler([...db.getGiderler()]);
    
    setYeniGider({
      tarih: new Date().toISOString().split('T')[0],
      miktar: 0,
      aciklama: '',
      kategori: 'maas',
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
    db.taksitOdeGider(id);
    db.saveToLocalStorage();
    setGiderler([...db.getGiderler()]);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Giderler</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Yeni Gider Ekle</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Temel Bilgiler */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Tarih</label>
                <input
                  type="date"
                  value={yeniGider.tarih}
                  onChange={(e) => setYeniGider({...yeniGider, tarih: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Miktar (₺)</label>
                <input
                  type="number"
                  value={yeniGider.miktar}
                  onChange={(e) => setYeniGider({...yeniGider, miktar: Number(e.target.value)})}
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
                value={yeniGider.aciklama}
                onChange={(e) => setYeniGider({...yeniGider, aciklama: e.target.value})}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Kategori</label>
              <select
                value={yeniGider.kategori}
                onChange={(e) => setYeniGider({...yeniGider, kategori: e.target.value as any})}
                className="w-full p-2 border rounded"
              >
                <option value="maas">Maaş Ödemeleri</option>
                <option value="kira">Kira Gideri</option>
                <option value="bakim">Makine Bakım</option>
                <option value="malzeme">Malzeme Alımı</option>
                <option value="diger">Diğer Giderler</option>
              </select>
            </div>

            {/* Taksit Bilgileri */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="taksitliMi"
                name="taksitliMi"
                checked={yeniGider.taksitliMi}
                onChange={handleTaksitDegisiklik}
                className="mr-2"
              />
              <label htmlFor="taksitliMi">Taksitli Ödeme</label>
            </div>

            {yeniGider.taksitliMi && (
              <div className="bg-gray-50 p-4 rounded space-y-3">
                <h3 className="font-medium">Taksit Planı</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Taksit Sayısı</label>
                    <input
                      type="number"
                      name="taksitSayisi"
                      value={yeniGider.taksitPlanı.taksitSayisi}
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
                      value={yeniGider.taksitPlanı.taksitAraligi}
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
                      value={yeniGider.taksitPlanı.baslangicTarihi}
                      onChange={handleTaksitDegisiklik}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Taksit Tutarı (₺)</label>
                    <input
                      type="text"
                      value={(yeniGider.miktar / yeniGider.taksitPlanı.taksitSayisi).toFixed(2)}
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
          <h2 className="text-xl font-semibold mb-4">Gider Listesi</h2>
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
                {giderler.map((gider) => (
                  <tr key={gider.id} className="border-t hover:bg-gray-50">
                    <td className="p-2">{gider.tarih.toLocaleDateString('tr-TR')}</td>
                    <td className="p-2">{gider.aciklama}</td>
                    <td className="p-2 text-red-600 font-medium">
                      {gider.miktar.toFixed(2)} ₺
                    </td>
                    <td className="p-2">
                      {gider.taksitliMi ? (
                        <div className="text-sm">
                          <div>{gider.tamamlananTaksitler}/{gider.taksitPlanı?.taksitSayisi}</div>
                          <div className="w-full bg-gray-200 rounded h-1.5">
                            <div 
                              className="bg-green-500 h-1.5 rounded" 
                              style={{
                                width: `${(gider.tamamlananTaksitler / gider.taksitPlanı!.taksitSayisi) * 100}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        'Peşin'
                      )}
                    </td>
                    <td className="p-2">
                      {gider.taksitliMi && gider.tamamlananTaksitler < gider.taksitPlanı!.taksitSayisi && (
                        <button
                          onClick={() => handleTaksitOde(gider.id)}
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