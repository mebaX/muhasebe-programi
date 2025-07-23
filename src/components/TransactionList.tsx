'use client';
import { useState } from 'react';

interface Transaction {
  id: number;
  person_name: string;
  amount: number;
  description: string;
  date: string;
  is_paid: boolean;
}

export default function TransactionList({ 
  transactions,
  type
}: {
  transactions: Transaction[];
  type: 'income' | 'expense';
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [localTransactions, setLocalTransactions] = useState(transactions);

  const filteredTransactions = localTransactions.filter(t =>
    t.person_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const togglePaymentStatus = async (id: number, currentStatus: boolean) => {
    const response = await fetch(`/api/transactions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_paid: !currentStatus })
    });
    
    if (response.ok) {
      window.location.reload();
    }
  };

  const handleDelete = async (id: number) => {
    const response = await fetch('/api/transactions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (response.ok) {
      setLocalTransactions(localTransactions.filter(t => t.id !== id));
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Ara..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 border rounded w-full mb-4"
      />

      <div className="space-y-2">
        {filteredTransactions.map((t) => (
          <div 
            key={t.id} 
            className={`p-4 border rounded ${
              type === 'income' ? 'bg-green-50' : 'bg-red-50'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{t.person_name}</h3>
                <p className="text-sm text-gray-600">{t.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(t.date).toLocaleDateString('tr-TR')}
                </p>
              </div>
              
              <div className="text-right space-y-2">
                <p className={`font-bold ${
                  type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {t.amount.toFixed(2)} ₺
                </p>
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={!!t.is_paid}
                    onChange={() => togglePaymentStatus(t.id, t.is_paid)}
                  />
                  <span>{t.is_paid ? 'Ödendi' : 'Bekliyor'}</span>
                </label>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded mt-2"
                  onClick={() => handleDelete(t.id)}
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}