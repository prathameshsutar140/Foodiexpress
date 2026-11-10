import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Store,
  CookingPot,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Check,
  X,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Power,
  Edit,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { Restaurant, FoodItem, OrderStatus } from '../../types';
import { useToast } from '../ui/Toast';

interface RestaurantDashboardProps {
  restaurant: Restaurant;
  foodItems: FoodItem[];
  onAddDish: (dish: Omit<FoodItem, 'id' | 'rating' | 'ratingCount'>) => void;
  onToggleDishAvailability: (id: string) => void;
  onDeleteDish: (id: string) => void;
}

export const RestaurantDashboard: React.FC<RestaurantDashboardProps> = ({
  restaurant,
  foodItems,
  onAddDish,
  onToggleDishAvailability,
  onDeleteDish,
}) => {
  const { orders, updateOrderStatus } = useOrders();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'analytics'>('orders');
  const [isOpen, setIsOpen] = useState(restaurant.isOpen);

  // New Dish Modal state
  const [showAddDishModal, setShowAddDishModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState('299');
  const [newCategory, setNewCategory] = useState('Biryani');
  const [newIsVeg, setNewIsVeg] = useState(true);
  const [newPrepTime, setNewPrepTime] = useState('20');
  const [newImage, setNewImage] = useState(
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'
  );

  // Filter orders for this restaurant
  const restaurantOrders = orders.filter((o) => o.restaurantId === restaurant.id);
  const liveOrders = restaurantOrders.filter(
    (o) => o.status !== 'delivered' && o.status !== 'cancelled'
  );
  const completedOrders = restaurantOrders.filter((o) => o.status === 'delivered');

  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);

  const handleAdvanceStatus = (orderId: string, currentStatus: OrderStatus) => {
    let nextStatus: OrderStatus = 'confirmed';
    if (currentStatus === 'placed') nextStatus = 'confirmed';
    else if (currentStatus === 'confirmed') nextStatus = 'preparing';
    else if (currentStatus === 'preparing') nextStatus = 'ready_for_pickup';

    updateOrderStatus(orderId, nextStatus);
    showToast('Order Status Updated', `Order #${orderId} marked as ${nextStatus.replace(/_/g, ' ')}`);
  };

  const handleAddDishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onAddDish({
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      name: newName.trim(),
      description: newDesc.trim() || 'Signature chef preparation made fresh.',
      price: parseFloat(newPrice) || 299,
      category: newCategory,
      isVeg: newIsVeg,
      isAvailable: true,
      preparationTime: parseInt(newPrepTime, 10) || 20,
      image: newImage,
    });

    showToast('New Dish Created', `${newName} added to kitchen catalog.`, 'success');
    setShowAddDishModal(false);
    setNewName('');
    setNewDesc('');
  };

  const myDishes = foodItems.filter((f) => f.restaurantId === restaurant.id);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Restaurant Header & Status Toggle */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-16 h-16 rounded-2xl object-cover shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">{restaurant.name}</h2>
              <span className="text-[11px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Verified Partner
              </span>
            </div>
            <p className="text-xs text-slate-500">{restaurant.address} • {restaurant.cuisineType.join(', ')}</p>
          </div>
        </div>

        {/* Kitchen Status Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsOpen(!isOpen);
              showToast('Status Changed', `Kitchen is now ${!isOpen ? 'ONLINE' : 'OFFLINE'}.`);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition shadow-xs ${
              isOpen
                ? 'bg-emerald-600 text-white'
                : 'bg-rose-100 text-rose-700 border border-rose-200'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{isOpen ? 'Kitchen Accepting Orders' : 'Kitchen Closed (Offline)'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-4 font-bold text-sm transition relative ${
            activeTab === 'orders'
              ? 'text-orange-600 border-b-2 border-orange-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Live Orders Queue</span>
          {liveOrders.length > 0 && (
            <span className="ml-2 bg-orange-600 text-white text-[11px] px-2 py-0.5 rounded-full">
              {liveOrders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('menu')}
          className={`pb-3 px-4 font-bold text-sm transition relative ${
            activeTab === 'menu'
              ? 'text-orange-600 border-b-2 border-orange-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Menu & Stock Inventory ({myDishes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 px-4 font-bold text-sm transition relative ${
            activeTab === 'analytics'
              ? 'text-orange-600 border-b-2 border-orange-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Kitchen Performance & Sales</span>
        </button>
      </div>

      {/* TAB 1: Live Orders Queue */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Incoming & Preparing Orders</h3>
            <span className="text-xs text-slate-500">{liveOrders.length} active tickets</span>
          </div>

          {liveOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="font-bold text-slate-800 text-sm">All caught up!</p>
              <p className="text-xs text-slate-400">
                No pending customer tickets waiting for preparation.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liveOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          #{ord.id}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full">
                          {ord.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <span className="font-black text-sm text-slate-900">₹{ord.total}</span>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1">
                      <p className="font-semibold text-slate-900">
                        Customer: {ord.customerName} ({ord.customerPhone})
                      </p>
                      <p className="text-slate-500">
                        Placed: {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    {/* Ordered items */}
                    <div className="p-3 bg-slate-50 rounded-2xl space-y-1.5 text-xs">
                      {ord.items.map((it, iIdx) => (
                        <div key={iIdx} className="flex justify-between text-slate-800">
                          <span>
                            <span className="font-bold text-orange-600">{it.quantity}x</span> {it.name}
                          </span>
                          <span className="font-mono text-slate-600">₹{it.price * it.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Advancement Button */}
                  <div className="pt-2 flex items-center justify-between gap-3">
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'cancelled', 'Kitchen rejected')}
                      className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1"
                    >
                      Reject Ticket
                    </button>

                    {ord.status === 'placed' && (
                      <button
                        onClick={() => handleAdvanceStatus(ord.id, 'placed')}
                        className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-xs"
                      >
                        Accept & Confirm
                      </button>
                    )}

                    {ord.status === 'confirmed' && (
                      <button
                        onClick={() => handleAdvanceStatus(ord.id, 'confirmed')}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5"
                      >
                        <CookingPot className="w-3.5 h-3.5" />
                        <span>Start Cooking</span>
                      </button>
                    )}

                    {ord.status === 'preparing' && (
                      <button
                        onClick={() => handleAdvanceStatus(ord.id, 'preparing')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Ready for Pickup</span>
                      </button>
                    )}

                    {ord.status === 'ready_for_pickup' && (
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
                        Waiting for Courier Arrival
                      </span>
                    )}

                    {ord.status === 'out_for_delivery' && (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                        In Transit with Courier
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Menu Management */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Menu Items & Food Catalog</h3>
              <p className="text-xs text-slate-500">
                Manage stock availability, add new recipes, or remove discontinued dishes.
              </p>
            </div>

            <button
              onClick={() => setShowAddDishModal(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-md transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Dish</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myDishes.map((dish) => (
              <div
                key={dish.id}
                className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-slate-100">
                    <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                    <span
                      className={`absolute top-2.5 left-2.5 text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        dish.isVeg ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      }`}
                    >
                      {dish.isVeg ? 'Veg' : 'Non-Veg'}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{dish.name}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                      {dish.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="font-black text-sm text-slate-900">₹{dish.price}</span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleDishAvailability(dish.id)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition ${
                        dish.isAvailable
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {dish.isAvailable ? 'In Stock' : 'Out of Stock'}
                    </button>

                    <button
                      onClick={() => onDeleteDish(dish.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Delete dish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Kitchen Performance & Sales */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Kitchen Revenue
              </span>
              <p className="text-2xl font-black text-slate-900">₹{totalRevenue.toLocaleString()}</p>
              <p className="text-[11px] text-emerald-600 font-semibold">+18% vs last week</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Orders Completed
              </span>
              <p className="text-2xl font-black text-slate-900">{completedOrders.length}</p>
              <p className="text-[11px] text-slate-500 font-medium">98.2% fulfillment rate</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Kitchen Rating
              </span>
              <p className="text-2xl font-black text-amber-500">{restaurant.rating} ⭐</p>
              <p className="text-[11px] text-slate-500 font-medium">Based on {restaurant.ratingCount} reviews</p>
            </div>
          </div>
        </div>
      )}

      {/* Add New Dish Modal */}
      {showAddDishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-lg">Add New Dish to Menu</h3>
              <button
                onClick={() => setShowAddDishModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDishSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Dish Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kashmiri Rogan Josh Biryani"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Appetizing description of ingredients, spices, and cooking method"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Prep Time (mins)</label>
                  <input
                    type="number"
                    value={newPrepTime}
                    onChange={(e) => setNewPrepTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="vegCheck"
                    checked={newIsVeg}
                    onChange={(e) => setNewIsVeg(e.target.checked)}
                    className="rounded text-orange-600 focus:ring-orange-500"
                  />
                  <label htmlFor="vegCheck" className="font-semibold text-slate-700">
                    Vegetarian Dish
                  </label>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Image URL</label>
                <input
                  type="text"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddDishModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange-600 text-white px-5 py-2 rounded-xl font-bold shadow-md hover:bg-orange-700"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
