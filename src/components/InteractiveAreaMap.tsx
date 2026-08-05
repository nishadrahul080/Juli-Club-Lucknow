import React from 'react';
import { LucknowArea } from '../types';
import { MapPin, Navigation } from 'lucide-react';
import { getLocationByArea } from '../data/locationData';

interface InteractiveAreaMapProps {
  selectedArea: LucknowArea;
  onSelectArea: (area: LucknowArea) => void;
  onNavigateLocation?: (slug: string) => void;
}

const LUCKNOW_ZONES: { name: LucknowArea; ads: number; desc: string; icon: string; slug: string }[] = [
  { name: 'Gomti Nagar', ads: 1450, desc: '5-Star Hotels, Hyatt, Taj Mahal & Gomti Riverfront Outcalls', icon: '🏨', slug: 'call-girls-gomti-nagar' },
  { name: 'Hazratganj', ads: 1200, desc: 'Heart of Lucknow city, Premium Executive Hotel Delivery', icon: '🏛️', slug: 'call-girls-hazratganj' },
  { name: 'Alambagh', ads: 850, desc: 'Quick 20-min driver dispatch, VIP Hotel Companions', icon: '🚕', slug: 'call-girls-alambagh' },
  { name: 'Indira Nagar', ads: 920, desc: 'Quiet Private Residence & Suite Companionship', icon: '🏡', slug: 'call-girls-indira-nagar' },
  { name: 'Mahanagar', ads: 780, desc: 'Sophisticated Luxury Apartments & Spa Services', icon: '✨', slug: 'call-girls-mahanagar' },
  { name: 'Charbagh', ads: 650, desc: 'Station Nearby Hotels & Express 30-min Pickup', icon: '🚉', slug: 'call-girls-charbagh' },
  { name: 'Sushant Golf City', ads: 890, desc: 'Lulu Mall & Ansal API Luxury Villas & Resort Escorts', icon: '⛳', slug: 'call-girls-sushant-golf-city' },
];

export const InteractiveAreaMap: React.FC<InteractiveAreaMapProps> = ({
  selectedArea,
  onSelectArea,
  onNavigateLocation,
}) => {
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
          {LUCKNOW_ZONES.map((zone) => {
            const isSelected = selectedArea === zone.name;
            return (
              <button
                key={zone.name}
                onClick={() => {
                  onSelectArea(zone.name);
                  if (onNavigateLocation) {
                    onNavigateLocation(zone.slug);
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
                    <span className="text-2xl">{zone.icon}</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-sm bg-[#0a0a0a] text-[#c5a059] border border-white/10 uppercase tracking-wider">
                      {zone.ads} Active
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#e0e0e0] group-hover:text-[#c5a059] transition-colors flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#c5a059]" />
                    {zone.name} Call Girls
                  </h4>
                  <p className="text-[11px] text-white/60 mt-1 leading-relaxed font-sans">{zone.desc}</p>
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


