'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from './api';
import { useAuth } from './auth-context';
import type { Cart } from './types';

interface CartContextValue {
  cart: Cart | null;
  itemCount: number;
  refreshCart: () => Promise<void>;
  addItem: (productId: string, sku: string, quantity?: number) => Promise<void>;
  updateItem: (productId: string, sku: string, quantity: number) => Promise<void>;
  removeItem: (productId: string, sku: string) => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCart(null);
      return;
    }
    try {
      const c = await api<Cart>('/cart');
      setCart(c);
    } catch {
      setCart(null);
    }
  }, [user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = useCallback(
    async (productId: string, sku: string, quantity = 1) => {
      const c = await api<Cart>('/cart/items', { method: 'POST', body: { productId, sku, quantity } });
      setCart(c);
    },
    [],
  );

  const updateItem = useCallback(async (productId: string, sku: string, quantity: number) => {
    const c = await api<Cart>('/cart/items/update', { method: 'POST', body: { productId, sku, quantity } });
    setCart(c);
  }, []);

  const removeItem = useCallback(async (productId: string, sku: string) => {
    const c = await api<Cart>(`/cart/items/${productId}/${sku}`, { method: 'DELETE' });
    setCart(c);
  }, []);

  const itemCount = cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

  return (
    <CartContext.Provider value={{ cart, itemCount, refreshCart, addItem, updateItem, removeItem }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
