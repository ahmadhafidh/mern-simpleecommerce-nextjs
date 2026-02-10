'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import axiosInstance from '@/axiosInstance';
import Cookies from 'js-cookie';
import { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  total: number;
}

interface CartContextType extends CartState {
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartItemsCount: () => number;
  checkout: (email: string, name: string, phone: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction =
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(i => i.product.id === action.payload.id);
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.product.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return { ...state, items: updatedItems, total: calculateTotal(updatedItems) };
      } else {
        const newItems = [
          ...state.items,
          { id: `cart-${Date.now()}`, product: action.payload, quantity: 1 },
        ];
        return { ...state, items: newItems, total: calculateTotal(newItems) };
      }
    }

    case 'REMOVE_FROM_CART': {
      const filteredItems = state.items.filter(item => item.product.id !== action.payload);
      return { ...state, items: filteredItems, total: calculateTotal(filteredItems) };
    }

    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items
        .map(item =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
        .filter(item => item.quantity > 0);
      return { ...state, items: updatedItems, total: calculateTotal(updatedItems) };
    }

    case 'CLEAR_CART':
      return { items: [], total: 0 };

    case 'LOAD_CART':
      return { items: action.payload, total: calculateTotal(action.payload) };

    default:
      return state;
  }
}

function calculateTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  const token = Cookies.get('token');
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  // Load cart dari backend saat mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!token) return;
        const res = await axiosInstance.get('/carts', { headers: authHeaders });
        const backendItems: CartItem[] = (res.data.data || []).map((c: any) => ({
          id: `cart-${c.id}`,
          product: {
            ...c.product,
            image: c.product.image.replace(
              'http://127.0.0.1:5025',
              'https://api-mern-simpleecommerce.idkoding.com'
            ),
          },
          quantity: c.quantity,
        }));
        dispatch({ type: 'LOAD_CART', payload: backendItems });
      } catch (err) {
        console.error('Failed to fetch backend cart:', err);
      }
    };
    fetchCart();
  }, []);

  // Simpan ke localStorage sebagai cache
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = async (product: Product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
    try {
      if (!token) return;
      await axiosInstance.post(
        '/carts',
        { productId: product.id, quantity: 1 },
        { headers: authHeaders }
      );
    } catch (err) {
      console.error('Failed to add to backend cart:', err);
    }
  };

  const removeFromCart = async (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    try {
      if (!token) return;
      await axiosInstance.delete(`/carts/${productId}`, { headers: authHeaders });
    } catch (err) {
      console.error('Failed to remove from backend cart:', err);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
    try {
      if (!token) return;
      await axiosInstance.put(
        `/carts/${productId}`,
        { quantity },
        { headers: authHeaders }
      );
    } catch (err) {
      console.error('Failed to update backend cart:', err);
    }
  };

  const clearCart = async () => {
    dispatch({ type: 'CLEAR_CART' });
    try {
      if (!token) return;
      await axiosInstance.delete('/carts', { headers: authHeaders }); // hapus semua cart backend
    } catch (err) {
      console.error('Failed to clear backend cart:', err);
    }
  };

  const getCartItemsCount = () =>
    state.items.reduce((count, item) => count + item.quantity, 0);

  const checkout = async (email: string, name: string, phone: string) => {
    try {
      if (!token) return;
      const today = new Date().toISOString().split('T')[0];
      await axiosInstance.post(
        '/invoice/checkout',
        { email, name, phone, date: today },
        { headers: authHeaders }
      );
      clearCart();
      alert('Checkout successful!');
    } catch (err) {
      console.error('Checkout failed:', err);
      alert('Checkout failed!');
    }
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartItemsCount,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}