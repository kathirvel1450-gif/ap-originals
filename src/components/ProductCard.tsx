'use client';

import React, { useState } from 'react';
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
  const [imgSrc, setImgSrc] = useState(product.image);
  
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
      className="group bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_30px_rgba(34,197,94,0.15)] border border-[#333] relative flex flex-col h-full transition-all duration-300"
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
        className="absolute top-3 right-3 z-20 p-2.5 rounded-full bg-[#111]/80 backdrop-blur-sm text-[#aaa] hover:text-red-500 hover:scale-110 transition-all duration-300 shadow-sm border border-[#333]"
      >
        <Heart className={`w-[18px] h-[18px] ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
      </button>

      <Link href={`/product/${product.id}`} className="flex-1 flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-[4/3] sm:aspect-square w-full overflow-hidden bg-[#222]">
          {/* Gradient Overlay for better contrast if text ever overlays, framing aesthetic */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 transition-opacity duration-300 opacity-80 group-hover:opacity-40 pointer-events-none"></div>
          
          <img
            src={imgSrc}
            onError={(e) => {
              if (imgSrc !== '/images/fallback.svg') {
                setImgSrc('/images/fallback.svg');
              }
            }}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out"
          />
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Category Tag */}
          <span className="inline-block bg-primary-900/30 text-primary-400 border border-primary-500/20 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full w-fit mb-3">
            {product.category}
          </span>
          
          <h3 className="font-heading font-extrabold text-[#fff] text-lg md:text-[1.15rem] leading-tight mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          <div className="mt-auto pt-4 flex items-center justify-between border-t border-[#333]">
            <div className="flex flex-col">
              <span className="font-extrabold text-[1.35rem] text-primary-400 leading-none">
                ₹{finalPrice}
              </span>
              {product.discountPercentage && (
                <span className="text-sm font-semibold text-[#888] line-through mt-0.5">
                  ₹{product.price}
                </span>
              )}
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="w-11 h-11 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-500 hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_20px_rgba(34,197,94,0.5)]"
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
