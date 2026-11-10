/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Utensils,
  Search,
  Filter,
  Flame,
  Star,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Heart,
  Store,
  ChevronRight,
  X,
} from 'lucide-react';
import { ToastProvider } from './components/ui/Toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { OrderProvider, useOrders } from './context/OrderContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/customer/HeroSection';
import { CategoryList } from './components/customer/CategoryList';
import { RestaurantCard } from './components/customer/RestaurantCard';
import { FoodItemCard } from './components/customer/FoodItemCard';
import { FoodCustomizationModal } from './components/customer/FoodCustomizationModal';
import { CartDrawer } from './components/customer/CartDrawer';
import { CheckoutModal } from './components/customer/CheckoutModal';
import { OrderTrackingView } from './components/customer/OrderTrackingView';
import { OrderHistoryView } from './components/customer/OrderHistoryView';
import { RestaurantDetailModal } from './components/customer/RestaurantDetailModal';
import { ReviewModal } from './components/customer/ReviewModal';
import { RestaurantDashboard } from './components/restaurant/RestaurantDashboard';
import { DeliveryDashboard } from './components/delivery/DeliveryDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DbmsExplorer } from './components/dbms/DbmsExplorer';
import {
  INITIAL_RESTAURANTS,
  INITIAL_FOOD_ITEMS,
  INITIAL_CATEGORIES,
} from './data/mockData';
import { Restaurant, FoodItem } from './types';
import { testFirestoreConnection } from './lib/firebase';

