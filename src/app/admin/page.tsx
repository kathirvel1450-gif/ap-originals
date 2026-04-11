'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/StoreContext';
import { useToast } from '@/lib/ToastContext';
import { Product, Category } from '@/lib/data';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPage() {
  const { 
    products, addProduct, editProduct, deleteProduct, 
    categories, addCategory, editCategory, deleteCategory,
    storeSettings, updateStoreSettings, adminLogout 
  } = useStore();
  const { addToast } = useToast();

  // --- Store Settings State ---
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [appName, setAppName] = useState('');
  const [appTagline, setAppTagline] = useState('');

  React.useEffect(() => {
    if (storeSettings && !isEditingSettings) {
      setAppName(storeSettings.appName);
      setAppTagline(storeSettings.appTagline);
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
  const [productImageMode, setProductImageMode] = useState<'url' | 'upload'>('url');
  const [productImageUrl, setProductImageUrl] = useState('');

  // --- Category Form State ---
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryImageMode, setCategoryImageMode] = useState<'url' | 'upload'>('url');
  const [categoryImageUrl, setCategoryImageUrl] = useState('');

  // --- Handlers ---
  const handleSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings({ appName, appTagline });
    setIsEditingSettings(false);
    addToast('Settings updated successfully', 'success');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setUrl: React.Dispatch<React.SetStateAction<string>>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1 * 1024 * 1024) {
      addToast("Image too large. Use image URL instead", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // --- Product Handlers ---
  const resetProductForm = () => {
    setProductName('');
    setPrice('');
    setDiscountPercentage('');
    setStockStatus('In Stock');
    setProductCategory(categories[0]?.name || '');
    setDescription('');
    setProductImageUrl('');
    setProductImageMode('url');
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
    setProductImageMode(p.image.startsWith('data:image') ? 'upload' : 'url');
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !price || !productImageUrl || !productCategory) {
      addToast('Please fill all required fields', 'error');
      return;
    }

    const newProduct: Product = {
      id: editingProductId || `p_${Date.now()}`,
      name: productName,
      price: Number(price),
      discountPercentage: discountPercentage ? Number(discountPercentage) : undefined,
      stockStatus,
      category: productCategory,
      rating: editingProductId ? (products.find(p => p.id === editingProductId)?.rating || 5.0) : 5.0,
      image: productImageUrl,
      description
    };

    if (editingProductId) {
      editProduct(newProduct);
      addToast('Product updated successfully', 'success');
    } else {
      addProduct(newProduct);
      addToast('Product added successfully', 'success');
    }

    setIsProductModalOpen(false);
    resetProductForm();
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteProduct(id);
      addToast('Product deleted', 'info');
    }
  };

  // --- Category Handlers ---
  const resetCategoryForm = () => {
    setCategoryName('');
    setCategoryImageUrl('');
    setCategoryImageMode('url');
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
    setCategoryImageMode(c.image.startsWith('data:image') ? 'upload' : 'url');
    setIsCategoryModalOpen(true);
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName || !categoryImageUrl) {
      addToast('Please fill all required fields', 'error');
      return;
    }

    const newCategory: Category = {
      id: editingCategoryId || `c_${Date.now()}`,
      name: categoryName,
      image: categoryImageUrl
    };

    if (editingCategoryId) {
      editCategory(newCategory);
      addToast('Category updated successfully', 'success');
    } else {
      addCategory(newCategory);
      addToast('Category added successfully', 'success');
    }

    setIsCategoryModalOpen(false);
    resetCategoryForm();
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      deleteCategory(id);
      addToast('Category deleted', 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-[#111] dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-500">Manage your inventory, categories, and offers dynamically.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => {
               adminLogout();
               addToast('Logged out successfully', 'info');
            }}
            className="px-4 py-3 border border-gray-200 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-xl font-bold transition-colors bg-white shadow-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Store Settings Section */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 mb-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#111] font-heading flex items-center gap-2">
            Store Branding
          </h2>
          {!isEditingSettings && (
            <button onClick={() => setIsEditingSettings(true)} className="text-primary-600 font-bold hover:underline text-sm flex items-center gap-1 bg-primary-50 px-3 py-1.5 rounded-lg">
              <Edit2 className="w-4 h-4" /> Edit
            </button>
          )}
        </div>
        
        {isEditingSettings ? (
          <form onSubmit={handleSettingsSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#111] mb-1">App Name</label>
                <input 
                  required 
                  value={appName} 
                  onChange={(e) => setAppName(e.target.value)} 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-[#111]" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-[#111] mb-1">Tagline</label>
                <input 
                  required 
                  value={appTagline} 
                  onChange={(e) => setAppTagline(e.target.value)} 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-[#111]" 
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => { setIsEditingSettings(false); setAppName(storeSettings.appName); setAppTagline(storeSettings.appTagline); }} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition-colors">Save Details</button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">App Name</p>
              <p className="font-bold text-[#111] text-lg">{storeSettings?.appName}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Tagline</p>
              <p className="font-semibold text-gray-700">{storeSettings?.appTagline}</p>
            </div>
          </div>
        )}
      </div>

      {/* Categories Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-[#111] font-heading">Categories</h2>
          <button 
            onClick={openAddCategoryModal}
            className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col items-center group relative">
              <div className="absolute top-2 right-2 flex gap-1 bg-white/90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity p-1 shadow-sm border border-gray-100">
                <button onClick={() => openEditCategoryModal(c)} className="p-1.5 text-primary-600 hover:bg-primary-50 rounded transition-colors"><Edit2 className="w-3 h-3" /></button>
                <button onClick={() => handleDeleteCategory(c.id, c.name)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-3 h-3" /></button>
              </div>
              <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-gray-100 shadow-sm flex-shrink-0 bg-gray-50">
                 <img src={c.image} alt={c.name} onError={(e) => { e.currentTarget.src = '/images/fallback.svg'; }} className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-[#111] text-center text-sm">{c.name}</span>
            </div>
          ))}
          {categories.length === 0 && (
             <div className="col-span-full p-8 text-center text-gray-500 bg-white rounded-2xl border border-gray-200 border-dashed">
                No categories found.
             </div>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-[#111] font-heading">Products List</h2>
          <button 
            onClick={openAddProductModal}
            className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[#111] text-sm font-bold uppercase tracking-wider">
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4 hidden md:table-cell">Price / Offer</th>
                  <th className="p-4 hidden sm:table-cell">Stock</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map(p => {
                  const finalPrice = p.discountPercentage 
                    ? p.price - Math.round((p.price * p.discountPercentage) / 100) 
                    : p.price;

                  return (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                            <img src={p.image} alt={p.name} onError={(e) => { e.currentTarget.src = '/images/fallback.svg'; }} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-[#111] line-clamp-1">{p.name}</p>
                            <p className="text-xs text-gray-500 sm:hidden">₹{finalPrice}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-700">
                        <span className="bg-gray-100 font-semibold px-2.5 py-1 rounded-md">{p.category}</span>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#111]">₹{finalPrice}</span>
                          {p.discountPercentage && (
                            <span className="text-xs text-primary-600 font-bold">{p.discountPercentage}% OFF (₹{p.price})</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          p.stockStatus === 'In Stock' ? 'bg-green-100 text-green-700 border border-green-200' :
                          p.stockStatus === 'Low Stock' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                          'bg-red-100 text-red-700 border border-red-200'
                        }`}>
                          {p.stockStatus}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEditProductModal(p)} className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors border border-transparent hover:border-primary-100">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteProduct(p.id, p.name)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100">
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

      {/* Product Modal */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8 relative flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-3xl">
                <h2 className="text-2xl font-heading font-bold text-[#111]">
                  {editingProductId ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={() => setIsProductModalOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form id="product-form" onSubmit={handleProductSubmit} className="p-6 space-y-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-[#111] mb-1">Product Name *</label>
                    <input required value={productName} onChange={(e) => setProductName(e.target.value)} type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-[#111]" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#111] mb-1">Base Price (₹) *</label>
                    <input required value={price} onChange={(e) => setPrice(e.target.value)} type="number" min="0" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-[#111]" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#111] mb-1">Discount Percentage (%)</label>
                    <input value={discountPercentage} onChange={(e) => setDiscountPercentage(e.target.value)} type="number" min="0" max="100" placeholder="e.g. 15" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-[#111]" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#111] mb-1">Category *</label>
                    <select required value={productCategory} onChange={(e) => setProductCategory(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-[#111]">
                      {categories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#111] mb-1">Stock Status *</label>
                    <select required value={stockStatus} onChange={(e) => setStockStatus(e.target.value as any)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-[#111]">
                      <option value="In Stock">In Stock</option>
                      <option value="Low Stock">Low Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-[#111] mb-1">Description *</label>
                    <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-[#111]"></textarea>
                  </div>

                  {/* Image Section */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-[#111] mb-2">Product Image *</label>
                    
                    <div className="flex gap-4 mb-4">
                      <label className="flex items-center gap-2 text-sm cursor-pointer font-bold text-gray-700">
                        <input type="radio" value="url" checked={productImageMode === 'url'} onChange={() => setProductImageMode('url')} className="text-primary-600 focus:ring-primary-500" />
                        Image URL (Recommended)
                      </label>
                      <label className="flex items-center gap-2 text-sm cursor-pointer font-bold text-gray-700">
                        <input type="radio" value="upload" checked={productImageMode === 'upload'} onChange={() => setProductImageMode('upload')} className="text-primary-600 focus:ring-primary-500" />
                        Upload File (Base64)
                      </label>
                    </div>

                    {productImageMode === 'url' ? (
                       <input 
                         required 
                         type="url" 
                         value={productImageUrl} 
                         onChange={(e) => setProductImageUrl(e.target.value)} 
                         placeholder="https://images.unsplash.com/photo-..." 
                         className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-[#111] mb-4" 
                       />
                    ) : (
                      <div className="mb-4">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500 font-bold">Click to upload image</p>
                            <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP (Max 1MB)</p>
                          </div>
                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setProductImageUrl)} className="hidden" />
                        </label>
                      </div>
                    )}

                    {productImageUrl && (
                      <div className="mt-2 bg-gray-50 p-2 rounded-xl inline-block border border-gray-200">
                        <div className="w-24 h-24 rounded-lg overflow-hidden relative">
                           <img src={productImageUrl} alt="Preview" className="w-full h-full object-cover bg-white" onError={(e) => { (e.target as HTMLImageElement).src = '/images/fallback.svg'; }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </form>

              <div className="p-6 border-t border-gray-200 flex justify-end gap-4 sticky bottom-0 bg-white rounded-b-3xl">
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">
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

      {/* Category Modal */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-xl my-8 relative flex flex-col"
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-white rounded-t-3xl">
                <h2 className="text-2xl font-heading font-bold text-[#111]">
                  {editingCategoryId ? 'Edit Category' : 'Add New Category'}
                </h2>
                <button onClick={() => setIsCategoryModalOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form id="category-form" onSubmit={handleCategorySubmit} className="p-6 space-y-6">
                 <div>
                    <label className="block text-sm font-bold text-[#111] mb-1">Category Name *</label>
                    <input required value={categoryName} onChange={(e) => setCategoryName(e.target.value)} type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-[#111]" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#111] mb-2">Category Image *</label>
                    <div className="flex gap-4 mb-4">
                      <label className="flex items-center gap-2 text-sm cursor-pointer font-bold text-gray-700">
                        <input type="radio" value="url" checked={categoryImageMode === 'url'} onChange={() => setCategoryImageMode('url')} className="text-primary-600 focus:ring-primary-500" />
                        Image URL (Recommended)
                      </label>
                      <label className="flex items-center gap-2 text-sm cursor-pointer font-bold text-gray-700">
                        <input type="radio" value="upload" checked={categoryImageMode === 'upload'} onChange={() => setCategoryImageMode('upload')} className="text-primary-600 focus:ring-primary-500" />
                        Upload File (Base64)
                      </label>
                    </div>

                    {categoryImageMode === 'url' ? (
                       <input 
                         required 
                         type="url" 
                         value={categoryImageUrl} 
                         onChange={(e) => setCategoryImageUrl(e.target.value)} 
                         placeholder="https://images.unsplash.com/photo-..." 
                         className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 text-[#111] mb-4" 
                       />
                    ) : (
                      <div className="mb-4">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500 font-bold">Click to upload image</p>
                            <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP (Max 1MB)</p>
                          </div>
                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setCategoryImageUrl)} className="hidden" />
                        </label>
                      </div>
                    )}

                    {categoryImageUrl && (
                      <div className="mt-2 bg-gray-50 p-2 rounded-xl inline-block border border-gray-200">
                        <div className="w-24 h-24 rounded-lg overflow-hidden relative">
                           <img src={categoryImageUrl} alt="Preview" className="w-full h-full object-cover bg-white" onError={(e) => { (e.target as HTMLImageElement).src = '/images/fallback.svg'; }} />
                        </div>
                      </div>
                    )}
                  </div>
              </form>

              <div className="p-6 border-t border-gray-200 flex justify-end gap-4 bg-white rounded-b-3xl">
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
                <button form="category-form" type="submit" className="px-6 py-2.5 rounded-xl font-bold bg-primary-600 hover:bg-primary-500 text-white transition-colors">
                  Save Category
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
