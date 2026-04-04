'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, seedProducts } from './data';

type CartItem = {
  product: Product;
  quantity: number;
};

type StoreContextType = {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  addProduct: (product: Product) => void;
  editProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  isLoadingData: boolean;

  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  user: any | null;
  login: (mobileNumber: string) => void;
  logout: () => void;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState<any | null>(null);

  // Initialize from sessionStorage/localStorage to prevent hydration errors
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem('ap-products');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      } else {
        setProducts(seedProducts);
      }
      
      const savedCart = sessionStorage.getItem('ap-cart');
      const savedWishlist = sessionStorage.getItem('ap-wishlist');
      const savedUser = sessionStorage.getItem('ap-user');
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      if (savedUser) setUser(JSON.parse(savedUser));
    } catch (e) {
      console.warn("Storage access failed", e);
      setProducts(seedProducts);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoadingData) {
      localStorage.setItem('ap-products', JSON.stringify(products));
    }
  }, [products, isLoadingData]);

  useEffect(() => {
    sessionStorage.setItem('ap-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    sessionStorage.setItem('ap-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    sessionStorage.setItem('ap-user', JSON.stringify(user));
  }, [user]);

  // Admin Actions
  const addProduct = (product: Product) => setProducts(prev => [...prev, product]);
  const editProduct = (product: Product) => setProducts(prev => prev.map(p => p.id === product.id ? product : p));
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const login = (mobileNumber: string) => {
    setUser({ mobile: mobileNumber, name: "Guest User" });
  };

  const logout = () => {
    setUser(null);
  };

  const cartTotal = cart.reduce(
    (total, item) => {
      const itemFinalPrice = item.product.discountPercentage 
        ? item.product.price - Math.round((item.product.price * item.product.discountPercentage) / 100) 
        : item.product.price;
      return total + itemFinalPrice * item.quantity;
    },
    0
  );

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        products,
        setProducts,
        addProduct,
        editProduct,
        deleteProduct,
        isLoadingData,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        wishlist,
        toggleWishlist,
        user,
        login,
        logout,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}

