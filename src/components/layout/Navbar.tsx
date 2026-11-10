import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  MapPin,
  Utensils,
  Shield,
  Truck,
  Store,
  Database,
  User as UserIcon,
  ChevronDown,
  LogOut,
  Sparkles,
  Search,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';
import { UserRole } from '../../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenSearch?: () => void;
  onSelectRestaurant?: (restaurantId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenSearch,
}) => {
  const { currentUser, profile, activeRole, setActiveRole, signInWithGoogle, logout } = useAuth();
  const { totalItemCount, setIsCartOpen } = useCart();
  const { orders, setActiveTrackingOrderId } = useOrders();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const activeOrder = orders.find((o) => o.status !== 'delivered' && o.status !== 'cancelled');

  const roleLabels: Record<UserRole, { label: string; icon: React.ReactNode; color: string }> = {
    customer: { label: 'Customer', icon: <Utensils className="w-3.5 h-3.5" />, color: 'bg-orange-500' },
    restaurant_owner: { label: 'Restaurant Partner', icon: <Store className="w-3.5 h-3.5" />, color: 'bg-emerald-600' },
    delivery_partner: { label: 'Delivery Fleet', icon: <Truck className="w-3.5 h-3.5" />, color: 'bg-blue-600' },
    admin: { label: 'Enterprise Admin', icon: <Shield className="w-3.5 h-3.5" />, color: 'bg-purple-600' },
  };

  const handleRoleSelect = (role: UserRole) => {
    setActiveRole(role);
    setShowRoleDropdown(false);
    if (role === 'restaurant_owner') setCurrentTab('restaurant_dashboard');
    else if (role === 'delivery_partner') setCurrentTab('delivery_dashboard');
    else if (role === 'admin') setCurrentTab('admin_dashboard');
    else setCurrentTab('home');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-xs transition-all">
      {/* Top Banner Notice for MSBTE DBMS Academic Feature */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white text-xs px-4 py-1.5 flex items-center justify-between font-medium">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase">
            MSBTE DBMS Project
          </span>
          <span>FoodieExpress v2 — Relational Schema, 3NF Normalization & ACID Transactions Engine</span>
        </div>
        <button
          onClick={() => setCurrentTab('dbms_explorer')}
          className="hidden sm:flex items-center gap-1.5 text-xs bg-white text-orange-700 px-2.5 py-0.5 rounded-full font-bold hover:bg-orange-50 transition shadow-xs"
        >
          <Database className="w-3 h-3" />
          <span>Launch DBMS Console</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
            <Utensils className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-slate-900">
                Foodie<span className="text-orange-600">Express</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">
                v2
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 italic tracking-wide">
              Your Cravings. Our Mission.
            </p>
          </div>
        </div>

        {/* Location selector */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-600 bg-slate-50 hover:bg-slate-100 px-3.5 py-2 rounded-full border border-slate-200/70 transition cursor-pointer">
          <MapPin className="w-3.5 h-3.5 text-orange-500" />
          <span className="font-semibold text-slate-800">Bandra West, Mumbai</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </div>

        {/* Search Bar trigger button */}
        <button
          onClick={onOpenSearch}
          className="hidden md:flex items-center gap-2.5 bg-slate-100 hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 px-4 py-2 rounded-full text-xs transition border border-transparent hover:border-slate-300 w-48 lg:w-64"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate">Search biryani, burgers, pizza...</span>
        </button>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <button
            onClick={() => setCurrentTab('home')}
            className={`px-3 py-1.5 rounded-lg transition ${
              currentTab === 'home'
                ? 'text-orange-600 font-bold bg-orange-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Explore
          </button>
          <button
            onClick={() => setCurrentTab('restaurants')}
            className={`px-3 py-1.5 rounded-lg transition ${
              currentTab === 'restaurants'
                ? 'text-orange-600 font-bold bg-orange-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Restaurants
          </button>
          <button
            onClick={() => {
              if (activeOrder) {
                setActiveTrackingOrderId(activeOrder.id);
              }
              setCurrentTab('tracking');
            }}
            className={`px-3 py-1.5 rounded-lg transition relative ${
              currentTab === 'tracking'
                ? 'text-orange-600 font-bold bg-orange-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span>Live Tracking</span>
            {activeOrder && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-500 animate-ping" />
            )}
          </button>
          <button
            onClick={() => setCurrentTab('orders')}
            className={`px-3 py-1.5 rounded-lg transition ${
              currentTab === 'orders'
                ? 'text-orange-600 font-bold bg-orange-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            My Orders
          </button>
          <button
            onClick={() => setCurrentTab('dbms_explorer')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              currentTab === 'dbms_explorer'
                ? 'text-purple-700 font-bold bg-purple-50'
                : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50/50'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-purple-600" />
            <span>DBMS Specs</span>
          </button>
        </nav>

        {/* Right Controls: Role Switcher, Cart, Profile */}
        <div className="flex items-center gap-3">
          {/* Multi-Role Quick Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-1.5 text-xs bg-slate-900 text-white px-3 py-2 rounded-full font-semibold shadow-xs hover:bg-slate-800 transition"
              title="Switch role to test the entire ecosystem"
            >
              <span className={`w-2 h-2 rounded-full ${roleLabels[activeRole].color}`} />
              <span className="hidden sm:inline">{roleLabels[activeRole].label}</span>
              <span className="sm:hidden">{roleLabels[activeRole].icon}</span>
              <ChevronDown className="w-3 h-3 text-slate-300 ml-0.5" />
            </button>

            <AnimatePresence>
              {showRoleDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs"
                >
                  <div className="px-2.5 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Active Persona
                  </div>
                  {(Object.keys(roleLabels) as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRoleSelect(r)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-medium transition ${
                        activeRole === r
                          ? 'bg-orange-50 text-orange-700 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`p-1.5 rounded-lg text-white ${roleLabels[r].color}`}>
                        {roleLabels[r].icon}
                      </span>
                      <span>{roleLabels[r].label}</span>
                    </button>
                  ))}
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    onClick={() => {
                      setCurrentTab('dbms_explorer');
                      setShowRoleDropdown(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left font-medium text-purple-700 hover:bg-purple-50 transition"
                  >
                    <span className="p-1.5 rounded-lg bg-purple-600 text-white">
                      <Database className="w-3.5 h-3.5" />
                    </span>
                    <span>Academic DBMS Module</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cart Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-3.5 py-2 rounded-full font-bold text-xs shadow-md shadow-orange-500/20 active:scale-95 transition-all"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {totalItemCount > 0 && (
              <motion.span
                key={totalItemCount}
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                className="bg-white text-orange-600 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs"
              >
                {totalItemCount}
              </motion.span>
            )}
          </button>

          {/* User Account / Google Sign-in */}
          <div className="relative">
            {currentUser ? (
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-9 h-9 rounded-full ring-2 ring-orange-500/30 overflow-hidden cursor-pointer hover:ring-orange-500 transition"
              >
                <img
                  src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={profile.displayName}
                  className="w-full h-full object-cover"
                />
              </button>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-orange-600 bg-slate-100 hover:bg-orange-50 px-3 py-2 rounded-full transition border border-slate-200"
              >
                <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            <AnimatePresence>
              {showUserMenu && currentUser && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 text-xs"
                >
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                    <img
                      src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={profile.displayName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="truncate">
                      <p className="font-bold text-slate-900 truncate">{profile.displayName}</p>
                      <p className="text-[11px] text-slate-500 truncate">{profile.email}</p>
                    </div>
                  </div>

                  <div className="py-2 space-y-1">
                    <button
                      onClick={() => {
                        setCurrentTab('orders');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50 font-medium transition"
                    >
                      Past Orders & Receipts
                    </button>
                    <button
                      onClick={() => {
                        setCurrentTab('tracking');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50 font-medium transition"
                    >
                      Live Tracking
                    </button>
                    <button
                      onClick={() => {
                        setCurrentTab('favorites');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50 font-medium transition"
                    >
                      Saved Favorites
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 text-rose-600 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg font-medium transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};
