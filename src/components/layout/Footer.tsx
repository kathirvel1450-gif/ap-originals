'use client';

import React from 'react';
import Link from 'next/link';
import { Leaf, Phone, Mail, MapPin } from 'lucide-react';
import { useStore } from '@/lib/StoreContext';

export default function Footer() {
  const { storeSettings } = useStore();
  
  return (
    <footer className="bg-[#111111] text-white pt-16 pb-8 border-t border-[#222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <Leaf className="w-7 h-7 text-primary-600 group-hover:scale-110 transition-transform" />
              <span className="font-heading font-extrabold text-2xl tracking-tight text-white block">
                {storeSettings.appName}
              </span>
            </Link>
            <p className="text-white text-base mb-6 leading-relaxed font-medium">
              {storeSettings.appTagline}
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-white hover:text-accent-400 transition-colors p-2 bg-[#222] rounded-full hover:bg-[#333]">
                <Phone className="w-5 h-5" />
              </a>
              <a href="#" className="text-white hover:text-accent-400 transition-colors p-2 bg-[#222] rounded-full hover:bg-[#333]">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="text-white hover:text-accent-400 transition-colors p-2 bg-[#222] rounded-full hover:bg-[#333]">
                <MapPin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-heading font-bold text-xl text-white mb-6 uppercase tracking-wider">Shop</h3>
            <ul className="space-y-4">
              <li><Link href="/shop" className="text-white font-semibold hover:text-accent-400 text-base transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>All Products</Link></li>
              <li><Link href="/shop?category=Oils" className="text-white font-semibold hover:text-accent-400 text-base transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>Cold Pressed Oils</Link></li>
              <li><Link href="/shop?category=Flours" className="text-white font-semibold hover:text-accent-400 text-base transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>Organic Flours</Link></li>
              <li><Link href="/shop?category=Honey" className="text-white font-semibold hover:text-accent-400 text-base transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>Forest Honey</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-bold text-xl text-white mb-6 uppercase tracking-wider">Help</h3>
            <ul className="space-y-4">
              <li><Link href="#" className="text-white font-semibold hover:text-accent-400 text-base transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>Track Order</Link></li>
              <li><Link href="#" className="text-white font-semibold hover:text-accent-400 text-base transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>Shipping & Returns</Link></li>
              <li><Link href="#" className="text-white font-semibold hover:text-accent-400 text-base transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>FAQs</Link></li>
              <li><Link href="#" className="text-white font-semibold hover:text-accent-400 text-base transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary-600 rounded-full"></span>Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-heading font-bold text-xl text-white mb-6 uppercase tracking-wider">Newsletter</h3>
            <p className="text-white text-base mb-4 font-medium">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
            <form className="mt-4" onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-white text-[#111] placeholder:text-gray-500 px-5 py-3.5 rounded-lg w-full text-base font-semibold outline-none focus:ring-4 focus:ring-primary-600/50 shadow-inner"
                />
                <button className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3.5 rounded-lg font-bold transition-colors text-base whitespace-nowrap shadow-md">
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-[#333] text-center md:text-left md:flex justify-between items-center text-white font-medium text-sm">
          <p>&copy; {new Date().getFullYear()} {storeSettings.appName}. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-accent-400 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-accent-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
