import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  TrendingUp,
  DollarSign,
  Users,
  Store,
  ShoppingBag,
  Download,
  Plus,
  CheckCircle2,
  XCircle,
  Tag,
  Search,
  Filter,
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { Restaurant, Coupon, Order } from '../../types';
import { INITIAL_COUPONS } from '../../data/mockData';
import { useToast } from '../ui/Toast';

interface AdminDashboardProps {
  restaurants: Restaurant[];
  onToggleRestaurantStatus: (restaurantId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  restaurants,
  onToggleRestaurantStatus,
}) => {
  const { orders } = useOrders();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'restaurants' | 'orders' | 'coupons'>('overview');
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [searchTerm, setSearchTerm] = useState('');

  // New coupon modal
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('20');
  const [newMaxDiscount, setNewMaxDiscount] = useState('150');
  const [newMinOrder, setNewMinOrder] = useState('199');
  const [newDesc, setNewDesc] = useState('Special discount voucher');

  // Platform metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const deliveredOrders = orders.filter((o) => o.status === 'delivered');
  const pendingOrders = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled');
  const cancelledOrders = orders.filter((o) => o.status === 'cancelled');
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  // CSV Export functionality
  const handleExportCSV = () => {
    const headers = ['Order ID', 'Customer Name', 'Restaurant', 'Status', 'Payment Method', 'Total (INR)', 'Date'];
    const rows = orders.map((o) => [
      o.id,
      `"${o.customerName}"`,
      `"${o.restaurantName}"`,
      o.status,
      o.paymentMethod,
      o.total,
      `"${new Date(o.createdAt).toLocaleDateString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `foodieexpress_sales_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV Exported', 'FoodieExpress orders report downloaded successfully.', 'success');
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    const coupon: Coupon = {
      id: `cpn-${Date.now()}`,
      code: newCode.trim().toUpperCase(),
      discountPercent: parseInt(newDiscount, 10) || 20,
      maxDiscount: parseInt(newMaxDiscount, 10) || 150,
      minOrder: parseInt(newMinOrder, 10) || 199,
      description: newDesc.trim(),
      isActive: true,
      validUntil: '2026-12-31',
    };

    setCoupons((prev) => [coupon, ...prev]);
    showToast('Coupon Created', `Code ${coupon.code} is active for foodies.`, 'success');
    setShowCouponModal(false);
    setNewCode('');
  };

  const toggleCoupon = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Enterprise Admin Center
            </h2>
            <span className="bg-purple-100 text-purple-800 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Super Admin
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Global ecosystem oversight, merchant approvals, revenue reconciliation & promotional vouchers.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-2xl transition shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4 text-orange-400" />
          <span>Export Sales Report (CSV)</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Gross GMV
          </span>
          <p className="text-2xl font-black text-slate-900">₹{totalRevenue.toLocaleString()}</p>
          <p className="text-[10px] text-emerald-600 font-bold">+24.8% this month</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total Orders
          </span>
          <p className="text-2xl font-black text-slate-900">{orders.length}</p>
          <p className="text-[10px] text-slate-500">{deliveredOrders.length} delivered</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Active Kitchens
          </span>
          <p className="text-2xl font-black text-slate-900">{restaurants.length}</p>
          <p className="text-[10px] text-emerald-600 font-bold">100% operational</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Average Order Ticket
          </span>
          <p className="text-2xl font-black text-slate-900">₹{avgOrderValue}</p>
          <p className="text-[10px] text-slate-500 font-medium">₹35 fee per ticket</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1 col-span-2 lg:col-span-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Pending Dispatches
          </span>
          <p className="text-2xl font-black text-orange-600">{pendingOrders.length}</p>
          <p className="text-[10px] text-orange-600 font-bold">Live routing</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-4 font-bold text-sm transition ${
            activeTab === 'overview'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          All Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('restaurants')}
          className={`pb-3 px-4 font-bold text-sm transition ${
            activeTab === 'restaurants'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Restaurant Directory ({restaurants.length})
        </button>
        <button
          onClick={() => setActiveTab('coupons')}
          className={`pb-3 px-4 font-bold text-sm transition ${
            activeTab === 'coupons'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Promotion Coupons ({coupons.length})
        </button>
      </div>

      {/* Orders Table */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
            <h3 className="font-bold text-slate-900 text-sm">Global Orders Stream</h3>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Filter by Order ID or Customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-50 p-1.5 px-3 rounded-xl border border-slate-200 text-xs w-52"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Restaurant</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Placed At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders
                  .filter(
                    (o) =>
                      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      o.customerName.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">#{ord.id}</td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800">{ord.customerName}</span>
                      </td>
                      <td className="py-3 px-4">{ord.restaurantName}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            ord.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.status === 'cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {ord.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 capitalize font-mono text-[11px]">
                        {ord.paymentMethod.replace(/_/g, ' ')}
                      </td>
                      <td className="py-3 px-4 font-black text-slate-900">₹{ord.total}</td>
                      <td className="py-3 px-4 text-slate-400">
                        {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Restaurant Management */}
      {activeTab === 'restaurants' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {restaurants.map((rest) => (
            <div
              key={rest.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="flex items-center gap-3">
                <img
                  src={rest.image}
                  alt={rest.name}
                  className="w-14 h-14 rounded-2xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-slate-900 truncate">{rest.name}</h4>
                  <p className="text-xs text-slate-500 truncate">{rest.city} • {rest.priceRange}</p>
                  <p className="text-[11px] text-amber-500 font-bold mt-0.5">{rest.rating} ⭐ ({rest.ratingCount})</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span
                  className={`font-bold px-2.5 py-1 rounded-full text-[11px] ${
                    rest.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {rest.isOpen ? 'Active Partner' : 'Offline'}
                </span>

                <button
                  onClick={() => {
                    onToggleRestaurantStatus(rest.id);
                    showToast('Restaurant Status', `${rest.name} status updated.`);
                  }}
                  className="font-bold text-orange-600 hover:text-orange-700"
                >
                  {rest.isOpen ? 'Deactivate' : 'Approve & Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Coupon Management */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Promotional Coupon Codes</h3>
              <p className="text-xs text-slate-500">
                Discount codes usable during customer checkout for marketing campaigns.
              </p>
            </div>
            <button
              onClick={() => setShowCouponModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-md transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Coupon</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {coupons.map((cpn) => (
              <div
                key={cpn.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-black text-sm text-purple-700 bg-purple-50 px-2.5 py-1 rounded-xl border border-purple-200">
                      {cpn.code}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        cpn.isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {cpn.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </div>

                  <p className="font-bold text-slate-900 text-xs">{cpn.description}</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {cpn.discountPercent}% off • Max discount ₹{cpn.maxDiscount} • Min order ₹{cpn.minOrder}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="text-[10px] text-slate-400 font-mono">Valid to {cpn.validUntil}</span>
                  <button
                    onClick={() => toggleCoupon(cpn.id)}
                    className="font-bold text-slate-700 hover:text-purple-700"
                  >
                    {cpn.isActive ? 'Deactivate' : 'Enable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-lg">Create New Promo Voucher</h3>
              <button onClick={() => setShowCouponModal(false)} className="text-slate-400">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MONSOON40"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  className="w-full p-2.5 rounded-xl border border-slate-200 uppercase font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Discount (%)</label>
                  <input
                    type="number"
                    required
                    value={newDiscount}
                    onChange={(e) => setNewDiscount(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Max Cap (₹)</label>
                  <input
                    type="number"
                    required
                    value={newMaxDiscount}
                    onChange={(e) => setNewMaxDiscount(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Min Order Total (₹)</label>
                <input
                  type="number"
                  required
                  value={newMinOrder}
                  onChange={(e) => setNewMinOrder(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Voucher Description</label>
                <input
                  type="text"
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-5 py-2 rounded-xl font-bold shadow-md hover:bg-purple-700"
                >
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
