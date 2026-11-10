import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Plus, Minus, Sparkles } from 'lucide-react';
import { FoodItem, FoodCustomizationOption } from '../../types';
import { useCart } from '../../context/CartContext';
import { useToast } from '../ui/Toast';

interface FoodCustomizationModalProps {
  item: FoodItem | null;
  onClose: () => void;
}

export const FoodCustomizationModal: React.FC<FoodCustomizationModalProps> = ({ item, onClose }) => {
  const { addItem } = useCart();
  const { showToast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<FoodCustomizationOption[]>([]);
  const [instructions, setInstructions] = useState('');

  if (!item) return null;

  const toggleOption = (option: FoodCustomizationOption, isRequiredGroup: boolean) => {
    setSelectedOptions((prev) => {
      // If from a single-select/required group, remove existing option from same group if any
      const exists = prev.some((o) => o.name === option.name);
      if (exists) {
        return prev.filter((o) => o.name !== option.name);
      }
      return [...prev, option];
    });
  };

  const optionsTotal = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
  const itemTotal = (item.price + optionsTotal) * quantity;

  const handleAddToCart = () => {
    addItem(item, quantity, selectedOptions, instructions);
    showToast('Item customized & added!', `${item.name} (${quantity}x) added to cart.`);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        >
          {/* Header image and dismiss */}
          <div className="relative aspect-16/9 overflow-hidden bg-slate-900 shrink-0">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400 bg-black/40 px-2 py-0.5 rounded">
                Customise Your Order
              </span>
              <h3 className="text-xl font-black mt-1">{item.name}</h3>
              <p className="text-xs text-slate-300">Base price: ₹{item.price}</p>
            </div>
          </div>

          {/* Options & Instructions Scrollable Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-700">
            {item.customizationGroups?.map((group, gIdx) => (
              <div key={gIdx} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900">{group.title}</h4>
                  {group.required && (
                    <span className="text-[11px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                      Required
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {group.options.map((opt, oIdx) => {
                    const isSelected = selectedOptions.some((o) => o.name === opt.name);
                    return (
                      <div
                        key={oIdx}
                        onClick={() => toggleOption(opt, group.required)}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                          isSelected
                            ? 'bg-orange-50/80 border-orange-500 text-slate-900 font-semibold'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                              isSelected
                                ? 'bg-orange-600 border-orange-600 text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span>{opt.name}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-600">
                          {opt.price === 0 ? 'Free' : `+₹${opt.price}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Special Instructions Input */}
            <div className="space-y-2">
              <label className="font-bold text-slate-900 block text-xs">
                Cooking Requests or Allergies
              </label>
              <textarea
                rows={2}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Less spicy, dressing on the side, extra cutlery..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:border-orange-500"
              />
            </div>
          </div>

          {/* Bottom Bar: Quantity & Add Button */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4 shrink-0">
            {/* Quantity Stepper */}
            <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2.5 hover:bg-slate-100 text-slate-600 transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-3 font-bold text-sm text-slate-900 min-w-8 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="p-2.5 hover:bg-slate-100 text-slate-600 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Final CTA */}
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-orange-500/20 flex items-center justify-between text-sm transition"
            >
              <span>Add to Cart</span>
              <span className="font-mono font-black">₹{itemTotal}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
