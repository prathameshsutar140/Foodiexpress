import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  X,
  MapPin,
  CreditCard,
  QrCode,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';
import { DeliveryAddress, PaymentMethod } from '../../types';
import { useToast } from '../ui/Toast';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess,
}) => {
  const { profile, updateAddress } = useAuth();
  const { items, subtotal, deliveryFee, tax, discount, total, clearCart, restaurantId, restaurantName } = useCart();
  const { placeOrder } = useOrders();
  const { showToast } = useToast();

  const savedAddresses = profile.savedAddresses || [];
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    savedAddresses[0]?.id || 'addr-1'
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('demo_upi');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Address edit state
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newTitle, setNewTitle] = useState('Other');
  const [newStreet, setNewStreet] = useState('');
  const [newArea, setNewArea] = useState('Bandra West');
  const [newPin, setNewPin] = useState('400050');

  // Demo UPI VPA
  const [upiId, setUpiId] = useState('aarav@okhdfcbank');

  // Demo Card fields
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('•••');

  if (!isOpen) return null;

  const currentAddress =
    savedAddresses.find((a) => a.id === selectedAddressId) || savedAddresses[0] || {
      id: 'addr-default',
      title: 'Home',
      street: 'Flat 402, Sea Green Apartments, Carter Road',
      area: 'Bandra West',
      city: 'Mumbai',
      pinCode: '400050',
    };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim()) return;
    const newAddr: DeliveryAddress = {
      id: `addr-${Date.now()}`,
      title: newTitle,
      street: newStreet,
      area: newArea,
      city: 'Mumbai',
      pinCode: newPin,
    };
    updateAddress(newAddr);
    setSelectedAddressId(newAddr.id);
    setShowAddAddress(false);
    showToast('New address added!', `${newTitle} address saved.`, 'success');
  };

  const handleConfirmOrder = async () => {
    if (items.length === 0 || !restaurantId) return;

    setIsSubmitting(true);
    try {
      const orderItems = items.map((i) => ({
        foodItemId: i.foodItem.id,
        name: i.foodItem.name,
        price: i.foodItem.price,
        quantity: i.quantity,
        isVeg: i.foodItem.isVeg,
        selectedOptions: i.selectedOptions,
      }));

      const newOrder = await placeOrder({
        restaurantId,
        restaurantName: restaurantName || 'Foodie Partner',
        restaurantAddress: '42 Nizam Heritage Enclave, MG Road, Mumbai',
        items: orderItems,
        subtotal,
        deliveryFee,
        tax,
        discount,
        total,
        paymentMethod,
        deliveryAddress: currentAddress,
      });

      // Confetti celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F97316', '#F59E0B', '#10B981', '#6366F1'],
      });

      clearCart();
      showToast('Order Placed Successfully!', `Order #${newOrder.id} is confirmed.`, 'success');
      onClose();
      onOrderSuccess(newOrder.id);
    } catch (err: any) {
      showToast('Failed to place order', err?.message || 'Please try again', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col my-8"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div>
              <h3 className="font-black text-slate-900 text-lg">Checkout & Confirmation</h3>
              <p className="text-xs text-slate-500">
                Final step to dispatch your hot meal from {restaurantName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
            {/* 1. Delivery Address Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span>Delivery Address</span>
                </h4>
                <button
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showAddAddress ? 'Cancel' : 'Add New'}</span>
                </button>
              </div>

              {/* Add New Address Accordion */}
              {showAddAddress && (
                <form
                  onSubmit={handleSaveNewAddress}
                  className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200/80 space-y-3 text-xs"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Tag</label>
                      <select
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full bg-white p-2 rounded-xl border border-slate-200 text-xs"
                      >
                        <option value="Home">Home</option>
                        <option value="Work">Work</option>
                        <option value="Gym">Gym</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Pin Code</label>
                      <input
                        type="text"
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        className="w-full bg-white p-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Street / House No.</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 501 Sky Towers, Main Road"
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      className="w-full bg-white p-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-orange-600 text-white font-bold py-2 rounded-xl shadow-xs"
                  >
                    Save Address
                  </button>
                </form>
              )}

              {/* Saved Address Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {savedAddresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition text-xs flex flex-col justify-between ${
                        isSelected
                          ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-500/30'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200 text-[11px]">
                          {addr.title}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-orange-600" />}
                      </div>
                      <p className="text-slate-600 leading-snug">{addr.street}</p>
                      <p className="text-slate-400 text-[11px] mt-1 font-medium">
                        {addr.area}, {addr.city} - {addr.pinCode}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Payment Method Simulation */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-orange-500" />
                <span>Select Payment Mode</span>
                <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full ml-auto">
                  Safe Demo Mode
                </span>
              </h4>

              <div className="grid grid-cols-3 gap-2.5">
                {/* Demo UPI */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('demo_upi')}
                  className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-2 ${
                    paymentMethod === 'demo_upi'
                      ? 'bg-orange-50 border-orange-500 font-bold text-orange-900 ring-2 ring-orange-500/30'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <QrCode className="w-6 h-6 text-orange-600" />
                  <span className="text-xs">Demo UPI</span>
                </button>

                {/* Demo Card */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('demo_card')}
                  className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-2 ${
                    paymentMethod === 'demo_card'
                      ? 'bg-orange-50 border-orange-500 font-bold text-orange-900 ring-2 ring-orange-500/30'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <CreditCard className="w-6 h-6 text-blue-600" />
                  <span className="text-xs">Demo Card</span>
                </button>

                {/* Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash_on_delivery')}
                  className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-2 ${
                    paymentMethod === 'cash_on_delivery'
                      ? 'bg-orange-50 border-orange-500 font-bold text-orange-900 ring-2 ring-orange-500/30'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Banknote className="w-6 h-6 text-emerald-600" />
                  <span className="text-xs">Pay on Delivery</span>
                </button>
              </div>

              {/* Dynamic Payment Details Display */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                {paymentMethod === 'demo_upi' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="font-semibold">UPI ID / VPA</span>
                      <span className="text-[10px] text-emerald-600 font-bold">Instant Verification</span>
                    </div>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@bank"
                      className="w-full bg-white p-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold"
                    />
                    <p className="text-[11px] text-slate-400">
                      Simulated fast UPI payment. You will receive an instant confirmation receipt.
                    </p>
                  </div>
                )}

                {paymentMethod === 'demo_card' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700">Demo Credit/Debit Card</span>
                      <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded font-mono">
                        Test Mode
                      </span>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl text-white font-mono space-y-2 shadow-xs">
                      <p className="text-[10px] text-slate-400">DEMO PAYMENT CARD</p>
                      <p className="text-sm font-bold tracking-widest">{cardNumber}</p>
                      <div className="flex justify-between text-[11px] text-slate-300">
                        <span>EXPIRES: {cardExpiry}</span>
                        <span>CVV: {cardCvv}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      No real card credentials are collected or saved. Simulated sandbox transaction.
                    </p>
                  </div>
                )}

                {paymentMethod === 'cash_on_delivery' && (
                  <div className="flex items-start gap-3">
                    <Banknote className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-800">Cash or UPI at Doorstep</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        Pay via cash or ask the delivery partner for their QR code upon doorstep arrival.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Total Order Summary */}
            <div className="p-4 bg-orange-50/70 rounded-2xl border border-orange-200 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-900">Total Payable Amount</p>
                <p className="text-[11px] text-slate-500">Includes taxes, packaging, and discounts</p>
              </div>
              <span className="text-xl font-black text-orange-600">₹{total}</span>
            </div>
          </div>

          {/* Footer Submit CTA */}
          <div className="p-5 bg-white border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirmOrder}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-orange-500/25 flex items-center gap-2 text-xs transition disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Dispatching Order...</span>
              ) : (
                <>
                  <span>Confirm Order • ₹{total}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
