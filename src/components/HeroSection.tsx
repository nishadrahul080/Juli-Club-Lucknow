import React from 'react';
import { ShieldCheck, CheckCircle2, Truck } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { useCMS } from '../context/CMSContext';

interface HeroSectionProps {
  onOpenBooking?: () => void;
  selectedCity: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ selectedCity }) => {
  const { cmsData } = useCMS();
  const settings = cmsData.settings;

  const heroHeading = settings.heroHeading || 'Exclusive Call Girl Service Lucknow';
  const heroSubheading = settings.heroSubheading || 'Welcome to Juli Club, Lucknow’s premier VIP companion directory. Enjoy verified independent models, college companions, and charming escorts with 100% Cash on Delivery (COD), zero advance required, and free private cab pickup.';
  const badgeText = settings.badgeText || `100% Genuine & Verified Companions (${selectedCity})`;
  const whatsappNumber = settings.whatsappNumber || '918726179837';
  const whatsappMessage = settings.whatsappMessage || 'Hi Juli Club, I want to book a Call Girl Service Lucknow with Cash on Delivery.';

  return (
    <section className="relative overflow-hidden bg-[#0d0d0d] py-10 sm:py-16 md:py-24 text-[#e0e0e0] border-b border-white/10">
      {/* Background radial gold glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-3/4 bg-gradient-to-b from-[#c5a059]/10 via-transparent to-transparent pointer-events-none blur-3xl"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-5 sm:space-y-7 md:space-y-9">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#c5a059] text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-[0.2em] shadow-sm max-w-full text-center leading-tight">
          <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#c5a059] shrink-0" />
          <span>{badgeText}</span>
        </div>

        {/* Main H1 Title */}
        <h1 className="text-2xl sm:text-5xl md:text-6xl font-serif text-[#e0e0e0] leading-tight font-bold tracking-tight">
          {heroHeading}
        </h1>

        {/* Short engaging introduction paragraph */}
        <p className="text-xs sm:text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed font-sans">
          {heroSubheading}
        </p>

        {/* Bullet Guarantees / Trust Badges */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-5 pt-1">
          <div className="flex items-center gap-1.5 bg-[#161616] px-2.5 py-1 sm:px-3.5 sm:py-2 rounded-full border border-white/10 text-[11px] sm:text-xs font-medium text-white/90 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Zero Advance Payment</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#161616] px-2.5 py-1 sm:px-3.5 sm:py-2 rounded-full border border-white/10 text-[11px] sm:text-xs font-medium text-white/90 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>100% Cash On Delivery</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#161616] px-2.5 py-1 sm:px-3.5 sm:py-2 rounded-full border border-white/10 text-[11px] sm:text-xs font-medium text-white/90 shadow-sm">
            <Truck className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
            <span>Free Hotel & Doorstep Delivery</span>
          </div>
        </div>

        {/* Single Centered WhatsApp CTA Button */}
        <div className="pt-2 sm:pt-3 flex justify-center items-center">
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2 sm:gap-2.5 px-5 py-2.5 sm:px-7 sm:py-3.5 bg-[#25D366] hover:bg-[#22c35e] text-white font-bold rounded-md text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-green-950/50 hover:shadow-[0_0_25px_rgba(37,211,102,0.4)] border border-emerald-400/30 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.02] cursor-pointer w-auto mx-auto whitespace-nowrap shrink-0"
          >
            <WhatsAppIcon className="w-4 h-4 sm:w-5 sm:h-5 fill-current shrink-0 group-hover:rotate-12 transition-transform duration-300" />
            <span className="whitespace-nowrap">Book via WhatsApp Now</span>
          </a>
        </div>
      </div>
    </section>
  );
};


