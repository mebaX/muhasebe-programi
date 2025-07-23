// src/components/TransactionForm.tsx
'use client';
import { useState } from 'react';
import PersonCombobox from './PersonCombobox';

export default function TransactionForm({ type }: { type: 'income' | 'expense' }) {
  const [form, setForm] = useState({
    personName: '',
    personId: null as number | null,
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.personName || !form.amount) {
      alert('Lütfen zorunlu alanları doldurun');
      return;
    }

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personName: form.personName,
          personId: form.personId,
          amount: parseFloat(form.amount),
          description: form.description,
          date: form.date,
          type
        })
      });

      if (response.ok) {
        alert('İşlem başarıyla kaydedildi!');
        setForm({
          personName: '',
          personId: null,
          amount: '',
          description: '',
          date: new Date().toISOString().split('T')[0]
        });
      }
    } catch (error) {
      console.error('Hata:', error);
      alert('Kayıt sırasında hata oluştu');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded bg-white">
      <h2 className="text-lg font-semibold">
        {type === 'income' ? 'Yeni Alacak' : 'Yeni Borç'} Ekle
      </h2>

      <div>
        <label className="block mb-1 text-sm font-medium">
          {type === 'income' ? 'Müşteri' : 'Tedarikçi'} *
        </label>
        <PersonCombobox
          type={type === 'income' ? 'customer' : 'supplier'}
          value={form.personName}
          onChange={(value) => setForm({...form, personName: value})}
          onSelect={(person) => {
            setForm({
              ...form,
              personName: person.name,
              personId: person.id
            });
          }}
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Tutar (₺) *</label>
        <input
          type="number"
          value={form.amount}
          onChange={(e) => setForm({...form, amount: e.target.value})}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Açıklama</label>
        <input
          type="text"
          value={form.description}
          onChange={(e) => setForm({...form, description: e.target.value})}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Tarih</label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({...form, date: e.target.value})}
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        type="submit"
        className={`w-full px-4 py-2 text-white rounded ${
          type === 'income' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
        }`}
      >
        {type === 'income' ? 'Alacak Ekle' : 'Borç Ekle'}
      </button>
    </form>
  );
}