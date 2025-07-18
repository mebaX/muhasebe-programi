'use client';

import { db } from '@/lib/local-db';

export default function Dashboard() {
  const gelirler = db.getGelirler();
  const giderler = db.getGiderler();
  const satislar = db.getSatislar(); // Artık bu fonksiyon tanımlı

  const toplamGelir = gelirler.reduce((sum, gelir) => sum + gelir.miktar, 0);
  const toplamGider = giderler.reduce((sum, gider) => sum + gider.miktar, 0);
  const netKar = toplamGelir - toplamGider;
  const toplamSatis = satislar.reduce((sum, satis) => sum + (satis.miktar * satis.birimFiyat), 0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Genel Bakış</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500">Toplam Gelir</h3>
          <p className="text-2xl font-bold text-green-600">{toplamGelir.toFixed(2)} ₺</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500">Toplam Gider</h3>
          <p className="text-2xl font-bold text-red-600">{toplamGider.toFixed(2)} ₺</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500">Net Kar</h3>
          <p className={`text-2xl font-bold ${
            netKar >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {netKar.toFixed(2)} ₺
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500">Toplam Satış</h3>
          <p className="text-2xl font-bold text-blue-600">{toplamSatis.toFixed(2)} ₺</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-2">Son Gelirler</h3>
          <ul className="space-y-2">
            {gelirler.slice(0, 5).map(gelir => (
              <li key={gelir.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <span>{gelir.aciklama}</span>
                  <span className="block text-xs text-gray-500">
                    {gelir.tarih.toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <span className="text-green-600">+{gelir.miktar.toFixed(2)} ₺</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-2">Son Giderler</h3>
          <ul className="space-y-2">
            {giderler.slice(0, 5).map(gider => (
              <li key={gider.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <span>{gider.aciklama}</span>
                  <span className="block text-xs text-gray-500">
                    {gider.tarih.toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <span className="text-red-600">-{gider.miktar.toFixed(2)} ₺</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-2">Son Satışlar</h3>
          <ul className="space-y-2">
            {satislar.slice(0, 5).map(satis => (
              <li key={satis.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <span>{satis.urunAdi}</span>
                  <span className="block text-xs text-gray-500">
                    {satis.musteri} - {satis.tarih.toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <span className="text-blue-600">
                  {(satis.miktar * satis.birimFiyat).toFixed(2)} ₺
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}