'use client';

import { useParams } from 'next/navigation';
import { db } from '@/lib/local-db';

export default function SatisDetay() {
  const { id } = useParams();
  const satis = db.getSatislar().find(s => s.id === id);

  if (!satis) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Satış Bulunamadı</h1>
        <p>Belirtilen ID ile bir satış kaydı bulunamadı.</p>
      </div>
    );
  }

  const toplamTutar = satis.miktar * satis.birimFiyat;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Satış Detayları</h1>
      
      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h2 className="text-sm font-medium text-gray-500">Tarih</h2>
            <p>{satis.tarih.toLocaleDateString('tr-TR')}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Müşteri</h2>
            <p>{satis.musteri}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Ürün Adı</h2>
            <p>{satis.urunAdi}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Miktar</h2>
            <p>{satis.miktar}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Birim Fiyat</h2>
            <p>{satis.birimFiyat.toFixed(2)} ₺</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Toplam Tutar</h2>
            <p className="text-green-600 font-bold">{toplamTutar.toFixed(2)} ₺</p>
          </div>
        </div>

        <div className="flex space-x-4">
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