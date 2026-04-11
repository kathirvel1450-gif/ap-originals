'use client';

import { useStore } from '@/lib/StoreContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, isLoadingData } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isLoadingData) {
      if (!isAdmin && pathname !== '/admin/login') {
        router.push('/admin/login');
      } else if (isAdmin && pathname === '/admin/login') {
        router.push('/admin');
      } else {
        setIsReady(true);
      }
    }
  }, [isAdmin, isLoadingData, pathname, router]);

  if (!isReady || isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {children}
    </div>
  );
}
