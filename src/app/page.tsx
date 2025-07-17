import PaymentWrapper from '@/components/PaymentWrapper';
import ReportViewer from '@/components/ReportViewer';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-6 text-gray-800">
      <h1 className="text-3xl font-bold text-center mb-6">Muhasebe Takip Sistemi</h1>
      <ReportViewer />
      <PaymentWrapper />
    </main>
  );
}
