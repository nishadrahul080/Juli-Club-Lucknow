import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { Review } from '../../types';
import {
  Star,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle2,
  MessageSquare,
  User,
  MapPin,
  Calendar,
  X,
  Save,
  ShieldCheck,
  Filter
} from 'lucide-react';

export const ReviewsModule: React.FC = () => {
  const { cmsData, updateReviews } = useCMS();
  const reviews = cmsData.reviews || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | 'All'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Partial<Review> | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredReviews = reviews.filter(r => {
    if (selectedRatingFilter !== 'All' && r.rating !== selectedRatingFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.clientName.toLowerCase().includes(q) ||
        r.profileName.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  const verifiedCount = reviews.filter(r => r.verifiedBooking).length;

  const handleOpenNewModal = () => {
    setEditingReview({
      id: `rev-${Date.now()}`,
      clientName: '',
      profileName: cmsData.profiles[0]?.name || 'Aroohii Sharma',
      rating: 5,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      comment: '',
      location: 'Gomti Nagar, Lucknow',
      verifiedBooking: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (review: Review) => {
    setEditingReview({ ...review });
    setIsModalOpen(true);
  };

  const handleDeleteReview = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      const updated = reviews.filter(r => r.id !== id);
      try {
        await updateReviews(updated);
        showToast('Review deleted successfully');
      } catch (err: any) {
        alert('Failed to delete review: ' + (err.message || 'Error'));
      }
    }
  };

  const handleToggleVerified = async (id: string) => {
    const updated = reviews.map(r => r.id === id ? { ...r, verifiedBooking: !r.verifiedBooking } : r);
    try {
      await updateReviews(updated);
      showToast('Verified booking status updated');
    } catch (err: any) {
      alert('Failed to update review: ' + (err.message || 'Error'));
    }
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview || !editingReview.clientName || !editingReview.comment) return;

    const newRev = editingReview as Review;
    const exists = reviews.some(r => r.id === newRev.id);

    let updatedList: Review[];
    if (exists) {
      updatedList = reviews.map(r => r.id === newRev.id ? newRev : r);
    } else {
      updatedList = [newRev, ...reviews];
    }

    try {
      await updateReviews(updatedList);
      showToast(exists ? 'Review updated successfully' : 'New review published successfully');
      setIsModalOpen(false);
      setEditingReview(null);
    } catch (err: any) {
      alert('Failed to save review to database: ' + (err.message || 'Error'));
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#c5a059] text-black font-bold text-xs px-4 py-3 rounded shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Analytics Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0f0f0f] p-6 rounded-lg border border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#c5a059]" />
            <h1 className="text-xl sm:text-2xl font-serif text-[#e0e0e0]">Client Reviews & Testimonials Manager</h1>
          </div>
          <p className="text-xs text-white/60 mt-1 font-sans">
            Manage verified customer feedback, star ratings, and booking testimonials across Lucknow location pages.
          </p>
        </div>

        <button
          onClick={handleOpenNewModal}
          className="px-5 py-2.5 bg-[#c5a059] hover:bg-[#d4b578] text-black font-bold rounded text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shrink-0 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Client Review
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0f0f0f] p-4 rounded-lg border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-white/50 uppercase font-bold tracking-widest block">Total Reviews</span>
            <span className="text-2xl font-serif font-bold text-[#e0e0e0] mt-1 block">{reviews.length}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#c5a059]/10 border border-[#c5a059]/30 flex items-center justify-center text-[#c5a059]">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0f0f0f] p-4 rounded-lg border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-white/50 uppercase font-bold tracking-widest block">Average Rating</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-serif font-bold text-[#c5a059]">{avgRating}</span>
              <div className="flex text-[#c5a059]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#c5a059]/10 border border-[#c5a059]/30 flex items-center justify-center text-[#c5a059]">
            <Star className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#0f0f0f] p-4 rounded-lg border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-white/50 uppercase font-bold tracking-widest block">Verified Bookings</span>
            <span className="text-2xl font-serif font-bold text-emerald-400 mt-1 block">
              {verifiedCount} ({reviews.length > 0 ? Math.round((verifiedCount / reviews.length) * 100) : 0}%)
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#0f0f0f] p-4 rounded-lg border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reviews by client, companion or text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/10 rounded pl-9 pr-3 py-2 text-xs text-[#e0e0e0] placeholder-white/40 focus:outline-none focus:border-[#c5a059]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-white/40" />
          <span className="text-xs text-white/60">Rating:</span>
          <select
            value={selectedRatingFilter}
            onChange={(e) => setSelectedRatingFilter(e.target.value === 'All' ? 'All' : Number(e.target.value))}
            className="bg-[#1a1a1a] border border-white/10 rounded px-3 py-2 text-xs text-[#c5a059] font-bold focus:outline-none"
          >
            <option value="All">All Ratings</option>
            <option value={5}>5 Stars</option>
            <option value={4}>4 Stars</option>
            <option value={3}>3 Stars</option>
          </select>
        </div>
      </div>

      {/* Reviews Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReviews.map((rev) => (
          <div key={rev.id} className="bg-[#0f0f0f] border border-white/10 rounded-lg p-5 space-y-4 relative group hover:border-[#c5a059]/40 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-[#c5a059] font-serif font-bold text-sm">
                  {rev.clientName[0] || 'C'}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#e0e0e0] flex items-center gap-2">
                    {rev.clientName}
                    {rev.verifiedBooking && (
                      <span className="inline-flex items-center gap-1 text-[9px] bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Verified COD
                      </span>
                    )}
                  </h3>
                  <div className="text-[11px] text-white/50 flex items-center gap-2 mt-0.5">
                    <span className="text-[#c5a059]">Companion: {rev.profileName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-white/30" />{rev.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEditModal(rev)}
                  className="p-1.5 text-white/60 hover:text-[#c5a059] hover:bg-white/5 rounded transition-colors"
                  title="Edit Review"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteReview(rev.id)}
                  className="p-1.5 text-white/60 hover:text-red-400 hover:bg-white/5 rounded transition-colors"
                  title="Delete Review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Rating & Date */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
              <div className="flex text-[#c5a059]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current text-[#c5a059]' : 'text-white/20'}`}
                  />
                ))}
              </div>
              <span className="text-[10px] text-white/40 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {rev.date}
              </span>
            </div>

            {/* Comment Body */}
            <p className="text-xs text-white/80 font-sans leading-relaxed bg-[#141414] p-3 rounded border border-white/5 italic">
              "{rev.comment}"
            </p>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => handleToggleVerified(rev.id)}
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border transition-colors ${
                  rev.verifiedBooking
                    ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30 hover:bg-emerald-900/60'
                    : 'bg-white/5 text-white/40 border-white/10 hover:text-white'
                }`}
              >
                {rev.verifiedBooking ? 'Verified Booking Active' : 'Mark as Verified'}
              </button>
            </div>
          </div>
        ))}

        {filteredReviews.length === 0 && (
          <div className="col-span-full text-center py-12 bg-[#0f0f0f] border border-white/10 rounded-lg p-6 space-y-3">
            <MessageSquare className="w-10 h-10 text-white/20 mx-auto" />
            <h3 className="text-sm font-serif text-[#e0e0e0]">No Reviews Found</h3>
            <p className="text-xs text-white/50 max-w-sm mx-auto">
              Try adjusting your search filters or click "Add Client Review" to create your first feedback item.
            </p>
          </div>
        )}
      </div>

      {/* Edit / New Review Modal */}
      {isModalOpen && editingReview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-lg max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-serif font-bold text-[#e0e0e0]">
                {reviews.some(r => r.id === editingReview.id) ? 'Edit Review' : 'Create New Client Review'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/40 hover:text-white p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReview} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/60 mb-1 font-bold">Client Name / Initial</label>
                  <input
                    type="text"
                    required
                    value={editingReview.clientName || ''}
                    onChange={(e) => setEditingReview({ ...editingReview, clientName: e.target.value })}
                    placeholder="e.g., Rohit K. or VIP Client"
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded px-3 py-2 text-[#e0e0e0] focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-1 font-bold">Assigned Companion</label>
                  <select
                    value={editingReview.profileName || ''}
                    onChange={(e) => setEditingReview({ ...editingReview, profileName: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded px-3 py-2 text-[#c5a059] font-bold focus:outline-none"
                  >
                    {cmsData.profiles.map((p) => (
                      <option key={p.id} value={p.name} className="bg-[#0f0f0f]">
                        {p.name} ({p.location})
                      </option>
                    ))}
                    <option value="Juli Club Agency" className="bg-[#0f0f0f]">Juli Club Agency</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/60 mb-1 font-bold">Star Rating</label>
                  <select
                    value={editingReview.rating || 5}
                    onChange={(e) => setEditingReview({ ...editingReview, rating: Number(e.target.value) })}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded px-3 py-2 text-[#c5a059] font-bold focus:outline-none"
                  >
                    <option value={5} className="bg-[#0f0f0f]">5 Stars (Excellent)</option>
                    <option value={4} className="bg-[#0f0f0f]">4 Stars (Very Good)</option>
                    <option value={3} className="bg-[#0f0f0f]">3 Stars (Good)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/60 mb-1 font-bold">Location</label>
                  <input
                    type="text"
                    required
                    value={editingReview.location || ''}
                    onChange={(e) => setEditingReview({ ...editingReview, location: e.target.value })}
                    placeholder="e.g., Gomti Nagar, Lucknow"
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded px-3 py-2 text-[#e0e0e0] focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/60 mb-1 font-bold">Review Comment</label>
                <textarea
                  required
                  rows={4}
                  value={editingReview.comment || ''}
                  onChange={(e) => setEditingReview({ ...editingReview, comment: e.target.value })}
                  placeholder="Detailed client experience regarding cash on delivery, zero advance, hotel dispatch..."
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded p-3 text-[#e0e0e0] focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="verifiedBooking"
                  checked={editingReview.verifiedBooking ?? true}
                  onChange={(e) => setEditingReview({ ...editingReview, verifiedBooking: e.target.checked })}
                  className="rounded border-white/10 bg-[#1a1a1a] text-[#c5a059] focus:ring-0"
                />
                <label htmlFor="verifiedBooking" className="text-xs text-white/80 cursor-pointer">
                  Display "100% Verified COD Booking" Badge
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#c5a059] hover:bg-[#d4b578] text-black font-bold rounded flex items-center gap-2 uppercase tracking-wider"
                >
                  <Save className="w-4 h-4" />
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
