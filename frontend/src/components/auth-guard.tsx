'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('gascontrol_user');
    if (!user) {
      router.replace('/');
    } else {
      setAutorizado(true);
    }

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted && !localStorage.getItem('gascontrol_user')) {
        window.location.href = '/';
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, [router]);

  if (!autorizado) return null;

  return <>{children}</>;
}