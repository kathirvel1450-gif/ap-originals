'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/StoreContext';
import { useToast } from '@/lib/ToastContext';
import { CheckCircle2, CreditCard, Banknote, MapPin, BadgePercent } from 'lucide-react';
import { motion } from 'framer-motion';
import { Order } from '@/lib/data';

export default function Checkout() {
  const router = useRouter();
  const { cart, cartTotal, clearCart, storeSettings, addOrder, currentUser } = useStore();
  const { addToast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi'>('cod');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Dynamic calculations
  const subtotal = cartTotal;
  const deliveryFee = storeSettings?.deliveryFee || 0;
  const tax = Math.round(subtotal * ((storeSettings?.tax || 0) / 100));
  const grandTotal = subtotal > 0 ? subtotal + tax + deliveryFee : 0;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      addToast("Your cart is empty", "error");
      return;
    }

    if (!currentUser) {
       addToast("You must log in to place an order.", "error");
       router.push('/auth/login');
       return;
    }

    setIsPlacingOrder(true);

    const newOrder: Order = {
      id: `ORD_${Date.now()}`,
      userId: currentUser.mobile,
      products: cart,
      subtotal,
      tax,
      deliveryFee,
      totalPrice: grandTotal,
      status: 'Pending',
      createdAt: Date.now()
    };

    try {
      await addOrder(newOrder);

      setIsPlacingOrder(false);
      setOrderPlaced(true);
      clearCart();
      
      // Redirect after showing success
      setTimeout(() => {
        router.push('/orders');
      }, 3000);
    } catch (err) {
      setIsPlacingOrder(false);
      addToast("Failed to process order", "error");
    }
  };

  if (orderPlaced) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24 px-4 bg-[#111]">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-green-900/30 text-green-500 border border-green-800 rounded-full flex items-center justify-center mb-6 shadow-xl"
        >
          <CheckCircle2 className="w-12 h-12" />
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-5xl font-heading font-bold text-white mb-4 text-center"
        >
          Order Confirmed!
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 mb-8 text-center max-w-md text-lg"
        >
          Thank you for choosing {storeSettings?.appName}. We are preparing your fresh order right now!
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-sm font-medium text-gray-500"
        >
          Redirecting to Tracking...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full text-white">
      <h1 className="text-3xl md:text-4xl font-heading font-bold mb-8">Secure Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1">
          <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-8">
            
            {/* Address */}
            <section className="bg-[#111] border border-[#333] rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-6 h-6 text-primary-500" />
                <h2 className="text-xl font-heading font-bold">Delivery Address</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required type="text" placeholder="Full Name" className="p-3 bg-[#0a0a0a] border border-[#333] rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-white" />
                <input required type="tel" placeholder="Mobile Number" defaultValue={currentUser?.mobile} className="p-3 bg-[#0a0a0a] border border-[#333] rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-white" />
                <div className="md:col-span-2">
                  <input required type="text" placeholder="House/Flat No., Building Name" className="w-full p-3 bg-[#0a0a0a] border border-[#333] rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-white" />
                </div>
                <div className="md:col-span-2">
                  <input required type="text" placeholder="Street Address / Area / Landmark" className="w-full p-3 bg-[#0a0a0a] border border-[#333] rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-white" />
                </div>
                <input required type="text" placeholder="City" className="p-3 bg-[#0a0a0a] border border-[#333] rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-white" />
                <input required type="text" placeholder="Pincode" className="p-3 bg-[#0a0a0a] border border-[#333] rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-white" />
              </div>
            </section>

            {/* Payment Options */}
            <section className="bg-[#111] border border-[#333] rounded-3xl p-6 md:p-8 shadow-sm">
               <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-6 h-6 text-primary-500" />
                <h2 className="text-xl font-heading font-bold">Payment Method</h2>
              </div>

              <div className="space-y-4">
                <label className={`flex flex-col cursor-pointer border rounded-2xl p-4 transition-colors ${paymentMethod === 'upi' ? 'border-primary-500 bg-primary-900/10' : 'border-[#333] bg-[#0a0a0a]'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="w-4 h-4 text-primary-500 focus:ring-primary-500" />
                    <span className="font-semibold text-white">UPI (GPay, PhonePe, Paytm)</span>
                  </div>
                  {paymentMethod === 'upi' && (
                    <div className="mt-4 ml-7">
                      <input type="text" placeholder="Enter UPI ID (e.g. name@okhdfcbank)" className="w-full p-3 bg-[#000] border border-[#444] rounded-xl outline-none focus:border-primary-500 text-sm text-white" />
                    </div>
                  )}
                </label>

                <label className={`flex items-center gap-3 cursor-pointer border rounded-2xl p-4 transition-colors ${paymentMethod === 'cod' ? 'border-primary-500 bg-primary-900/10' : 'border-[#333] bg-[#0a0a0a]'}`}>
                  <input type="radio" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-4 h-4 text-primary-500 focus:ring-primary-500" />
                  <span className="font-semibold text-white">Cash on Delivery</span>
                  <Banknote className="w-5 h-5 ml-auto text-gray-500" />
                </label>
              </div>
            </section>
          </form>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96">
          <div className="bg-[#111] rounded-3xl p-6 md:p-8 border border-[#333] sticky top-24 shadow-sm">
            <h2 className="text-xl font-heading font-bold text-white mb-6">Order Details</h2>
            
            <div className="space-y-3 mb-6 max-h-48 overflow-y-auto pr-2">
              {cart.map(item => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-gray-300">
                    {item.quantity}x {item.product.name}
                  </span>
                  <span className="font-bold text-white">₹{item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-6 border-t border-[#333] pt-6">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-white font-medium">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span className="flex gap-2 items-center">Tax <BadgePercent className="w-3 h-3" /> ({storeSettings?.tax || 0}%)</span>
                <span className="text-white font-medium">₹{tax}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Delivery Fee</span>
                <span className="text-white font-medium">{deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}</span>
              </div>
            </div>
            
            <div className="border-t border-[#333] pt-4 mb-8">
              <div className="flex justify-between items-center text-lg font-bold text-white">
                <span>Final Amount</span>
                <span className="text-3xl text-primary-500">₹{grandTotal}</span>
              </div>
            </div>

            <button 
              form="checkout-form"
              type="submit"
              disabled={isPlacingOrder || cart.length === 0}
              className="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-4 rounded-full flex items-center justify-center transition-all shadow-lg"
            >
              {isPlacingOrder ? (
                 <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                `Place Order (₹${grandTotal})`
              )}
            </button>
            <p className="text-xs text-center text-gray-500 mt-4">By placing this order, you agree to our Terms & Conditions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
