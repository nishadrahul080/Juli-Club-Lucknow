import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import {
  Palette,
  Globe,
  Upload,
  Download,
  CheckCircle2,
  Sparkles,
  Phone,
  Mail,
  FileCode,
  Layers,
  Shield,
  RotateCcw
} from 'lucide-react';

export const WhiteLabelModule: React.FC = () => {
  const { cmsData, updateSettings } = useCMS();
  const settings = cmsData.settings;

  const [brandName, setBrandName] = useState(settings.siteTitle || 'Juli Club');
  const [slogan, setSlogan] = useState('Lucknow Premier Escort & Companion Directory');
  const [domain, setDomain] = useState('juliclub.com');
  const [logoUrl, setLogoUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80');
  const [accentColor, setAccentColor] = useState('#c5a059');
  const [canvasColor, setCanvasColor] = useState('#0a0a0a');
  const [contactPhone, setContactPhone] = useState(settings.contactPhone || '+91 8726179837');
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber || '918726179837');
  const [contactEmail, setContactEmail] = useState(settings.contactEmail || 'contact@juliclub.com');
  const [footerText, setFooterText] = useState(settings.footerText || '© 2026 Juli Club Lucknow. All rights reserved. 100% Cash on Delivery Service.');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveWhiteLabel = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      siteTitle: brandName,
      contactPhone,
      whatsappNumber,
      contactEmail,
      footerText
    });
    showToast('White Label Branding updated successfully!');
  };

  const handleApplyColorPreset = (color: string) => {
    setAccentColor(color);
    showToast(`Accent color updated to ${color}.`);
  };

  const handleExportWhiteLabelConfig = () => {
    const config = {
      brandName,
      slogan,
      domain,
      logoUrl,
      accentColor,
      canvasColor,
      contactPhone,
      whatsappNumber,
      contactEmail,
      footerText,
      exportedAt: new Date().toISOString()
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(config, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `${brandName.toLowerCase().replace(/ /g, '_')}_whitelabel_config.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('White Label Configuration exported.');
  };

  const handleImportWhiteLabelConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (parsed.brandName) setBrandName(parsed.brandName);
        if (parsed.slogan) setSlogan(parsed.slogan);
        if (parsed.domain) setDomain(parsed.domain);
        if (parsed.logoUrl) setLogoUrl(parsed.logoUrl);
        if (parsed.accentColor) setAccentColor(parsed.accentColor);
        if (parsed.contactPhone) setContactPhone(parsed.contactPhone);
        if (parsed.whatsappNumber) setWhatsappNumber(parsed.whatsappNumber);
        if (parsed.contactEmail) setContactEmail(parsed.contactEmail);
        if (parsed.footerText) setFooterText(parsed.footerText);

        updateSettings({
          siteTitle: parsed.brandName || brandName,
          contactPhone: parsed.contactPhone || contactPhone,
          whatsappNumber: parsed.whatsappNumber || whatsappNumber,
          contactEmail: parsed.contactEmail || contactEmail,
          footerText: parsed.footerText || footerText
        });

        showToast('Imported White Label preset configuration successfully!');
      } catch (err) {
        alert('Invalid White Label JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-xl">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif text-white font-medium">White Label CMS Engine</h1>
            <p className="text-xs text-white/50">Rebrand, reconfigure domain parameters, colors, and export project configurations without code changes</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportWhiteLabelConfig}
            className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/15 rounded-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#c5a059]" />
            Export Config
          </button>

          <label className="px-3.5 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 rounded-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            Import Config
            <input type="file" accept=".json" onChange={handleImportWhiteLabelConfig} className="hidden" />
          </label>
        </div>
      </div>

      {toast && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSaveWhiteLabel} className="space-y-6">
        {/* Brand & Identity */}
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-serif font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Sparkles className="w-4 h-4 text-[#c5a059]" /> Brand & Platform Identity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/60 block mb-1">Brand Name</label>
              <input
                type="text"
                required
                value={brandName}
                onChange={e => setBrandName(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-white/15 focus:border-[#c5a059] text-white text-xs rounded-xl p-2.5 outline-none font-bold"
              />
            </div>

            <div>
              <label className="text-xs text-white/60 block mb-1">Brand Tagline / Subtitle</label>
              <input
                type="text"
                value={slogan}
                onChange={e => setSlogan(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-white/15 focus:border-[#c5a059] text-white text-xs rounded-xl p-2.5 outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-white/60 block mb-1">Target Domain Name</label>
              <input
                type="text"
                value={domain}
                onChange={e => setDomain(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-white/15 focus:border-[#c5a059] text-white text-xs rounded-xl p-2.5 outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-xs text-white/60 block mb-1">Brand Logo Image URL</label>
              <input
                type="url"
                value={logoUrl}
                onChange={e => setLogoUrl(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-white/15 focus:border-[#c5a059] text-white text-xs rounded-xl p-2.5 outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Theme Palette & Styling */}
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-serif font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Palette className="w-4 h-4 text-purple-400" /> Dynamic Color Theme & Atmosphere
          </h2>

          <div className="space-y-3">
            <label className="text-xs text-white/60 block">Select Accent Preset</label>
            <div className="flex flex-wrap gap-3">
              {[
                { name: 'Imperial Gold', hex: '#c5a059' },
                { name: 'Royal Sapphire', hex: '#3b82f6' },
                { name: 'Emerald Reserve', hex: '#10b981' },
                { name: 'Rose Velvet', hex: '#e11d48' },
                { name: 'Purple Sovereign', hex: '#8b5cf6' }
              ].map(c => (
                <button
                  type="button"
                  key={c.hex}
                  onClick={() => handleApplyColorPreset(c.hex)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-2 cursor-pointer transition-all ${
                    accentColor === c.hex ? 'border-white text-white' : 'border-white/10 text-white/60'
                  }`}
                  style={{ backgroundColor: `${c.hex}15` }}
                >
                  <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: c.hex }}></span>
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contact & Support Routing */}
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-serif font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Phone className="w-4 h-4 text-emerald-400" /> Contact & WhatsApp Routing
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-white/60 block mb-1">WhatsApp Number (Digits only)</label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={e => setWhatsappNumber(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-white/15 focus:border-[#c5a059] text-white text-xs rounded-xl p-2.5 outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-xs text-white/60 block mb-1">Display Phone Number</label>
              <input
                type="text"
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-white/15 focus:border-[#c5a059] text-white text-xs rounded-xl p-2.5 outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-xs text-white/60 block mb-1">Support Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-white/15 focus:border-[#c5a059] text-white text-xs rounded-xl p-2.5 outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-white/60 block mb-1">Footer Copyright Notice</label>
            <input
              type="text"
              value={footerText}
              onChange={e => setFooterText(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-white/15 focus:border-[#c5a059] text-white text-xs rounded-xl p-2.5 outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-3 bg-[#c5a059] hover:bg-[#d4b578] text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg cursor-pointer"
          >
            Save White Label Configuration
          </button>
        </div>
      </form>
    </div>
  );
};
