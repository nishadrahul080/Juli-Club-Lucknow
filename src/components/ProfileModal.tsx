import React, { useState } from 'react';
import { CompanionProfile } from '../types';
import { X, Star, MapPin, CheckCircle2, Phone, Truck, ShieldCheck, Heart, Sparkles, User, Globe, Clock } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

interface ProfileModalProps {
  profile: CompanionProfile | null;
  onClose: () => void;
  onBookNow: (profile: CompanionProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ profile, onClose, onBookNow }) => {
  if (!profile) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0f0f0f] border border-white/10 rounded overflow-hidden text-[#e0e0e0] my-8 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/80 hover:bg-white/10 text-white/70 hover:text-white rounded-full border border-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Gallery */}
          <div className="p-4 bg-[#0a0a0a] flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10">
            <div className="relative aspect-[3/4] rounded overflow-hidden border border-white/10">
              <img
                src={profile.gallery[activeImageIndex] || profile.image}
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute top-3 left-3 bg-[#c5a059] text-black px-2.5 py-1 rounded-sm text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-black" />
                Verified Photos
              </div>
            </div>

            {/* Thumbnails */}
            {profile.gallery.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {profile.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-14 rounded overflow-hidden border-2 shrink-0 ${
                      activeImageIndex === idx ? 'border-[#c5a059]' : 'border-white/10 opacity-50'
                    }`}
                  >
                    <img src={img} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Companion Details */}
          <div className="p-6 space-y-5 max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-sm bg-[#c5a059]/20 text-[#c5a059] text-[10px] font-bold uppercase tracking-wider border border-[#c5a059]/30">
                  {profile.category}
                </span>
                <span className="text-xs text-white/60 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#c5a059]" />
                  {profile.location}, Lucknow
                </span>
              </div>
              <h2 className="text-2xl font-serif text-[#e0e0e0]">{profile.name}</h2>
              <p className="text-xs text-[#c5a059] font-medium tracking-wide">{profile.title}</p>
            </div>

            {/* Rating & Stats */}
            <div className="grid grid-cols-3 gap-2 bg-[#1a1a1a] p-3 rounded border border-white/5 text-center text-xs">
              <div>
                <span className="text-[10px] uppercase text-white/50 block">Age</span>
                <span className="font-bold text-[#e0e0e0]">{profile.age} Yrs</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-white/50 block">Height</span>
                <span className="font-bold text-[#e0e0e0]">{profile.height}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-white/50 block">Rating</span>
                <span className="font-bold text-[#c5a059] flex items-center justify-center gap-1">
                  <Star className="w-3 h-3 fill-[#c5a059]" />
                  {profile.rating}
                </span>
              </div>
            </div>

            {/* Bio */}
            <div>
              <h4 className="text-[10px] font-bold uppercase text-[#c5a059] tracking-[0.2em] mb-1 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" /> About Companion
              </h4>
              <p className="text-xs text-white/70 leading-relaxed bg-[#1a1a1a] p-3 rounded border border-white/5 font-sans">
                {profile.bio}
              </p>
            </div>

            {/* Rates Table */}
            <div className="bg-[#1a1a1a] p-3.5 rounded border border-[#c5a059]/30 space-y-2">
              <h4 className="text-[10px] font-bold uppercase text-[#c5a059] tracking-[0.2em] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#c5a059]" /> Service Rates
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#0f0f0f] p-2.5 rounded border border-white/5">
                  <span className="text-[10px] uppercase text-white/50 block">Short Time (2h)</span>
                  <span className="text-[#c5a059] font-bold italic text-sm">₹{profile.rateShort.toLocaleString()}</span>
                </div>
                <div className="bg-[#0f0f0f] p-2.5 rounded border border-white/5">
                  <span className="text-[10px] uppercase text-white/50 block">Full Night (8h)</span>
                  <span className="text-[#c5a059] font-bold italic text-sm">₹{profile.rateFull.toLocaleString()}</span>
                </div>
              </div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                No Advance Required • 100% Cash on Delivery (COD)
              </div>
            </div>

            {/* Services Included */}
            <div>
              <h4 className="text-[10px] font-bold uppercase text-[#c5a059] tracking-[0.2em] mb-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Services Included
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-white/70">
                {profile.services.map((serv, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 bg-[#1a1a1a] px-2.5 py-1.5 rounded border border-white/5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
                    <span>{serv}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages & Pickup */}
            <div className="flex items-center justify-between text-xs text-white/60 border-t border-white/10 pt-3">
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-[#c5a059]" />
                {profile.languages.join(', ')}
              </span>
              <span className="flex items-center gap-1 text-[#c5a059] font-semibold">
                <Truck className="w-3.5 h-3.5 text-[#c5a059]" />
                Free Pickup & Drop
              </span>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  onBookNow(profile);
                  onClose();
                }}
                className="w-full py-3.5 bg-[#c5a059] hover:bg-[#d4b578] text-black font-bold rounded-sm text-xs uppercase tracking-widest transition-colors shadow-lg"
              >
                Book {profile.name} Now (Cash on Delivery)
              </button>

              <a
                href={`https://wa.me/${profile.whatsapp}?text=Hi%20Juli%20Club%2C%20I%20want%20to%20book%20${encodeURIComponent(
                  profile.name
                )}%20in%20Lucknow%20with%20Cash%20on%20Delivery.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-sm text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
                <span>Chat with {profile.name} on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

