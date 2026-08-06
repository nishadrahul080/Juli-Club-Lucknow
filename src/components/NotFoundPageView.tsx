import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';
import { Home, ArrowLeft, Search, MapPin, FileText, User, Sparkles, Navigation } from 'lucide-react';
import { ProfileCard } from './ProfileCard';
import { CompanionProfile, LocationPageInfo } from '../types';

interface NotFoundPageViewProps {
  attemptedSlug?: string;
  onNavigateHome: () => void;
  onNavigateLocation: (slug: string) => void;
  onNavigateBlogArticle: (slug: string) => void;
  onSelectProfileModal: (profile: CompanionProfile) => void;
  onOpenBookingForProfile: (profile: CompanionProfile) => void;
}

export const NotFoundPageView: React.FC<NotFoundPageViewProps> = ({
  attemptedSlug,
  onNavigateHome,
  onNavigateLocation,
  onNavigateBlogArticle,
  onSelectProfileModal,
  onOpenBookingForProfile
}) => {
  const { cmsData } = useCMS();
  const [searchQuery, setSearchQuery] = useState('');

  // Top locations list
  const locationList = (Object.values(cmsData.locations || {}) as LocationPageInfo[]).slice(0, 6);

  // Top featured profiles
  const topProfiles = (cmsData.profiles || []).filter(p => p.isActive !== false).slice(0, 3);

  // Top blogs
  const topBlogs = (cmsData.blogs || []).slice(0, 3);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Find matching location or blog
      const matchedLoc = Object.keys(cmsData.locations || {}).find(slug =>
        slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cmsData.locations[slug].areaName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (matchedLoc) {
        onNavigateLocation(matchedLoc);
        return;
      }

      const matchedBlog = (cmsData.blogs || []).find(b =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.slug.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (matchedBlog) {
        onNavigateBlogArticle(matchedBlog.slug);
        return;
      }

      // Default navigate home with search
      onNavigateHome();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] font-sans selection:bg-[#c5a059] selection:text-black py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Main 404 Hero Card */}
        <div className="bg-[#141414] border border-white/10 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Gold Glow */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#c5a059]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#c5a059]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#c5a059]/10 border border-[#c5a059]/30 rounded-full text-[#c5a059] text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> 404 Error • Page Not Found
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-white tracking-tight">
            Oops! Page Not Found
          </h1>

          <p className="text-sm sm:text-base text-white/60 max-w-xl mx-auto font-sans leading-relaxed">
            The requested companion route or page <span className="text-[#c5a059] font-mono font-semibold">{attemptedSlug ? `/${attemptedSlug}` : ''}</span> does not exist or may have been relocated.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto pt-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search area locations, escort profiles, or articles..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-white/15 focus:border-[#c5a059] rounded-2xl pl-11 pr-24 py-3.5 text-xs text-white placeholder-white/40 outline-none shadow-inner"
              />
              <Search className="w-4 h-4 text-white/40 absolute left-4 top-4" />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-4 bg-[#c5a059] hover:bg-[#d4b578] text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>

          {/* Buttons: Back Home & Go Back */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={onNavigateHome}
              className="px-6 py-3 bg-[#c5a059] hover:bg-[#d4b578] text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </button>

            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/15 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#c5a059]" />
              Go Back
            </button>
          </div>
        </div>

        {/* Suggested Locations Grid */}
        {locationList.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-serif font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#c5a059]" /> Popular Lucknow Locations
              </h3>
              <span className="text-xs text-white/40">Select a verified service area</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {locationList.map(loc => (
                <button
                  key={loc.slug}
                  onClick={() => onNavigateLocation(loc.slug)}
                  className="p-3 bg-[#141414] hover:bg-[#1c1c1c] border border-white/10 hover:border-[#c5a059]/50 rounded-xl text-left transition-all group cursor-pointer"
                >
                  <span className="text-xs font-bold text-white group-hover:text-[#c5a059] block truncate">
                    {loc.areaName}
                  </span>
                  <span className="text-[10px] text-white/40 block mt-0.5 font-mono">
                    {loc.popularHotels?.length || 0} Hotels
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Profiles */}
        {topProfiles.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-serif font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-[#c5a059]" /> Featured Independent Companions
              </h3>
              <button
                onClick={onNavigateHome}
                className="text-xs text-[#c5a059] hover:underline cursor-pointer"
              >
                View All Profiles →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {topProfiles.map(profile => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  onOpenModal={onSelectProfileModal}
                  onOpenBooking={onOpenBookingForProfile}
                />
              ))}
            </div>
          </div>
        )}

        {/* Suggested Blog Articles */}
        {topBlogs.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-serif font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#c5a059]" /> Recommended Articles & Guides
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {topBlogs.map(blog => (
                <button
                  key={blog.id}
                  onClick={() => onNavigateBlogArticle(blog.slug)}
                  className="bg-[#141414] hover:bg-[#181818] border border-white/10 hover:border-[#c5a059]/40 rounded-xl p-4 text-left transition-all space-y-2 group cursor-pointer"
                >
                  <span className="px-2 py-0.5 bg-[#c5a059]/10 text-[#c5a059] rounded text-[10px] font-bold uppercase">
                    {blog.category}
                  </span>
                  <h4 className="text-xs font-serif font-bold text-white group-hover:text-[#c5a059] line-clamp-2">
                    {blog.title}
                  </h4>
                  <p className="text-[11px] text-white/50 line-clamp-2">
                    {blog.excerpt}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
