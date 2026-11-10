import React from 'react';
import { Utensils, Heart, ShieldCheck, Zap, Database, Award, Sparkles } from 'lucide-react';

export const Footer: React.FC<{ onOpenDbms: () => void }> = ({ onOpenDbms }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-md">
                <Utensils className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Foodie<span className="text-orange-500">Express</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              "Your Cravings. Our Mission." Delivering chef-crafted dishes from the city's finest restaurants in under 30 minutes with lightning-fast routing.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-950 text-orange-400 border border-orange-800/60">
                <Zap className="w-3.5 h-3.5 text-orange-400" />
                30 Mins Express Delivery
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                100% Hygienic Kitchens
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Explore Cuisines
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="hover:text-orange-400 transition cursor-pointer">Hyderabadi Dum Biryani</li>
              <li className="hover:text-orange-400 transition cursor-pointer">Artisan Woodfired Pizzas</li>
              <li className="hover:text-orange-400 transition cursor-pointer">Gourmet Angus Smash Burgers</li>
              <li className="hover:text-orange-400 transition cursor-pointer">Japanese Sushi & Tonkotsu Ramen</li>
              <li className="hover:text-orange-400 transition cursor-pointer">Superfood Quinoa Bowls</li>
              <li className="hover:text-orange-400 transition cursor-pointer">French Patisserie & Gelato</li>
            </ul>
          </div>

          {/* Service Cities */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Top Locations
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="hover:text-orange-400 transition cursor-pointer">Mumbai (Bandra, Juhu, Powai, BKC)</li>
              <li className="hover:text-orange-400 transition cursor-pointer">Delhi NCR (Connaught, Gurgaon, Noida)</li>
              <li className="hover:text-orange-400 transition cursor-pointer">Bengaluru (Indiranagar, Koramangala)</li>
              <li className="hover:text-orange-400 transition cursor-pointer">Pune (Koregaon Park, Viman Nagar)</li>
              <li className="hover:text-orange-400 transition cursor-pointer">Hyderabad (Banjara Hills, Gachibowli)</li>
            </ul>
          </div>

          {/* Academic Capstone Details */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              DBMS Capstone
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Designed as an advanced MSBTE Diploma Computer Technology DBMS project exhibiting professional relational architecture.
            </p>
            <button
              onClick={onOpenDbms}
              className="w-full flex items-center justify-center gap-2 bg-purple-900/80 hover:bg-purple-800 text-purple-200 text-xs font-bold py-2 px-3 rounded-xl border border-purple-700/50 transition shadow-xs"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Open DBMS Console</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 FoodieExpress Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">FSSAI License #10022022000142</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
