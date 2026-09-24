import { Bell } from 'lucide-react';
import Sidebar from '@/components/sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex overflow-hidden bg-slate-100 font-sans selection:bg-ypfb-blue selection:text-white">
      <Sidebar />

      <main className="flex-1 overflow-y-auto bg-slate-100 flex flex-col h-full">
        <header className="relative bg-white shadow-sm border-b border-gray-100 overflow-hidden min-h-[70px] flex items-center justify-between pl-16 lg:pl-6 pr-6 shrink-0">
          <div className="absolute inset-0 pointer-events-none z-0">
            <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none" fill="none">
              <path d="M650 0 C 800 90, 1000 110, 1200 60 L 1200 0 Z" fill="#00529B" />
              <path d="M550 0 C 750 120, 980 110, 1200 35 L 1200 0 Z" fill="#003366" fillOpacity="0.15" />
              <path d="M580 0 C 760 110, 990 100, 1200 48" stroke="#E31E24" strokeWidth="8" strokeLinecap="round" fill="none" />
              <path d="M570 0 C 750 110, 980 100, 1200 43" stroke="#D01017" strokeWidth="3" strokeLinecap="round" fill="none" />
            </svg>
          </div>

          <div className="relative z-10 flex items-center justify-between w-full">
            <div className="flex items-center space-x-3">
              <span className="bg-blue-50 text-[#00529B] font-semibold text-xs px-3 py-1.5 rounded-md border border-blue-100 tracking-wide shadow-sm font-sans">
                ESTACIÓN BERMEJO
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-emerald-50/90 backdrop-blur-sm border border-emerald-200/80 px-3 py-1.5 rounded-full shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-800 text-[10px] font-bold uppercase font-sans">Surtidor Conectado</span>
              </div>
              <button className="relative p-2 text-white hover:bg-white/10 rounded-full transition-all duration-200">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E31E24]"></span>
                </span>
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 flex-1 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}