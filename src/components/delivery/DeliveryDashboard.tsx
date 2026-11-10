import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Truck,
  MapPin,
  Phone,
  CheckCircle2,
  Navigation,
  Clock,
  DollarSign,
  Award,
  Power,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { INITIAL_DELIVERY_PARTNERS } from '../../data/mockData';
import { useToast } from '../ui/Toast';

export const DeliveryDashboard: React.FC = () => {
  const { orders, updateOrderStatus } = useOrders();
  const { showToast } = useToast();

  const driver = INITIAL_DELIVERY_PARTNERS[0];
  const [isOnline, setIsOnline] = useState(true);

  // Active deliveries in transit or ready for pickup
  const assignedOrders = orders.filter(
    (o) => o.status === 'ready_for_pickup' || o.status === 'out_for_delivery'
  );
  const completedOrders = orders.filter((o) => o.status === 'delivered');

  const earningsToday = completedOrders.length * 60 + 120; // Delivery fee + incentive

  const handleConfirmPickup = (orderId: string) => {
    updateOrderStatus(orderId, 'out_for_delivery');
    showToast('Pickup Confirmed', `Order #${orderId} is now out for delivery!`, 'success');
  };

  const handleMarkDelivered = (orderId: string) => {
    updateOrderStatus(orderId, 'delivered');
    showToast('Delivery Completed!', `Order #${orderId} marked as delivered. ₹60 added to wallet.`, 'success');
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Driver Header Card */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={driver.avatarUrl}
            alt={driver.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-400/40"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black">{driver.name}</h2>
              <span className="text-[10px] font-black uppercase bg-blue-500/30 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full">
                {driver.vehicleType}
              </span>
            </div>
            <p className="text-xs text-blue-200 mt-0.5">
              Reg: {driver.vehicleNumber} • {driver.rating} ⭐ ({driver.totalDeliveries} Lifetime Deliveries)
            </p>
          </div>
        </div>

        {/* Duty Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsOnline(!isOnline);
              showToast('Duty Status', `You are now ${!isOnline ? 'ON DUTY' : 'OFF DUTY'}.`);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition shadow-xs ${
              isOnline
                ? 'bg-emerald-500 text-white'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{isOnline ? 'Active On-Duty' : 'Offline / Rest Mode'}</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Today's Earnings
          </span>
          <p className="text-2xl font-black text-slate-900">₹{earningsToday}</p>
          <p className="text-[11px] text-emerald-600 font-medium">Includes ₹120 surge incentives</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Completed Trips
          </span>
          <p className="text-2xl font-black text-slate-900">{completedOrders.length}</p>
          <p className="text-[11px] text-slate-500 font-medium">Average 21 mins per trip</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Customer Rating
          </span>
          <p className="text-2xl font-black text-amber-500">{driver.rating} ⭐</p>
          <p className="text-[11px] text-slate-500 font-medium">Top 5% Eco-courier partner</p>
        </div>
      </div>

      {/* Assigned Orders Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-slate-900 text-lg">Active Courier Dispatches</h3>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
            {assignedOrders.length} Trips Assigned
          </span>
        </div>

        {assignedOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="font-bold text-slate-800 text-sm">No Active Trips Assigned</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Stay in designated hot zones (Bandra West, BKC) to receive the next high-priority express ticket.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {assignedOrders.map((ord) => {
              const isReady = ord.status === 'ready_for_pickup';
              const isOut = ord.status === 'out_for_delivery';

              return (
                <div
                  key={ord.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded">
                        #{ord.id}
                      </span>
                      <span
                        className={`text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                          isReady ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800 animate-pulse'
                        }`}
                      >
                        {ord.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-slate-500">
                      Payment: {ord.paymentMethod.replace(/_/g, ' ')} ({ord.paymentStatus})
                    </span>
                  </div>

                  {/* Route: Pickup & Drop */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {/* Pickup Restaurant */}
                    <div className="p-3.5 bg-slate-50 rounded-2xl space-y-1">
                      <span className="text-[10px] uppercase font-bold text-orange-600 tracking-wider">
                        1. Restaurant Pickup Point
                      </span>
                      <p className="font-bold text-slate-900 text-sm">{ord.restaurantName}</p>
                      <p className="text-slate-500">{ord.restaurantAddress}</p>
                      <p className="text-[11px] font-semibold text-slate-700 pt-1">
                        Order items: {ord.items.length} dishes to verify
                      </p>
                    </div>

                    {/* Drop Customer */}
                    <div className="p-3.5 bg-slate-50 rounded-2xl space-y-1">
                      <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
                        2. Customer Delivery Point
                      </span>
                      <p className="font-bold text-slate-900 text-sm">{ord.customerName}</p>
                      <p className="text-slate-500">
                        {ord.deliveryAddress?.street}, {ord.deliveryAddress?.area},{' '}
                        {ord.deliveryAddress?.city}
                      </p>
                      <p className="text-[11px] font-semibold text-blue-600 pt-1 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span>{ord.customerPhone}</span>
                      </p>
                    </div>
                  </div>

                  {/* Stepper Advancement Buttons */}
                  <div className="pt-2 flex items-center justify-end gap-3">
                    {isReady && (
                      <button
                        onClick={() => handleConfirmPickup(ord.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Confirm Pickup & Start Trip</span>
                      </button>
                    )}

                    {isOut && (
                      <button
                        onClick={() => handleMarkDelivered(ord.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Delivered to Customer Doorstep</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
