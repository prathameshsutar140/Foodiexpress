import React from 'react';
import { motion } from 'motion/react';
import { Star, Clock, Heart, Sparkles, MapPin } from 'lucide-react';
import { Restaurant } from '../../types';
import { useOrders } from '../../context/OrderContext';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onClick }) => {
  const { favorites, toggleFavoriteRestaurant } = useOrders();
  const isFavorite = favorites.restaurants.includes(restaurant.id);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:shadow-orange-950/8 transition-all duration-300 flex flex-col cursor-pointer"
      onClick={onClick}
    >
      {/* Banner & Image Showcase */}
      <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Gradient Overlay for bottom text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Badges: Veg indicator & Delivery time */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {restaurant.isVegOnly && (
            <span className="bg-emerald-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Pure Veg
            </span>
          )}
          <span className="bg-black/70 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3 text-orange-400" />
            <span>{restaurant.deliveryTimeMin} mins</span>
          </span>
        </div>

        {/* Top Right: Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavoriteRestaurant(restaurant.id);
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition ${
            isFavorite
              ? 'bg-rose-500 text-white'
              : 'bg-black/40 text-white hover:bg-rose-500 hover:text-white'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
        </button>

        {/* Bottom overlay: Name and Price range */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-lg text-white drop-shadow-md truncate">
              {restaurant.name}
            </h3>
            <span className="text-xs font-mono font-bold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded">
              {restaurant.priceRange}
            </span>
          </div>
          <p className="text-xs text-slate-200 truncate mt-0.5">{restaurant.tagline}</p>
        </div>
      </div>

      {/* Card Content & Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Cuisines */}
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {restaurant.cuisineType.map((cuisine) => (
              <span
                key={cuisine}
                className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
              >
                {cuisine}
              </span>
            ))}
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {restaurant.description}
          </p>
        </div>

        {/* Footer info: Rating, Delivery fee, Min order */}
        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="bg-emerald-600 text-white font-black px-2 py-0.5 rounded-md text-[11px] flex items-center gap-1">
              <span>{restaurant.rating}</span>
              <Star className="w-3 h-3 fill-white text-white" />
            </span>
            <span className="text-slate-400 font-medium">({restaurant.ratingCount})</span>
          </div>

          <div className="flex items-center gap-2 text-slate-600 font-medium text-[11px]">
            <span>
              {restaurant.deliveryFee === 0 ? (
                <span className="text-emerald-600 font-bold">Free Delivery</span>
              ) : (
                `₹${restaurant.deliveryFee} Delivery`
              )}
            </span>
            <span>•</span>
            <span>Min ₹{restaurant.minOrder}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
