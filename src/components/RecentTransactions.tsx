interface Transaction {
  id: number;
  amount: number;
  description?: string;
  date: string;
  type: string;
  product_name?: string; // Satışlar için
  title?: string;        // Diğer işlemler için
}

// src/components/RecentTransactions.tsx
interface RecentTransactionsProps {
  transactions: Transaction[];
  title: string;
}

export default function RecentTransactions({
  transactions,
  title,
}: RecentTransactionsProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>

      {transactions.length > 0 ? (
        <ul className="space-y-3">
          {transactions.map((transaction, idx) => (
            <li
              key={`${transaction.id}-${idx}`}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="font-medium">
                  {transaction.description ||
                    transaction.product_name ||
                    transaction.title ||
                    "Açıklama Yok"}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleDateString("tr-TR")}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  transaction.type === "income"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {Number(transaction.amount).toFixed(2)} ₺
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center py-4">
          Henüz kayıt bulunmamaktadır
        </p>
      )}
    </div>
  );
}
