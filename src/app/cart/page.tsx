'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/lib/StoreContext';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useStore();

  const shipping = cartTotal > 500 ? 0 : 50;
  const grandTotal = cartTotal > 0 ? cartTotal + shipping : 0;

  if (cart.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24 px-4">
        <div className="w-24 h-24 bg-earth-100 dark:bg-earth-900 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-earth-400" />
        </div>
        <h2 className="text-2xl font-heading font-bold text-earth-900 dark:text-white mb-2">Your cart is empty</h2>
        <p className="text-earth-500 mb-8 text-center max-w-sm">Looks like you haven't added any pure organic goodness to your cart yet.</p>
        <Link 
          href="/shop" 
          className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-3 rounded-full font-medium transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <h1 className="text-3xl md:text-4xl font-heading font-bold text-earth-900 dark:text-white mb-8">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items List */}
        <div className="flex-1">
          <div className="space-y-6">
            {cart.map((item) => (
              <motion.div 
                layout
                key={item.product.id}
                className="flex items-center gap-4 border border-earth-200 dark:border-earth-800 rounded-2xl p-4 bg-white dark:bg-earth-900/50 shadow-sm relative pr-12"
              >
                <div className="w-20 md:w-24 aspect-square rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.product.id}`} className="text-lg font-heading font-semibold text-earth-900 dark:text-white line-clamp-1 hover:text-primary-600 transition-colors">
                    {item.product.name}
                  </Link>
                  <p className="text-earth-500 text-sm mb-3">{item.product.category}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary-700 dark:text-primary-400">₹{item.product.price}</span>
                    
                    <div className="flex items-center border border-earth-200 dark:border-earth-700 rounded-lg overflow-hidden bg-earth-50 dark:bg-earth-800">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-3 py-1.5 hover:bg-earth-200 dark:hover:bg-earth-700 text-earth-600 dark:text-earth-300 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 py-1 font-semibold text-sm w-8 text-center text-earth-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-3 py-1.5 hover:bg-earth-200 dark:hover:bg-earth-700 text-earth-600 dark:text-earth-300 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => removeFromCart(item.product.id)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-earth-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96">
          <div className="bg-earth-50 dark:bg-earth-900/40 rounded-3xl p-6 md:p-8 border border-earth-200 dark:border-earth-800 sticky top-24">
            <h2 className="text-xl font-heading font-bold text-earth-900 dark:text-white mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-earth-600 dark:text-earth-300">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-earth-600 dark:text-earth-300">
                <span>Shipping</span>
                {shipping === 0 ? (
                  <span className="text-primary-600 font-medium">Free</span>
                ) : (
                  <span>₹{shipping}</span>
                )}
              </div>
            </div>
            
            <div className="border-t border-earth-200 dark:border-earth-800 pt-4 mb-8">
              <div className="flex justify-between items-center text-lg font-bold text-earth-900 dark:text-white">
                <span>Total</span>
                <span className="text-2xl text-primary-600 dark:text-primary-400">₹{grandTotal}</span>
              </div>
            </div>

            <Link href="/checkout" className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 transition-all shadow-md shadow-primary-500/20">
              Proceed to Checkout
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <div className="mt-4 text-center">
              <span className="text-xs text-earth-500 flex items-center justify-center gap-1">
                Secure checkout • Free shipping over ₹500
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
