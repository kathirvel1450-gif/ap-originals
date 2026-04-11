'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/StoreContext';
import { ShoppingBag, Heart, Search, Menu, User, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { cartCount, wishlist, user, storeSettings, isAdmin } = useStore();
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button className="p-2 -ml-2 text-[#111] hover:text-primary-600 transition-colors">
              <Menu className="w-7 h-7" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex justify-center flex-1 md:justify-start">
            <Link href="/" className="flex items-center gap-2.5 group">
              <Leaf className="w-7 h-7 text-primary-600 group-hover:rotate-12 transition-transform" />
              <span className="font-heading font-extrabold text-[#111] text-2xl tracking-tight">
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
                className={`text-base font-bold uppercase tracking-wider transition-all hover:text-primary-600 ${
                  pathname === link.href
                    ? 'text-primary-600 border-b-2 border-primary-600 pb-1'
                    : 'text-[#111]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-5 justify-end flex-1 md:flex-none">
            <button className="p-2 text-[#111] hover:text-primary-600 transition-colors hidden sm:block">
              <Search className="w-6 h-6" />
            </button>
            
            <Link href="/cart" className="p-2 text-[#111] hover:text-primary-600 transition-colors relative">
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-extrabold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary-600 rounded-full shadow border-2 border-white"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>

            <Link href={user ? "/profile" : "/auth/login"} className="p-2 text-[#111] hover:text-primary-600 transition-colors">
              <User className="w-6 h-6" />
            </Link>
            {isAdmin && (
              <Link href="/admin" className="p-2 text-[#111] hover:text-primary-600 transition-colors ml-2 font-bold flex items-center border border-gray-200 rounded-md px-3 bg-gray-50 text-sm">
                Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
