'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Search, Car, User, ShieldCheck, ShieldAlert, ChevronLeft, Loader2, Gauge, Home, Info, Fuel } from 'lucide-react';
import { apiFetch } from '@/lib/api';

const VehicleViewer = dynamic(
  () => import('@/components/bomba/vehicle-viewer'),
  {
    ssr: false,
    loading: () => (
      <div className="h-56 w-full animate-pulse rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-[10px] uppercase tracking-widest">
        Cargando modelo 3D...
      </div>
    ),
  }
);

export function VisorMovil() {
  const [view, setView] = useState<'home' | 'dashboard' | 'info'>('home');
  const [ci, setCi] = useState('');
  const [placa, setPlaca] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  const [error, setError] = useState('');

  const consultar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await apiFetch('/visor/consulta', {
        method: 'POST',
        body: JSON.stringify({ ci, placa: placa.toUpperCase() })
      });
      setResultado(data);
      setView('dashboard');
    } catch (err: any) {
      setError(err.message || 'Credenciales incorrectas o vehículo no encontrado.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResultado(null);
    setCi('');
    setPlaca('');
    setView('home');
  };

  return (
    <section className="h-[100dvh] w-full bg-slate-50 md:bg-slate-200 md:flex md:items-center md:justify-center md:p-4 font-sans overflow-hidden">
      <div className="w-full h-full md:w-[400px] md:h-[780px] md:rounded-[2.5rem] md:border-[12px] md:border-white md:shadow-2xl bg-slate-50 relative flex flex-col overflow-hidden">

        {view === 'home' && (
          <div className="flex-1 flex flex-col animate-in fade-in duration-300 overflow-y-auto">
            <div className="bg-white pt-10 pb-6 px-6 border-b-4 border-amber-500 shadow-sm relative z-10 shrink-0">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  {/* Cambio de Logo al Municipal con el parche del zoom */}
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.08)] overflow-hidden border-2 border-white">
                    <img src="/images/LogoGasolina.jpg" alt="Logo" className="w-full h-full object-cover scale-[1.8]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-green-900 font-black text-xl font-display tracking-tight leading-none">GAM<span className="text-amber-500 ml-0.5">Inquisivi</span></span>
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Distrito Cajuata - Siquimirani</span>
                  </div>
                </div>
                <Link href="/" className="text-slate-400 hover:text-amber-500 transition-colors p-2 bg-slate-50 rounded-full">
                  <ChevronLeft size={20} />
                </Link>
              </div>
              <h1 className="text-2xl font-black text-slate-800 leading-tight">Consulta de<br/><span className="text-green-800">Cupo Asignado</span></h1>
            </div>

            <div className="px-5 py-8 relative z-20 flex-1 bg-slate-50 pb-28">
              <form onSubmit={consultar} className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase ml-1 tracking-wider">Carnet de Identidad</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      required
                      value={ci}
                      onChange={(e) => setCi(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:border-green-700 focus:bg-white focus:ring-4 focus:ring-green-700/20 transition-all font-mono font-semibold text-sm"
                      placeholder="Ej. 1234567"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-bold uppercase ml-1 tracking-wider">Placa del Vehículo</label>
                  <div className="relative">
                    <Car className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      required
                      value={placa}
                      onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:border-green-700 focus:bg-white focus:ring-4 focus:ring-green-700/20 transition-all font-mono font-bold uppercase tracking-widest text-sm"
                      placeholder="Ej. 1234ABC"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-semibold flex items-start gap-2 border border-red-100">
                    <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !ci || !placa}
                  className="w-full bg-green-700 hover:bg-green-800 text-white font-black uppercase py-4 rounded-2xl shadow-lg mt-2 active:scale-95 transition-all tracking-widest text-xs flex items-center justify-center disabled:opacity-60"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : "Verificar Saldo"}
                </button>
              </form>
            </div>
          </div>
        )}

        {view === 'dashboard' && resultado && (
          <div className="flex-1 flex flex-col animate-in slide-in-from-right duration-300 overflow-y-auto pb-28">
            <div className="bg-white px-5 pt-8 pb-6 md:pt-10 shadow-sm relative z-10 border-b-4 border-green-700 shrink-0">
              <div className="flex justify-between items-center mb-6">
                <button onClick={() => setView('home')} className="p-2 -ml-2 bg-slate-100 text-slate-600 rounded-full active:scale-95 transition-all">
                  <ChevronLeft size={20} />
                </button>
                <span className="font-black text-green-800 text-xs uppercase tracking-widest flex items-center gap-1.5">
                  <Fuel size={14} /> Gasolinera Local
                </span>
                <div className="w-10"></div>
              </div>

              <div className="w-full relative h-[280px] md:h-[320px]">
                <VehicleViewer tipoVehiculo={resultado.tipo} />
              </div>
            </div>

            <div className="flex-1 bg-slate-50 px-5 py-8 space-y-6 relative z-20">
              <div className="bg-white p-5 rounded-3xl shadow-md border-l-8 border-amber-500 flex flex-col gap-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-400 font-bold text-[10px] tracking-widest uppercase mb-1">Placa Registrada</p>
                    <p className="text-slate-900 text-2xl font-mono font-black tracking-widest">
                      {resultado.placa}
                    </p>
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider ${resultado.estadoVehiculo === 'ACTIVO' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                    {resultado.estadoVehiculo === 'ACTIVO' ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                    {resultado.estadoVehiculo}
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-slate-400 text-[10px] uppercase tracking-wider font-bold mb-0.5">Propietario</p>
                  <h2 className="text-sm font-bold text-slate-700 truncate">
                    {resultado.nombrePropietario}
                  </h2>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-800">
                      <Gauge size={16} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Cupo Disponible</span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-slate-900 font-display leading-none">
                      {resultado.cupoDisponible.toFixed(1)} <span className="text-[11px] font-bold text-slate-400">/ {resultado.cupoMaximo} L</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="h-5 w-full bg-slate-100 rounded-full overflow-hidden flex border border-slate-200 p-0.5">
                    <div style={{ width: `${(resultado.litrosConsumidos / resultado.cupoMaximo) * 100}%` }} className="bg-slate-300 h-full rounded-full transition-all duration-1000"></div>
                    <div style={{ width: `${(resultado.cupoDisponible / resultado.cupoMaximo) * 100}%` }} className={`h-full rounded-full transition-all duration-1000 ml-0.5 ${resultado.cupoDisponible <= 0 ? 'bg-red-500' : 'bg-green-700'}`}></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
                    <span>Consumo: {resultado.litrosConsumidos.toFixed(1)}L</span>
                    <span className={resultado.cupoDisponible <= 0 ? 'text-red-500' : 'text-green-700'}>
                      Restante: {resultado.cupoDisponible.toFixed(1)}L
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'info' && (
          <div className="flex-1 flex flex-col animate-in slide-in-from-right duration-300 overflow-y-auto pb-28 bg-slate-50 p-6">
            <div className="flex justify-between items-center mb-6 pt-6">
              <button onClick={() => setView('home')} className="p-2 bg-slate-100 text-slate-600 rounded-full active:scale-95 transition-all">
                <ChevronLeft size={20} />
              </button>
              <span className="font-black text-green-800 text-xs uppercase tracking-widest">Información Local</span>
              <div className="w-10"></div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
              <h2 className="font-bold text-slate-800 text-sm">Control de Surtidor Comunitario</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Este sistema opera de manera local en la estación de servicio para el control de cupos de combustible de las comunidades de <strong className="text-green-800">Cajuata</strong> y <strong className="text-green-800">Siquimirani</strong>.
              </p>
              <div className="bg-green-50 border border-green-100 p-3 rounded-2xl text-[11px] text-green-800 font-medium">
                Los cupos se renuevan automáticamente cada semana (Lunes a Domingo). Asegúrese de portar su tarjeta física NFC y su PIN de seguridad.
              </div>
            </div>
          </div>
        )}

        <div className="absolute bottom-0 w-full bg-white border-t border-slate-200 flex justify-around items-center py-2 pb-6 md:pb-3 md:rounded-b-[2.5rem] z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
          <button onClick={() => view !== 'home' ? setView('home') : null} className={`flex flex-col items-center p-2 transition-colors ${view === 'home' ? 'text-green-800' : 'text-slate-400 hover:text-slate-600'}`}>
            <Home size={20} className="mb-1" />
            <span className="text-[9px] font-bold tracking-wider uppercase">Inicio</span>
          </button>

          <button onClick={handleReset} className="relative -top-6 w-14 h-14 bg-amber-500 text-white rounded-full shadow-[0_8px_15px_rgba(245,158,11,0.3)] flex items-center justify-center border-4 border-slate-50 active:scale-95 transition-transform">
            <Search size={22} />
          </button>

          <button onClick={() => setView('info')} className={`flex flex-col items-center p-2 transition-colors ${view === 'info' ? 'text-green-800' : 'text-slate-400 hover:text-slate-600'}`}>
            <Info size={20} className="mb-1" />
            <span className="text-[9px] font-bold tracking-wider uppercase">Ayuda</span>
          </button>
        </div>
      </div>
    </section>
  );
}