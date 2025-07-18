import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="w-64 bg-green-800 text-white p-4">
      <h1 className="text-2xl font-bold mb-6">
        <Link href="/">Nissa Muhasebe</Link></h1>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link href="/dashboard" className="block p-2 hover:bg-green-700 rounded">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/gelirler" className="block p-2 hover:bg-green-700 rounded">
              Gelirler
            </Link>
          </li>
          <li>
            <Link href="/giderler" className="block p-2 hover:bg-green-700 rounded">
              Giderler
            </Link>
          </li>
          <li>
            <Link href="/satislar" className="block p-2 hover:bg-green-700 rounded">
              Satışlar
            </Link>
          </li>
          <li>
            <Link href="/raporlar" className="block p-2 hover:bg-green-700 rounded">
              Raporlar
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}