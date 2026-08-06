import React from 'react';
import { LucknowArea, LocationPageInfo } from '../types';
import { MapPin, Navigation } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

interface InteractiveAreaMapProps {
  selectedArea: LucknowArea;
  onSelectArea: (area: LucknowArea) => void;
  onNavigateLocation?: (slug: string) => void;
}

export const InteractiveAreaMap: React.FC<InteractiveAreaMapProps> = ({
  selectedArea,
  onSelectArea,
  onNavigateLocation,
}) => {
  const { cmsData } = useCMS();
  const locationPages = (Object.values(cmsData.locations || {}) as unknown as LocationPageInfo[]);

  return (
    <section className="py-16 bg-[#0a0a0a] text-[#e0e0e0] border-b border-white/10" id="locations">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#c5a059] text-[10px] font-bold uppercase tracking-[0.2em]">
            <Navigation className="w-3.5 h-3.5 text-[#c5a059]" /> Coverage Zones
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif text-[#e0e0e0]">
            Fast 30-Min Free Pickup Across Top Lucknow Locations
          </h2>
          <p className="text-xs sm:text-sm text-white/60 font-sans">
            Click any area in Lucknow below to open its dedicated location page or view local companion profiles.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {locationPages.map((loc) => {
            const isSelected = selectedArea === loc.areaName;
            const profileCount = (cmsData.profiles || []).filter(p => p.location.toLowerCase() === loc.areaName.toLowerCase()).length;
            const displayAds = profileCount > 0 ? profileCount * 120 + 250 : 850;

            return (
              <button
                key={loc.slug}
                onClick={() => {
                  onSelectArea(loc.areaName as LucknowArea);
                  if (onNavigateLocation) {
                    onNavigateLocation(loc.slug);
                  }
                }}
                className={`p-5 rounded-sm text-left transition-all border flex flex-col justify-between group cursor-pointer ${
                  isSelected
                    ? 'bg-[#1a1a1a] border-[#c5a059] shadow-xl'
                    : 'bg-[#0f0f0f] border-white/10 hover:border-[#c5a059]/50 hover:bg-[#1a1a1a]/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">🏨</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-sm bg-[#0a0a0a] text-[#c5a059] border border-white/10 uppercase tracking-wider">
                      {displayAds} Active
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#e0e0e0] group-hover:text-[#c5a059] transition-colors flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#c5a059]" />
                    {loc.areaName} Call Girls
                  </h4>
                  <p className="text-[11px] text-white/60 mt-1 leading-relaxed font-sans line-clamp-2">
                    {loc.intro || `${loc.areaName} VIP companions with 100% Cash on Delivery and free pickup.`}
                  </p>
                </div>

                <div className="pt-3 mt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-sans">
                  <span className="text-[#c5a059] font-medium">Free Cab Pickup</span>
                  <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">Open Location →</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};


