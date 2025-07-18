'use client';

import { db } from '../../lib/local-db';

export default function Raporlar() {
  const gelirler = db.getGelirler();
  const giderler = db.getGiderler();
  const satislar = db.getSatislar();

  // Gelir raporu
  const gelirKategorileri = gelirler.reduce((acc, gelir) => {
    acc[gelir.kategori] = (acc[gelir.kategori] || 0) + gelir.miktar;
    return acc;
  }, {} as Record<string, number>);

  // Gider raporu
  const giderKategorileri = giderler.reduce((acc, gider) => {
    acc[gider.kategori] = (acc[gider.kategori] || 0) + gider.miktar;
    return acc;
  }, {} as Record<string, number>);

  // Aylık rapor
  const aylikRapor = [...gelirler, ...giderler].reduce((acc, item) => {
    const ay = item.tarih.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
    if (!acc[ay]) {
      acc[ay] = { gelir: 0, gider: 0 };
    }
    if ('urunAdi' in item) {
      // Satış ise gelir olarak ekle
      acc[ay].gelir += (item as any).miktar * (item as any).birimFiyat;
    } else if (gelirler.includes(item as any)) {
      acc[ay].gelir += item.miktar;
    } else {
      acc[ay].gider += item.miktar;
    }
    return acc;
  }, {} as Record<string, { gelir: number; gider: number }>);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Raporlar</h1>
      
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Gelir Dağılımı</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(gelirKategorileri).map(([kategori, miktar]) => (
              <div key={kategori} className="border p-3 rounded">
                <h3 className="font-medium">
                  {kategori === 'makine_satisi' && 'Makine Satışı'}
                  {kategori === 'yedek_parca' && 'Yedek Parça'}
                  {kategori === 'servis' && 'Servis Geliri'}
                  {kategori === 'diger' && 'Diğer'}
                </h3>
                <p className="text-green-600 text-lg font-bold">{miktar.toFixed(2)} ₺</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Gider Dağılımı</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(giderKategorileri).map(([kategori, miktar]) => (
              <div key={kategori} className="border p-3 rounded">
                <h3 className="font-medium">
                  {kategori === 'maas' && 'Maaş Ödemeleri'}
                  {kategori === 'kira' && 'Kira Gideri'}
                  {kategori === 'bakim' && 'Makine Bakım'}
                  {kategori === 'malzeme' && 'Malzeme Alımı'}
                  {kategori === 'diger' && 'Diğer Giderler'}
                </h3>
                <p className="text-red-600 text-lg font-bold">{miktar.toFixed(2)} ₺</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Aylık Kar/Zarar</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Ay</th>
                  <th className="p-2 text-right">Toplam Gelir</th>
                  <th className="p-2 text-right">Toplam Gider</th>
                  <th className="p-2 text-right">Net</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(aylikRapor).map(([ay, { gelir, gider }]) => (
                  <tr key={ay} className="border-t">
                    <td className="p-2">{ay}</td>
                    <td className="p-2 text-right text-green-600">{gelir.toFixed(2)} ₺</td>
                    <td className="p-2 text-right text-red-600">{gider.toFixed(2)} ₺</td>
                    <td className="p-2 text-right font-bold">
                      {(gelir - gider) >= 0 ? (
                        <span className="text-green-600">+{(gelir - gider).toFixed(2)} ₺</span>
                      ) : (
                        <span className="text-red-600">{(gelir - gider).toFixed(2)} ₺</span>
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