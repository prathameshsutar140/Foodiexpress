import React from 'react';
import { motion } from 'motion/react';
import { Search, Flame, Clock, ShieldCheck, Sparkles, Star, ArrowRight, Tag } from 'lucide-react';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onExploreClick: () => void;
  onQuickCategoryClick: (slug: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  onExploreClick,
  onQuickCategoryClick,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/70 via-amber-50/30 to-white pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-orange-100/60">
      {/* Decorative ambient background glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-10 w-80 h-80 bg-amber-300/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline, Search, Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Top promotional pill */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/90 border border-orange-200/80 text-orange-800 text-xs font-bold shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-600 animate-spin" />
              <span>Flat 50% OFF on First 3 Orders</span>
              <span className="bg-orange-600 text-white text-[10px] px-2 py-0.5 rounded-full font-mono uppercase">
                CODE: TASTY50
              </span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
              Your Cravings.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500">
                Our Mission.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Indulge in authentic Dum Biryanis, artisanal woodfired pizzas, and gourmet smash burgers delivered piping hot from top-rated master kitchens in under 30 minutes.
            </p>

            {/* Integrated Interactive Search Bar */}
            <div className="pt-2 max-w-xl mx-auto lg:mx-0">
              <div className="relative flex items-center bg-white rounded-2xl p-2 shadow-xl shadow-orange-950/5 border border-orange-200 focus-within:ring-2 focus-within:ring-orange-500 transition-all">
                <div className="pl-3 pr-2 text-slate-400">
                  <Search className="w-5 h-5 text-orange-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search restaurants, biryani, burgers, pasta, desserts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden py-2"
                />
                <button
                  onClick={onExploreClick}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md shadow-orange-500/20 flex items-center gap-1.5 transition shrink-0 active:scale-95"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Search Tags */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-3 text-xs text-slate-500">
                <span className="font-semibold text-slate-600 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-500" /> Popular:
                </span>
                {['biryani', 'burgers', 'pizza', 'asian', 'healthy', 'desserts'].map((slug) => (
                  <button
                    key={slug}
                    onClick={() => onQuickCategoryClick(slug)}
                    className="capitalize px-2.5 py-1 rounded-lg bg-white/80 hover:bg-orange-50 text-slate-700 hover:text-orange-600 border border-slate-200/80 transition text-[11px] font-medium"
                  >
                    {slug}
                  </button>
                ))}
              </div>
            </div>

            {/* Feature Highlights / Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 max-w-lg mx-auto lg:mx-0 border-t border-slate-200/70">
              <div className="text-left">
                <div className="flex items-center gap-1 text-orange-600 font-black text-xl sm:text-2xl">
                  <span>28</span>
                  <span className="text-sm font-bold">Mins</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Avg Express Delivery</p>
              </div>
              <div className="text-left border-l border-slate-200 pl-4">
                <div className="flex items-center gap-1 text-slate-900 font-black text-xl sm:text-2xl">
                  <span>4.9</span>
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Customer Rating</p>
              </div>
              <div className="text-left border-l border-slate-200 pl-4">
                <div className="flex items-center gap-1 text-emerald-600 font-black text-xl sm:text-2xl">
                  <span>50k+</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Orders Delivered</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Cinematic Floating Culinary Showcase */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Center Main Dish Graphic with subtle floating animation */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
              className="relative w-72 sm:w-88 aspect-square rounded-full bg-gradient-to-tr from-orange-400 to-amber-300 p-2 shadow-2xl shadow-orange-500/30"
            >
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-inner">
                <img
                  src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80"
                  alt="Royal Saffron Dum Biryani"
                  className="w-full h-full object-cover scale-105 hover:scale-110 transition duration-700"
                />
              </div>
            </motion.div>

            {/* Floating Card 1: Express Timer badge */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -top-4 -left-4 sm:left-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-orange-100 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <Clock className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Fastest Courier</p>
                <p className="text-xs font-black text-slate-900">Live GPS Dispatch</p>
              </div>
            </motion.div>

            {/* Floating Card 2: Food Quality badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 1 }}
              className="absolute -bottom-6 -right-2 sm:right-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-emerald-100 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Food Safety</p>
                <p className="text-xs font-black text-slate-900">100% Tamper Proof</p>
              </div>
            </motion.div>

            {/* Floating Card 3: Discount tag */}
            <motion.div
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="absolute top-1/2 -right-6 sm:-right-8 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3.5 py-2 rounded-xl shadow-lg text-xs font-black flex items-center gap-1.5"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>SAVE ₹150</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
