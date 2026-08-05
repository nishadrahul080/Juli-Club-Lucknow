import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoryFilter } from './components/CategoryFilter';
import { ProfileCard } from './components/ProfileCard';
import { ProfileModal } from './components/ProfileModal';
import { BookingModal } from './components/BookingModal';
import { RateChartTable } from './components/RateChartTable';
import { ContentBlocks } from './components/ContentBlocks';
import { InteractiveAreaMap } from './components/InteractiveAreaMap';
import { ReviewsSection } from './components/ReviewsSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { LocationPageView } from './components/LocationPageView';

import { COMPANION_PROFILES } from './data/mockData';
import { getLocationBySlug } from './data/locationData';
import { CategoryType, LucknowArea, CompanionProfile } from './types';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { WhatsAppIcon } from './components/WhatsAppIcon';

export default function App() {
  const [selectedCity, setSelectedCity] = useState<string>('Lucknow');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [selectedArea, setSelectedArea] = useState<LucknowArea>('All Lucknow');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popular' | 'priceLow' | 'priceHigh' | 'rating'>('popular');

  const [activeProfileModal, setActiveProfileModal] = useState<CompanionProfile | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [bookingInitialProfile, setBookingInitialProfile] = useState<CompanionProfile | null>(null);

  // URL routing state for area location pages (e.g., 'call-girls-gomti-nagar')
  const [currentSlug, setCurrentSlug] = useState<string | null>(() => {
    const path = window.location.pathname.replace(/^\//, '');
    return path ? path : null;
  });

  // Handle browser popstate (back/forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\//, '');
      setCurrentSlug(path ? path : null);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync page title
  useEffect(() => {
    if (currentSlug) {
      const locData = getLocationBySlug(currentSlug);
      if (locData) {
        document.title = locData.title;
        return;
      }
    }
    document.title = 'Juli Club - Call Girl Service Lucknow | 100% Cash on Delivery (0 Advance)';
  }, [currentSlug]);

  const handleNavigateHome = () => {
    setCurrentSlug(null);
    window.history.pushState({}, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateLocation = (slug: string) => {
    setCurrentSlug(slug);
    window.history.pushState({}, '', `/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Active Location Data if on location page
  const activeLocationData = useMemo(() => {
    if (!currentSlug) return null;
    return getLocationBySlug(currentSlug) || null;
  }, [currentSlug]);


  // Filter & Sort Profiles
  const filteredProfiles = useMemo(() => {
    return COMPANION_PROFILES.filter((profile) => {
      // Category filter
      if (selectedCategory !== 'All' && profile.category !== selectedCategory) {
        return false;
      }
      // Area filter
      if (selectedArea !== 'All Lucknow' && profile.location !== selectedArea) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = profile.name.toLowerCase().includes(q);
        const matchesCategory = profile.category.toLowerCase().includes(q);
        const matchesLocation = profile.location.toLowerCase().includes(q);
        const matchesBio = profile.bio.toLowerCase().includes(q);
        if (!matchesName && !matchesCategory && !matchesLocation && !matchesBio) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'priceLow') return a.rateShort - b.rateShort;
      if (sortBy === 'priceHigh') return b.rateShort - a.rateShort;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.reviewsCount - a.reviewsCount; // popular
    });
  }, [selectedCategory, selectedArea, searchQuery, sortBy]);

  const handleOpenBookingForProfile = (profile: CompanionProfile) => {
    setBookingInitialProfile(profile);
    setIsBookingModalOpen(true);
  };

  const handleOpenGeneralBooking = () => {
    setBookingInitialProfile(null);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] font-sans antialiased selection:bg-[#c5a059] selection:text-black">
      {/* Sticky Header */}
      <Navbar
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenBooking={handleOpenGeneralBooking}
        onNavigateHome={handleNavigateHome}
        onNavigateLocation={handleNavigateLocation}
        currentSlug={currentSlug}
      />

      {/* RENDER LOCATION PAGE IF SLUG MATCHES LOCATION DATA */}
      {activeLocationData ? (
        <LocationPageView
          locationData={activeLocationData}
          onNavigateHome={handleNavigateHome}
          onNavigateLocation={handleNavigateLocation}
          onOpenBookingForProfile={handleOpenBookingForProfile}
          onOpenGeneralBooking={handleOpenGeneralBooking}
          onSelectProfileModal={setActiveProfileModal}
        />
      ) : (
        <>
          {/* Hero Banner */}
          <HeroSection onOpenBooking={handleOpenGeneralBooking} selectedCity={selectedCity} />

          {/* Category & Location Filters */}
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedArea={selectedArea}
            onSelectArea={setSelectedArea}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {/* Main Content Area */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6" id="profiles">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#c5a059] animate-pulse"></span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c5a059]">
                    Verified Companion Directory ({selectedCity})
                  </span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-serif text-[#e0e0e0] mt-1">
                  {selectedCategory === 'All' ? 'All Call Girls in Lucknow' : `${selectedCategory} Call Girls in Lucknow`}
                </h2>
                <p className="text-xs text-white/60 mt-1 font-sans">
                  Showing {filteredProfiles.length} verified independent profiles in {selectedArea}. Zero advance payment required.
                </p>
              </div>

              <button
                onClick={handleOpenGeneralBooking}
                className="px-5 py-2.5 bg-[#c5a059] hover:bg-[#d4b578] text-black font-bold rounded-sm text-xs uppercase tracking-widest shadow-lg transition-colors"
              >
                Express Booking (0-Advance)
              </button>
            </div>

            {/* Profile Grid */}
            {filteredProfiles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProfiles.map((profile) => (
                  <ProfileCard
                    key={profile.id}
                    profile={profile}
                    onSelect={setActiveProfileModal}
                    onBookNow={handleOpenBookingForProfile}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-[#0f0f0f] border border-white/10 rounded p-8 space-y-4">
                <Sparkles className="w-10 h-10 text-[#c5a059] mx-auto" />
                <h3 className="text-lg font-serif text-[#e0e0e0]">No Profiles Found for Current Filter</h3>
                <p className="text-xs text-white/60 max-w-md mx-auto font-sans">
                  Try clearing your search query or switching category to 'All' or location to 'All Lucknow'.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedArea('All Lucknow');
                    setSearchQuery('');
                  }}
                  className="px-5 py-2 bg-[#c5a059] hover:bg-[#d4b578] text-black font-bold text-xs uppercase tracking-wider rounded-sm"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Lucknow Coverage Map Grid */}
            <InteractiveAreaMap
              selectedArea={selectedArea}
              onSelectArea={setSelectedArea}
              onNavigateLocation={handleNavigateLocation}
            />

            {/* Rate Chart Table */}
            <RateChartTable
              onSelectCompanion={(id) => {
                const comp = COMPANION_PROFILES.find((p) => p.id === id);
                if (comp) setActiveProfileModal(comp);
              }}
            />

            {/* Detailed SEO Content Blocks */}
            <ContentBlocks />

            {/* Reviews Section */}
            <ReviewsSection />

            {/* FAQ Accordion */}
            <FAQSection />
          </main>
        </>
      )}

      {/* Footer */}
      <Footer onOpenBooking={handleOpenGeneralBooking} />

      {/* Floating Sticky WhatsApp Bar (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a0a]/95 border-t border-white/10 p-2.5 sm:hidden backdrop-blur-md flex items-center justify-between gap-2 shadow-2xl">
        <a
          href="https://wa.me/918726179837?text=Hi%20Juli%20Club%2C%20I%20want%20to%20book%20a%20Call%20Girl%20Service%20Lucknow%20with%20Cash%20on%20Delivery."
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 bg-[#25D366] active:bg-[#20bd5a] text-white font-bold rounded-md text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg shadow-green-950/50"
        >
          <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
          <span>WhatsApp Us Now (0 Advance COD)</span>
        </a>
      </div>

      {/* Modals */}
      <ProfileModal
        profile={activeProfileModal}
        onClose={() => setActiveProfileModal(null)}
        onBookNow={handleOpenBookingForProfile}
      />

      {isBookingModalOpen && (
        <BookingModal
          initialProfile={bookingInitialProfile}
          onClose={() => setIsBookingModalOpen(false)}
        />
      )}
    </div>
  );
}
