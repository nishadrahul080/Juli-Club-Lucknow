import React, { useState } from 'react';
import { CLIENT_REVIEWS } from '../data/mockData';
import { Review } from '../types';
import { Star, ShieldCheck, MessageSquarePlus, CheckCircle2, User } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(CLIENT_REVIEWS);
  const [newReview, setNewReview] = useState({ clientName: '', profileName: 'Aroohii Sharma', rating: 5, comment: '', location: 'Gomti Nagar' });
  const [showAddReview, setShowAddReview] = useState(false);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.clientName || !newReview.comment) return;

    const rev: Review = {
      id: 'rev-' + Date.now(),
      clientName: newReview.clientName,
      profileName: newReview.profileName,
      rating: Number(newReview.rating),
      date: 'Just now',
      comment: newReview.comment,
      location: newReview.location + ', Lucknow',
      verifiedBooking: true,
    };

    setReviews([rev, ...reviews]);
    setNewReview({ clientName: '', profileName: 'Aroohii Sharma', rating: 5, comment: '', location: 'Gomti Nagar' });
    setShowAddReview(false);
  };

  return (
    <section className="py-16 bg-[#0a0a0a] text-[#e0e0e0] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#c5a059] text-[10px] font-bold uppercase tracking-[0.2em]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#c5a059]" /> Client Ratings
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif text-[#e0e0e0] mt-1">
              Client Feedback & Satisfaction Reviews
            </h2>
          </div>

          <button
            onClick={() => setShowAddReview(!showAddReview)}
            className="px-5 py-2.5 bg-[#c5a059] hover:bg-[#d4b578] text-black font-bold rounded-sm text-xs uppercase tracking-widest transition-colors flex items-center gap-1.5 shadow-lg"
          >
            <MessageSquarePlus className="w-4 h-4" />
            Write Review
          </button>
        </div>

        {/* Add review form */}
        {showAddReview && (
          <form onSubmit={handleAddReview} className="bg-[#0f0f0f] p-5 rounded border border-white/10 space-y-3 max-w-xl mx-auto">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#c5a059]">Submit Your Booking Experience</h4>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Your Name / Initial"
                required
                value={newReview.clientName}
                onChange={(e) => setNewReview({ ...newReview, clientName: e.target.value })}
                className="bg-[#1a1a1a] border border-white/10 rounded px-3 py-2 text-xs text-[#e0e0e0] placeholder-white/30 focus:outline-none focus:border-[#c5a059]"
              />
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                className="bg-[#1a1a1a] border border-white/10 rounded px-3 py-2 text-xs text-[#c5a059] font-bold focus:outline-none focus:border-[#c5a059]"
              >
                <option value={5} className="bg-[#0f0f0f]">5 Stars (Excellent)</option>
                <option value={4} className="bg-[#0f0f0f]">4 Stars (Very Good)</option>
              </select>
            </div>
            <textarea
              required
              rows={3}
              placeholder="Describe your meeting experience, cash on delivery, punctuality, pickup & drop..."
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded p-3 text-xs text-[#e0e0e0] placeholder-white/30 focus:outline-none focus:border-[#c5a059]"
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddReview(false)}
                className="px-3 py-1.5 bg-white/10 text-white/70 hover:text-white rounded text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#c5a059] hover:bg-[#d4b578] text-black font-bold rounded text-xs uppercase tracking-wider"
              >
                Post Review
              </button>
            </div>
          </form>
        )}

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-[#0f0f0f] p-5 rounded border border-white/10 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center text-[#c5a059] font-bold text-xs border border-white/10">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-serif font-bold text-[#e0e0e0] text-sm block">{rev.clientName}</span>
                      <span className="text-[10px] text-white/50">{rev.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-[#c5a059]/10 px-2 py-1 rounded border border-[#c5a059]/20">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#c5a059] text-[#c5a059]" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-white/70 leading-relaxed font-sans italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-sans">
                <span className="text-[#c5a059] font-medium">Companion: {rev.profileName}</span>
                {rev.verifiedBooking && (
                  <span className="text-emerald-400 flex items-center gap-1 font-bold uppercase tracking-wider text-[9px]">
                    <CheckCircle2 className="w-3 h-3" /> Verified Cash Booking
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

