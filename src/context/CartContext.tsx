import React, { createContext, useContext, useState, useMemo } from 'react';
import { CartItem, FoodItem, FoodCustomizationOption, Coupon } from '../types';
import { INITIAL_COUPONS } from '../data/mockData';

interface CartContextType {
  items: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addItem: (foodItem: FoodItem, quantity?: number, selectedOptions?: FoodCustomizationOption[], instructions?: string) => void;
  removeItem: (foodItemId: string, optionsKey?: string) => void;
  updateQuantity: (foodItemId: string, delta: number, optionsKey?: string) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  packagingFee: number;
  discount: number;
  total: number;
  totalItemCount: number;
  restaurantId: string | null;
  restaurantName: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const restaurantId = useMemo(() => (items.length > 0 ? items[0].foodItem.restaurantId : null), [items]);
  const restaurantName = useMemo(() => (items.length > 0 ? items[0].foodItem.restaurantName : null), [items]);

  const totalItemCount = useMemo(() => items.reduce((acc, item) => acc + item.quantity, 0), [items]);

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => {
      const optionsTotal = (item.selectedOptions || []).reduce((sum, opt) => sum + opt.price, 0);
      return acc + (item.foodItem.price + optionsTotal) * item.quantity;
    }, 0);
  }, [items]);

  const deliveryFee = useMemo(() => {
    if (items.length === 0) return 0;
    // Free delivery on orders over ₹499
    if (subtotal >= 499) return 0;
    return 29;
  }, [items, subtotal]);

  const packagingFee = useMemo(() => (items.length > 0 ? 15 : 0), [items]);

  const tax = useMemo(() => Math.round(subtotal * 0.05), [subtotal]);

  const discount = useMemo(() => {
    if (!appliedCoupon || subtotal < appliedCoupon.minOrder) return 0;
    const calc = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    return Math.min(calc, appliedCoupon.maxDiscount);
  }, [appliedCoupon, subtotal]);

  const total = useMemo(() => {
    if (items.length === 0) return 0;
    return Math.max(0, subtotal + deliveryFee + packagingFee + tax - discount);
  }, [items, subtotal, deliveryFee, packagingFee, tax, discount]);

  const addItem = (
    foodItem: FoodItem,
    quantity = 1,
    selectedOptions: FoodCustomizationOption[] = [],
    instructions = ''
  ) => {
    setItems((prev) => {
      // Check if item from another restaurant
      if (prev.length > 0 && prev[0].foodItem.restaurantId !== foodItem.restaurantId) {
        // Replace items from new restaurant
        return [{ foodItem, quantity, selectedOptions, specialInstructions: instructions }];
      }

      const existingIndex = prev.findIndex(
        (i) =>
          i.foodItem.id === foodItem.id &&
          JSON.stringify(i.selectedOptions || []) === JSON.stringify(selectedOptions)
      );

      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }

      return [...prev, { foodItem, quantity, selectedOptions, specialInstructions: instructions }];
    });
  };

  const removeItem = (foodItemId: string, optionsKey?: string) => {
    setItems((prev) =>
      prev.filter((item) => {
        if (item.foodItem.id !== foodItemId) return true;
        if (optionsKey && JSON.stringify(item.selectedOptions || []) !== optionsKey) return true;
        return false;
      })
    );
  };

  const updateQuantity = (foodItemId: string, delta: number, optionsKey?: string) => {
    setItems((prev) => {
      return prev
        .map((item) => {
          if (item.foodItem.id !== foodItemId) return item;
          if (optionsKey && JSON.stringify(item.selectedOptions || []) !== optionsKey) return item;

          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          return { ...item, quantity: newQty };
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const coupon = INITIAL_COUPONS.find(
      (c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive
    );
    if (!coupon) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }
    if (subtotal < coupon.minOrder) {
      return {
        success: false,
        message: `Cart total must be at least ₹${coupon.minOrder} to apply ${coupon.code}.`,
      };
    }
    setAppliedCoupon(coupon);
    return {
      success: true,
      message: `Coupon ${coupon.code} applied! Saved ₹${Math.min(
        Math.round((subtotal * coupon.discountPercent) / 100),
        coupon.maxDiscount
      )}.`,
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        setIsCartOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        deliveryFee,
        packagingFee,
        tax,
        discount,
        total,
        totalItemCount,
        restaurantId,
        restaurantName,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};
