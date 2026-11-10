import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import { useToast } from '../ui/Toast';

interface ReviewModalProps {
  restaurantId: string | null;
  restaurantName: string | null;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  restaurantId,
  restaurantName,
  onClose,
}) => {
  const { profile } = useAuth();
  const { addReview } = useOrders();
  const { showToast } = useToast();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!restaurantId) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      await addReview({
        restaurantId,
        restaurantName: restaurantName || undefined,
        customerId: profile.uid,
        customerName: profile.displayName || 'Foodie Reviewer',
        rating,
        comment: comment.trim(),
      });
      showToast('Review Submitted!', 'Thank you for helping fellow food lovers.', 'success');
      onClose();
    } catch (err: any) {
      showToast('Error', err?.message || 'Failed to submit review', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-6 space-y-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-900 text-lg">Leave a Review</h3>
              <p className="text-xs text-slate-500">{restaurantName}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Interactive Stars */}
            <div className="text-center py-2">
              <p className="text-xs font-semibold text-slate-600 mb-2">Rate your dining experience</p>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const filled = (hoverRating || rating) >= star;
                  return (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-hidden"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          filled
                            ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                            : 'text-slate-200'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comment Area */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Your Feedback & Taste Notes
              </label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you love about the food, spice balance, or delivery speed?"
                className="w-full text-xs p-3 rounded-2xl border border-slate-200 focus:outline-hidden focus:border-orange-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 rounded-xl shadow-md transition disabled:opacity-50 text-xs"
            >
              {isSubmitting ? 'Posting Review...' : 'Submit Review'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
