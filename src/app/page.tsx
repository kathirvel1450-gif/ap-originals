'use client';
import React from 'react';
import Link from 'next/link';
import { bestSellers } from '@/lib/data';
import { useStore } from '@/lib/StoreContext';
import CategoryShowcase from '@/components/CategoryShowcase';
import ProductCard from '@/components/ProductCard';
import { ArrowRight, Star, ShieldCheck, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const { products, isLoadingData } = useStore();
  
  // Optionally map the static bestSellers IDs to the dynamic objects
  const bestSellerProducts = products.filter(p => bestSellers.includes(p.id)) || products.slice(0, 4);
  
  return (
    <div className="flex flex-col flex-1 w-full relative">
      
      {/* Hero Banner Section */}
      <section className="relative w-full h-[80vh] min-h-[600px] bg-earth-950 flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1628102491629-77858ab57202?auto=format&fit=crop&q=80&w=2000" 
            alt="Organic farming" 
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-earth-950/90 via-earth-900/70 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block py-1.5 px-4 rounded-full bg-accent-500/20 text-accent-400 font-bold text-sm mb-6 uppercase tracking-wider backdrop-blur-sm border border-accent-500/40 shadow-sm"
            >
              100% Pure & Natural
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-heading font-black text-[#ffffff] leading-tight mb-6 drop-shadow-lg"
            >
              Nourish Your Body with <span className="text-accent-400 drop-shadow-xl">Nature's Best.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-white mb-10 leading-relaxed font-medium shadow-black drop-shadow-md"
            >
              Experience the authentic taste and health benefits of cold-pressed oils, pure forest honey, and naturally grown groceries.
            </motion.p>

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 }}
               className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/shop" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-earth-900 bg-white rounded-full hover:bg-earth-100 hover:scale-105 transition-all duration-300">
                Shop Organic Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/shop?category=Oils" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white border-2 border-white/40 rounded-full hover:bg-white/10 hover:border-white/60 backdrop-blur-sm transition-all duration-300">
                Explore Oils
              </Link>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 flex items-center gap-8 border-t border-white/20 pt-8"
            >
              <div className="flex items-center gap-3">
                <Leaf className="w-6 h-6 text-primary-400 drop-shadow-md" />
                <span className="text-[#fdfbf7] text-sm font-semibold tracking-wide">100% Organic</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-primary-400 drop-shadow-md" />
                <span className="text-[#fdfbf7] text-sm font-semibold tracking-wide">Certified Quality</span>
              </div>
              <div className="flex items-center gap-3">
                <Star className="w-6 h-6 text-accent-400 drop-shadow-md" />
                <span className="text-[#fdfbf7] text-sm font-semibold tracking-wide">Premium Grade</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <CategoryShowcase />

      {/* Best Sellers Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-[#111] dark:text-white mb-4">Our Best Sellers</h2>
            <p className="text-[#111] dark:text-white font-medium text-lg">Discover our most loved products, trusted by thousands of families for their daily wellness.</p>
          </div>
          
          {isLoadingData ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
                {[1,2,3,4].map(idx => (
                    <div key={idx} className="animate-pulse bg-earth-100 dark:bg-earth-800 rounded-2xl h-80 w-full"></div>
                ))}
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
              {bestSellerProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href="/shop" className="inline-flex items-center font-bold text-primary-700 hover:text-primary-800 dark:hover:text-primary-400 transition-colors">
              View All Products
              <ArrowRight className="w-5 h-5 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Offers & Banner section */}
      <section className="py-12 bg-earth-50 dark:bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="bg-primary-900 rounded-3xl overflow-hidden relative shadow-xl"
          >
            <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1200" 
                alt="Offers background" 
                className="w-full h-full object-cover opacity-20"
              />
            </div>
            <div className="relative z-10 px-8 py-16 md:p-20 flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-8">
              <div className="max-w-xl">
                <span className="inline-block bg-accent-500 text-white font-black tracking-widest uppercase text-xs mb-4 px-3 py-1 rounded shadow-md">Special Offer</span>
                <h3 className="text-4xl md:text-5xl font-heading font-extrabold text-[#ffffff] mb-6 drop-shadow-md leading-tight">Get 20% off on your first order!</h3>
                <p className="text-[#fdfbf7] text-xl font-medium drop-shadow leading-relaxed mb-6">Use code <strong className="text-[#0a0a0a] px-3 py-1.5 bg-[#fdfbf7] rounded-md shadow-sm ml-1 text-sm tracking-widest uppercase">ORGANIC20</strong> at checkout.</p>
              </div>
              <div>
                <Link href="/shop" className="inline-flex items-center justify-center px-10 py-5 text-lg font-black text-primary-900 bg-accent-400 hover:bg-accent-300 hover:scale-[1.03] active:scale-95 shadow-[0_0_40px_rgba(250,204,21,0.4)] rounded-full transition-all duration-300 transform">
                  Claim Offer Now
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
