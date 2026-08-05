import React from 'react';
import { CMSSection, CompanionProfile } from '../types';
import { WhatsAppIcon } from './WhatsAppIcon';
import { ShieldCheck, Sparkles, Heart, MapPin, Star, Truck, CheckCircle, ChevronDown, PhoneCall, Play } from 'lucide-react';
import { ProfileCard } from './ProfileCard';

interface PublicSectionRendererProps {
  sections: CMSSection[];
  profiles?: CompanionProfile[];
  excludeTypes?: string[];
}

export const PublicSectionRenderer: React.FC<PublicSectionRendererProps> = ({
  sections,
  profiles = [],
  excludeTypes = []
}) => {
  if (!sections || sections.length === 0) return null;

  // Filter sections that are marked show: true and status: 'published' and not in excludeTypes
  const visibleSections = [...sections]
    .filter(sec => sec.show && sec.status === 'published' && (!excludeTypes || !excludeTypes.includes(sec.type)))
    .sort((a, b) => a.order - b.order);

  if (visibleSections.length === 0) return null;

  return (
    <div className="w-full space-y-0">
      {visibleSections.map(sec => {
        // Helper to render action buttons
        const renderButtons = () => {
          if (sec.buttons && sec.buttons.length > 0) {
            return (
              <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                {sec.buttons.map((btn, bIdx) => {
                  const isWa = btn.variant === 'whatsapp';
                  const isPrimary = btn.variant === 'primary' || !btn.variant;
                  const isOutline = btn.variant === 'outline';

                  const btnClass = isWa
                    ? 'bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl shadow-emerald-950/40'
                    : isPrimary
                    ? 'bg-[#c5a059] hover:bg-[#b08c46] text-black shadow-lg shadow-[#c5a059]/20'
                    : isOutline
                    ? 'border border-[#c5a059] text-[#c5a059] hover:bg-[#c5a059]/10'
                    : 'bg-white/10 hover:bg-white/20 text-white';

                  return (
                    <a
                      key={btn.id || bIdx}
                      href={btn.url || 'https://wa.me/918726179837'}
                      target={btn.target || '_blank'}
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2.5 px-7 py-3 font-bold text-xs uppercase tracking-widest rounded-sm transition-all ${btnClass}`}
                    >
                      {isWa && <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />}
                      <span>{btn.label}</span>
                    </a>
                  );
                })}
              </div>
            );
          } else if (sec.ctaText) {
            return (
              <div className="pt-2 text-center">
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
            );
          }
          return null;
        };

        // Render inner content for the section
        const renderInnerContent = () => {
          switch (sec.type) {
            case 'hero':
              return (
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
                    <div
                      className="text-sm sm:text-base text-white/80 leading-relaxed font-sans max-w-2xl mx-auto prose prose-invert"
                      dangerouslySetInnerHTML={{ __html: sec.description }}
                    />
                  )}

                  {renderButtons()}
                </div>
              );

            case 'text':
              return (
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
                    <div
                      className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: sec.description }}
                    />
                  )}
                  {renderButtons()}
                </div>
              );

            case 'image':
              if (!sec.bgImage) return null;
              return (
                <div className="rounded-xl border border-white/10 overflow-hidden shadow-2xl relative group">
                  <img src={sec.bgImage} alt={sec.title || 'Banner'} className="w-full max-h-[450px] object-cover" />
                  {(sec.title || sec.description) && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 sm:p-8 flex flex-col justify-end space-y-2">
                      {sec.title && <h2 className="text-2xl font-serif font-bold text-white">{sec.title}</h2>}
                      {sec.description && <p className="text-xs text-white/80 font-sans max-w-2xl">{sec.description}</p>}
                    </div>
                  )}
                </div>
              );

            case 'image-text':
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    {sec.subtitle && (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#c5a059] block">
                        {sec.subtitle}
                      </span>
                    )}
                    <h2 className="text-2xl sm:text-3xl font-serif text-[#e0e0e0]">{sec.title}</h2>
                    {sec.description && (
                      <div
                        className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans prose prose-invert"
                        dangerouslySetInnerHTML={{ __html: sec.description }}
                      />
                    )}
                    {renderButtons()}
                  </div>
                  {sec.bgImage && (
                    <div className="rounded border border-white/10 overflow-hidden shadow-2xl">
                      <img src={sec.bgImage} alt={sec.title} className="w-full h-72 object-cover" />
                    </div>
                  )}
                </div>
              );

            case 'cards':
              return (
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
                        <div
                          className="text-xs text-white/60 font-sans max-w-xl mx-auto"
                          dangerouslySetInnerHTML={{ __html: sec.description }}
                        />
                      )}
                    </div>
                  )}

                  {profiles.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {profiles.slice(0, 6).map(prof => (
                        <ProfileCard key={prof.id} profile={prof} onSelect={() => {}} onBookNow={() => {}} />
                      ))}
                    </div>
                  )}
                </div>
              );

            case 'gallery':
              return (
                <div className="space-y-6">
                  {(sec.title || sec.subtitle) && (
                    <div className="text-center space-y-2">
                      {sec.subtitle && <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c5a059]">{sec.subtitle}</span>}
                      <h2 className="text-2xl font-serif text-white">{sec.title}</h2>
                    </div>
                  )}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {(sec.images && sec.images.length > 0
                      ? sec.images
                      : [
                          { id: '1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80' },
                          { id: '2', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80' },
                          { id: '3', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80' },
                          { id: '4', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80' }
                        ]
                    ).map((img: any, idx: number) => (
                      <div key={img.id || idx} className="rounded-lg overflow-hidden border border-white/10 h-48 group relative">
                        <img src={img.url} alt={img.alt || 'Gallery item'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    ))}
                  </div>
                </div>
              );

            case 'faq':
              return (
                <div className="bg-[#0f0f0f] p-6 sm:p-8 rounded border border-white/10 space-y-6">
                  {(sec.title || sec.subtitle) && (
                    <div className="text-center space-y-2">
                      {sec.subtitle && <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c5a059]">{sec.subtitle}</span>}
                      <h2 className="text-2xl font-serif text-white">{sec.title}</h2>
                    </div>
                  )}
                  <div className="space-y-3 max-w-3xl mx-auto">
                    {(sec.customData?.faqs || [
                      { question: 'Do I need to pay any advance amount?', answer: 'No! We strictly operate on 100% Cash on Delivery (COD). Zero advance required.' },
                      { question: 'Are photos 100% genuine and unedited?', answer: 'Yes, all companion profiles feature verified, unedited real pictures.' },
                      { question: 'Do you provide hotel outcall service in Lucknow?', answer: 'Yes, we deliver companions directly to major hotels in Gomti Nagar, Hazratganj, Alambagh, etc.' }
                    ]).map((f: any, idx: number) => (
                      <div key={idx} className="p-4 bg-[#161616] rounded border border-white/10 space-y-1.5">
                        <h4 className="text-xs sm:text-sm font-serif font-bold text-[#c5a059]">{f.question}</h4>
                        <p className="text-xs text-white/70 font-sans leading-relaxed">{f.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );

            case 'statistics':
              return (
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
              );

            case 'features':
              return (
                <div className="bg-[#0f0f0f] p-6 sm:p-8 rounded border border-white/10 space-y-6">
                  {(sec.title || sec.subtitle) && (
                    <div className="text-center space-y-2">
                      {sec.subtitle && <span className="text-[10px] font-bold uppercase tracking-widest text-[#c5a059]">{sec.subtitle}</span>}
                      <h2 className="text-2xl font-serif text-white">{sec.title}</h2>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {(sec.customData?.features || [
                      { title: 'Zero Advance Payment', desc: 'Pay 100% cash on delivery after meeting companion.' },
                      { title: '30-Min Hotel Outcall', desc: 'Fastest doorstep delivery to Gomti Nagar & Hazratganj.' },
                      { title: '100% Verified Models', desc: 'Unedited genuine pictures guaranteed.' }
                    ]).map((f: any, idx: number) => (
                      <div key={idx} className="p-4 bg-[#161616] rounded border border-white/10 space-y-2">
                        <CheckCircle className="w-5 h-5 text-[#c5a059]" />
                        <h3 className="text-xs font-bold text-white">{f.title}</h3>
                        <p className="text-[11px] text-white/60 font-sans leading-relaxed">{f.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );

            case 'video':
              if (!sec.customData?.videoUrl) return null;
              return (
                <div className="space-y-4 max-w-3xl mx-auto">
                  {sec.title && <h2 className="text-2xl font-serif text-center text-white">{sec.title}</h2>}
                  <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/15 bg-black shadow-2xl">
                    {sec.customData.videoUrl.includes('youtube.com') || sec.customData.videoUrl.includes('youtu.be') ? (
                      <iframe
                        src={sec.customData.videoUrl.replace('watch?v=', 'embed/')}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    ) : (
                      <video src={sec.customData.videoUrl} controls className="w-full h-full" />
                    )}
                  </div>
                </div>
              );

            case 'cta':
              return (
                <div className="bg-[#1a1a1a] p-8 rounded border border-[#c5a059]/30 text-center space-y-4">
                  <h2 className="text-2xl font-serif text-[#c5a059]">{sec.title}</h2>
                  {sec.description && (
                    <div
                      className="text-xs sm:text-sm text-white/80 max-w-2xl mx-auto font-sans"
                      dangerouslySetInnerHTML={{ __html: sec.description }}
                    />
                  )}
                  {renderButtons()}
                </div>
              );

            case 'custom-html':
              if (!sec.customData?.html) return null;
              return (
                <div
                  className="w-full"
                  dangerouslySetInnerHTML={{ __html: sec.customData.html }}
                />
              );

            case 'custom-block':
              return (
                <div className="p-6 bg-[#0f0f0f] rounded-lg border border-white/10 space-y-3">
                  {sec.title && <h3 className="text-lg font-serif font-bold text-white">{sec.title}</h3>}
                  {sec.description && <div dangerouslySetInnerHTML={{ __html: sec.description }} />}
                  {renderButtons()}
                </div>
              );

            case 'divider':
              return <hr className="border-t border-white/10 my-4" />;

            case 'spacer':
              return <div className="h-12 w-full" />;

            case 'review':
              return (
                <div className="bg-[#0f0f0f] p-6 sm:p-8 rounded border border-white/10 space-y-6">
                  {(sec.title || sec.subtitle) && (
                    <div className="text-center space-y-2">
                      {sec.subtitle && <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c5a059]">{sec.subtitle}</span>}
                      <h2 className="text-2xl font-serif text-white">{sec.title}</h2>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#161616] rounded border border-white/10 space-y-2">
                      <div className="flex items-center gap-1 text-[#c5a059]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <p className="text-xs text-white/80 font-sans italic">"Best service in Gomti Nagar. Cash on delivery was 100% genuine and the companion arrived within 25 minutes."</p>
                      <span className="text-[10px] text-white/50 block font-bold">- Verified Gentleman, Gomti Nagar</span>
                    </div>
                    <div className="p-4 bg-[#161616] rounded border border-white/10 space-y-2">
                      <div className="flex items-center gap-1 text-[#c5a059]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <p className="text-xs text-white/80 font-sans italic">"Zero advance payment guarantee gives total peace of mind. Highly recommended VIP companion agency."</p>
                      <span className="text-[10px] text-white/50 block font-bold">- Corporate Executive, Hazratganj</span>
                    </div>
                  </div>
                </div>
              );

            default:
              return null;
          }
        };

        const innerContent = renderInnerContent();

        // IF NO INNER CONTENT WAS PRODUCED, DO NOT RENDER OUTER SECTION CONTAINER
        if (!innerContent) return null;

        // Device visibility logic
        const visibilityClasses =
          sec.visibility === 'desktop'
            ? 'hidden md:block'
            : sec.visibility === 'mobile'
            ? 'block md:hidden'
            : 'block';

        const spacingClasses =
          sec.spacing === 'none'
            ? 'py-0'
            : sec.spacing === 'small'
            ? 'py-6 sm:py-8'
            : sec.spacing === 'large'
            ? 'py-16 sm:py-24'
            : 'py-12 sm:py-16';

        const overlayOpacity = (sec.bgOverlayOpacity ?? 85) / 100;
        const styleBg = sec.bgImage
          ? {
              backgroundImage: `linear-gradient(to bottom, rgba(10,10,10,${overlayOpacity}), rgba(10,10,10,${Math.min(1, overlayOpacity + 0.1)})), url('${sec.bgImage}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }
          : { backgroundColor: sec.bgColor || '#0a0a0a' };

        return (
          <section
            key={sec.id}
            className={`${visibilityClasses} ${spacingClasses} text-[#e0e0e0] border-b border-white/10 relative overflow-hidden`}
            style={styleBg}
          >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
              {innerContent}
            </div>
          </section>
        );
      })}
    </div>
  );
};
