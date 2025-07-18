'use client';

import { useParams } from 'next/navigation';
import { db } from '@/lib/local-db';

export default function GiderDetay() {
  const { id } = useParams();
  const gider = db.getGiderById(id as string);

  if (!gider) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Gider Bulunamadı</h1>
        <p>Belirtilen ID ile bir gider kaydı bulunamadı.</p>
      </div>
    );
  }

  const gelecekTaksitTarihleri = gider.taksitliMi ? 
    Array.from({ length: gider.taksitPlanı!.taksitSayisi }, (_, i) => {
      const tarih = new Date(gider.taksitPlanı!.baslangicTarihi);
      tarih.setDate(tarih.getDate() + (i * gider.taksitPlanı!.taksitAraligi));
      return tarih;
    }) : [];

  const handleTaksitOde = () => {
    db.taksitOdeGider(gider.id);
    window.location.reload();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gider Detayları</h1>
      
      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h2 className="text-sm font-medium text-gray-500">Tarih</h2>
            <p>{gider.tarih.toLocaleDateString('tr-TR')}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Miktar</h2>
            <p className="text-red-600 font-bold">{gider.miktar.toFixed(2)} ₺</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Kategori</h2>
            <p>
              {gider.kategori === 'maas' && 'Maaş Ödemeleri'}
              {gider.kategori === 'kira' && 'Kira Gideri'}
              {gider.kategori === 'bakim' && 'Makine Bakım'}
              {gider.kategori === 'malzeme' && 'Malzeme Alımı'}
              {gider.kategori === 'diger' && 'Diğer Giderler'}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Ödeme Tipi</h2>
            <p>{gider.taksitliMi ? 'Taksitli' : 'Peşin'}</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-500">Açıklama</h2>
          <p className="mt-1">{gider.aciklama}</p>
        </div>

        {gider.taksitliMi && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Taksit Planı</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Taksit Sayısı</h3>
                <p>{gider.taksitPlanı!.taksitSayisi}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Taksit Tutarı</h3>
                <p>{gider.taksitPlanı!.taksitTutari.toFixed(2)} ₺</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Taksit Aralığı</h3>
                <p>{gider.taksitPlanı!.taksitAraligi} gün</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Tamamlanan</h3>
                <p>
                  {gider.tamamlananTaksitler} / {gider.taksitPlanı!.taksitSayisi} (
                  {((gider.tamamlananTaksitler / gider.taksitPlanı!.taksitSayisi) * 100).toFixed(0)}%)
                </p>
              </div>
            </div>

            <h3 className="font-medium mb-2">Taksit Takvimi</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">#</th>
                    <th className="p-2 text-left">Tarih</th>
                    <th className="p-2 text-left">Durum</th>
                    <th className="p-2 text-right">Tutar</th>
                  </tr>
                </thead>
                <tbody>
                  {gelecekTaksitTarihleri.map((tarih, index) => (
                    <tr 
                      key={index} 
                      className={index < gider.tamamlananTaksitler ? 'bg-green-50' : ''}
                    >
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2">{tarih.toLocaleDateString('tr-TR')}</td>
                      <td className="p-2">
                        {index < gider.tamamlananTaksitler ? (
                          <span className="text-green-600">Ödendi</span>
                        ) : (
                          <span className="text-gray-500">Bekliyor</span>
                        )}
                      </td>
                      <td className="p-2 text-right">{gider.taksitPlanı!.taksitTutari.toFixed(2)} ₺</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {gider.tamamlananTaksitler < gider.taksitPlanı!.taksitSayisi && (
              <div className="mt-4">
                <button
                  onClick={handleTaksitOde}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Sonraki Taksiti Öde
                </button>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex space-x-4">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={() => window.history.back()}
          >
            Geri Dön
          </button>
        </div>
      </div>
    </div>
  );
}