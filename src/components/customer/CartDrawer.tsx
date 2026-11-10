import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Tag,
  CheckCircle2,
  Percent,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { INITIAL_COUPONS } from '../../data/mockData';
import { useToast } from '../ui/Toast';

interface CartDrawerProps {
  onProceedCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedCheckout }) => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    deliveryFee,
    packagingFee,
    tax,
    discount,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    restaurantName,
  } = useCart();
  const { showToast } = useToast();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const freeDeliveryThreshold = 499;
  const amountForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  const handleApplyCoupon = (code: string) => {
    setCouponError('');
    const res = applyCoupon(code);
    if (res.success) {
      showToast('Coupon applied!', res.message, 'success');
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  if (!isCartOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 240 }}
          className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">Your Cart</h3>
                {restaurantName && (
                  <p className="text-xs text-slate-500 truncate max-w-56">from {restaurantName}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-rose-500 hover:text-rose-700 font-semibold px-2 py-1 hover:bg-rose-50 rounded-lg transition"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-orange-50 text-orange-400 mx-auto flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base">Your bag is empty</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 leading-relaxed">
                    Explore high-rated restaurants and add your favorite dishes to start an express delivery.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-md shadow-orange-500/20 transition"
                >
                  Browse Dishes
                </button>
              </div>
            ) : (
              <>
                {/* Free Delivery Gamification Progress Bar */}
                <div className="p-3.5 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-200/60 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800">
                      {amountForFreeDelivery === 0 ? (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Congratulations! You got FREE Delivery
                        </span>
                      ) : (
                        <span>
                          Add <span className="text-orange-600">₹{amountForFreeDelivery}</span> more for FREE Delivery!
                        </span>
                      )}
                    </span>
                    <span className="text-slate-500 text-[11px]">{freeDeliveryProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${freeDeliveryProgress}%` }}
                    />
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Selected Dishes ({items.length})
                  </h4>
                  {items.map((item, idx) => {
                    const optionsTotal = (item.selectedOptions || []).reduce(
                      (s, o) => s + o.price,
                      0
                    );
                    const lineTotal = (item.foodItem.price + optionsTotal) * item.quantity;
                    const optKey = JSON.stringify(item.selectedOptions || []);

                    return (
                      <div
                        key={`${item.foodItem.id}-${idx}`}
                        className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <img
                            src={item.foodItem.image}
                            alt={item.foodItem.name}
                            className="w-14 h-14 rounded-xl object-cover shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <h5 className="font-bold text-xs text-slate-900 truncate">
                              {item.foodItem.name}
                            </h5>
                            <p className="text-xs font-bold text-slate-700 mt-0.5">₹{lineTotal}</p>

                            {/* Options preview */}
                            {item.selectedOptions && item.selectedOptions.length > 0 && (
                              <p className="text-[10px] text-slate-500 truncate mt-0.5">
                                {item.selectedOptions.map((o) => o.name).join(', ')}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden shrink-0">
                          <button
                            onClick={() => updateQuantity(item.foodItem.id, -1, optKey)}
                            className="p-1.5 hover:bg-slate-100 text-slate-600 transition"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 text-xs font-bold text-slate-800 min-w-5 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.foodItem.id, 1, optKey)}
                            className="p-1.5 hover:bg-slate-100 text-slate-600 transition"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Coupon Code Section */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Apply Coupon
                  </h4>

                  {appliedCoupon ? (
                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-emerald-600" />
                        <div>
                          <p className="text-xs font-bold text-emerald-800 font-mono">
                            {appliedCoupon.code}
                          </p>
                          <p className="text-[11px] text-emerald-600">
                            Saving ₹{discount} on this order
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter coupon code"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 uppercase font-mono tracking-wider focus:outline-hidden focus:border-orange-500"
                        />
                        <button
                          onClick={() => handleApplyCoupon(couponInput)}
                          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs"
                        >
                          Apply
                        </button>
                      </div>

                      {couponError && (
                        <p className="text-[11px] text-rose-500 font-medium">{couponError}</p>
                      )}

                      {/* Quick 1-click apply pills */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {INITIAL_COUPONS.map((cpn) => (
                          <button
                            key={cpn.id}
                            onClick={() => handleApplyCoupon(cpn.code)}
                            className="text-[11px] font-mono font-bold bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200/80 px-2.5 py-1 rounded-lg transition flex items-center gap-1"
                          >
                            <Percent className="w-3 h-3 text-orange-500" />
                            <span>{cpn.code}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bill Breakdown */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                  <h4 className="font-bold text-slate-800 mb-1 text-sm">Bill Summary</h4>

                  <div className="flex justify-between text-slate-600">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-slate-900">₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Fee</span>
                    <span>
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-600 font-bold">FREE</span>
                      ) : (
                        `₹${deliveryFee}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Restaurant Packaging</span>
                    <span>₹{packagingFee}</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>GST and Restaurant Taxes (5%)</span>
                    <span>₹{tax}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount ({appliedCoupon?.code})</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                    <span>To Pay</span>
                    <span className="text-base text-orange-600">₹{total}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Checkout CTA */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 bg-white border-t border-slate-100 shrink-0 space-y-2 shadow-lg">
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onProceedCheckout();
                }}
                className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3.5 px-5 rounded-2xl shadow-lg shadow-orange-500/25 flex items-center justify-between transition-all active:scale-98 cursor-pointer"
              >
                <div className="text-left">
                  <p className="text-[11px] uppercase tracking-wider text-orange-100 font-semibold">
                    Total • {items.length} items
                  </p>
                  <p className="text-lg font-black leading-tight">₹{total}</p>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-bold bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-xl">
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
