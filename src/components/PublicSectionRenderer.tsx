import React from 'react';
import { CMSSection, CompanionProfile } from '../types';
import { WhatsAppIcon } from './WhatsAppIcon';
import { ShieldCheck, Sparkles, Heart, MapPin, Star, Truck, CheckCircle, ChevronDown, PhoneCall } from 'lucide-react';
import { ProfileCard } from './ProfileCard';

interface PublicSectionRendererProps {
  sections: CMSSection[];
  profiles?: CompanionProfile[];
}

export const PublicSectionRenderer: React.FC<PublicSectionRendererProps> = ({
  sections,
  profiles = []
}) => {
  if (!sections || sections.length === 0) return null;

  // Filter sections that are marked show: true and status: 'published' (or show all in preview mode)
  const visibleSections = [...sections]
    .filter(sec => sec.show && sec.status === 'published')
    .sort((a, b) => a.order - b.order);

  if (visibleSections.length === 0) return null;

  return (
    <div className="w-full space-y-0">
      {visibleSections.map(sec => {
        const spacingClasses =
          sec.spacing === 'none'
            ? 'py-0'
            : sec.spacing === 'small'
            ? 'py-6 sm:py-8'
            : sec.spacing === 'large'
            ? 'py-16 sm:py-24'
            : 'py-12 sm:py-16';

        const styleBg = sec.bgImage
          ? {
              backgroundImage: `linear-gradient(to bottom, rgba(10,10,10,0.88), rgba(10,10,10,0.95)), url('${sec.bgImage}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }
          : { backgroundColor: sec.bgColor || '#0a0a0a' };

        return (
          <section
            key={sec.id}
            className={`${spacingClasses} text-[#e0e0e0] border-b border-white/10 relative overflow-hidden`}
            style={styleBg}
          >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
              {/* Type 1: Hero */}
              {sec.type === 'hero' && (
                <div className="text-center space-y-6 max-w-3xl mx-auto py-4">
                  {sec.subtitle && (
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-sm bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#c5a059] text-[10px] font-bold uppercase tracking-[0.2em]">
                      <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" /> {sec.subtitle}
                    </div>
                  )}

                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
                    {sec.title}
                  </h1>

                  {sec.description && (
                    <p className="text-sm sm:text-base text-white/80 leading-relaxed font-sans max-w-2xl mx-auto">
                      {sec.description}
                    </p>
                  )}

                  {sec.ctaText && (
                    <div className="pt-2">
                      <a
                        href={sec.ctaUrl || 'https://wa.me/918726179837'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-widest rounded-sm transition-all shadow-xl shadow-emerald-950/40"
                      >
                        <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
                        <span>{sec.ctaText}</span>
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Type 2: Text Block */}
              {sec.type === 'text' && (
                <div className="bg-[#0f0f0f] p-6 sm:p-8 rounded border border-white/10 space-y-4 shadow-xl">
                  {sec.subtitle && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#c5a059] text-[10px] font-bold uppercase tracking-[0.2em]">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#c5a059]" /> {sec.subtitle}
                    </div>
                  )}
                  {sec.title && (
                    <h2 className="text-2xl sm:text-3xl font-serif text-[#e0e0e0]">
                      {sec.title}
                    </h2>
                  )}
                  {sec.description && (
                    <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans whitespace-pre-line">
                      {sec.description}
                    </p>
                  )}
                  {sec.ctaText && (
                    <div className="pt-2">
                      <a
                        href={sec.ctaUrl || 'https://wa.me/918726179837'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#c5a059] hover:bg-[#b08c46] text-black font-bold text-xs uppercase tracking-wider rounded-sm transition-all"
                      >
                        <span>{sec.ctaText}</span>
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Type 3: Image + Text Grid */}
              {sec.type === 'image-text' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    {sec.subtitle && (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#c5a059] block">
                        {sec.subtitle}
                      </span>
                    )}
                    <h2 className="text-2xl sm:text-3xl font-serif text-[#e0e0e0]">{sec.title}</h2>
                    {sec.description && (
                      <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">{sec.description}</p>
                    )}
                    {sec.ctaText && (
                      <a
                        href={sec.ctaUrl || '#profiles'}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#c5a059] hover:bg-[#b08c46] text-black font-bold text-xs uppercase tracking-wider rounded-sm transition-all mt-2"
                      >
                        <span>{sec.ctaText}</span>
                      </a>
                    )}
                  </div>
                  {sec.bgImage && (
                    <div className="rounded border border-white/10 overflow-hidden shadow-2xl">
                      <img src={sec.bgImage} alt={sec.title} className="w-full h-72 object-cover" />
                    </div>
                  )}
                </div>
              )}

              {/* Type 4: Cards Directory Grid */}
              {sec.type === 'cards' && (
                <div className="space-y-6">
                  {(sec.title || sec.subtitle) && (
                    <div className="text-center space-y-2">
                      {sec.subtitle && (
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c5a059]">
                          {sec.subtitle}
                        </span>
                      )}
                      <h2 className="text-2xl sm:text-3xl font-serif text-[#e0e0e0]">{sec.title}</h2>
                      {sec.description && (
                        <p className="text-xs text-white/60 font-sans max-w-xl mx-auto">{sec.description}</p>
                      )}
                    </div>
                  )}

                  {/* Render Profiles Cards */}
                  {profiles.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {profiles.slice(0, 6).map(prof => (
                        <ProfileCard key={prof.id} profile={prof} onSelect={() => {}} onBookNow={() => {}} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Type 5: Statistics / Highlights */}
              {sec.type === 'statistics' && (
                <div className="bg-[#0f0f0f] p-6 sm:p-8 rounded border border-[#c5a059]/30 space-y-6">
                  {(sec.title || sec.subtitle) && (
                    <div className="text-center space-y-2">
                      <h2 className="text-2xl font-serif text-[#c5a059]">{sec.title}</h2>
                      {sec.subtitle && <p className="text-xs text-white/50 font-sans">{sec.subtitle}</p>}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {(sec.customData?.stats || [
                      { value: '₹3,999', label: 'Starting Rate', detail: 'Affordable short time & full night packages' },
                      { value: 'Zero Advance', label: 'Payment Guarantee', detail: '100% Cash on Delivery when companion arrives' },
                      { value: 'Free Pickup', label: 'Cab Service', detail: 'Free private driver delivery to any hotel' },
                      { value: '100% Real', label: 'Verification', detail: 'Unedited photos with guaranteed measurements' }
                    ]).map((st: any, idx: number) => (
                      <div key={idx} className="p-4 bg-[#1a1a1a] rounded border border-white/5 space-y-1 text-center">
                        <span className="text-base font-serif font-bold text-[#c5a059] block">{st.value}</span>
                        <h3 className="font-serif font-bold text-xs text-[#e0e0e0]">{st.label}</h3>
                        <p className="text-[10px] text-white/50 font-sans">{st.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Type 6: CTA Block */}
              {sec.type === 'cta' && (
                <div className="bg-[#1a1a1a] p-8 rounded border border-[#c5a059]/30 text-center space-y-4">
                  <h2 className="text-2xl font-serif text-[#c5a059]">{sec.title}</h2>
                  {sec.description && <p className="text-xs sm:text-sm text-white/80 max-w-2xl mx-auto">{sec.description}</p>}
                  <a
                    href={sec.ctaUrl || 'https://wa.me/918726179837'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-widest rounded-sm transition-all shadow-lg"
                  >
                    <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
                    <span>{sec.ctaText || 'Contact via WhatsApp'}</span>
                  </a>
                </div>
              )}

              {/* Type 7: Custom HTML Code */}
              {sec.type === 'custom-html' && sec.customData?.html && (
                <div
                  className="w-full"
                  dangerouslySetInnerHTML={{ __html: sec.customData.html }}
                />
              )}

              {/* Type 8: Line Divider */}
              {sec.type === 'divider' && <hr className="border-t border-white/10 my-4" />}

              {/* Type 9: Vertical Spacer */}
              {sec.type === 'spacer' && <div className="h-12 w-full" />}
            </div>
          </section>
        );
      })}
    </div>
  );
};