function MainApp() {
  const { activeRole } = useAuth();
  const { setActiveTrackingOrderId } = useOrders();

  // App Loading state
  const [isAppLoading, setIsAppLoading] = useState(true);

  // App Catalog State
  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [foodItems, setFoodItems] = useState<FoodItem[]>(INITIAL_FOOD_ITEMS);
  const [categories] = useState(INITIAL_CATEGORIES);

  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [customizingItem, setCustomizingItem] = useState<FoodItem | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [reviewModalData, setReviewModalData] = useState<{ id: string; name: string } | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Filter states on Restaurants Tab
  const [restVegFilter, setRestVegFilter] = useState(false);
  const [restSortBy, setRestSortBy] = useState<'rating' | 'deliveryTime' | 'price'>('rating');

  // Initial connection test & brand splash screen
  useEffect(() => {
    testFirestoreConnection();
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  // Filtered restaurants for Explorer
  const filteredRestaurants = useMemo(() => {
    return restaurants
      .filter((r) => {
        if (restVegFilter && !r.isVegOnly) return false;
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchName = r.name.toLowerCase().includes(query);
          const matchCuisine = r.cuisineType.some((c) => c.toLowerCase().includes(query));
          const matchDish = foodItems.some(
            (f) => f.restaurantId === r.id && f.name.toLowerCase().includes(query)
          );
          if (!matchName && !matchCuisine && !matchDish) return false;
        }
        if (selectedCategory) {
          const catObj = categories.find((c) => c.slug === selectedCategory);
          if (catObj) {
            const matchCuisine = r.cuisineType.some(
              (c) => c.toLowerCase().includes(catObj.name.toLowerCase()) || c.toLowerCase().includes(selectedCategory)
            );
            const hasDishInCat = foodItems.some(
              (f) => f.restaurantId === r.id && f.category.toLowerCase().includes(selectedCategory)
            );
            if (!matchCuisine && !hasDishInCat) return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (restSortBy === 'rating') return b.rating - a.rating;
        if (restSortBy === 'deliveryTime') return a.deliveryTimeMin - b.deliveryTimeMin;
        if (restSortBy === 'price') return a.minOrder - b.minOrder;
        return 0;
      });
  }, [restaurants, foodItems, restVegFilter, searchQuery, selectedCategory, restSortBy, categories]);

  // Bestseller Food Items for home page
  const bestsellerDishes = useMemo(() => {
    return foodItems.filter((f) => f.isBestseller).slice(0, 6);
  }, [foodItems]);

  // Handlers for Restaurant Management
  const handleAddDish = (dish: Omit<FoodItem, 'id' | 'rating' | 'ratingCount'>) => {
    const newDish: FoodItem = {
      ...dish,
      id: `food-${Date.now()}`,
      rating: 5.0,
      ratingCount: 1,
    };
    setFoodItems((prev) => [newDish, ...prev]);
  };

  const handleToggleDishAvailability = (dishId: string) => {
    setFoodItems((prev) =>
      prev.map((d) => (d.id === dishId ? { ...d, isAvailable: !d.isAvailable } : d))
    );
  };

  const handleDeleteDish = (dishId: string) => {
    setFoodItems((prev) => prev.filter((d) => d.id !== dishId));
  };

  const handleToggleRestaurantStatus = (restaurantId: string) => {
    setRestaurants((prev) =>
      prev.map((r) => (r.id === restaurantId ? { ...r, isOpen: !r.isOpen } : r))
    );
  };

  // If branded loading screen active
  if (isAppLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 flex flex-col items-center justify-center p-6 text-white text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-6"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-2xl shadow-orange-500/40">
            <Utensils className="w-10 h-10 text-white stroke-[2.2]" />
          </div>
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 ring-4 ring-slate-950 animate-ping" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl font-black tracking-tight">
            Foodie<span className="text-orange-500">Express</span>
          </h1>
          <p className="text-xs text-orange-200 mt-1 italic tracking-wider">
            "Your Cravings. Our Mission."
          </p>
        </motion.div>

        <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-8">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
          />
        </div>
        <p className="text-[11px] text-slate-400 mt-3 font-mono">
          Bootstrapping Food Delivery Ecosystem...
        </p>
      </div>
    );
  }

  // Active Role Dispatching
  // If user switched role from top switcher, show the respective dashboard
  if (activeRole === 'restaurant_owner' || currentTab === 'restaurant_dashboard') {
    return (
      <div className="min-h-screen bg-[#FDFBF7] text-slate-800 flex flex-col justify-between">
        <Navbar currentTab="restaurant_dashboard" setCurrentTab={setCurrentTab} />
        <main className="flex-1">
          <RestaurantDashboard
            restaurant={restaurants[0]}
            foodItems={foodItems}
            onAddDish={handleAddDish}
            onToggleDishAvailability={handleToggleDishAvailability}
            onDeleteDish={handleDeleteDish}
          />
        </main>
        <Footer onOpenDbms={() => setCurrentTab('dbms_explorer')} />
      </div>
    );
  }

  if (activeRole === 'delivery_partner' || currentTab === 'delivery_dashboard') {
    return (
      <div className="min-h-screen bg-[#FDFBF7] text-slate-800 flex flex-col justify-between">
        <Navbar currentTab="delivery_dashboard" setCurrentTab={setCurrentTab} />
        <main className="flex-1">
          <DeliveryDashboard />
        </main>
        <Footer onOpenDbms={() => setCurrentTab('dbms_explorer')} />
      </div>
    );
  }

  if (activeRole === 'admin' || currentTab === 'admin_dashboard') {
    return (
      <div className="min-h-screen bg-[#FDFBF7] text-slate-800 flex flex-col justify-between">
        <Navbar currentTab="admin_dashboard" setCurrentTab={setCurrentTab} />
        <main className="flex-1">
          <AdminDashboard
            restaurants={restaurants}
            onToggleRestaurantStatus={handleToggleRestaurantStatus}
          />
        </main>
        <Footer onOpenDbms={() => setCurrentTab('dbms_explorer')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 flex flex-col justify-between selection:bg-orange-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Customer Views */}
      <main className="flex-1">
        {/* TAB: Home / Explore */}
        {currentTab === 'home' && (
          <div>
            {/* Cinematic Hero */}
            <HeroSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onExploreClick={() => setCurrentTab('restaurants')}
              onQuickCategoryClick={(slug) => {
                setSelectedCategory(slug);
                setCurrentTab('restaurants');
              }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 pt-8">
              {/* Category Inspirations */}
              <CategoryList
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={(slug) => {
                  setSelectedCategory(slug);
                  if (slug) setCurrentTab('restaurants');
                }}
              />

              {/* Promotional Discount Offer Banner */}
              <div className="rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="space-y-2 text-center sm:text-left">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Exclusive Craving Deals
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black">
                    Up to 50% OFF on Top Kitchens
                  </h3>
                  <p className="text-xs sm:text-sm text-orange-100 max-w-lg">
                    Apply promo code <span className="font-mono font-bold bg-white text-orange-700 px-2 py-0.5 rounded">TASTY50</span> at checkout to save instantly on your delicious feast.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentTab('restaurants')}
                  className="bg-white text-orange-600 hover:bg-orange-50 font-black text-xs px-6 py-3 rounded-2xl shadow-lg transition active:scale-95 shrink-0 flex items-center gap-2"
                >
                  <span>Explore Participating Menus</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Top Rated Restaurants Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Top Certified Kitchens in Mumbai
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Authentic dum biryanis, sourdough pizzas, smash burgers & more
                    </p>
                  </div>

                  <button
                    onClick={() => setCurrentTab('restaurants')}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                  >
                    <span>View all ({restaurants.length})</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {restaurants.slice(0, 6).map((restaurant) => (
                    <RestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                      onClick={() => setSelectedRestaurant(restaurant)}
                    />
                  ))}
                </div>
              </div>

              {/* Bestseller Dishes Carousel */}
              <div className="space-y-6 pb-12">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        Trending Bestseller Dishes
                      </h2>
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-amber-600 text-amber-600" />
                        Hot
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Most ordered signature recipes across Mumbai
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bestsellerDishes.map((dish) => (
                    <FoodItemCard
                      key={dish.id}
                      item={dish}
                      onCustomize={(item) => setCustomizingItem(item)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: Restaurants Discovery & Filters */}
        {currentTab === 'restaurants' && (
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Explore All Restaurants & Kitchens
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Filter by cuisine, dietary choices, delivery speed, or pricing.
              </p>
            </div>

            {/* Filter and Sort Toolbar */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                {/* Search in Restaurants */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by restaurant or dish..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-50 pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs w-48 sm:w-60 focus:outline-hidden focus:border-orange-500"
                  />
                </div>

                {/* Pure Veg Filter */}
                <button
                  onClick={() => setRestVegFilter(!restVegFilter)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                    restVegFilter
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Pure Veg Only</span>
                </button>

                {/* Category Pills */}
                {categories.map((c) => {
                  const isCat = selectedCategory === c.slug;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(isCat ? null : c.slug)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition ${
                        isCat
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-semibold">Sort:</span>
                <select
                  value={restSortBy}
                  onChange={(e) => setRestSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700"
                >
                  <option value="rating">Rating (Highest First)</option>
                  <option value="deliveryTime">Delivery Time (Fastest)</option>
                  <option value="price">Cost (Low to High)</option>
                </select>
              </div>
            </div>

            {/* Results Grid */}
            {filteredRestaurants.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-xs space-y-3">
                <Store className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-800 text-base">No restaurants match your filters</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try clearing your search query or toggling dietary preferences.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setRestVegFilter(false);
                    setSelectedCategory(null);
                  }}
                  className="bg-orange-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    onClick={() => setSelectedRestaurant(restaurant)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: Live Order Tracking */}
        {currentTab === 'tracking' && (
          <OrderTrackingView onBrowseMore={() => setCurrentTab('restaurants')} />
        )}

        {/* TAB: Order History */}
        {currentTab === 'orders' && (
          <OrderHistoryView
            onTrackOrder={(orderId) => {
              setActiveTrackingOrderId(orderId);
              setCurrentTab('tracking');
            }}
            onOpenReview={(id, name) => setReviewModalData({ id, name })}
            onBrowseMenu={() => setCurrentTab('restaurants')}
          />
        )}

        {/* TAB: Academic DBMS Explorer */}
        {currentTab === 'dbms_explorer' && <DbmsExplorer />}
      </main>

      {/* Footer */}
      <Footer onOpenDbms={() => setCurrentTab('dbms_explorer')} />

      {/* Restaurant Detail Modal */}
      <RestaurantDetailModal
        restaurant={selectedRestaurant}
        foodItems={foodItems}
        onClose={() => setSelectedRestaurant(null)}
        onCustomizeItem={(item) => setCustomizingItem(item)}
        onOpenReview={(id, name) => setReviewModalData({ id, name })}
      />

      {/* Dish Customization Modal */}
      <FoodCustomizationModal
        item={customizingItem}
        onClose={() => setCustomizingItem(null)}
      />

      {/* Slide-in Cart Drawer */}
      <CartDrawer
        onProceedCheckout={() => {
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout & Payment Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={(orderId) => {
          setActiveTrackingOrderId(orderId);
          setCurrentTab('tracking');
        }}
      />

      {/* Review & Rating Modal */}
      <ReviewModal
        restaurantId={reviewModalData?.id || null}
        restaurantName={reviewModalData?.name || null}
        onClose={() => setReviewModalData(null)}
      />

      {/* Global Instant Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 pt-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5 flex-1 mr-4">
                  <Search className="w-5 h-5 text-orange-500" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search dishes, restaurants, or cuisines..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-base font-medium text-slate-900 placeholder-slate-400 focus:outline-hidden"
                  />
                </div>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 flex items-center justify-center transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Live search results */}
              <div className="max-h-96 overflow-y-auto space-y-4 text-xs">
                {/* Matched Dishes */}
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[11px] mb-2">
                    Dishes
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {foodItems
                      .filter((f) =>
                        searchQuery ? f.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
                      )
                      .slice(0, 4)
                      .map((dish) => (
                        <div
                          key={dish.id}
                          onClick={() => {
                            setCustomizingItem(dish);
                            setIsSearchOpen(false);
                          }}
                          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-orange-50/60 border border-slate-100 cursor-pointer transition"
                        >
                          <img
                            src={dish.image}
                            alt={dish.name}
                            className="w-11 h-11 rounded-lg object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-slate-900 truncate">{dish.name}</p>
                            <p className="text-slate-500">₹{dish.price} • {dish.restaurantName}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Matched Restaurants */}
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[11px] mb-2">
                    Restaurants
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {restaurants
                      .filter((r) =>
                        searchQuery
                          ? r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            r.cuisineType.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
                          : true
                      )
                      .slice(0, 4)
                      .map((rest) => (
                        <div
                          key={rest.id}
                          onClick={() => {
                            setSelectedRestaurant(rest);
                            setIsSearchOpen(false);
                          }}
                          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-orange-50/60 border border-slate-100 cursor-pointer transition"
                        >
                          <img
                            src={rest.image}
                            alt={rest.name}
                            className="w-11 h-11 rounded-lg object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-slate-900 truncate">{rest.name}</p>
                            <p className="text-slate-500">{rest.cuisineType.join(', ')} • {rest.rating} ⭐</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <MainApp />
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
