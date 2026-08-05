import React, { useState } from 'react';
import { CompanionProfile } from '../../../types';
import { ProfileCard } from '../../../components/ProfileCard';
import { ProfileModal } from '../../../components/ProfileModal';
import { X, Eye, LayoutGrid, Maximize2 } from 'lucide-react';

interface ProfilePreviewModalProps {
  profile: CompanionProfile | null;
  onClose: () => void;
}

export const ProfilePreviewModal: React.FC<ProfilePreviewModalProps> = ({ profile, onClose }) => {
  if (!profile) return null;

  const [viewMode, setViewMode] = useState<'card' | 'modal'>('card');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0f0f0f] border border-white/10 rounded-lg overflow-hidden text-[#e0e0e0] my-8 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#141414] border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#c5a059]/10 border border-[#c5a059]/30 flex items-center justify-center text-[#c5a059]">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif text-[#e0e0e0] flex items-center gap-2">
                Live Public Preview: <span className="text-[#c5a059]">{profile.name}</span>
              </h3>
              <p className="text-xs text-white/50">
                URL: <span className="font-mono text-white/70">/profile/{profile.slug || profile.id}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex bg-[#0a0a0a] border border-white/10 rounded p-1 text-xs">
              <button
                onClick={() => setViewMode('card')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
                  viewMode === 'card'
                    ? 'bg-[#c5a059] text-black font-semibold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Directory Card
              </button>
              <button
                onClick={() => setViewMode('modal')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
                  viewMode === 'modal'
                    ? 'bg-[#c5a059] text-black font-semibold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Maximize2 className="w-3.5 h-3.5" />
                Detail View
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded border border-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto bg-[#0a0a0a] flex-1 flex items-center justify-center">
          {viewMode === 'card' ? (
            <div className="w-full max-w-sm">
              <div className="mb-3 text-center">
                <span className="text-[10px] font-bold text-[#c5a059] uppercase tracking-widest bg-[#c5a059]/10 px-2.5 py-1 rounded border border-[#c5a059]/20">
                  Directory Grid Preview
                </span>
              </div>
              <ProfileCard
                profile={profile}
                onSelect={() => setViewMode('modal')}
                onBookNow={() => {
                  alert(`[Preview Mode] Booking requested for ${profile.name}`);
                }}
              />
            </div>
          ) : (
            <div className="w-full max-w-3xl">
              <ProfileModal
                profile={profile}
                onClose={() => setViewMode('card')}
                onBookNow={() => {
                  alert(`[Preview Mode] Booking requested for ${profile.name}`);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
