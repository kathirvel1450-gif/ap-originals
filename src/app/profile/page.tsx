'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/StoreContext';
import { useToast } from '@/lib/ToastContext';
import { User, LogOut, Package, Heart } from 'lucide-react';

export default function Profile() {
  const router = useRouter();
  const { user, logout } = useStore();
  const { addToast } = useToast();

  React.useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'info');
    router.push('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <h1 className="text-3xl font-heading font-bold text-earth-900 dark:text-white mb-8">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Sidebar */}
        <div className="md:col-span-1 border border-earth-200 dark:border-earth-800 rounded-3xl p-6 bg-earth-50 dark:bg-earth-900/40 h-fit">
          <div className="flex flex-col items-center text-center mb-8 pb-8 border-b border-earth-200 dark:border-earth-800">
            <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
              <User className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-earth-900 dark:text-white">{user.name}</h2>
            <p className="text-earth-500">{user.mobile}</p>
          </div>

          <nav className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-white dark:bg-earth-800 text-primary-600 rounded-xl font-medium shadow-sm">
              <User className="w-5 h-5" /> Profile Settings
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white dark:hover:bg-earth-800 text-earth-700 dark:text-earth-300 rounded-xl font-medium transition-colors">
              <Package className="w-5 h-5" /> My Orders
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white dark:hover:bg-earth-800 text-earth-700 dark:text-earth-300 rounded-xl font-medium transition-colors">
              <Heart className="w-5 h-5" /> Wishlist
            </button>
            <div className="pt-4 mt-4 border-t border-earth-200 dark:border-earth-800">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-medium transition-colors"
              >
                <LogOut className="w-5 h-5" /> Sign Out
              </button>
            </div>
          </nav>
        </div>

        {/* Content */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white dark:bg-earth-900/40 border border-earth-200 dark:border-earth-800 rounded-3xl p-8">
            <h3 className="text-xl font-heading font-bold text-earth-900 dark:text-white mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div>
                 <label className="block text-sm text-earth-500 mb-1">Full Name</label>
                 <div className="font-medium text-earth-900 dark:text-white p-3 bg-earth-50 dark:bg-black/50 border border-earth-200 dark:border-earth-700 rounded-xl">
                    {user.name}
                 </div>
               </div>
               <div>
                 <label className="block text-sm text-earth-500 mb-1">Mobile Number</label>
                 <div className="font-medium text-earth-900 dark:text-white p-3 bg-earth-50 dark:bg-black/50 border border-earth-200 dark:border-earth-700 rounded-xl">
                    +91 {user.mobile}
                 </div>
               </div>
               <div className="sm:col-span-2">
                 <label className="block text-sm text-earth-500 mb-1">Email Address</label>
                 <div className="font-medium text-earth-400 p-3 bg-earth-50 dark:bg-black/50 border border-earth-200 dark:border-earth-700 rounded-xl">
                    Not provided
                 </div>
               </div>
            </div>
            <button className="mt-6 bg-earth-100 hover:bg-earth-200 dark:bg-earth-800 dark:hover:bg-earth-700 text-earth-900 dark:text-white px-6 py-2.5 rounded-full font-medium transition-colors">
              Edit Details
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
