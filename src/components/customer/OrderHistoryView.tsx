import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShoppingBag,
  RotateCcw,
  Star,
  MapPin,
  Clock,
  ArrowRight,
  ChevronRight,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useCart } from '../../context/CartContext';
import { INITIAL_FOOD_ITEMS } from '../../data/mockData';
import { Order } from '../../types';
import { useToast } from '../ui/Toast';

interface OrderHistoryViewProps {
  onTrackOrder: (orderId: string) => void;
  onOpenReview: (restaurantId: string, restaurantName: string) => void;
  onBrowseMenu: () => void;
}

export const OrderHistoryView: React.FC<OrderHistoryViewProps> = ({
  onTrackOrder,
  onOpenReview,
  onBrowseMenu,
}) => {
  const { orders } = useOrders();
  const { addItem, setIsCartOpen } = useCart();
  const { showToast } = useToast();

  const handleReorder = (order: Order) => {
    let count = 0;
    order.items.forEach((item) => {
      const foodItem = INITIAL_FOOD_ITEMS.find((f) => f.id === item.foodItemId);
      if (foodItem) {
        addItem(foodItem, item.quantity, item.selectedOptions);
        count++;
      }
    });

    if (count > 0) {
      showToast('Reorder Added to Cart', `${count} items added from ${order.restaurantName}`);
      setIsCartOpen(true);
    } else {
      showToast('Notice', 'Dishes from this restaurant are temporarily unavailable.', 'info');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Order History & Invoices
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review past meals, reorder favorite dishes in 1 click, or track active dispatches.
          </p>
        </div>

        <button
          onClick={onBrowseMenu}
          className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 px-4 py-2 rounded-full border border-orange-200 transition"
        >
          Explore More
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-500 mx-auto flex items-center justify-center">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="font-black text-slate-800 text-lg">No orders placed yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Your culinary journey starts here. Explore our handpicked chef kitchens and place your first order.
          </p>
          <button
            onClick={onBrowseMenu}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-6 py-2.5 rounded-full transition shadow-md"
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isDelivered = order.status === 'delivered';
            const isCancelled = order.status === 'cancelled';
            const isActive = !isDelivered && !isCancelled;

            return (
              <motion.div
                key={order.id}
                whileHover={{ y: -2 }}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4 transition"
              >
                {/* Header: Restaurant, Date, Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-base text-slate-900">{order.restaurantName}</h4>
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          isDelivered
                            ? 'bg-emerald-100 text-emerald-800'
                            : isCancelled
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-orange-100 text-orange-800 animate-pulse'
                        }`}
                      >
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Order #{order.id} • {new Date(order.createdAt).toLocaleDateString()} at{' '}
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <span className="font-black text-base text-slate-900 sm:text-right">
                    ₹{order.total}
                  </span>
                </div>

                {/* Items Summary */}
                <div className="space-y-1 text-xs text-slate-600">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{item.quantity}x</span>
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium text-slate-500">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Delivered to {order.deliveryAddress?.title || 'Home'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isActive && (
                      <button
                        onClick={() => onTrackOrder(order.id)}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Track Live</span>
                      </button>
                    )}

                    {isDelivered && (
                      <button
                        onClick={() => onOpenReview(order.restaurantId, order.restaurantName)}
                        className="bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-700 font-bold px-3.5 py-2 rounded-xl border border-slate-200 transition flex items-center gap-1"
                      >
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>Write Review</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleReorder(order)}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reorder Meal</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
