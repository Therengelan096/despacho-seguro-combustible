// src/components/Sidebar.tsx
'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Fuel, History, Users, Car, LogOut, ShieldCheck } from 'lucide-react';

const navItems = [
  { href: '/dashboard/bomba', label: 'Bomba', icon: Fuel },
  { href: '/dashboard/historial', label: 'Historial', icon: History },
  { href: '/dashboard/propietarios', label: 'Propietarios', icon: Users },
  { href: '/dashboard/vehiculos', label: 'Vehículos', icon: Car },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
  localStorage.removeItem("token"); // limpia la sesión guardada
  router.push("/"); // redirige al inicio de sesión
};

  return (
    <aside
      className="h-screen min-w-[220px] flex flex-col justify-between bg-[#004a8e] text-white font-sans antialiased shadow-xl"
      style={{ width: '15%' }}
    >
      {/* cabecera del sidebar */}
      <div>
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="bg-[#f5d000] p-2.5 rounded-xl shadow-lg shrink-0">
            <ShieldCheck className="text-[#004a8e]" size={24} />
          </div>
          <div className="leading-tight">
            <h2 className="text-lg font-black uppercase tracking-tight">Mi App</h2>
            <p className="text-[11px] text-blue-200 font-medium">Panel de control</p>
          </div>
        </div>

        {/* enlaces de navegacion */}
        <nav className="flex flex-col gap-1.5 p-4">
          {navItems.map(({ href, label, icon: Icon }) => {
            const activo = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
                  activo
                    ? 'bg-[#f5d000] text-[#004a8e] shadow-md'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={18} className="shrink-0" />
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="group w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 text-white border border-white/15 font-black uppercase tracking-wider text-xs hover:bg-red-500 hover:border-red-500 transition-all active:scale-95"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}