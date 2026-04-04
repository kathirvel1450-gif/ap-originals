'use client';

import React, { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import { useStore } from '@/lib/StoreContext';
import { useToast } from '@/lib/ToastContext';
import { Heart, Minus, Plus, ShoppingCart, CheckCircle, ShieldCheck, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductDetail() {
  const params = useParams();
  const productId = params.id as string;
  
  const { products, isLoadingData, addToCart, toggleWishlist, wishlist } = useStore();
  const { addToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  
  const product = products.find(p => p.id === productId);
  
  if (isLoadingData) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex h-96 items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
    </div>;
  }

  if (!product) {
    return notFound();
  }

  const isWishlisted = wishlist.includes(product.id);
  
  const finalPrice = product.discountPercentage 
    ? product.price - Math.round((product.price * product.discountPercentage) / 100) 
    : product.price;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    addToast(`Added ${quantity} ${product.name} to cart`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
        
        {/* Product Image */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-1/2"
        >
          <div className="aspect-square bg-gray-100 dark:bg-earth-900 rounded-3xl overflow-hidden relative shadow-lg">
             {product.discountPercentage && (
              <div className="absolute top-4 left-4 z-10 bg-accent-500 text-white font-bold px-3 py-1.5 rounded-md shadow-sm">
                {product.discountPercentage}% OFF
              </div>
            )}
            <button 
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm text-earth-400 hover:text-red-500 transition-colors shadow-sm"
            >
              <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-1/2 flex flex-col justify-center"
        >
          <div className="mb-2 text-earth-500 dark:text-earth-400 uppercase tracking-widest text-sm font-semibold">
            {product.category}
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-earth-900 dark:text-white mb-4">
            {product.name}
          </h1>
          
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded font-bold">★ {product.rating}</span>
            <span className="text-sm text-earth-500 border-l pl-2 border-earth-300">100+ Reviews</span>
          </div>

          <div className="flex items-end gap-4 mb-6">
            <span className="text-4xl font-bold text-primary-700 dark:text-primary-400">
              ₹{finalPrice}
            </span>
            {product.discountPercentage && (
              <span className="text-xl text-earth-400 line-through mb-1">
                ₹{product.price}
              </span>
            )}
          </div>

          <p className="text-lg text-earth-600 dark:text-earth-300 mb-8 leading-relaxed">
            {product.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex items-center border border-earth-200 dark:border-earth-700 rounded-full bg-white dark:bg-earth-900 overflow-hidden shadow-sm">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="p-4 text-earth-600 hover:text-earth-900 hover:bg-earth-50 dark:text-earth-300 dark:hover:text-white dark:hover:bg-earth-800 transition-colors"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="w-12 text-center font-semibold text-lg text-earth-900 dark:text-white">
                {quantity}
              </span>
              <button 
                onClick={() => setQuantity(q => q + 1)}
                 className="p-4 text-earth-600 hover:text-earth-900 hover:bg-earth-50 dark:text-earth-300 dark:hover:text-white dark:hover:bg-earth-800 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-primary-600 hover:bg-primary-500 text-white font-bold text-lg rounded-full py-4 px-8 flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg shadow-primary-500/30"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-earth-200 dark:border-earth-800">
            <div className="flex items-center gap-3 text-earth-600 dark:text-earth-300">
              <Truck className="w-6 h-6 text-primary-500" />
              <span>Fast & fresh delivery</span>
            </div>
            <div className="flex items-center gap-3 text-earth-600 dark:text-earth-300">
              <ShieldCheck className="w-6 h-6 text-primary-500" />
              <span>Guaranteed Authentic</span>
            </div>
            <div className="flex items-center gap-3 text-earth-600 dark:text-earth-300">
              <CheckCircle className="w-6 h-6 text-primary-500" />
              <span>100% Organic</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
