import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Star,
  Clock,
  MapPin,
  Phone,
  Heart,
  ShoppingBag,
  Filter,
  Flame,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react';
import { Restaurant, FoodItem } from '../../types';
import { FoodItemCard } from './FoodItemCard';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';

interface RestaurantDetailModalProps {
  restaurant: Restaurant | null;
  foodItems: FoodItem[];
  onClose: () => void;
  onCustomizeItem: (item: FoodItem) => void;
  onOpenReview: (restaurantId: string, restaurantName: string) => void;
}

export const RestaurantDetailModal: React.FC<RestaurantDetailModalProps> = ({
  restaurant,
  foodItems,
  onClose,
  onCustomizeItem,
  onOpenReview,
}) => {
  const { totalItemCount, total, setIsCartOpen, restaurantId } = useCart();
  const { reviews, favorites, toggleFavoriteRestaurant } = useOrders();

  const [vegOnlyFilter, setVegOnlyFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!restaurant) return null;

  const isFavorite = favorites.restaurants.includes(restaurant.id);

  // Dishes for this restaurant
  const restaurantDishes = foodItems.filter((f) => f.restaurantId === restaurant.id);
  const filteredDishes = restaurantDishes.filter((dish) => {
    if (vegOnlyFilter && !dish.isVeg) return false;
    if (selectedCategory !== 'All' && dish.category !== selectedCategory) return false;
    return true;
  });

  const categories = ['All', ...Array.from(new Set(restaurantDishes.map((d) => d.category)))];

  // Filter reviews for this restaurant
  const restaurantReviews = reviews.filter((r) => r.restaurantId === restaurant.id);

  const isCurrentCartRestaurant = restaurantId === restaurant.id && totalItemCount > 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 20 }}
          className="bg-white w-full max-w-5xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col min-h-screen sm:min-h-0 sm:max-h-[92vh]"
        >
          {/* Top Banner Header */}
          <div className="relative aspect-21/9 sm:aspect-3/1 overflow-hidden bg-slate-900 shrink-0">
            <img
              src={restaurant.bannerImage || restaurant.image}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition shadow-md z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Favorite button */}
            <button
              onClick={() => toggleFavoriteRestaurant(restaurant.id)}
              className={`absolute top-4 right-16 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition z-10 ${
                isFavorite
                  ? 'bg-rose-500 text-white'
                  : 'bg-black/50 text-white hover:bg-rose-500 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
            </button>

            {/* Restaurant Bio on Banner */}
            <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 text-white">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                {restaurant.isVegOnly && (
                  <span className="bg-emerald-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                    Pure Veg
                  </span>
                )}
                <span className="text-xs bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full font-bold">
                  {restaurant.cuisineType.join(' • ')}
                </span>
                <span className="text-xs bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3 text-orange-400" />
                  <span>{restaurant.deliveryTimeMin} mins express</span>
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black">{restaurant.name}</h2>
              <p className="text-xs sm:text-sm text-slate-200 mt-0.5 max-w-xl line-clamp-1">
                {restaurant.tagline}
              </p>
            </div>
          </div>

          {/* Details & Filter Bar */}
          <div className="p-4 sm:px-6 bg-slate-50 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
            <div className="flex items-center gap-4 text-slate-600">
              <div className="flex items-center gap-1.5 bg-emerald-600 text-white px-2 py-0.5 rounded-md font-bold">
                <span>{restaurant.rating}</span>
                <Star className="w-3 h-3 fill-white text-white" />
              </div>
              <span className="font-semibold text-slate-700">
                {restaurant.ratingCount}+ ratings
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                {restaurant.address}
              </span>
            </div>

            {/* Veg Only Switch */}
            <div className="flex items-center gap-2">
              <label
                onClick={() => setVegOnlyFilter(!vegOnlyFilter)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-bold cursor-pointer transition select-none ${
                  vegOnlyFilter
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 border-2 rounded-xs flex items-center justify-center ${
                    vegOnlyFilter ? 'border-white' : 'border-emerald-600'
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      vegOnlyFilter ? 'bg-white' : 'bg-emerald-600'
                    }`}
                  />
                </div>
                <span>Veg Only</span>
              </label>

              <button
                onClick={() => onOpenReview(restaurant.id, restaurant.name)}
                className="bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-700 font-bold px-3 py-1.5 rounded-full border border-slate-200 transition flex items-center gap-1"
              >
                <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
                <span>Add Review</span>
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="px-4 sm:px-6 py-2.5 border-b border-slate-100 flex items-center gap-2 overflow-x-auto shrink-0 bg-white">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Dishes Grid */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-slate-900 text-lg">
                  {selectedCategory === 'All' ? 'Recommended Menu Items' : selectedCategory} (
                  {filteredDishes.length})
                </h3>
              </div>

              {filteredDishes.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No dishes found matching your current filter.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDishes.map((dish) => (
                    <FoodItemCard key={dish.id} item={dish} onCustomize={onCustomizeItem} />
                  ))}
                </div>
              )}
            </div>

            {/* Customer Reviews Section */}
            <div className="pt-6 border-t border-slate-200/80">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-black text-slate-900 text-base">Customer Feedback</h3>
                  <p className="text-xs text-slate-500">Verified dining & delivery reviews</p>
                </div>
                <button
                  onClick={() => onOpenReview(restaurant.id, restaurant.name)}
                  className="text-xs font-bold text-orange-600 hover:underline"
                >
                  Write a review
                </button>
              </div>

              {restaurantReviews.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  Be the first foodie to leave a review for this kitchen!
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {restaurantReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{rev.customerName}</span>
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 leading-relaxed italic">"{rev.comment}"</p>
                      <p className="text-[10px] text-slate-400">{rev.createdAt}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sticky Bottom View Cart Bar if Cart has items from this kitchen */}
          {isCurrentCartRestaurant && (
            <div className="p-3 sm:px-6 bg-slate-900 text-white flex items-center justify-between shadow-2xl shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center font-black text-xs">
                  {totalItemCount}
                </div>
                <div>
                  <p className="text-xs font-bold">
                    {totalItemCount} items selected • <span className="text-orange-400">₹{total}</span>
                  </p>
                  <p className="text-[10px] text-slate-400">Extra charges may apply</p>
                </div>
              </div>

              <button
                onClick={() => setIsCartOpen(true)}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>View Cart</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
