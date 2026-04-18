'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/StoreContext';
import { ShoppingBag, Heart, Search, Menu, User, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { cartCount, wishlist, currentUser, storeSettings, isAdmin } = useStore();
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#000]/90 backdrop-blur-md border-b border-[#333] shadow-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button className="p-2 -ml-2 text-white hover:text-primary-500 transition-colors">
              <Menu className="w-7 h-7" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex justify-center flex-1 md:justify-start">
            <Link href="/" className="flex items-center gap-2.5 group">
              <Leaf className="w-7 h-7 text-primary-500 group-hover:rotate-12 transition-transform" />
              <span className="font-heading font-extrabold text-white text-2xl tracking-tight">
                {storeSettings.appName}
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-base font-bold uppercase tracking-wider transition-all hover:text-primary-500 ${
                  pathname === link.href
                    ? 'text-primary-500 border-b-2 border-primary-500 pb-1'
                    : 'text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-5 justify-end flex-1 md:flex-none">
            <button className="p-2 text-white hover:text-primary-500 transition-colors hidden sm:block">
              <Search className="w-6 h-6" />
            </button>
            
            <Link href="/cart" className="p-2 text-white hover:text-primary-500 transition-colors relative">
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-extrabold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary-600 rounded-full shadow border-2 border-[#111]"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>

            {currentUser && (
              <Link href="/orders" title="Track Orders" className="p-2 text-white hover:text-primary-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              </Link>
            )}

            <Link href={currentUser ? "/profile" : "/auth/login"} className="p-2 text-white hover:text-primary-500 transition-colors">
              <User className="w-6 h-6" />
            </Link>
            {isAdmin && (
              <Link href="/admin" className="p-2 text-white hover:text-[#111] hover:bg-white transition-colors ml-2 font-bold flex items-center border border-[#444] rounded-md px-3 bg-[#222] text-sm">
                Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
