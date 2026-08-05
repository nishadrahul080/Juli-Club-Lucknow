import React, { useMemo } from 'react';
import { LocationPageInfo, CompanionProfile } from '../types';
import { ProfileCard } from './ProfileCard';
import { ShieldCheck, CheckCircle2, Truck, MapPin, Star, ArrowLeft, ChevronRight, Phone } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { COMPANION_PROFILES } from '../data/mockData';

interface LocationPageViewProps {
  locationData: LocationPageInfo;
  onNavigateHome: () => void;
  onNavigateLocation: (slug: string) => void;
  onOpenBookingForProfile: (profile: CompanionProfile) => void;
  onOpenGeneralBooking: () => void;
  onSelectProfileModal: (profile: CompanionProfile) => void;
}

export const LocationPageView: React.FC<LocationPageViewProps> = ({
  locationData,
  onNavigateHome,
  onNavigateLocation,
  onOpenBookingForProfile,
  onOpenGeneralBooking,
  onSelectProfileModal,
}) => {
  // Filter companion profiles for this specific location
  const areaProfiles = useMemo(() => {
    const exactMatches = COMPANION_PROFILES.filter(
      (p) => p.location.toLowerCase() === locationData.areaName.toLowerCase()
    );
    if (exactMatches.length >= 3) return exactMatches;
    // Fill up with other top verified profiles in Lucknow with pickup
    const remaining = COMPANION_PROFILES.filter(
      (p) => p.location.toLowerCase() !== locationData.areaName.toLowerCase()
    );
    return [...exactMatches, ...remaining].slice(0, 8);
  }, [locationData]);

  const whatsappMessage = encodeURIComponent(
    `Hi Juli Club, I want to book a Call Girl Service in ${locationData.areaName} Lucknow with Cash on Delivery.`
  );

  return (
    <div className="space-y-12 pb-12">
      {/* Breadcrumb Navigation */}
      <div className="bg-[#111111] border-b border-white/10 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs text-white/60">
          <button
            onClick={onNavigateHome}
            className="hover:text-[#c5a059] flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </button>
          <ChevronRight className="w-3 h-3 text-white/30" />
          <button onClick={onNavigateHome} className="hover:text-[#c5a059] transition-colors">
            Lucknow Call Girls
          </button>
          <ChevronRight className="w-3 h-3 text-white/30" />
          <span className="text-[#c5a059] font-medium">{locationData.areaName} Call Girls</span>
        </div>
      </div>

      {/* Target SEO Hero Section */}
      <section className="relative overflow-hidden bg-[#0d0d0d] py-10 sm:py-16 md:py-24 text-[#e0e0e0] border-b border-white/10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-3/4 bg-gradient-to-b from-[#c5a059]/10 via-transparent to-transparent pointer-events-none blur-3xl"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-5 sm:space-y-7 md:space-y-9">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#c5a059] text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-[0.2em] shadow-sm max-w-full text-center leading-tight">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#c5a059] shrink-0" />
            <span>Verified Location: {locationData.areaName}, Lucknow</span>
          </div>

          {/* Main Target H1 Title */}
          <h1 className="text-2xl sm:text-5xl md:text-6xl font-serif text-[#e0e0e0] leading-tight font-bold tracking-tight max-w-4xl mx-auto">
            {locationData.h1}
          </h1>

          {/* Subtagline & Intro */}
          <p className="text-xs sm:text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed font-sans">
            {locationData.intro}
          </p>

          {/* Guarantees / Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-5 pt-1">
            <div className="flex items-center gap-1.5 bg-[#161616] px-2.5 py-1 sm:px-3.5 sm:py-2 rounded-full border border-white/10 text-[11px] sm:text-xs font-medium text-white/90 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>0 Advance Payment</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#161616] px-2.5 py-1 sm:px-3.5 sm:py-2 rounded-full border border-white/10 text-[11px] sm:text-xs font-medium text-white/90 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>100% Cash On Delivery</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#161616] px-2.5 py-1 sm:px-3.5 sm:py-2 rounded-full border border-white/10 text-[11px] sm:text-xs font-medium text-white/90 shadow-sm">
              <Truck className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
              <span>Free 30-Min Hotel Pickup in {locationData.areaName}</span>
            </div>
          </div>

          {/* Key Landmarks */}
          {locationData.landmarks.length > 0 && (
            <div className="pt-1 flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 max-w-3xl mx-auto">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#c5a059] mr-1">
                Top Hotels & Outcalls:
              </span>
              {locationData.landmarks.map((lm) => (
                <span
                  key={lm}
                  className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-[#161616] border border-white/10 rounded-md text-[11px] sm:text-xs text-white/70"
                >
                  {lm}
                </span>
              ))}
            </div>
          )}

          {/* Single Centered WhatsApp CTA Button */}
          <div className="pt-2 sm:pt-3 flex justify-center items-center">
            <a
              href={`https://wa.me/918726179837?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 sm:gap-3 px-5 py-3 sm:px-10 sm:py-4.5 bg-[#25D366] hover:bg-[#22c35e] text-white font-bold rounded-md text-xs sm:text-base uppercase tracking-wider shadow-xl shadow-green-950/50 hover:shadow-[0_0_30px_rgba(37,211,102,0.45)] border border-emerald-400/30 transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.04] cursor-pointer w-full max-w-xs sm:w-auto"
            >
              <WhatsAppIcon className="w-4 h-4 sm:w-6 sm:h-6 fill-current shrink-0 group-hover:rotate-12 transition-transform duration-300" />
              <span>Book via WhatsApp Now</span>
            </a>
          </div>
        </div>
      </section>

      {/* Profiles Grid for this location */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-4 gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif text-[#e0e0e0] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#c5a059]" />
              Verified Call Girls in {locationData.areaName} Lucknow
            </h2>
            <p className="text-xs text-white/50">
              Real images • Verified measurements • 100% Cash on Delivery
            </p>
          </div>
          <span className="text-xs bg-[#c5a059]/10 text-[#c5a059] px-3 py-1 rounded border border-[#c5a059]/30 font-bold uppercase tracking-wider">
            {areaProfiles.length} Companions Ready
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {areaProfiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onSelect={onSelectProfileModal}
              onBookNow={onOpenBookingForProfile}
            />
          ))}
        </div>
      </section>

      {/* Comprehensive SEO Content Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {locationData.contentSections.map((section, idx) => (
          <div
            key={idx}
            className="bg-[#0f0f0f] p-6 sm:p-8 rounded border border-white/10 space-y-4 shadow-xl"
          >
            <h2 className="text-xl sm:text-2xl font-serif text-[#c5a059]">
              {section.title}
            </h2>
            {section.paragraphs.map((p, pIdx) => (
              <p key={pIdx} className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
                {p}
              </p>
            ))}
          </div>
        ))}

        {/* Location Specific Rate Chart Box */}
        <div className="bg-[#111111] p-6 rounded border border-[#c5a059]/30 space-y-4">
          <h3 className="text-lg font-serif text-[#c5a059] flex items-center gap-2">
            <Star className="w-4 h-4 text-[#c5a059]" />
            Call Girl Rate Chart for {locationData.areaName} Lucknow
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-[#1a1a1a] p-4 rounded border border-white/5 space-y-1">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block font-bold">Short Time (2 Hours)</span>
              <span className="text-lg font-bold text-[#c5a059]">₹3,999 - ₹4,999</span>
              <p className="text-[10px] text-white/60">Includes body massage & GFE</p>
            </div>
            <div className="bg-[#1a1a1a] p-4 rounded border border-white/5 space-y-1">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block font-bold">Full Night (8 Hours)</span>
              <span className="text-lg font-bold text-[#c5a059]">₹8,999 - ₹10,999</span>
              <p className="text-[10px] text-white/60">Unhurried romantic night</p>
            </div>
            <div className="bg-[#1a1a1a] p-4 rounded border border-white/5 space-y-1">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block font-bold">VIP Celebrity / Russian</span>
              <span className="text-lg font-bold text-[#c5a059]">₹14,999 - ₹18,999</span>
              <p className="text-[10px] text-white/60">International models & 5-star outcall</p>
            </div>
          </div>
        </div>

        {/* FAQ Section for this location */}
        {locationData.faqs.length > 0 && (
          <div className="bg-[#0f0f0f] p-6 sm:p-8 rounded border border-white/10 space-y-6">
            <h3 className="text-xl font-serif text-[#e0e0e0]">
              Frequently Asked Questions - {locationData.areaName} Call Girls
            </h3>
            <div className="space-y-4">
              {locationData.faqs.map((faq, fIdx) => (
                <div key={fIdx} className="bg-[#1a1a1a] p-4 rounded border border-white/5 space-y-2">
                  <h4 className="text-xs sm:text-sm font-bold text-[#c5a059]">{faq.question}</h4>
                  <p className="text-xs text-white/70 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Banner */}
        <div className="bg-gradient-to-r from-[#1a1a1a] via-[#111111] to-[#1a1a1a] p-8 rounded border border-[#c5a059]/40 text-center space-y-4">
          <h3 className="text-2xl font-serif text-[#c5a059]">
            Book Your {locationData.areaName} Companion Now
          </h3>
          <p className="text-xs text-white/70 max-w-xl mx-auto">
            100% Cash on Delivery • Zero Advance Deposit • Complimentary Driver Pickup in 30 Minutes
          </p>
          <a
            href={`https://wa.me/918726179837?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:px-8 sm:py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-widest rounded-sm transition-all shadow-xl hover:scale-105 w-full max-w-xs sm:w-auto"
          >
            <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
            <span>Chat with Juli Club on WhatsApp</span>
          </a>
        </div>
      </section>
    </div>
  );
};
