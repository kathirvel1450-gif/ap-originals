'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { categories } from '@/lib/data';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CategoryShowcase() {
  const scrollContainer = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 bg-earth-50 dark:bg-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-heading font-bold text-earth-900 dark:text-white">Shop by Category</h2>
            <p className="text-earth-500 mt-2">Explore our pure, organic collections</p>
          </div>
          <div className="hidden sm:flex gap-2">
            <button onClick={scrollLeft} className="p-2 rounded-full border border-earth-200 dark:border-earth-800 text-earth-600 dark:text-gray-300 hover:bg-earth-100 dark:hover:bg-earth-800 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={scrollRight} className="p-2 rounded-full border border-earth-200 dark:border-earth-800 text-earth-600 dark:text-gray-300 hover:bg-earth-100 dark:hover:bg-earth-800 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="relative">
          <div 
            ref={scrollContainer}
            className="flex overflow-x-auto gap-6 pb-4 sm:pb-0 hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((category) => (
              <motion.div 
                whileHover={{ y: -5 }}
                key={category.id} 
                className="flex-none w-32 sm:w-40"
              >
                <Link href={`/shop?category=${encodeURIComponent(category.name)}`} className="group block">
                  <div className="aspect-square rounded-full overflow-hidden mb-4 border-4 border-white dark:border-earth-800 shadow-md">
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  <h3 className="text-center font-medium text-earth-800 dark:text-gray-200 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
