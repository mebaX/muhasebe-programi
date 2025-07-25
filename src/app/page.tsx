import Link from 'next/link';
 //deneme
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold text-green-800 mb-8">Nissa Tarım Muhasebe Sistemi</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <Link href="/dashboard" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Dashboard</h2>
          <p className="text-gray-600">Genel muhasebe özetini görüntüleyin</p>
        </Link>
        <Link href="/gelirler" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Gelirler</h2>
          <p className="text-gray-600">Gelir kayıtlarını yönetin</p>
        </Link>
        <Link href="/giderler" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Giderler</h2>
          <p className="text-gray-600">Gider kayıtlarını yönetin</p>
        </Link>
        <Link href="/satislar" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Satışlar</h2>
          <p className="text-gray-600">Satış kayıtlarını görüntüleyin</p>
        </Link>
      </div>
    </div>
  );
}