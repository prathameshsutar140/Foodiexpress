import React from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Truck,
  CookingPot,
  Check,
  XCircle,
  AlertCircle,
  Sparkles,
  ShoppingBag,
  Store,
  ChevronRight,
  Play,
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { OrderStatus } from '../../types';
import { useToast } from '../ui/Toast';

interface OrderTrackingViewProps {
  orderId?: string | null;
  onBrowseMore: () => void;
}

const STAGES: { key: OrderStatus; label: string; desc: string; icon: React.ReactNode }[] = [
  {
    key: 'placed',
    label: 'Order Placed',
    desc: 'We have received your order details',
    icon: <ShoppingBag className="w-4 h-4" />,
  },
  {
    key: 'confirmed',
    label: 'Confirmed by Kitchen',
    desc: 'Restaurant accepted your order ticket',
    icon: <Store className="w-4 h-4" />,
  },
  {
    key: 'preparing',
    label: 'Chef Preparing Meal',
    desc: 'Fresh ingredients being cooked to perfection',
    icon: <CookingPot className="w-4 h-4" />,
  },
  {
    key: 'ready_for_pickup',
    label: 'Ready for Pickup',
    desc: 'Packed in thermal bag awaiting courier',
    icon: <Check className="w-4 h-4" />,
  },
  {
    key: 'out_for_delivery',
    label: 'Out for Delivery',
    desc: 'Delivery partner on the way to your door',
    icon: <Truck className="w-4 h-4" />,
  },
  {
    key: 'delivered',
    label: 'Delivered',
    desc: 'Bon appétit! Enjoy your delicious meal',
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
];

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  orderId,
  onBrowseMore,
}) => {
  const { orders, activeTrackingOrderId, advanceOrderStage, cancelOrder } = useOrders();
  const { showToast } = useToast();

  const currentId = orderId || activeTrackingOrderId || orders[0]?.id;
  const order = orders.find((o) => o.id === currentId) || orders[0];

  if (!order) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 mx-auto flex items-center justify-center">
          <Truck className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-slate-900">No Active Order Found</h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          You do not have any ongoing deliveries right now. Order a tasty meal to track it here live!
        </p>
        <button
          onClick={onBrowseMore}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-full text-xs shadow-md transition"
        >
          Explore Restaurants
        </button>
      </div>
    );
  }

  const isCancelled = order.status === 'cancelled';
  const isDelivered = order.status === 'delivered';
  const stageKeys = STAGES.map((s) => s.key);
  const currentStageIndex = isCancelled ? -1 : stageKeys.indexOf(order.status);

  const canCancel = order.status === 'placed' || order.status === 'confirmed';

  const handleSimulateNext = () => {
    advanceOrderStage(order.id);
    showToast('Simulated Stage Advanced', 'Order moved to next stage in delivery cycle.', 'info');
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      cancelOrder(order.id);
      showToast('Order Cancelled', 'Your order was cancelled successfully.', 'error');
    }
  };

  const handleCallPartner = () => {
    showToast('Calling Partner', `Dialing ${order.deliveryPartnerPhone || '+91 98765 11223'}...`, 'info');
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-white/10 px-2.5 py-1 rounded-full text-orange-300">
                #{order.id}
              </span>
              <span
                className={`text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                  isCancelled
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : isDelivered
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-orange-500/20 text-orange-400 border border-orange-500/40 animate-pulse'
                }`}
              >
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black mt-2">
              {isCancelled
                ? 'Order Cancelled'
                : isDelivered
                ? 'Delivered to your doorstep!'
                : 'Arriving in ~20-25 mins'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              From <span className="font-semibold text-white">{order.restaurantName}</span> • {order.items.length} items
            </p>
          </div>

          {/* Interactive Simulation Controls for MSBTE Evaluators */}
          <div className="flex flex-col sm:items-end gap-2 shrink-0">
            {!isDelivered && !isCancelled && (
              <button
                onClick={handleSimulateNext}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-orange-500/20 transition active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Simulate Next Stage</span>
              </button>
            )}

            {canCancel && (
              <button
                onClick={handleCancel}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold underline underline-offset-2"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: 6-Stage Timeline */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-black text-slate-900 text-lg">Delivery Timeline</h3>
            <span className="text-xs text-slate-400 font-medium">Real-Time State</span>
          </div>

          {isCancelled ? (
            <div className="p-4 bg-rose-50 text-rose-800 rounded-2xl border border-rose-200 flex items-center gap-3">
              <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
              <div>
                <p className="font-bold text-sm">Order Cancelled</p>
                <p className="text-xs text-rose-600 mt-0.5">
                  {order.cancellationReason || 'Cancelled at customer or kitchen request.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 relative pl-2">
              {STAGES.map((stage, idx) => {
                const isPassed = currentStageIndex > idx;
                const isCurrent = currentStageIndex === idx;
                const isPending = currentStageIndex < idx;

                return (
                  <div key={stage.key} className="flex items-start gap-4 relative group">
                    {/* Vertical connecting line */}
                    {idx < STAGES.length - 1 && (
                      <div
                        className={`absolute left-4 top-8 w-0.5 h-12 transition-colors duration-500 ${
                          isPassed ? 'bg-orange-500' : 'bg-slate-200'
                        }`}
                      />
                    )}

                    {/* Stage icon node */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 font-bold transition-all ${
                        isPassed
                          ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                          : isCurrent
                          ? 'bg-orange-600 text-white ring-4 ring-orange-200 shadow-md animate-pulse'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {isPassed ? <Check className="w-4 h-4 stroke-[3]" /> : stage.icon}
                    </div>

                    {/* Stage description */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`font-bold text-sm leading-tight ${
                            isCurrent
                              ? 'text-orange-600 font-black'
                              : isPassed
                              ? 'text-slate-900'
                              : 'text-slate-400'
                          }`}
                        >
                          {stage.label}
                        </h4>
                        {isCurrent && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                            Active
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-xs mt-0.5 ${
                          isCurrent ? 'text-slate-700' : 'text-slate-400'
                        }`}
                      >
                        {stage.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Driver Details & Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          {/* Delivery Partner Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">Assigned Delivery Fleet</h4>

            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120"
                alt="Rahul Sharma"
                className="w-12 h-12 rounded-2xl object-cover shrink-0"
              />
              <div className="flex-1">
                <p className="font-bold text-sm text-slate-900">
                  {order.deliveryPartnerName || 'Rahul Sharma'}
                </p>
                <p className="text-xs text-slate-500">Electric Courier • 4.9 ⭐ (1,240 drops)</p>
              </div>

              <button
                onClick={handleCallPartner}
                className="w-10 h-10 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition"
                title="Call Delivery Partner"
              >
                <Phone className="w-4 h-4" />
              </button>
            </div>

            {/* Address */}
            <div className="p-3 bg-slate-50 rounded-2xl text-xs space-y-1">
              <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                <span>Deliver to: {order.deliveryAddress?.title || 'Home'}</span>
              </p>
              <p className="text-slate-500 pl-5">
                {order.deliveryAddress?.street}, {order.deliveryAddress?.area},{' '}
                {order.deliveryAddress?.city} - {order.deliveryAddress?.pinCode}
              </p>
            </div>
          </div>

          {/* Order Details Accordion */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 text-sm">Order Summary</h4>

            <div className="space-y-2 pt-1">
              {order.items.map((i, idx) => (
                <div key={idx} className="flex justify-between text-slate-700">
                  <span>
                    <span className="font-bold text-orange-600">{i.quantity}x</span> {i.name}
                  </span>
                  <span className="font-semibold">₹{i.price * i.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-2.5 space-y-1.5 text-slate-500">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery & Taxes</span>
                <span>₹{order.deliveryFee + order.tax}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-₹{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-slate-900 text-sm pt-1.5 border-t border-slate-100">
                <span>Paid Total ({order.paymentMethod.replace(/_/g, ' ')})</span>
                <span className="text-orange-600">₹{order.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
