'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '@/lib/StoreContext';
import { useToast } from '@/lib/ToastContext';
import { Product, Category, Order } from '@/lib/data';
import { Plus, Edit2, Trash2, X, TrendingUp, Package, Link as LinkIcon, Download, MapPin, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { 
    products, addProduct, editProduct, deleteProduct, 
    categories, addCategory, editCategory, deleteCategory,
    storeSettings, updateStoreSettings, adminLogout,
    orders, updateOrderStatus, isAdmin, isLoadingData
  } = useStore();
  const { addToast } = useToast();
  const router = useRouter();

  // --- Auth Check ---
  useEffect(() => {
    if (!isLoadingData && !isAdmin) {
      router.replace('/admin/login');
    }
  }, [isAdmin, isLoadingData, router]);

  // Optionally halt rendering until validated
  if (isLoadingData || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111]">
         <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // --- Metrics ---
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const totalProductsSold = orders.reduce((sum, o) => {
    return sum + o.products.reduce((acc, p) => acc + p.quantity, 0);
  }, 0);

  // --- Store Settings State ---
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [appName, setAppName] = useState('');
  const [appTagline, setAppTagline] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [deliveryFee, setDeliveryFee] = useState('');
  const [tax, setTax] = useState('');

  useEffect(() => {
    if (storeSettings && !isEditingSettings) {
      setAppName(storeSettings.appName);
      setAppTagline(storeSettings.appTagline);
      setAddress(storeSettings.address || '');
      setPhone(storeSettings.phone || '');
      setEmail(storeSettings.email || '');
      setDeliveryFee(storeSettings.deliveryFee?.toString() || '0');
      setTax(storeSettings.tax?.toString() || '0');
    }
  }, [storeSettings, isEditingSettings]);

  // --- Product Form State ---
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [stockStatus, setStockStatus] = useState<'In Stock' | 'Out of Stock' | 'Low Stock'>('In Stock');
  const [productCategory, setProductCategory] = useState('');
  const [description, setDescription] = useState('');
  const [productImageUrl, setProductImageUrl] = useState('');

  // --- Category Form State ---
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryImageUrl, setCategoryImageUrl] = useState('');

  // --- Order Filter State ---
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // --- Realtime Order Notifications ---
  const prevOrdersCount = useRef(orders.length);
  useEffect(() => {
    // Only notify if we already loaded initial data and the array grew
    if (prevOrdersCount.current > 0 && orders.length > prevOrdersCount.current) {
        addToast("🔔 New Order Received!", "success");
    }
    prevOrdersCount.current = orders.length;
  }, [orders.length, addToast]);

  // --- Handlers ---
  const handleSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings({ 
      appName, 
      appTagline,
      address,
      phone,
      email,
      deliveryFee: Number(deliveryFee),
      tax: Number(tax)
    });
    setIsEditingSettings(false);
    addToast('Settings updated successfully to Firestore', 'success');
  };

  const validateUrl = (url: string) => {
    if (url.startsWith('C:\\') || url.startsWith('file://')) {
      addToast("Local file paths are blocked. Please use an Image URL (http/https).", "error");
      return false;
    }
    return true;
  };

  // --- Product Handlers ---
  const resetProductForm = () => {
    setProductName('');
    setPrice('');
    setDiscountPercentage('');
    setStockStatus('In Stock');
    setProductCategory('');
    setDescription('');
    setProductImageUrl('');
    setEditingProductId(null);
  };

  const openAddProductModal = () => {
    resetProductForm();
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (p: Product) => {
    setEditingProductId(p.id);
    setProductName(p.name);
    setPrice(p.price.toString());
    setDiscountPercentage(p.discountPercentage ? p.discountPercentage.toString() : '');
    setStockStatus(p.stockStatus);
    setProductCategory(p.category);
    setDescription(p.description);
    setProductImageUrl(p.image);
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !price || !productImageUrl || !productCategory) {
      addToast('Please fill all required fields', 'error');
      return;
    }

    if (!validateUrl(productImageUrl)) return;

    const newProduct: Product = {
      id: editingProductId || '',
      name: productName,
      price: Number(price),
      discountPercentage: discountPercentage ? Number(discountPercentage) : undefined,
      stockStatus,
      category: productCategory,
      rating: editingProductId ? (products.find(p => p.id === editingProductId)?.rating || 5.0) : 5.0,
      image: productImageUrl,
      description
    };

    try {
      if (editingProductId) {
        await editProduct(newProduct);
        addToast('Product updated successfully', 'success');
      } else {
        await addProduct(newProduct);
        addToast('Product added successfully', 'success');
      }
      setIsProductModalOpen(false);
      resetProductForm();
    } catch (e) {
      addToast('Error saving product to Firebase', 'error');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteProduct(id);
        addToast('Product deleted', 'info');
      } catch (e) {
         addToast('Failed to delete product', 'error');
      }
    }
  };

  // --- Category Handlers ---
  const resetCategoryForm = () => {
    setCategoryName('');
    setCategoryImageUrl('');
    setEditingCategoryId(null);
  };

  const openAddCategoryModal = () => {
    resetCategoryForm();
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (c: Category) => {
    setEditingCategoryId(c.id);
    setCategoryName(c.name);
    setCategoryImageUrl(c.image);
    setIsCategoryModalOpen(true);
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName || !categoryImageUrl) {
      addToast('Please fill all required fields', 'error');
      return;
    }

    if (!validateUrl(categoryImageUrl)) return;

    const newCategory: Category = {
      id: editingCategoryId || '',
      name: categoryName,
      image: categoryImageUrl
    };

    try {
      if (editingCategoryId) {
        await editCategory(newCategory);
        addToast('Category updated successfully', 'success');
      } else {
        await addCategory(newCategory);
        addToast('Category added successfully', 'success');
      }
      setIsCategoryModalOpen(false);
      resetCategoryForm();
    } catch (e) {
       addToast('Failed to save category to Firebase', 'error');
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      await deleteCategory(id);
      addToast('Category deleted', 'info');
    }
  };

  const handleOrderUpdate = async (id: string, status: Order['status'], dateStr: string) => {
    try {
      await updateOrderStatus(id, status, dateStr);
      addToast(`Order ${id} updated`, 'success');
    } catch (err) {
      addToast("Failed to update status", "error");
    }
  }

  const filteredOrders = orderStatusFilter === 'All' 
     ? orders 
     : orders.filter(o => o.status === orderStatusFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400">Manage limits, inventory, orders, and UI layouts globally via Firestore.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => {
               adminLogout();
               addToast('Logged out successfully', 'info');
            }}
            className="px-4 py-3 border border-[#333] text-gray-300 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 rounded-xl font-bold transition-colors bg-[#111] shadow-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Analytics / Sales Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#111] border border-[#333] p-6 rounded-3xl flex items-center gap-4 shadow-sm">
           <div className="p-4 bg-primary-900/30 text-primary-500 rounded-2xl">
              <Package className="w-8 h-8" />
           </div>
           <div>
              <p className="text-gray-400 font-bold text-sm uppercase tracking-wider">Total Orders</p>
              <p className="text-3xl font-heading font-bold text-white">{totalOrders}</p>
           </div>
        </div>
        <div className="bg-[#111] border border-[#333] p-6 rounded-3xl flex items-center gap-4 shadow-sm">
           <div className="p-4 bg-blue-900/30 text-blue-500 rounded-2xl">
              <TrendingUp className="w-8 h-8" />
           </div>
           <div>
              <p className="text-gray-400 font-bold text-sm uppercase tracking-wider">Total Revenue</p>
              <p className="text-3xl font-heading font-bold text-white">₹{totalRevenue}</p>
           </div>
        </div>
        <div className="bg-[#111] border border-[#333] p-6 rounded-3xl flex items-center gap-4 shadow-sm">
           <div className="p-4 bg-orange-900/30 text-orange-500 rounded-2xl">
              <Truck className="w-8 h-8" />
           </div>
           <div>
              <p className="text-gray-400 font-bold text-sm uppercase tracking-wider">Products Sold</p>
              <p className="text-3xl font-heading font-bold text-white">{totalProductsSold}</p>
           </div>
        </div>
      </div>

      {/* Store Settings Section */}
      <div className="bg-[#111] rounded-3xl border border-[#333] p-6 mb-8 shadow-sm text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold font-heading flex items-center gap-2">
            Store Branding & Details
          </h2>
          {!isEditingSettings && (
            <button onClick={() => setIsEditingSettings(true)} className="text-primary-500 font-bold hover:underline text-sm flex items-center gap-1 bg-[#222] px-3 py-1.5 rounded-lg">
              <Edit2 className="w-4 h-4" /> Edit Configuration
            </button>
          )}
        </div>
        
        {isEditingSettings ? (
          <form onSubmit={handleSettingsSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1">App Name</label>
                <input required value={appName} onChange={(e) => setAppName(e.target.value)} className="w-full p-3 bg-[#0a0a0a] border border-[#333] rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1">Tagline</label>
                <input required value={appTagline} onChange={(e) => setAppTagline(e.target.value)} className="w-full p-3 bg-[#0a0a0a] border border-[#333] rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-300 mb-1">Store Address</label>
                <input required value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-3 bg-[#0a0a0a] border border-[#333] rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1">Contact Phone</label>
                <input required value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" className="w-full p-3 bg-[#0a0a0a] border border-[#333] rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1">Contact Email</label>
                <input required value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full p-3 bg-[#0a0a0a] border border-[#333] rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1">Delivery Fee (₹)</label>
                <input required value={deliveryFee} onChange={(e) => setDeliveryFee(e.target.value)} type="number" min="0" className="w-full p-3 bg-[#0a0a0a] border border-[#333] rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1">Tax Percentage (%)</label>
                <input required value={tax} onChange={(e) => setTax(e.target.value)} type="number" min="0" max="100" className="w-full p-3 bg-[#0a0a0a] border border-[#333] rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-white" />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => { setIsEditingSettings(false); }} className="px-4 py-2 text-gray-400 font-bold hover:bg-[#222] rounded-lg transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-500 transition-colors">Save Details</button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-[#0a0a0a] p-5 rounded-xl border border-[#222]">
            <div>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">App Name</p>
              <p className="font-bold text-white text-lg">{storeSettings?.appName}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Tagline</p>
              <p className="font-semibold text-gray-300">{storeSettings?.appTagline}</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Address</p>
              <p className="font-semibold text-gray-300 truncate" title={storeSettings?.address}>{storeSettings?.address}</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Phone</p>
              <p className="font-semibold text-gray-300">{storeSettings?.phone}</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Email</p>
              <p className="font-semibold text-gray-300 truncate">{storeSettings?.email}</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Delivery Fee</p>
              <p className="font-semibold text-gray-300">₹{storeSettings?.deliveryFee}</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Tax</p>
              <p className="font-semibold text-gray-300">{storeSettings?.tax}%</p>
            </div>
          </div>
        )}
      </div>

      {/* Categories Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white font-heading">Categories</h2>
          <button 
            onClick={openAddCategoryModal}
            className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((c) => (
            <div key={c.id} className="bg-[#111] rounded-2xl p-4 border border-[#333] shadow-sm flex flex-col items-center group relative">
              <div className="absolute top-2 right-2 flex gap-1 bg-[#000]/90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity p-1 shadow-sm border border-[#444]">
                <button onClick={() => openEditCategoryModal(c)} className="p-1.5 text-primary-500 hover:bg-primary-900/30 rounded transition-colors"><Edit2 className="w-3 h-3" /></button>
                <button onClick={() => handleDeleteCategory(c.id, c.name)} className="p-1.5 text-red-500 hover:bg-red-900/30 rounded transition-colors"><Trash2 className="w-3 h-3" /></button>
              </div>
              <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-[#444] shadow-sm flex-shrink-0 bg-[#222]">
                 <img src={c.image} alt={c.name} onError={(e) => { e.currentTarget.src = '/images/fallback.svg'; }} className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-white text-center text-sm">{c.name}</span>
            </div>
          ))}
          {categories.length === 0 && (
             <div className="col-span-full p-8 text-center text-gray-500 bg-[#111] rounded-2xl border border-[#333] border-dashed">
                No categories found.
             </div>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white font-heading">Products List</h2>
          <button 
            onClick={openAddProductModal}
            className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
        <div className="bg-[#111] rounded-3xl border border-[#333] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
              <tr className="bg-[#0a0a0a] border-b border-[#333] text-white text-sm font-bold uppercase tracking-wider">
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4 hidden md:table-cell">Price / Offer</th>
                  <th className="p-4 hidden sm:table-cell">Stock</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#333]">
                {products.map(p => {
                  const finalPrice = p.discountPercentage 
                    ? p.price - Math.round((p.price * p.discountPercentage) / 100) 
                    : p.price;

                  return (
                    <tr key={p.id} className="hover:bg-[#222] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#222] flex-shrink-0 border border-[#444]">
                            <img src={p.image} alt={p.name} onError={(e) => { e.currentTarget.src = '/images/fallback.svg'; }} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-white line-clamp-1">{p.name}</p>
                            <p className="text-xs text-gray-500 sm:hidden">₹{finalPrice}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-300">
                        <span className="bg-[#333] font-semibold px-2.5 py-1 rounded-md">{p.category}</span>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <div className="flex flex-col">
                          <span className="font-bold text-white">₹{finalPrice}</span>
                          {p.discountPercentage && (
                            <span className="text-xs text-primary-500 font-bold">{p.discountPercentage}% OFF (₹{p.price})</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          p.stockStatus === 'In Stock' ? 'bg-green-900/30 text-green-400 border border-green-800' :
                          p.stockStatus === 'Low Stock' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800' :
                          'bg-red-900/30 text-red-400 border border-red-800'
                        }`}>
                          {p.stockStatus}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEditProductModal(p)} className="p-2 text-primary-500 hover:bg-[#333] rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteProduct(p.id, p.name)} className="p-2 text-red-500 hover:bg-red-900/30 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      No products found. Add some to get started!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Orders Management Table */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <h2 className="text-2xl font-bold text-white font-heading">Orders Management</h2>
          <select 
            value={orderStatusFilter}
            onChange={(e) => setOrderStatusFilter(e.target.value)}
            className="p-2.5 bg-[#000] border border-[#444] rounded-xl outline-none text-white text-sm font-bold shadow-sm"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
        <div className="bg-[#111] rounded-3xl border border-[#333] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
              <tr className="bg-[#0a0a0a] border-b border-[#333] text-gray-300 text-sm font-bold uppercase tracking-wider">
                  <th className="p-4">Order ID & Date</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4 text-center">Status & Delivery Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#333]">
                {filteredOrders.map(o => {
                  return (
                    <tr key={o.id} className="hover:bg-[#222] transition-colors text-white">
                      <td className="p-4 pr-0">
                          <p className="font-bold text-sm tracking-wider text-primary-400">{o.id}</p>
                          <p className="text-xs text-gray-500 mt-1">{new Date(o.createdAt).toLocaleString()}</p>
                      </td>
                      <td className="p-4">
                          <p className="font-semibold text-gray-200">{o.userId}</p>
                          <p className="text-xs text-gray-400 mt-1">{o.products.length} Items</p>
                      </td>
                      <td className="p-4">
                          <p className="font-bold">₹{o.totalPrice}</p>
                      </td>
                      <td className="p-4">
                          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center sm:justify-end">
                            <select 
                              value={o.status}
                              onChange={(e) => handleOrderUpdate(o.id, e.target.value as any, o.deliveryDate as string)}
                              className={`text-sm font-bold px-3 py-1.5 rounded-full border outline-none ${
                                o.status === 'Pending' ? 'bg-orange-900/40 text-orange-400 border-orange-800' :
                                o.status === 'Shipped' ? 'bg-blue-900/40 text-blue-400 border-blue-800' :
                                'bg-green-900/40 text-green-400 border-green-800'
                              }`}
                            >
                                <option value="Pending" className="text-black">Pending</option>
                                <option value="Shipped" className="text-black">Shipped</option>
                                <option value="Delivered" className="text-black">Delivered</option>
                            </select>
                            
                            <input 
                              type="date" 
                              value={o.deliveryDate ? o.deliveryDate.toString() : ''}
                              onChange={(e) => handleOrderUpdate(o.id, o.status, e.target.value)}
                              className="text-xs p-1.5 bg-[#000] border border-[#555] rounded text-gray-300"
                            />
                          </div>
                      </td>
                    </tr>
                  )
                })}
                {filteredOrders.length === 0 && (
                   <tr>
                   <td colSpan={4} className="p-8 text-center text-gray-500">
                     No orders found.
                   </td>
                 </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111] border border-[#333] rounded-3xl shadow-2xl w-full max-w-2xl my-8 relative flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-[#333] flex items-center justify-between sticky top-0 bg-[#0a0a0a] z-10 rounded-t-3xl">
                <h2 className="text-2xl font-heading font-bold text-white">
                  {editingProductId ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={() => setIsProductModalOpen(false)} className="p-2 text-gray-400 hover:bg-[#333] rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form id="product-form" onSubmit={handleProductSubmit} className="p-6 space-y-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-300 mb-1">Product Name *</label>
                    <input required value={productName} onChange={(e) => setProductName(e.target.value)} type="text" className="w-full p-3 bg-[#000] border border-[#444] rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-white" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-1">Base Price (₹) *</label>
                    <input required value={price} onChange={(e) => setPrice(e.target.value)} type="number" min="0" className="w-full p-3 bg-[#000] border border-[#444] rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-white" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-1">Discount Percentage (%)</label>
                    <input value={discountPercentage} onChange={(e) => setDiscountPercentage(e.target.value)} type="number" min="0" max="100" placeholder="e.g. 15" className="w-full p-3 bg-[#000] border border-[#444] rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-white" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-1">Category *</label>
                    <select required value={productCategory} onChange={(e) => setProductCategory(e.target.value)} className="w-full p-3 bg-[#000] border border-[#444] rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-white">
                      <option value="" disabled className="text-gray-500">
                        {categories.length === 0 ? "No categories available" : "Select a Category"}
                      </option>
                      {categories.map(c => (
                        <option key={c.id} value={c.name} className="text-black">{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-1">Stock Status *</label>
                    <select required value={stockStatus} onChange={(e) => setStockStatus(e.target.value as any)} className="w-full p-3 bg-[#000] border border-[#444] rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-white">
                      <option value="In Stock" className="text-black">In Stock</option>
                      <option value="Low Stock" className="text-black">Low Stock</option>
                      <option value="Out of Stock" className="text-black">Out of Stock</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-300 mb-1">Description *</label>
                    <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full p-3 bg-[#000] border border-[#444] rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-white"></textarea>
                  </div>

                  {/* Image Section */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-300 mb-2">Product Image Format *</label>
                    
                    <div className="flex gap-4 mb-4">
                      <label className="flex items-center gap-2 text-sm cursor-default font-bold text-primary-500">
                        <LinkIcon className="w-4 h-4" />
                        Direct Web URL
                      </label>
                    </div>

                    <input 
                      required 
                      type="url" 
                      value={productImageUrl} 
                      onChange={(e) => {
                         const val = e.target.value;
                         if (val.startsWith('C:\\') || val.startsWith('file://')) {
                            addToast('Local files are not supported. Use valid URL paths', 'error');
                            setProductImageUrl('');
                         } else {
                            setProductImageUrl(val);
                         }
                      }} 
                      placeholder="https://images.unsplash.com/photo-..." 
                      className="w-full p-3 bg-[#000] border border-[#444] rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-white mb-4" 
                    />

                    {productImageUrl && (
                      <div className="mt-2 bg-[#000] p-2 rounded-xl inline-block border border-[#444]">
                        <div className="w-24 h-24 rounded-lg overflow-hidden relative">
                           <img src={productImageUrl} alt="Preview" className="w-full h-full object-cover bg-white" onError={(e) => { (e.target as HTMLImageElement).src = '/images/fallback.svg'; }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </form>

              <div className="p-6 border-t border-[#333] flex justify-end gap-4 sticky bottom-0 bg-[#0a0a0a] rounded-b-3xl">
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold text-gray-400 hover:bg-[#222] transition-colors">
                  Cancel
                </button>
                <button form="product-form" type="submit" className="px-6 py-2.5 rounded-xl font-bold bg-primary-600 hover:bg-primary-500 text-white transition-colors">
                  Save Product to Firestore
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Category Modal */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111] border border-[#333] rounded-3xl shadow-2xl w-full max-w-xl my-8 relative flex flex-col"
            >
              <div className="p-6 border-b border-[#333] flex items-center justify-between bg-[#0a0a0a] rounded-t-3xl">
                <h2 className="text-2xl font-heading font-bold text-white">
                  {editingCategoryId ? 'Edit Category' : 'Add New Category'}
                </h2>
                <button onClick={() => setIsCategoryModalOpen(false)} className="p-2 text-gray-400 hover:bg-[#333] rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form id="category-form" onSubmit={handleCategorySubmit} className="p-6 space-y-6">
                 <div>
                    <label className="block text-sm font-bold text-gray-300 mb-1">Category Name *</label>
                    <input required value={categoryName} onChange={(e) => setCategoryName(e.target.value)} type="text" className="w-full p-3 bg-[#000] border border-[#444] rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-white" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Category Image *</label>
                    <div className="flex gap-4 mb-4">
                      <label className="flex items-center gap-2 text-sm cursor-default font-bold text-primary-500">
                        <LinkIcon className="w-4 h-4" />
                        Direct Web URL
                      </label>
                    </div>

                    <input 
                      required 
                      type="url" 
                      value={categoryImageUrl} 
                      onChange={(e) => {
                         const val = e.target.value;
                         if (val.startsWith('C:\\') || val.startsWith('file://')) {
                            addToast('Local files are not supported. Use valid URL paths', 'error');
                            setCategoryImageUrl('');
                         } else {
                            setCategoryImageUrl(val);
                         }
                      }} 
                      placeholder="https://images.unsplash.com/photo-..." 
                      className="w-full p-3 bg-[#000] border border-[#444] rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-white mb-4" 
                    />

                    {categoryImageUrl && (
                      <div className="mt-2 bg-[#000] p-2 rounded-xl inline-block border border-[#444]">
                        <div className="w-24 h-24 rounded-lg overflow-hidden relative">
                           <img src={categoryImageUrl} alt="Preview" className="w-full h-full object-cover bg-white" onError={(e) => { (e.target as HTMLImageElement).src = '/images/fallback.svg'; }} />
                        </div>
                      </div>
                    )}
                  </div>
              </form>

              <div className="p-6 border-t border-[#333] flex justify-end gap-4 bg-[#0a0a0a] rounded-b-3xl">
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold text-gray-400 hover:bg-[#222] transition-colors">
                  Cancel
                </button>
                <button form="category-form" type="submit" className="px-6 py-2.5 rounded-xl font-bold bg-primary-600 hover:bg-primary-500 text-white transition-colors">
                  Save to Firestore
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
