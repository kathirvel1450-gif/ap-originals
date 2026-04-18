'use client';

import { useStore } from '@/lib/StoreContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, isLoadingData } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isLoadingData) {
      if (!isAdmin && !pathname.includes('/admin/login')) {
        router.replace('/admin/login');
      } else if (isAdmin && pathname.includes('/admin/login')) {
        router.replace('/admin');
      } else {
        setIsReady(true);
      }
    }
  }, [isAdmin, isLoadingData, pathname, router]);

  if (!isReady || isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111]">
         <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] flex flex-col">
      {children}
    </div>
  );
}
