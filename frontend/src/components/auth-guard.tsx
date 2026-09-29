'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const user = typeof window !== 'undefined' ? localStorage.getItem('gascontrol_user') : null;
  const rol = typeof window !== 'undefined' ? localStorage.getItem('gascontrol_rol') : null;

  const faltaSesion = !user;

  // Regla 1: El Trabajador intenta salir de la bomba hacia administración
  const trabajadorBloqueado = rol === 'TRABAJADOR' && !pathname.startsWith('/dashboard/bomba');

  // Regla 2: El Administrador intenta entrar a la bomba de los trabajadores
  const adminBloqueado = rol === 'ADMINISTRADOR' && pathname.startsWith('/dashboard/bomba');

  useEffect(() => {
    if (!mounted) return;

    if (faltaSesion) {
      router.replace('/');
    } else if (trabajadorBloqueado) {
      toast.error('Acceso denegado: Área exclusiva de administración.');
      router.replace('/dashboard/bomba');
    } else if (adminBloqueado) {
      toast.error('Acceso denegado: El monitor de caseta es exclusivo para los trabajadores de turno.');
      router.replace('/dashboard');
    }
  }, [mounted, faltaSesion, trabajadorBloqueado, adminBloqueado, router, pathname]);

  if (!mounted) return null;
  if (faltaSesion || trabajadorBloqueado || adminBloqueado) return null;

  return <>{children}</>;
}