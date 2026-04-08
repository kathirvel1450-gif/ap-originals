'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/StoreContext';
import { useToast } from '@/lib/ToastContext';
import { categories, Product } from '@/lib/data';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPage() {
  const { products, addProduct, editProduct, deleteProduct } = useStore();
  const { addToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [stockStatus, setStockStatus] = useState<'In Stock' | 'Out of Stock' | 'Low Stock'>('In Stock');
  const [category, setCategory] = useState(categories[0].name);
  const [description, setDescription] = useState('');
  
  // Image State
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
  const [imageUrl, setImageUrl] = useState('');
  
  const resetForm = () => {
    setName('');
    setPrice('');
    setDiscountPercentage('');
    setStockStatus('In Stock');
    setCategory(categories[0].name);
    setDescription('');
    setImageUrl('');
    setImageMode('url');
    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingId(p.id);
    setName(p.name);
    setPrice(p.price.toString());
    setDiscountPercentage(p.discountPercentage ? p.discountPercentage.toString() : '');
    setStockStatus(p.stockStatus);
    setCategory(p.category);
    setDescription(p.description);
    setImageUrl(p.image);
    setImageMode(p.image.startsWith('data:image') ? 'upload' : 'url');
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      addToast("Image size should be less than 2MB for LocalStorage", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price || !imageUrl || !category) {
      addToast('Please fill all required fields', 'error');
      return;
    }

    const currentPrice = Number(price);
    const currentDiscount = discountPercentage ? Number(discountPercentage) : undefined;

    const newProduct: Product = {
      id: editingId || `p_${Date.now()}`,
      name,
      price: currentPrice,
      discountPercentage: currentDiscount,
      stockStatus,
      category,
      rating: editingId ? (products.find(p => p.id === editingId)?.rating || 5.0) : 5.0, // Keep rating or add default
      image: imageUrl,
      description
    };

    if (editingId) {
      editProduct(newProduct);
      addToast('Product updated successfully', 'success');
    } else {
      addProduct(newProduct);
      addToast('Product added successfully', 'success');
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string, productName: string) => {
    if (window.confirm(`Are you sure you want to delete ${productName}?`)) {
      deleteProduct(id);
      addToast('Product deleted', 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-earth-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-earth-500">Manage your inventory, prices, and offers dynamically via LocalStorage.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-md"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-earth-900 rounded-3xl border border-earth-200 dark:border-earth-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
            <tr className="bg-earth-50 dark:bg-earth-800/50 border-b border-earth-200 dark:border-earth-800 text-[#111] dark:text-white text-sm font-semibold uppercase tracking-wider">
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4 hidden md:table-cell">Price / Offer</th>
                <th className="p-4 hidden sm:table-cell">Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-200 dark:divide-earth-800">
              {products.map(p => {
                const finalPrice = p.discountPercentage 
                  ? p.price - Math.round((p.price * p.discountPercentage) / 100) 
                  : p.price;

                return (
                  <tr key={p.id} className="hover:bg-earth-50 dark:hover:bg-earth-800/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-earth-100 flex-shrink-0">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-earth-900 dark:text-white line-clamp-1">{p.name}</p>
                          <p className="text-xs text-earth-500 sm:hidden">₹{finalPrice}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-earth-700 dark:text-earth-300">
                      <span className="bg-earth-100 dark:bg-earth-800 px-2.5 py-1 rounded-md">{p.category}</span>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="flex flex-col">
                        <span className="font-bold text-earth-900 dark:text-white">₹{finalPrice}</span>
                        {p.discountPercentage && (
                          <span className="text-xs text-accent-600 font-semibold">{p.discountPercentage}% OFF (₹{p.price})</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        p.stockStatus === 'In Stock' ? 'bg-green-100 text-green-700' :
                        p.stockStatus === 'Low Stock' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {p.stockStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEditModal(p)} className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(p.id, p.name)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-earth-500">
                    No products found. Add some to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-earth-900/60 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-earth-900 rounded-3xl shadow-2xl w-full max-w-2xl my-8 relative flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-earth-100 dark:border-earth-800 flex items-center justify-between sticky top-0 bg-white dark:bg-earth-900 z-10 rounded-t-3xl">
                <h2 className="text-2xl font-heading font-bold text-earth-900 dark:text-white">
                  {editingId ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-earth-400 hover:bg-earth-100 dark:hover:bg-earth-800 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form id="product-form" onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-1">Product Name *</label>
                    <input required value={name} onChange={(e) => setName(e.target.value)} type="text" className="w-full p-3 bg-earth-50 dark:bg-black/50 border border-earth-200 dark:border-earth-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-1">Base Price (₹) *</label>
                    <input required value={price} onChange={(e) => setPrice(e.target.value)} type="number" min="0" className="w-full p-3 bg-earth-50 dark:bg-black/50 border border-earth-200 dark:border-earth-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-1">Discount Percentage (%)</label>
                    <input value={discountPercentage} onChange={(e) => setDiscountPercentage(e.target.value)} type="number" min="0" max="100" placeholder="e.g. 15" className="w-full p-3 bg-earth-50 dark:bg-black/50 border border-earth-200 dark:border-earth-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-1">Category *</label>
                    <select required value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 bg-earth-50 dark:bg-black/50 border border-earth-200 dark:border-earth-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white">
                      {categories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-1">Stock Status *</label>
                    <select required value={stockStatus} onChange={(e) => setStockStatus(e.target.value as any)} className="w-full p-3 bg-earth-50 dark:bg-black/50 border border-earth-200 dark:border-earth-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white">
                      <option value="In Stock">In Stock</option>
                      <option value="Low Stock">Low Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-1">Description *</label>
                    <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full p-3 bg-earth-50 dark:bg-black/50 border border-earth-200 dark:border-earth-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"></textarea>
                  </div>

                  {/* Image Section */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-2">Product Image *</label>
                    
                    <div className="flex gap-4 mb-4">
                      <label className="flex items-center gap-2 text-sm cursor-pointer dark:text-gray-300">
                        <input type="radio" value="url" checked={imageMode === 'url'} onChange={() => setImageMode('url')} className="text-primary-600 focus:ring-primary-500" />
                        Image URL
                      </label>
                      <label className="flex items-center gap-2 text-sm cursor-pointer dark:text-gray-300">
                        <input type="radio" value="upload" checked={imageMode === 'upload'} onChange={() => setImageMode('upload')} className="text-primary-600 focus:ring-primary-500" />
                        Upload File (Base64)
                      </label>
                    </div>

                    {imageMode === 'url' ? (
                       <input 
                         required 
                         type="url" 
                         value={imageUrl} 
                         onChange={(e) => setImageUrl(e.target.value)} 
                         placeholder="https://images.unsplash.com/photo-..." 
                         className="w-full p-3 bg-earth-50 dark:bg-black/50 border border-earth-200 dark:border-earth-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white mb-4" 
                       />
                    ) : (
                      <div className="mb-4">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-earth-300 dark:border-earth-700 rounded-xl bg-earth-50 dark:bg-earth-800/50 hover:bg-earth-100 dark:hover:bg-earth-800 cursor-pointer transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-8 h-8 text-earth-400 mb-2" />
                            <p className="text-sm text-earth-500 dark:text-earth-400 font-medium">Click to upload image</p>
                            <p className="text-xs text-earth-400 mt-1">PNG, JPG, WEBP (Max 2MB)</p>
                          </div>
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                      </div>
                    )}

                    {/* Image Preview */}
                    {imageUrl && (
                      <div className="mt-2 bg-earth-50 dark:bg-earth-800/50 p-2 rounded-xl inline-block border border-earth-200 dark:border-earth-700">
                        <div className="w-24 h-24 rounded-lg overflow-hidden relative">
                           <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </form>

              <div className="p-6 border-t border-earth-100 dark:border-earth-800 flex justify-end gap-4 sticky bottom-0 bg-white dark:bg-earth-900 rounded-b-3xl">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold text-earth-600 dark:text-earth-300 hover:bg-earth-100 dark:hover:bg-earth-800 transition-colors">
                  Cancel
                </button>
                <button form="product-form" type="submit" className="px-6 py-2.5 rounded-xl font-bold bg-primary-600 hover:bg-primary-500 text-white transition-colors">
                  Save Product
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
