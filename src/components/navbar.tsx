export default function Navbar() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-xl font-bold text-green-800">Nissa Muhasebe</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Hoş Geldiniz</span>
          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-xs font-medium">NS</span>
          </div>
        </div>
      </div>
    </header>
  );
}