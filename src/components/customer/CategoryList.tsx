import React from 'react';
import { motion } from 'motion/react';
import { Category } from '../../types';

interface CategoryListProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (slug: string | null) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Inspiration for your first order
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Handpicked culinary categories curated for every craving
          </p>
        </div>
        {selectedCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200 transition"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Horizontal scrollable category pill cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <motion.div
              key={cat.id}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectCategory(isSelected ? null : cat.slug)}
              className={`group cursor-pointer rounded-2xl p-2.5 flex flex-col items-center text-center transition-all ${
                isSelected
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25 ring-2 ring-orange-500'
                  : 'bg-white hover:bg-orange-50/50 border border-slate-200/80 hover:border-orange-200 shadow-xs'
              }`}
            >
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden p-1 bg-gradient-to-tr from-amber-400 to-orange-500 shadow-inner mb-2.5">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition duration-500"
                />
              </div>
              <span
                className={`text-xs font-bold leading-tight ${
                  isSelected ? 'text-white' : 'text-slate-800 group-hover:text-orange-600'
                }`}
              >
                {cat.name}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
