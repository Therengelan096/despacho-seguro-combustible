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
    <main className="min-h-screen w-full bg-green-950 flex items-center justify-center p-4 md:p-6 lg:p-8 font-sans overflow-y-auto">
      <div className="w-full max-w-5xl bg-green-900 rounded-3xl shadow-2xl overflow-hidden border border-green-800/40 flex flex-col lg:flex-row min-h-[500px]">

        <div className="w-full lg:w-7/12 relative flex flex-col justify-between p-6 md:p-8 lg:p-10 min-h-[250px] sm:min-h-[300px] lg:min-h-full">
          <img
            src="/images/fondo-surtidor.jpg"
            alt="Operaciones"
            className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-green-950 via-green-900/80 to-green-950/90 z-10"></div>

          <div className="relative z-20 flex flex-col justify-between h-full space-y-4 lg:space-y-6">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 lg:w-14 lg:h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center relative shrink-0 overflow-hidden border-2 border-white">
                <img
                  src="/images/LogoGasolina.jpg"
                  alt="Logo"
                  className="w-full h-full object-cover scale-[1.8]"
                />
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <span className="text-white font-extrabold text-lg lg:text-xl tracking-tight">GAM</span>
                  <span className="text-amber-500 font-extrabold text-lg lg:text-xl">Cajuata - Siquimirani</span>
                </div>
                <p className="text-green-200/90 text-[9px] lg:text-[10px] font-bold uppercase tracking-wider">
                  SISTEMA DE CONTROL DE SURTIDOR
                </p>
              </div>
            </div>

            <div className="space-y-3 lg:space-y-4 mt-auto">
              <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full backdrop-blur-md w-max">
                <span className="text-amber-400 text-[10px] lg:text-xs font-semibold tracking-wide">Gestión Municipal con Resultados</span>
              </div>
              <h2 className="text-white text-xl md:text-2xl lg:text-3xl font-extrabold leading-tight tracking-tight">
                Gestión inteligente de distribución de combustible para los distritos de Cajuata y Siquimirani.
              </h2>
            </div>
            <p className="text-[10px] lg:text-[11px] text-green-300/60 font-medium hidden sm:block">
              © 2026 Gobierno Autónomo Municipal de Inquisivi. Todos los derechos reservados.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-5/12 bg-green-900/60 p-6 md:p-8 lg:p-10 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-green-800/50 z-20">
          <div className="w-full max-w-sm mx-auto space-y-4">
            <div>
              <h3 className="text-lg lg:text-xl font-bold text-white">Iniciar Sesión</h3>
              <p className="text-[11px] lg:text-xs text-green-300/80 mt-1">Ingresa tus credenciales autorizadas para acceder al panel.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="block text-[10px] lg:text-xs font-semibold text-green-200 uppercase tracking-wider mb-1.5">Usuario</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin_surtidor"
                  disabled={loading}
                  required
                  className="w-full px-4 py-3 bg-green-950 text-white text-sm rounded-xl border border-green-700/80 focus:ring-2 focus:ring-amber-500 outline-none transition-all placeholder-green-700"
                />
              </div>

              <div>
                <label className="block text-[10px] lg:text-xs font-semibold text-green-200 uppercase tracking-wider mb-1.5">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                    required
                    className="w-full px-4 py-3 pr-12 bg-green-950 text-white text-sm rounded-xl border border-green-700/80 focus:ring-2 focus:ring-amber-500 outline-none transition-all placeholder-green-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-green-400 hover:text-amber-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-green-950 font-extrabold rounded-xl shadow-lg transition-all duration-200 text-xs tracking-wider uppercase disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
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