'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Fuel, Car, Users, LogOut, ChevronLeft, ChevronRight, Menu, X, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [nombreUsuario, setNombreUsuario] = useState('Usuario');
  const [rolUsuario, setRolUsuario] = useState('TRABAJADOR');

  useEffect(() => {
    setNombreUsuario(localStorage.getItem('gascontrol_user') || 'Usuario');
    const rolGuardado = localStorage.getItem('gascontrol_rol') || 'TRABAJADOR';
    setRolUsuario(rolGuardado);

    setIsMobileOpen(false);
    const handleResize = () => { if (window.innerWidth >= 1024) setIsMobileOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
      localStorage.removeItem('gascontrol_user');
      localStorage.removeItem('gascontrol_rol');
      toast.success('Sesión cerrada de forma segura');
      router.push('/');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  const navItems = [];

  if (rolUsuario === 'ADMINISTRADOR') {
    navItems.push(
      { id: 'dashboard', href: '/dashboard', icon: LayoutDashboard, label: 'MÉTRICAS' },
      { id: 'vehiculos', href: '/dashboard/vehiculos', icon: Car, label: 'VEHÍCULOS' },
      { id: 'propietarios', href: '/dashboard/propietarios', icon: Users, label: 'PROPIETARIOS' },
      { id: 'auditoria', href: '/dashboard/auditoria', icon: ShieldCheck, label: 'AUDITORÍA' }
    );
  } else {
    navItems.push(
      { id: 'bomba', href: '/dashboard/bomba', icon: Fuel, label: 'MONITOR CASETA' }
    );
  }

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-3 left-4 z-40 p-2.5 bg-green-950 text-white rounded-xl shadow-lg"
      >
        <Menu size={20} />
      </button>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:relative top-0 left-0 h-screen bg-green-950 text-white flex flex-col justify-between shrink-0 shadow-2xl lg:shadow-xl z-50 transition-all duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        <div>
          <div className="h-[70px] bg-gradient-to-b from-green-900 to-green-950 border-b border-white/10 flex items-center justify-between px-4 relative">
            <div className="flex items-center space-x-3 w-full overflow-hidden">
              <div className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center shrink-0 overflow-hidden border-2 border-white">
                <img
                  src="/images/LogoGasolina.jpg"
                  alt="Logo"
                  className="w-full h-full object-cover scale-[1.8]"
                />
              </div>
              <div className={`flex flex-col whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
                <div className="flex items-center">
                  <span className="text-white font-extrabold text-lg tracking-tight font-display">GAM</span>
                  <span className="text-amber-500 font-extrabold text-lg ml-1 font-display">Inquisivi</span>
                </div>
                <span className="text-green-200 text-[9px] font-semibold tracking-widest uppercase font-sans">Panel de control</span>
              </div>
            </div>
            <button onClick={() => setIsMobileOpen(false)} className="lg:hidden text-white/70 hover:text-white p-1 absolute right-4">
              <X size={20} />
            </button>
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute -right-3 top-[23px] bg-amber-500 text-green-950 p-1 rounded-full shadow-md hover:bg-amber-600 transition-colors z-50"
          >
            {isCollapsed ? <ChevronRight size={14} strokeWidth={3} /> : <ChevronLeft size={14} strokeWidth={3} />}
          </button>

          <nav className="p-3 space-y-2 text-sm font-medium font-sans mt-2 overflow-hidden">
            {navItems.map((item) => {
              const active = item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.includes(item.href);

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  title={isCollapsed ? item.label : ''}
                  className={`flex items-center px-3 py-3 rounded-xl transition-all duration-200 group ${
                    active ? 'bg-green-700 text-white shadow-md' : 'text-green-100 hover:bg-white/10 hover:text-white'
                  } ${isCollapsed ? 'justify-center' : 'space-x-3'}`}
                >
                  <item.icon className={`w-5 shrink-0 ${active ? 'scale-110' : 'group-hover:scale-110 transition-transform'}`} />
                  <span className={`text-xs font-bold whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10 bg-black/20 font-sans overflow-hidden">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} mb-4 transition-all duration-300`}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-lg shadow shrink-0 font-display ${
                rolUsuario === 'ADMINISTRADOR' ? 'bg-gradient-to-tr from-orange-600 to-amber-500 text-white' : 'bg-green-100 text-green-950'
            }`}>
              {nombreUsuario.charAt(0).toUpperCase()}
            </div>
            <div className={`flex-1 min-w-0 transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'}`}>
              <p className="text-sm font-bold text-white truncate capitalize">{nombreUsuario}</p>
              <p className="text-[9px] text-green-300 tracking-widest uppercase truncate">{rolUsuario}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title={isCollapsed ? "Cerrar Sesión" : ""}
            className={`flex items-center justify-center py-2.5 bg-white/5 hover:bg-red-600/90 text-green-200 hover:text-white rounded-lg text-xs font-semibold transition-colors w-full whitespace-nowrap ${isCollapsed ? 'px-0' : 'space-x-2 px-3'}`}
          >
            <LogOut size={16} className="shrink-0" />
            <span className={`transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'}`}>
              CERRAR SESIÓN
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}