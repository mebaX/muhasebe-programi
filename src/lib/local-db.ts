// Tipler
type TaksitPlanı = {
  taksitSayisi: number;
  taksitTutari: number;
  taksitAraligi: number; // gün cinsinden
  baslangicTarihi: Date;
};

type Gelir = {
  id: string;
  tarih: Date;
  miktar: number;
  aciklama: string;
  kategori: 'makine_satisi' | 'yedek_parca' | 'servis' | 'diger';
  taksitliMi: boolean;
  taksitPlanı?: TaksitPlanı;
  tamamlananTaksitler: number;
};

type Gider = {
  id: string;
  tarih: Date;
  miktar: number;
  aciklama: string;
  kategori: 'maas' | 'kira' | 'bakim' | 'malzeme' | 'diger';
  taksitliMi: boolean;
  taksitPlanı?: TaksitPlanı;
  tamamlananTaksitler: number;
};

type Satis = {
  id: string;
  tarih: Date;
  urunAdi: string;
  miktar: number;
  birimFiyat: number;
  musteri: string;
};

// Veritabanı
let gelirler: Gelir[] = [];
let giderler: Gider[] = [];
let satislar: Satis[] = [];

export const db = {
  // Gelir İşlemleri
  getGelirler: () => gelirler,
  getGelirById: (id: string) => gelirler.find(g => g.id === id),
  addGelir: (gelir: Omit<Gelir, 'id'>) => {
    const newGelir = { 
      ...gelir, 
      id: Date.now().toString(),
      taksitPlanı: gelir.taksitliMi ? {
        ...gelir.taksitPlanı!,
        taksitTutari: gelir.miktar / gelir.taksitPlanı!.taksitSayisi
      } : undefined,
      tamamlananTaksitler: 0
    };
    gelirler.push(newGelir);
    return newGelir;
  },
  updateGelir: (id: string, updates: Partial<Gelir>) => {
    const index = gelirler.findIndex(g => g.id === id);
    if (index !== -1) {
      gelirler[index] = { ...gelirler[index], ...updates };
      return gelirler[index];
    }
    return null;
  },
  deleteGelir: (id: string) => {
    gelirler = gelirler.filter(g => g.id !== id);
  },
  taksitOdeGelir: (id: string, adet: number = 1) => {
    const gelir = gelirler.find(g => g.id === id);
    if (gelir && gelir.taksitliMi) {
      gelir.tamamlananTaksitler = Math.min(
        gelir.tamamlananTaksitler + adet,
        gelir.taksitPlanı!.taksitSayisi
      );
      return true;
    }
    return false;
  },

  // Gider İşlemleri
  getGiderler: () => giderler,
  getGiderById: (id: string) => giderler.find(g => g.id === id),
  addGider: (gider: Omit<Gider, 'id'>) => {
    const newGider = { 
      ...gider, 
      id: Date.now().toString(),
      taksitPlanı: gider.taksitliMi ? {
        ...gider.taksitPlanı!,
        taksitTutari: gider.miktar / gider.taksitPlanı!.taksitSayisi
      } : undefined,
      tamamlananTaksitler: 0
    };
    giderler.push(newGider);
    return newGider;
  },
  updateGider: (id: string, updates: Partial<Gider>) => {
    const index = giderler.findIndex(g => g.id === id);
    if (index !== -1) {
      giderler[index] = { ...giderler[index], ...updates };
      return giderler[index];
    }
    return null;
  },
  deleteGider: (id: string) => {
    giderler = giderler.filter(g => g.id !== id);
  },
  taksitOdeGider: (id: string, adet: number = 1) => {
    const gider = giderler.find(g => g.id === id);
    if (gider && gider.taksitliMi) {
      gider.tamamlananTaksitler = Math.min(
        gider.tamamlananTaksitler + adet,
        gider.taksitPlanı!.taksitSayisi
      );
      return true;
    }
    return false;
  },

  // Satış İşlemleri
  getSatislar: () => satislar,
  getSatisById: (id: string) => satislar.find(s => s.id === id),
  addSatis: (satis: Omit<Satis, 'id'>) => {
    const newSatis = { 
      ...satis, 
      id: Date.now().toString(),
      tarih: new Date(satis.tarih)
    };
    satislar.push(newSatis);
    return newSatis;
  },
  updateSatis: (id: string, updates: Partial<Satis>) => {
    const index = satislar.findIndex(s => s.id === id);
    if (index !== -1) {
      satislar[index] = { ...satislar[index], ...updates };
      return satislar[index];
    }
    return null;
  },
  deleteSatis: (id: string) => {
    satislar = satislar.filter(s => s.id !== id);
  },

  // Veri Kalıcılığı
  saveToLocalStorage: () => {
    localStorage.setItem('nissa-muhasebe', JSON.stringify({
      gelirler,
      giderler,
      satislar
    }));
  },
  loadFromLocalStorage: () => {
    const data = localStorage.getItem('nissa-muhasebe');
    if (data) {
      const parsed = JSON.parse(data);
      
      gelirler = parsed.gelirler?.map((g: any) => ({
        ...g,
        tarih: new Date(g.tarih),
        taksitPlanı: g.taksitPlanı ? {
          ...g.taksitPlanı,
          baslangicTarihi: new Date(g.taksitPlanı.baslangicTarihi)
        } : undefined
      })) || [];

      giderler = parsed.giderler?.map((g: any) => ({
        ...g,
        tarih: new Date(g.tarih),
        taksitPlanı: g.taksitPlanı ? {
          ...g.taksitPlanı,
          baslangicTarihi: new Date(g.taksitPlanı.baslangicTarihi)
        } : undefined
      })) || [];

      satislar = parsed.satislar?.map((s: any) => ({
        ...s,
        tarih: new Date(s.tarih)
      })) || [];
    }
  }
};

// Uygulama başladığında verileri yükle
if (typeof window !== 'undefined') {
  db.loadFromLocalStorage();
}