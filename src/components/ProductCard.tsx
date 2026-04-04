'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/data';
import { useStore } from '@/lib/StoreContext';
import { useToast } from '@/lib/ToastContext';
import { Heart, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const { addToast } = useToast();
  
  const isWishlisted = wishlist.includes(product.id);

  const finalPrice = product.discountPercentage 
    ? product.price - Math.round((product.price * product.discountPercentage) / 100) 
    : product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
    addToast(`Added ${product.name} to cart`, 'success');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product.id);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 relative flex flex-col h-full transition-shadow duration-300"
    >
      {/* Discount Badge */}
      {product.discountPercentage && (
        <div className="absolute top-3 left-3 z-20 bg-[#EF4444] text-white text-xs font-extrabold px-2.5 py-1.5 rounded shadow-sm tracking-wide">
          {product.discountPercentage}% OFF
        </div>
      )}

      {/* Wishlist Button */}
      <button 
        onClick={handleWishlist}
        className="absolute top-3 right-3 z-20 p-2.5 rounded-full bg-white/90 backdrop-blur-sm text-gray-400 hover:text-red-500 hover:scale-110 transition-all duration-300 shadow-sm"
      >
        <Heart className={`w-[18px] h-[18px] ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
      </button>

      <Link href={`/product/${product.id}`} className="flex-1 flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-[4/3] sm:aspect-square w-full overflow-hidden bg-gray-50">
          {/* Gradient Overlay for better contrast if text ever overlays, framing aesthetic */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10 transition-opacity duration-300 opacity-50 group-hover:opacity-20 pointer-events-none"></div>
          
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out"
          />
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Category Tag */}
          <span className="inline-block bg-primary-50 text-primary-800 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full w-fit mb-3">
            {product.category}
          </span>
          
          <h3 className="font-heading font-bold text-gray-900 text-lg md:text-[1.15rem] leading-tight mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
            <div className="flex flex-col">
              <span className="font-extrabold text-[1.35rem] text-primary-700 leading-none">
                ₹{finalPrice}
              </span>
              {product.discountPercentage && (
                <span className="text-sm font-semibold text-gray-400 line-through mt-0.5">
                  ₹{product.price}
                </span>
              )}
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="w-11 h-11 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 hover:scale-105 active:scale-95 transition-all duration-300 shadow-sm shadow-primary-600/30"
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-[18px] h-[18px]" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
