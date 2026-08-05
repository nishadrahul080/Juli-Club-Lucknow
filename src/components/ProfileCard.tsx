import React from 'react';
import { CompanionProfile } from '../types';
import { Star, MapPin, Eye } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

interface ProfileCardProps {
  profile: CompanionProfile;
  onViewDetails?: (profile: CompanionProfile) => void;
  onSelect?: (profile: CompanionProfile) => void;
  onBookNow?: (profile: CompanionProfile) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onViewDetails,
  onSelect,
  onBookNow,
}) => {
  const handleView = () => {
    if (onSelect) onSelect(profile);
    else if (onViewDetails) onViewDetails(profile);
    else if (onBookNow) onBookNow(profile);
  };

  return (
    <div className="group bg-[#1a1a1a] border border-white/5 hover:border-[#c5a059]/40 rounded-md overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between h-full">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900 shrink-0">
        <img
          src={profile.image}
          alt={profile.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-center gap-2 z-10">
          {profile.rating >= 4.9 ? (
            <span className="bg-[#c5a059] text-black text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
              TOP RATED
            </span>
          ) : (
            <span className="bg-emerald-900/90 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
              VERIFIED
            </span>
          )}

          <div className="flex items-center gap-1 ml-auto">
            {profile.isOnline ? (
              <span className="bg-black/60 text-emerald-400 border border-emerald-500/30 text-[9px] font-semibold px-2 py-0.5 rounded-sm flex items-center gap-1 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                AVAILABLE
              </span>
            ) : (
              <span className="bg-black/60 text-white/60 text-[9px] px-2 py-0.5 rounded-sm backdrop-blur-sm">
                24/7 OUT_CALL
              </span>
            )}
          </div>
        </div>

        {/* Quick View Button on Hover */}
        <button
          onClick={handleView}
          className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-[#c5a059] text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110 z-20 cursor-pointer"
          title="Quick View Profile"
        >
          <Eye className="w-5 h-5" />
        </button>

        {/* Bottom Overlay Info on Image */}
        <div className="absolute bottom-3 left-3 right-3 space-y-1 z-10">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#c5a059] uppercase tracking-wider font-bold">
              {profile.category}
            </span>
            <div className="flex items-center gap-1 text-[#c5a059] text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-[#c5a059] text-[#c5a059]" />
              <span>{profile.rating.toFixed(1)}</span>
              <span className="text-[10px] text-white/50 font-normal">({profile.reviewsCount})</span>
            </div>
          </div>

          <h3 className="font-serif text-xl leading-tight text-[#e0e0e0]">
            {profile.name} <span className="text-xs text-white/50 font-sans">({profile.age} yrs)</span>
          </h3>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div className="space-y-2.5">
          <p className="text-xs text-white/70 line-clamp-2 leading-relaxed font-sans">
            {profile.bio}
          </p>

          <div className="flex justify-between items-center text-[11px] text-white/70 border-t border-white/5 pt-2 font-sans">
            <span className="text-[#c5a059] font-medium flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#c5a059]" />
              {profile.location}, Lucknow
            </span>
            <span className="text-white/60">Height: {profile.height}</span>
          </div>
        </div>

        {/* Single Full-Width WhatsApp CTA Button */}
        <div className="pt-1">
          <a
            href={`https://wa.me/${profile.whatsapp}?text=Hi%20${encodeURIComponent(
              profile.name
            )}%2C%20I%20want%20to%20book%20your%20service%20in%20Lucknow%20with%20Cash%20on%20Delivery.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#22c35e] text-white rounded-md text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.03] shadow-md shadow-green-950/40 hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] border border-emerald-400/30 cursor-pointer"
          >
            <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
            <span>Book via WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};

