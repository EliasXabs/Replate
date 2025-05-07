import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  restaurantId: string;
  restaurantName: string;
  price: number;
  image: any;
  qty: number;
}

interface CartCtx {
  items: CartItem[];
  addOrInc: (item: Omit<CartItem, 'qty'>) => void;
  dec: (id: string) => void;
  clear: () => void;
  total: number;
}

const CartContext = createContext<CartCtx | null>(null);

/* ---------- provider ---------- */
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addOrInc = (item: Omit<CartItem, 'qty'>) =>
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...item, qty: 1 }];
    });

  const dec = (id: string) =>
    setItems(prev =>
      prev
        .map(i => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter(i => i.qty > 0),
    );

  const clear = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.qty * i.price, 0);

  return (
    <CartContext.Provider value={{ items, addOrInc, dec, clear, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};
