import React from 'react';
import { motion } from 'motion/react';
import { Star, Plus, Minus, Heart, Flame, Clock } from 'lucide-react';
import { FoodItem } from '../../types';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';
import { useToast } from '../ui/Toast';

interface FoodItemCardProps {
  item: FoodItem;
  onCustomize: (item: FoodItem) => void;
}

export const FoodItemCard: React.FC<FoodItemCardProps> = ({ item, onCustomize }) => {
  const { items, addItem, updateQuantity } = useCart();
  const { favorites, toggleFavoriteFood } = useOrders();
  const { showToast } = useToast();

  const isFavorite = favorites.foods.includes(item.id);

  // Check if item is in cart
  const cartItem = items.find((i) => i.foodItem.id === item.id);
  const cartQuantity = cartItem ? cartItem.quantity : 0;

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.customizationGroups && item.customizationGroups.length > 0) {
      onCustomize(item);
    } else {
      addItem(item, 1);
      showToast(`Added to cart!`, `${item.name} is in your bag.`);
    }
  };

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/80 p-4 shadow-xs hover:shadow-xl hover:shadow-orange-950/6 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Top Image Showcase */}
        <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 mb-3.5">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Veg / Non-Veg Symbol in top left */}
          <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs p-1 rounded-md shadow-xs">
            <div
              className={`w-3.5 h-3.5 border-2 flex items-center justify-center rounded-xs ${
                item.isVeg ? 'border-emerald-600' : 'border-rose-600'
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                }`}
              />
            </div>
          </div>

          {/* Bestseller Badge */}
          {item.isBestseller && (
            <div className="absolute top-2.5 right-11 bg-amber-500 text-slate-900 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
              <Flame className="w-3 h-3 text-white fill-white" />
              <span>Bestseller</span>
            </div>
          )}

          {/* Favorite heart button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavoriteFood(item.id);
            }}
            className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center transition ${
              isFavorite
                ? 'bg-rose-500 text-white'
                : 'bg-black/30 text-white hover:bg-rose-500 hover:text-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-white' : ''}`} />
          </button>

          {/* Prep time & Calories floating bar */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-white font-semibold">
            <span className="bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-full flex items-center gap-1">
              <Clock className="w-2.5 h-2.5 text-orange-400" />
              <span>{item.preparationTime} mins</span>
            </span>
            {item.calories && (
              <span className="bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-full">
                {item.calories} kcal
              </span>
            )}
          </div>
        </div>

        {/* Title, Category & Restaurant */}
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-orange-600 transition leading-snug">
              {item.name}
            </h4>
          </div>
          <p className="text-[11px] font-medium text-slate-400 truncate">
            from <span className="text-slate-600">{item.restaurantName}</span>
          </p>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed pt-1">
            {item.description}
          </p>
        </div>
      </div>

      {/* Bottom Pricing & Add to Cart Controls */}
      <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-base font-black text-slate-900">₹{item.price}</span>
            {item.originalPrice && (
              <span className="text-xs text-slate-400 line-through">₹{item.originalPrice}</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-0.5">
            <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
            <span>{item.rating}</span>
            <span className="text-slate-400 font-normal">({item.ratingCount})</span>
          </div>
        </div>

        {/* Add / Stepper Button */}
        <div>
          {cartQuantity === 0 ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddClick}
              className="bg-orange-50 hover:bg-orange-600 text-orange-600 hover:text-white border border-orange-200 hover:border-orange-600 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
            >
              <span>Add</span>
              <Plus className="w-3.5 h-3.5" />
            </motion.button>
          ) : (
            <div className="flex items-center bg-orange-600 text-white rounded-xl shadow-xs overflow-hidden">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateQuantity(item.id, -1);
                }}
                className="px-2.5 py-1.5 hover:bg-orange-700 transition"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="px-2 text-xs font-black min-w-5 text-center">
                {cartQuantity}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateQuantity(item.id, 1);
                }}
                className="px-2.5 py-1.5 hover:bg-orange-700 transition"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
