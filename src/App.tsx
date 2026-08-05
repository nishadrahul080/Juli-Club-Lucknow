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
import { CMSProvider, useCMS } from './context/CMSContext';
import { AuthProvider } from './admin/context/AuthContext';
import { AdminLoginPage } from './admin/pages/AdminLoginPage';
import { AdminDashboardPage } from './admin/pages/AdminDashboardPage';
import { PublicSectionRenderer } from './components/PublicSectionRenderer';

import { CategoryType, LucknowArea, CompanionProfile } from './types';
import { generateSlug } from './admin/profiles/utils/profileHelpers';
import { Sparkles, Eye, X } from 'lucide-react';
import { WhatsAppIcon } from './components/WhatsAppIcon';

function MainApp() {
  const { cmsData, isPreviewMode, togglePreviewMode } = useCMS();
  const [selectedCity, setSelectedCity] = useState<string>('Lucknow');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [selectedArea, setSelectedArea] = useState<LucknowArea>('All Lucknow');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popular' | 'priceLow' | 'priceHigh' | 'rating'>('popular');

  const [activeProfileModal, setActiveProfileModal] = useState<CompanionProfile | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [bookingInitialProfile, setBookingInitialProfile] = useState<CompanionProfile | null>(null);

  // URL routing state for area location pages or '/admin-login'
  const [currentSlug, setCurrentSlug] = useState<string | null>(() => {
    const path = window.location.pathname.replace(/^\//, '');
    return path ? path : null;
  });

  // Handle redirect rules
  useEffect(() => {
    if (!currentSlug || !cmsData.redirects || cmsData.redirects.length === 0) return;
    const rule = cmsData.redirects.find(
      r => r.isActive && (r.fromSlug === `/${currentSlug}` || r.fromSlug === currentSlug)
    );
    if (rule) {
      const cleanTarget = rule.toTarget.replace(/^\//, '');
      setCurrentSlug(cleanTarget || null);
      window.history.pushState({}, '', rule.toTarget);
    }
  }, [currentSlug, cmsData.redirects]);

  // Handle browser popstate
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\//, '');
      setCurrentSlug(path ? path : null);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle deep-linking to /profile/:slug or :slug matching profile
  useEffect(() => {
    if (!currentSlug) return;
    if (currentSlug === 'admin-login' || currentSlug === 'admin-dashboard') return;
    if (cmsData.locations[currentSlug]) return;

    // Check if currentSlug matches a profile
    const targetSlug = currentSlug.replace(/^profile\//, '');
    const foundProfile = cmsData.profiles.find(
      p => (p.slug || generateSlug(p.name)) === targetSlug || p.id === targetSlug
    );

    if (foundProfile) {
      setActiveProfileModal(foundProfile);
    }
  }, [currentSlug, cmsData.profiles, cmsData.locations]);

  // Sync page title & meta description from CMS
  useEffect(() => {
    if (currentSlug === 'admin-login') {
      document.title = 'Admin Login | Juli Club Lucknow';
      return;
    }
    if (currentSlug === 'admin-dashboard') {
      document.title = 'Admin Control Panel | Juli Club Lucknow';
      return;
    }
    if (activeProfileModal) {
      document.title = activeProfileModal.seoTitle || `${activeProfileModal.name} (${activeProfileModal.category}) in ${activeProfileModal.location} Lucknow | 0 Advance Payment`;
      return;
    }
    if (currentSlug) {
      const locData = cmsData.locations[currentSlug];
      if (locData) {
        document.title = locData.title;
        return;
      }
    }
    document.title = cmsData.homepage?.seoTitle || cmsData.settings.siteTitle || 'Juli Club - Call Girl Service Lucknow | 100% Cash on Delivery (0 Advance)';
  }, [currentSlug, cmsData.settings.siteTitle, cmsData.homepage, cmsData.locations, activeProfileModal]);

  const handleNavigateHome = () => {
    setCurrentSlug(null);
    setActiveProfileModal(null);
    window.history.pushState({}, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateLocation = (slug: string) => {
    setCurrentSlug(slug);
    setActiveProfileModal(null);
    window.history.pushState({}, '', `/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProfileModal = (profile: CompanionProfile) => {
    setActiveProfileModal(profile);
    const pSlug = profile.slug || generateSlug(profile.name);
    window.history.pushState({}, '', `/profile/${pSlug}`);
  };

  const handleCloseProfileModal = () => {
    setActiveProfileModal(null);
    window.history.pushState({}, '', currentSlug ? `/${currentSlug}` : '/');
  };

  const handleNavigateAdminLogin = () => {
    setCurrentSlug('admin-login');
    window.history.pushState({}, '', '/admin-login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateAdminDashboard = () => {
    setCurrentSlug('admin-dashboard');
    window.history.pushState({}, '', '/admin-dashboard');
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
      // Respect Active / Inactive toggle from CMS
      if (profile.isActive === false) {
        return false;
      }
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
      // Prioritize Featured Profiles
      if (a.isFeatured !== b.isFeatured) {
        return a.isFeatured ? -1 : 1;
      }
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

  if (currentSlug === 'admin-login') {
    return (
      <AdminLoginPage onSuccessNavigate={handleNavigateAdminDashboard} />
    );
  }

  if (currentSlug === 'admin-dashboard') {
    return (
      <AdminDashboardPage onUnauthenticatedRedirect={handleNavigateAdminLogin} />
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] font-sans antialiased selection:bg-[#c5a059] selection:text-black">
      {/* Live Preview Mode Sticky Header */}
      {isPreviewMode && (
        <div className="bg-amber-500 text-black px-4 py-2 text-xs font-bold flex items-center justify-between sticky top-0 z-50 shadow-md">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>CMS Live Preview Mode Active - Viewing Unsaved/Draft Content</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleNavigateAdminDashboard}
              className="px-3 py-1 bg-black text-amber-400 rounded text-[11px] font-bold"
            >
              Back to CMS Admin
            </button>
            <button
              onClick={() => togglePreviewMode(false)}
              className="p-1 hover:bg-black/20 rounded"
              title="Close Preview Mode"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

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
                    onSelect={handleSelectProfileModal}
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

            {/* Render CMS Sections if provided */}
            {cmsData.homepage?.sections && cmsData.homepage.sections.length > 0 && (
              <PublicSectionRenderer sections={cmsData.homepage.sections} profiles={filteredProfiles} />
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
                if (comp) handleSelectProfileModal(comp);
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

      {/* Modals */}
      <ProfileModal
        profile={activeProfileModal}
        onClose={handleCloseProfileModal}
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
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </CMSProvider>
  );
}
