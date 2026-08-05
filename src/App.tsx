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
import { AdminDashboard } from './components/AdminDashboard';
import { CMSProvider, useCMS } from './context/CMSContext';

import { CategoryType, LucknowArea, CompanionProfile } from './types';
import { Sparkles } from 'lucide-react';
import { WhatsAppIcon } from './components/WhatsAppIcon';

function MainApp() {
  const { cmsData } = useCMS();
  const [selectedCity, setSelectedCity] = useState<string>('Lucknow');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [selectedArea, setSelectedArea] = useState<LucknowArea>('All Lucknow');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popular' | 'priceLow' | 'priceHigh' | 'rating'>('popular');

  const [activeProfileModal, setActiveProfileModal] = useState<CompanionProfile | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [bookingInitialProfile, setBookingInitialProfile] = useState<CompanionProfile | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

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

  // Sync page title & meta description from CMS
  useEffect(() => {
    if (currentSlug) {
      const locData = cmsData.locations[currentSlug];
      if (locData) {
        document.title = locData.title;
        return;
      }
    }
    document.title = cmsData.settings.siteTitle || 'Juli Club - Call Girl Service Lucknow | 100% Cash on Delivery (0 Advance)';
  }, [currentSlug, cmsData.settings.siteTitle, cmsData.locations]);

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
    return cmsData.locations[currentSlug] || null;
  }, [currentSlug, cmsData.locations]);

  // Filter & Sort Profiles from CMS Store
  const filteredProfiles = useMemo(() => {
    return cmsData.profiles.filter((profile) => {
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
  }, [cmsData.profiles, selectedCategory, selectedArea, searchQuery, sortBy]);

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

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="px-3 py-2 bg-white/10 hover:bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/30 font-bold rounded-sm text-xs uppercase tracking-wider transition-colors"
                >
                  🔐 Admin CMS
                </button>
                <button
                  onClick={handleOpenGeneralBooking}
                  className="px-5 py-2.5 bg-[#c5a059] hover:bg-[#d4b578] text-black font-bold rounded-sm text-xs uppercase tracking-widest shadow-lg transition-colors"
                >
                  Express Booking (0-Advance)
                </button>
              </div>
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
                const comp = cmsData.profiles.find((p) => p.id === id);
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
      <Footer onOpenBooking={handleOpenGeneralBooking} onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Floating Bottom-Right WhatsApp Action Button */}
      <a
        href={`https://wa.me/${cmsData.settings.whatsappNumber}?text=${encodeURIComponent(cmsData.settings.whatsappMessage)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 bg-[#25D366] hover:bg-[#22c35e] text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl shadow-green-950/60 border border-emerald-400/40 flex items-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer"
        title="Chat on WhatsApp"
        aria-label="WhatsApp Us Now"
      >
        <span className="relative flex h-3 w-3 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <WhatsAppIcon className="w-5 h-5 sm:w-6 sm:h-6 fill-current shrink-0 group-hover:rotate-12 transition-transform duration-300" />
        <span className="font-bold text-xs uppercase tracking-wider whitespace-nowrap">WhatsApp Us Now</span>
      </a>

      {/* Admin Dashboard Modal */}
      {isAdminOpen && <AdminDashboard onClose={() => setIsAdminOpen(false)} />}

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

export default function App() {
  return (
    <CMSProvider>
      <MainApp />
    </CMSProvider>
  );
}
