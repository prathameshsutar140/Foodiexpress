import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  setDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Order, OrderStatus, Review, DeliveryAddress, PaymentMethod } from '../types';
import { INITIAL_ORDERS, INITIAL_REVIEWS, INITIAL_DELIVERY_PARTNERS } from '../data/mockData';
import { useAuth } from './AuthContext';

interface OrderContextType {
  orders: Order[];
  reviews: Review[];
  activeTrackingOrderId: string | null;
  setActiveTrackingOrderId: (id: string | null) => void;
  favorites: { restaurants: string[]; foods: string[] };
  toggleFavoriteRestaurant: (restaurantId: string) => void;
  toggleFavoriteFood: (foodId: string) => void;
  placeOrder: (orderData: {
    restaurantId: string;
    restaurantName: string;
    restaurantAddress: string;
    items: Order['items'];
    subtotal: number;
    deliveryFee: number;
    tax: number;
    discount: number;
    total: number;
    paymentMethod: PaymentMethod;
    deliveryAddress: DeliveryAddress;
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, reason?: string) => Promise<void>;
  cancelOrder: (orderId: string, reason?: string) => Promise<void>;
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => Promise<void>;
  advanceOrderStage: (orderId: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | null>(
    INITIAL_ORDERS[0]?.id || null
  );
  const [favorites, setFavorites] = useState<{ restaurants: string[]; foods: string[] }>({
    restaurants: ['rest-1', 'rest-3'],
    foods: ['food-101', 'food-201'],
  });

  // Listen to Firestore orders collection if connected
  useEffect(() => {
    const ordersColPath = 'orders';
    let unsubscribe: (() => void) | undefined;

    try {
      unsubscribe = onSnapshot(
        collection(db, ordersColPath),
        (snapshot) => {
          if (!snapshot.empty) {
            const fetched: Order[] = [];
            snapshot.forEach((d) => {
              fetched.push({ id: d.id, ...(d.data() as any) });
            });
            // Merge with default initial orders so demo is never empty
            setOrders((prev) => {
              const combined = [...fetched];
              INITIAL_ORDERS.forEach((init) => {
                if (!combined.some((o) => o.id === init.id)) {
                  combined.push(init);
                }
              });
              return combined.sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              );
            });
          }
        },
        (error) => {
          // If firestore permission or offline, fallback gracefully
          console.warn('Orders onSnapshot notice:', error.message);
        }
      );
    } catch (err) {
      console.warn('Orders subscription notice:', err);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const placeOrder = async (orderData: {
    restaurantId: string;
    restaurantName: string;
    restaurantAddress: string;
    items: Order['items'];
    subtotal: number;
    deliveryFee: number;
    tax: number;
    discount: number;
    total: number;
    paymentMethod: PaymentMethod;
    deliveryAddress: DeliveryAddress;
  }): Promise<Order> => {
    const newOrderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const driver = INITIAL_DELIVERY_PARTNERS[Math.floor(Math.random() * INITIAL_DELIVERY_PARTNERS.length)];

    const newOrder: Order = {
      id: newOrderId,
      customerId: profile.uid,
      customerName: profile.displayName || 'Foodie Customer',
      customerEmail: profile.email || 'customer@example.com',
      customerPhone: profile.phone || '+91 98199 88776',
      restaurantId: orderData.restaurantId,
      restaurantName: orderData.restaurantName,
      restaurantAddress: orderData.restaurantAddress,
      items: orderData.items,
      subtotal: orderData.subtotal,
      deliveryFee: orderData.deliveryFee,
      tax: orderData.tax,
      discount: orderData.discount,
      total: orderData.total,
      status: 'placed',
      paymentMethod: orderData.paymentMethod,
      paymentStatus: 'completed',
      deliveryAddress: orderData.deliveryAddress,
      deliveryPartnerId: driver.id,
      deliveryPartnerName: driver.name,
      deliveryPartnerPhone: driver.phone,
      estimatedDeliveryMinutes: 28,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Update local state immediately for snappy UI
    setOrders((prev) => [newOrder, ...prev]);
    setActiveTrackingOrderId(newOrderId);

    // Save to Firestore
    try {
      await setDoc(doc(db, 'orders', newOrderId), newOrder);
    } catch (err) {
      console.warn('Persisting order to Firestore note:', err);
    }

    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus, reason?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          ...(reason ? { cancellationReason: reason } : {}),
        };
      })
    );

    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        updatedAt: new Date().toISOString(),
        ...(reason ? { cancellationReason: reason } : {}),
      });
    } catch (err) {
      console.warn('Updating order in Firestore notice:', err);
    }
  };

  const cancelOrder = async (orderId: string, reason = 'Customer requested cancellation') => {
    await updateOrderStatus(orderId, 'cancelled', reason);
  };

  const advanceOrderStage = (orderId: string) => {
    const stages: OrderStatus[] = [
      'placed',
      'confirmed',
      'preparing',
      'ready_for_pickup',
      'out_for_delivery',
      'delivered',
    ];
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;

    const currentIndex = stages.indexOf(target.status);
    if (currentIndex >= 0 && currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1];
      updateOrderStatus(orderId, nextStage);
    }
  };

  const addReview = async (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: 'Just now',
    };
    setReviews((prev) => [newReview, ...prev]);

    try {
      await setDoc(doc(db, 'reviews', newReview.id), newReview);
    } catch (err) {
      console.warn('Add review to Firestore notice:', err);
    }
  };

  const toggleFavoriteRestaurant = (restaurantId: string) => {
    setFavorites((prev) => {
      const exists = prev.restaurants.includes(restaurantId);
      return {
        ...prev,
        restaurants: exists
          ? prev.restaurants.filter((id) => id !== restaurantId)
          : [...prev.restaurants, restaurantId],
      };
    });
  };

  const toggleFavoriteFood = (foodId: string) => {
    setFavorites((prev) => {
      const exists = prev.foods.includes(foodId);
      return {
        ...prev,
        foods: exists ? prev.foods.filter((id) => id !== foodId) : [...prev.foods, foodId],
      };
    });
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        reviews,
        activeTrackingOrderId,
        setActiveTrackingOrderId,
        favorites,
        toggleFavoriteRestaurant,
        toggleFavoriteFood,
        placeOrder,
        updateOrderStatus,
        cancelOrder,
        addReview,
        advanceOrderStage,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within an OrderProvider');
  return ctx;
};
