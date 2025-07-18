import '@/styles/globals.css';
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className="bg-gray-50">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1">
            <Navbar />
            <main className="p-4">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}