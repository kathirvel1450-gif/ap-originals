'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { categories } from '@/lib/data';
import { useStore } from '@/lib/StoreContext';
import ProductCard from '@/components/ProductCard';
import { Filter } from 'lucide-react';
import { motion } from 'framer-motion';

function ShopContent() {
  const searchParams = useSearchParams();
  const defaultCategory = searchParams.get('category') || 'All';
  const { products, isLoadingData } = useStore();
  
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [priceSort, setPriceSort] = useState('none');

  useEffect(() => {
    if (searchParams.get('category')) {
      setSelectedCategory(searchParams.get('category') as string);
    }
  }, [searchParams]);

  let filteredProducts = products;
  
  if (selectedCategory !== 'All') {
    filteredProducts = filteredProducts.filter((p) => p.category === selectedCategory);
  }

  if (priceSort === 'low-high') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (priceSort === 'high-low') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-earth-900 dark:text-white mb-2">Our Products</h1>
          <p className="text-earth-500">Pure, organic & honest</p>
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-4 bg-white dark:bg-earth-900 p-2 rounded-xl border border-earth-200 dark:border-earth-800 shadow-sm overflow-x-auto w-full md:w-auto">
          <div className="flex px-2 text-earth-400">
            <Filter className="w-5 h-5" />
          </div>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-transparent text-sm font-medium focus:outline-none dark:text-white"
          >
            <option value="All">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
          <div className="w-px h-6 bg-earth-200 dark:bg-earth-800"></div>
          <select 
            value={priceSort}
            onChange={(e) => setPriceSort(e.target.value)}
            className="bg-transparent text-sm font-medium focus:outline-none dark:text-white"
          >
            <option value="none">Sort by Price</option>
            <option value="low-high">Lowest to Highest</option>
            <option value="high-low">Highest to Lowest</option>
          </select>
        </div>
      </div>

      {isLoadingData ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {[1,2,3,4,5,6,7,8].map(i => (
             <div key={i} className="animate-pulse bg-earth-100 dark:bg-earth-800 rounded-2xl h-80 w-full"></div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-earth-50 dark:bg-black/20 rounded-3xl">
          <h3 className="text-xl font-heading text-earth-800 dark:text-earth-200">No products found</h3>
          <p className="text-earth-500 mt-2">Try selecting a different category.</p>
          <button 
            onClick={() => setSelectedCategory('All')} 
            className="mt-6 text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
      <ShopContent />
    </Suspense>
  )
}
