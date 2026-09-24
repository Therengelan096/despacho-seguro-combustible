'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });

      localStorage.setItem('gascontrol_user', username);
      localStorage.setItem('gascontrol_rol', data.rol || 'OPERADOR');

      toast.success('Sesión iniciada correctamente.');

      // Si es admin va a sus métricas, si es trabajador va a su terminal
      if (data.rol === 'ADMINISTRADOR') {
        router.push('/dashboard');
      } else {
        router.push('/dashboard/bomba');
      }

    } catch (error: any) {
      toast.error(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#001427] flex items-center justify-center p-4 md:p-6 lg:p-8 font-sans overflow-y-auto">
      <div className="w-full max-w-5xl bg-[#001D3D] rounded-3xl shadow-2xl overflow-hidden border border-blue-900/40 flex flex-col lg:flex-row min-h-[640px]">

        <div className="w-full lg:w-7/12 relative flex flex-col justify-between p-6 md:p-8 lg:p-12 min-h-[250px] sm:min-h-[300px] lg:min-h-full">
          <img
            src="https://www.ypfb.gob.bo/sites/default/files/2026-09/WhatsApp%20Image%202026-09-17%20at%2011.38.10%20%283%29.jpeg"
            alt="Operaciones YPFB"
            className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#001427] via-[#002855]/80 to-[#001D3D]/90 z-10"></div>

          <div className="relative z-20 flex flex-col justify-between h-full space-y-4 lg:space-y-6">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-2xl shadow-lg p-1.5 flex items-center justify-center relative shrink-0">
                <img
                  src="https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/YPFB_Logo.svg/1280px-YPFB_Logo.svg.png"
                  alt="Logo YPFB"
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <span className="text-white font-extrabold text-lg lg:text-xl tracking-tight">YPFB</span>
                  <span className="text-amber-400 font-extrabold text-lg lg:text-xl">GasControl</span>
                </div>
                <p className="text-blue-200/90 text-[9px] lg:text-[10px] font-bold uppercase tracking-wider">
                  SISTEMA DE CONTROL DE SURTIDORES
                </p>
              </div>
            </div>

            <div className="space-y-3 lg:space-y-4 mt-auto">
              <div className="inline-flex items-center space-x-2 bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-full backdrop-blur-md w-max">
                <span className="text-amber-300 text-[10px] lg:text-xs font-semibold tracking-wide">Red YPFB Corporativa Bolivia</span>
              </div>
              <h2 className="text-white text-xl md:text-2xl lg:text-3xl font-extrabold leading-tight tracking-tight">
                Gestión inteligente para estaciones de servicio.
              </h2>
            </div>
            <p className="text-[10px] lg:text-[11px] text-blue-300/60 font-medium hidden sm:block">
              © 2026 YPFB Corporación. Todos los derechos reservados.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-5/12 bg-[#001833] p-6 md:p-8 lg:p-12 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-blue-900/50 z-20">
          <div className="w-full max-w-sm mx-auto space-y-5 lg:space-y-6">
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-white">Iniciar Sesión</h3>
              <p className="text-[11px] lg:text-xs text-blue-300/80 mt-1">Ingresa tus credenciales autorizadas para acceder al panel.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] lg:text-xs font-semibold text-blue-200 uppercase tracking-wider mb-1.5">Usuario</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin_surtidor"
                  disabled={loading}
                  required
                  className="w-full px-4 py-3 bg-[#000F1F] text-white text-sm rounded-xl border border-blue-800/80 focus:ring-2 focus:ring-amber-400 outline-none transition-all placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-[10px] lg:text-xs font-semibold text-blue-200 uppercase tracking-wider mb-1.5">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                    required
                    className="w-full px-4 py-3 pr-12 bg-[#000F1F] text-white text-sm rounded-xl border border-blue-800/80 focus:ring-2 focus:ring-amber-400 outline-none transition-all placeholder-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-blue-400 hover:text-amber-400 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-[#001427] font-extrabold rounded-xl shadow-lg transition-all duration-200 text-xs tracking-wider uppercase mt-4 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Verificando...
                  </>
                ) : (
                  'INGRESAR AL SISTEMA'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}