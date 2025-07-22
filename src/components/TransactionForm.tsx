'use client';
import { useState } from 'react';
import PersonCombobox from './PersonCombobox';

export default function TransactionForm() {
  const [form, setForm] = useState({
    person: null as { id: number; name: string } | null,
    amount: '',
    description: '',
    type: 'income' as 'income' | 'expense'
  });

  const handleSubmit = async () => {
    if (!form.person) return alert('Kişi seçiniz');
    
    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        person_id: form.person.id,
        amount: parseFloat(form.amount),
        description: form.description,
        type: form.type
      })
    });

    if (response.ok) {
      alert('Kaydedildi!');
      setForm({
        person: null,
        amount: '',
        description: '',
        type: 'income'
      });
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded">
      <h2 className="text-xl font-bold">Yeni İşlem</h2>
      
      <div>
        <label className="block mb-1">İşlem Türü</label>
        <select
          value={form.type}
          onChange={(e) => setForm({...form, type: e.target.value as 'income' | 'expense'})}
          className="p-2 border rounded"
        >
          <option value="income">Alacak (Ödeme Alınacak)</option>
          <option value="expense">Borç (Ödeme Yapılacak)</option>
        </select>
      </div>

      <div>
        <label className="block mb-1">
          {form.type === 'income' ? 'Müşteri' : 'Tedarikçi'}
        </label>
        <PersonCombobox
          type={form.type === 'income' ? 'customer' : 'supplier'}
          onSelect={(person) => setForm({...form, person})}
        />
      </div>

      <div>
        <label className="block mb-1">Tutar</label>
        <input
          type="number"
          value={form.amount}
          onChange={(e) => setForm({...form, amount: e.target.value})}
          className="p-2 border rounded w-full"
        />
      </div>

      <div>
        <label className="block mb-1">Açıklama</label>
        <input
          type="text"
          value={form.description}
          onChange={(e) => setForm({...form, description: e.target.value})}
          className="p-2 border rounded w-full"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Kaydet
      </button>
    </div>
  );
}