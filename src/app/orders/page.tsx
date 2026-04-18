'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/StoreContext';
import { Package, Truck, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrdersPage() {
  const router = useRouter();
  const { orders, currentUser, isLoadingData } = useStore();

  if (isLoadingData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 flex flex-col items-center">
        <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2 text-center">Login Required</h2>
        <p className="text-gray-400 mb-6 text-center">Please login to view your order history.</p>
        <button 
          onClick={() => router.push('/auth/login')}
          className="bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 px-8 rounded-full transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // Filter orders
  const myOrders = orders.filter(o => o.userId === currentUser.mobile);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
       <div className="bg-[#111] border-b border-[#333] sticky top-[72px] z-30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => router.push('/')} className="p-2 hover:bg-[#222] rounded-full transition-colors">
                 <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-heading font-bold">Your Orders</h1>
            </div>
            <div className="text-sm font-bold text-gray-400 bg-[#222] px-3 py-1.5 rounded-lg border border-[#333]">
              {myOrders.length} {myOrders.length === 1 ? 'Order' : 'Orders'}
            </div>
          </div>
       </div>

       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {myOrders.length === 0 ? (
            <div className="bg-[#111] border border-[#222] rounded-3xl p-12 flex flex-col items-center text-center">
               <Package className="w-16 h-16 text-gray-600 mb-4" />
               <h2 className="text-2xl font-bold font-heading mb-2">No orders found</h2>
               <p className="text-gray-400 mb-6">Looks like you haven't placed any orders yet.</p>
               <button 
                  onClick={() => router.push('/shop')}
                  className="bg-white text-[#111] font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-colors"
                >
                  Start Shopping
                </button>
            </div>
          ) : (
            myOrders.map((order, idx) => {
              const statusColors = {
                 'Pending': 'bg-orange-900/40 text-orange-400 border-orange-800',
                 'Shipped': 'bg-blue-900/40 text-blue-400 border-blue-800',
                 'Delivered': 'bg-green-900/40 text-green-400 border-green-800'
              };
              
              const StatusIcon = order.status === 'Pending' ? Package 
                                : order.status === 'Shipped' ? Truck 
                                : CheckCircle2;

              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={order.id} 
                  className="bg-[#111] border border-[#333] rounded-3xl overflow-hidden shadow-lg"
                >
                   {/* Order Header */}
                   <div className="bg-[#0a0a0a] border-b border-[#333] p-5 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                         <div>
                            <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px] mb-0.5">Order Placed</p>
                            <p className="font-semibold text-gray-200">{new Date(order.createdAt).toLocaleDateString()}</p>
                         </div>
                         <div>
                            <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px] mb-0.5">Total Amount</p>
                            <p className="font-semibold text-gray-200">₹{order.totalPrice}</p>
                         </div>
                         <div>
                            <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px] mb-0.5">Order ID</p>
                            <p className="font-semibold tracking-wider text-primary-400">{order.id}</p>
                         </div>
                      </div>
                      <div className="flex items-center">
                         <span className={`text-xs font-bold px-3 py-1.5 rounded-full border flex items-center gap-1.5 shadow-sm ${statusColors[order.status]}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {order.status}
                         </span>
                      </div>
                   </div>

                   {/* Add Delivery tracking highlight if DeliveryDate is populated */}
                   {order.deliveryDate && order.status !== 'Delivered' && (
                     <div className="px-5 sm:px-6 py-3 bg-[#171717] border-b border-[#333] flex items-center gap-2">
                        <Truck className="w-5 h-5 text-blue-500" />
                        <span className="text-sm font-bold text-gray-300">Expected Delivery by: <span className="text-white">{new Date(order.deliveryDate).toLocaleDateString()}</span></span>
                     </div>
                   )}
                   {order.deliveryDate && order.status === 'Delivered' && (
                     <div className="px-5 sm:px-6 py-3 bg-green-900/10 border-b border-green-900/30 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-bold text-green-400">Delivered on: <span className="text-green-300">{new Date(order.deliveryDate).toLocaleDateString()}</span></span>
                     </div>
                   )}

                   {/* Order Body */}
                   <div className="p-5 sm:px-6">
                      <div className="space-y-4">
                         {order.products.map((item, i) => (
                           <div key={`${order.id}-${i}`} className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#222] flex-shrink-0 border border-[#333]">
                                 <img 
                                    src={item.product.image} 
                                    alt={item.product.name} 
                                    className="w-full h-full object-cover" 
                                    onError={(e) => { e.currentTarget.src = '/images/fallback.svg'; }}
                                 />
                              </div>
                              <div className="flex-1 min-w-0">
                                 <h4 className="font-bold text-white line-clamp-1">{item.product.name}</h4>
                                 <p className="text-sm text-gray-500 mt-0.5">Quantity: <span className="font-bold text-gray-300">{item.quantity}</span></p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                 <p className="font-bold text-white">₹{item.product.price} <span className="text-sm text-gray-500 font-normal">ea.</span></p>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>

                   {/* Order Footer - Receipts / Cost Structure */}
                   <div className="p-4 sm:px-6 bg-[#0a0a0a] border-t border-[#333] flex justify-between items-center">
                     <div className="text-xs text-gray-500 font-medium">
                       Includes ₹{order.tax || 0} tax & ₹{order.deliveryFee || 0} shipping
                     </div>
                     <button className="text-sm font-bold text-primary-500 hover:text-primary-400 transition-colors">
                       View Invoice
                     </button>
                   </div>
                </motion.div>
              );
            })
          )}
       </div>
    </div>
  );
}
