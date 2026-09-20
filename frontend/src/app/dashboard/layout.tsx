// src/app/dashboard/layout.tsx
import Sidebar from '@/components/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar/>
      
      {/* El main toma el 85% restante de la pantalla */}
      <main className="w-[85%] bg-white p-8">
        {children}
      </main>
    </div>
  );
}