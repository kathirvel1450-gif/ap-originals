'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { Product, seedProducts, Category, seedCategories, StoreSettings, Order, OrderItem } from './data';

export type UserData = {
  mobile: string;
  name?: string;
  createdAt: number;
};

type CartItem = {
  product: Product;
  quantity: number;
};

type StoreContextType = {
  products: Product[];
  addProduct: (product: Product) => void;
  editProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;

  categories: Category[];
  addCategory: (category: Category) => void;
  editCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  
  users: UserData[];
  currentUser: UserData | null;
  registerUser: (mobile: string) => void;
  loginUser: (mobile: string) => void;

  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: Order['status'], deliveryDate?: string) => void;

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

  storeSettings: StoreSettings;
  updateStoreSettings: (settings: StoreSettings) => void;

  isAdmin: boolean;
  adminLogin: () => void;
  adminLogout: () => void;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    appName: 'AP originals',
    appTagline: 'Premium quality organic grocery & pure cold-pressed oils. Bringing the traditional purity back to your kitchen.',
    address: '123 Organic Lane, Chennai, India',
    phone: '+91 9876543210',
    email: 'contact@aporiginals.com',
    deliveryFee: 50,
    tax: 5
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState<any | null>(null);

  // Firestore onSnapshot listeners
  useEffect(() => {
    let unsubs: any[] = [];
    
    try {
      // 1. Categories
      const unsubCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
        const catsData: Category[] = [];
        snapshot.forEach((doc) => {
          catsData.push({ id: doc.id, ...doc.data() } as Category);
        });
        setCategories(catsData);
      });
      unsubs.push(unsubCategories);

      // 2. Products
      const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
        const prodsData: Product[] = [];
        snapshot.forEach((doc) => {
          prodsData.push({ id: doc.id, ...doc.data() } as Product);
        });
        setProducts(prodsData);
      });
      unsubs.push(unsubProducts);

      // 3. Settings
      const unsubSettings = onSnapshot(doc(db, 'storeSettings', 'global'), (docSnap) => {
        if (docSnap.exists()) {
          setStoreSettings(docSnap.data() as StoreSettings);
        }
      });
      unsubs.push(unsubSettings);

      // 4. Users
      const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
        const usersData: UserData[] = [];
        snapshot.forEach((doc) => {
          usersData.push(doc.data() as UserData);
        });
        setUsers(usersData);
      });
      unsubs.push(unsubUsers);

      // 5. Orders
      const unsubOrders = onSnapshot(query(collection(db, 'orders'), orderBy('createdAt', 'desc')), (snapshot) => {
        const ordersData: Order[] = [];
        snapshot.forEach((doc) => {
          ordersData.push({ id: doc.id, ...doc.data() } as Order);
        });
        setOrders(ordersData);
      });
      unsubs.push(unsubOrders);

    } catch (error) {
      console.error("Firestore Subscribe Error:", error);
    }

    setIsLoadingData(false);

    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, []);

  // Local storage syncing for session continuity (Cart, Wishlist, CurrentUser, AdminSession)
  useEffect(() => {
    try {
      const savedAdmin = localStorage.getItem('ap-admin-auth');
      if (savedAdmin === 'true') setIsAdmin(true);

      const savedCurrentUser = localStorage.getItem('currentUser');
      if (savedCurrentUser) setCurrentUser(JSON.parse(savedCurrentUser));

      const savedCart = sessionStorage.getItem('ap-cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = sessionStorage.getItem('ap-wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch (e) {
      console.warn("Local storage parse failed", e);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  useEffect(() => {
    if (isAdmin) {
      localStorage.setItem('ap-admin-auth', 'true');
    } else {
      localStorage.removeItem('ap-admin-auth');
    }
  }, [isAdmin]);

  useEffect(() => {
    sessionStorage.setItem('ap-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    sessionStorage.setItem('ap-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Firestore Methods
  const addCategory = async (category: Category) => {
    if(!category.id) category.id = `c_${Date.now()}`;
    await setDoc(doc(db, 'categories', category.id), category);
  };
  const editCategory = async (category: Category) => {
    await updateDoc(doc(db, 'categories', category.id), { ...category });
  };
  const deleteCategory = async (id: string) => {
    await deleteDoc(doc(db, 'categories', id));
  };

  const addProduct = async (product: Product) => {
    if(!product.id) product.id = `p_${Date.now()}`;
    await setDoc(doc(db, 'products', product.id), product);
  };
  const editProduct = async (product: Product) => {
    await updateDoc(doc(db, 'products', product.id), { ...product });
  };
  const deleteProduct = async (id: string) => {
    await deleteDoc(doc(db, 'products', id));
  };

  const updateStoreSettings = async (settings: StoreSettings) => {
    await setDoc(doc(db, 'storeSettings', 'global'), settings);
  };

  const addOrder = async (order: Order) => {
    if(!order.id) order.id = `ORD_${Date.now()}`;
    await setDoc(doc(db, 'orders', order.id), order);
  };
  
  const updateOrderStatus = async (id: string, status: Order['status'], deliveryDate?: string) => {
    const updatePayload: any = { status };
    if (deliveryDate !== undefined) updatePayload.deliveryDate = deliveryDate;
    await updateDoc(doc(db, 'orders', id), updatePayload);
  };

  const registerUser = async (mobile: string) => {
    const newUser = { mobile, createdAt: Date.now() };
    await setDoc(doc(db, 'users', mobile), newUser);
    setCurrentUser(newUser);
  };

  const loginUser = (mobile: string) => {
    const existing = users.find(u => u.mobile === mobile);
    if (existing) {
      setCurrentUser(existing);
    }
  };

  // Local/Session methods
  const adminLogin = () => setIsAdmin(true);
  const adminLogout = () => setIsAdmin(false);

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
    setCurrentUser(null);
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
        addProduct,
        editProduct,
        deleteProduct,
        categories,
        addCategory,
        editCategory,
        deleteCategory,
        users,
        currentUser,
        registerUser,
        loginUser,
        orders,
        addOrder,
        updateOrderStatus,
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
        storeSettings,
        updateStoreSettings,
        isAdmin,
        adminLogin,
        adminLogout,
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
