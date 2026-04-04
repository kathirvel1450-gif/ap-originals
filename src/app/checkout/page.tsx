'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/StoreContext';
import { useToast } from '@/lib/ToastContext';
import { CheckCircle2, CreditCard, Banknote, MapPin, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Checkout() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useStore();
  const { addToast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi'>('upi');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const shipping = cartTotal > 500 ? 0 : 50;
  const grandTotal = cartTotal > 0 ? cartTotal + shipping : 0;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      addToast("Your cart is empty", "error");
      return;
    }

    setIsPlacingOrder(true);

    // Simulate API call
    setTimeout(() => {
      setIsPlacingOrder(false);
      setOrderPlaced(true);
      clearCart();
      
      // Redirect after showing success for a bit
      setTimeout(() => {
        router.push('/');
      }, 3000);
    }, 2000);
  };

  if (orderPlaced) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24 px-4 bg-earth-50 dark:bg-black/20">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle2 className="w-12 h-12" />
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-5xl font-heading font-bold text-earth-900 dark:text-white mb-4 text-center"
        >
          Order Confirmed!
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-earth-500 mb-8 text-center max-w-md text-lg"
        >
          Thank you for choosing pure & organic. We are preparing your fresh order right now.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-sm font-medium text-earth-400"
        >
          Redirecting to home...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <h1 className="text-3xl md:text-4xl font-heading font-bold text-earth-900 dark:text-white mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1">
          <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-8">
            
            {/* Address */}
            <section className="bg-white dark:bg-earth-900/40 border border-earth-200 dark:border-earth-800 rounded-3xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6 text-earth-900 dark:text-white">
                <MapPin className="w-6 h-6 text-primary-500" />
                <h2 className="text-xl font-heading font-bold">Delivery Address</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required type="text" placeholder="Full Name" className="p-3 bg-earth-50 dark:bg-black/50 border border-earth-200 dark:border-earth-800 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white" />
                <input required type="tel" placeholder="Mobile Number" className="p-3 bg-earth-50 dark:bg-black/50 border border-earth-200 dark:border-earth-800 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white" />
                <div className="md:col-span-2">
                  <input required type="text" placeholder="House/Flat No., Building Name" className="w-full p-3 bg-earth-50 dark:bg-black/50 border border-earth-200 dark:border-earth-800 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white" />
                </div>
                <div className="md:col-span-2">
                  <input required type="text" placeholder="Street Address / Area / Landmark" className="w-full p-3 bg-earth-50 dark:bg-black/50 border border-earth-200 dark:border-earth-800 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white" />
                </div>
                <input required type="text" placeholder="City" className="p-3 bg-earth-50 dark:bg-black/50 border border-earth-200 dark:border-earth-800 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white" />
                <input required type="text" placeholder="Pincode" className="p-3 bg-earth-50 dark:bg-black/50 border border-earth-200 dark:border-earth-800 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white" />
              </div>
            </section>

            {/* Payment Options */}
            <section className="bg-white dark:bg-earth-900/40 border border-earth-200 dark:border-earth-800 rounded-3xl p-6 md:p-8">
               <div className="flex items-center gap-3 mb-6 text-earth-900 dark:text-white">
                <CreditCard className="w-6 h-6 text-primary-500" />
                <h2 className="text-xl font-heading font-bold">Payment Method</h2>
              </div>

              <div className="space-y-4">
                <label className={`flex flex-col cursor-pointer border rounded-2xl p-4 transition-colors ${paymentMethod === 'upi' ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10' : 'border-earth-200 dark:border-earth-800'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="w-4 h-4 text-primary-600 focus:ring-primary-500" />
                    <span className="font-semibold text-earth-900 dark:text-white">UPI (GPay, PhonePe, Paytm)</span>
                  </div>
                  {paymentMethod === 'upi' && (
                    <div className="mt-4 ml-7">
                      <input type="text" placeholder="Enter UPI ID (e.g. name@okhdfcbank)" className="w-full p-3 bg-white dark:bg-black border border-earth-200 dark:border-earth-800 rounded-xl outline-none focus:border-primary-500 text-sm dark:text-white" />
                    </div>
                  )}
                </label>

                <label className={`flex items-center gap-3 cursor-pointer border rounded-2xl p-4 transition-colors ${paymentMethod === 'cod' ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10' : 'border-earth-200 dark:border-earth-800'}`}>
                  <input type="radio" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-4 h-4 text-primary-600 focus:ring-primary-500" />
                  <span className="font-semibold text-earth-900 dark:text-white">Cash on Delivery</span>
                  <Banknote className="w-5 h-5 ml-auto text-earth-400" />
                </label>
              </div>
            </section>
          </form>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96">
          <div className="bg-earth-50 dark:bg-earth-900/40 rounded-3xl p-6 md:p-8 border border-earth-200 dark:border-earth-800 sticky top-24">
            <h2 className="text-xl font-heading font-bold text-earth-900 dark:text-white mb-6">Order Details</h2>
            
            <div className="space-y-3 mb-6 max-h-48 overflow-y-auto pr-2">
              {cart.map(item => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-earth-600 dark:text-earth-300">
                    {item.quantity}x {item.product.name}
                  </span>
                  <span className="font-medium text-earth-900 dark:text-white">₹{item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-6 border-t border-earth-200 dark:border-earth-800 pt-6">
              <div className="flex justify-between text-earth-600 dark:text-earth-300">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-earth-600 dark:text-earth-300">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
              </div>
            </div>
            
            <div className="border-t border-earth-200 dark:border-earth-800 pt-4 mb-8">
              <div className="flex justify-between items-center text-lg font-bold text-earth-900 dark:text-white">
                <span>Total Amount</span>
                <span className="text-2xl text-primary-600 dark:text-primary-400">₹{grandTotal}</span>
              </div>
            </div>

            <button 
              form="checkout-form"
              type="submit"
              disabled={isPlacingOrder || cart.length === 0}
              className="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-4 rounded-full flex items-center justify-center transition-all shadow-md"
            >
              {isPlacingOrder ? (
                 <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                `Place Order (₹${grandTotal})`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
