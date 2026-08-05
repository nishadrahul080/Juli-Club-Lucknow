import React, { useState } from 'react';
import { Search, ShieldCheck, Menu, X, Mail, ChevronDown, MapPin } from 'lucide-react';
import { LOCATION_PAGES } from '../data/locationData';
import { WhatsAppIcon } from './WhatsAppIcon';

interface NavbarProps {
  selectedCity: string;
  onSelectCity: (city: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenBooking: () => void;
  onNavigateHome: () => void;
  onNavigateLocation: (slug: string) => void;
  currentSlug: string | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedCity,
  onSelectCity,
  searchQuery,
  onSearchChange,
  onOpenBooking,
  onNavigateHome,
  onNavigateLocation,
  currentSlug,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  const navLinkClass = (isActive: boolean) =>
    `relative py-1 font-medium text-xs tracking-wider uppercase transition-all duration-300 whitespace-nowrap cursor-pointer hover:text-[#c5a059] hover:-translate-y-0.5 transform after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#c5a059] hover:after:w-full after:transition-all after:duration-300 ${
      isActive ? 'text-[#c5a059] font-bold after:w-full' : 'text-white/80 after:w-0'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-[#0f0f0f]/95 backdrop-blur-md border-b border-white/10 text-[#e0e0e0]">
      {/* Top Bar Announcement */}
      <div className="bg-[#0a0a0a] text-xs py-2 px-4 border-b border-white/10">
        <div className="flex items-center justify-between max-w-7xl mx-auto w-full gap-4">
          <span className="flex items-center gap-2 text-xs truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
            <strong className="text-[#c5a059] font-medium tracking-wide">100% Genuine Profiles:</strong>
            <span className="opacity-80 truncate hidden sm:inline">No Advance Payment • Cash on Delivery (COD) • Free Pickup & Drop</span>
            <span className="opacity-80 truncate sm:hidden">0 Advance • Cash on Delivery</span>
          </span>
          <div className="hidden md:flex items-center gap-6 text-xs shrink-0">
            <a
              href="mailto:ramanarora7869@gmail.com"
              className="flex items-center gap-1.5 text-xs opacity-70 hover:opacity-100 hover:text-[#c5a059] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#c5a059]" />
              ramanarora7869@gmail.com
            </a>
            <span className="opacity-20">|</span>
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              24/7 Available
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4 md:gap-6">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2.5 group text-left focus:outline-none"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-[#c5a059] to-[#8c6b32] rounded-full flex items-center justify-center text-black font-bold text-lg shadow-lg shadow-[#c5a059]/10 group-hover:scale-105 transition-transform">
                J
              </div>
              <div className="leading-none">
                <span className="text-lg font-serif tracking-widest text-[#c5a059] uppercase block font-bold">
                  JULI CLUB
                </span>
                <span className="text-[9px] uppercase tracking-wider opacity-60 block mt-0.5">
                  Call Girl Service Lucknow
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 font-medium tracking-wider text-xs uppercase whitespace-nowrap">
            <button onClick={onNavigateHome} className={navLinkClass(!currentSlug)}>
              Home
            </button>

            <a
              href="#profiles"
              onClick={() => currentSlug && onNavigateHome()}
              className={navLinkClass(false)}
            >
              Profiles
            </a>

            {/* Locations Dropdown Menu */}
            <div className="relative group" onMouseLeave={() => setIsLocationDropdownOpen(false)}>
              <button
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                onMouseEnter={() => setIsLocationDropdownOpen(true)}
                className={`flex items-center gap-1.5 ${navLinkClass(!!currentSlug)}`}
              >
                <span>Locations</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#c5a059] transition-transform duration-200 group-hover:rotate-180" />
              </button>

              {/* Dropdown Box */}
              {isLocationDropdownOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-64 bg-[#0d0d0d] border border-white/10 rounded-md shadow-2xl p-2 z-50 space-y-1 backdrop-blur-xl">
                  <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#c5a059] border-b border-white/10 mb-1 flex items-center justify-between">
                    <span>Select Area Page</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-ping"></span>
                  </div>
                  {LOCATION_PAGES.map((loc) => {
                    const isActive = currentSlug === loc.slug;
                    return (
                      <button
                        key={loc.slug}
                        onClick={() => {
                          onNavigateLocation(loc.slug);
                          setIsLocationDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded text-xs flex items-center justify-between transition-all duration-200 ${
                          isActive
                            ? 'bg-[#c5a059]/20 text-[#c5a059] font-bold border border-[#c5a059]/40'
                            : 'text-white/80 hover:bg-white/5 hover:text-[#c5a059] hover:translate-x-1'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#c5a059]" />
                          {loc.areaName} Call Girls
                        </span>
                        <span className="text-[9px] text-white/40 uppercase font-mono">Page</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <a
              href="#about"
              onClick={() => currentSlug && onNavigateHome()}
              className={navLinkClass(false)}
            >
              About Us
            </a>
            <a
              href="#rate-chart"
              onClick={() => currentSlug && onNavigateHome()}
              className={navLinkClass(false)}
            >
              Rate Chart
            </a>
            <a
              href="#reviews"
              onClick={() => currentSlug && onNavigateHome()}
              className={navLinkClass(false)}
            >
              Reviews
            </a>
            <a
              href="#faq"
              onClick={() => currentSlug && onNavigateHome()}
              className={navLinkClass(false)}
            >
              FAQ
            </a>
          </nav>

          {/* Search Input (Desktop) */}
          <div className="hidden xl:flex items-center max-w-[210px] w-full shrink-0">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Gomti Nagar..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-md pl-8 pr-3 py-1.5 text-xs text-[#e0e0e0] placeholder-white/40 focus:outline-none focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059]/50 transition-all"
              />
            </div>
          </div>

          {/* Single Primary CTA Button: WhatsApp */}
          <div className="hidden sm:flex items-center shrink-0">
            <a
              href="https://wa.me/918726179837?text=Hi%20Juli%20Club%2C%20I%20want%20to%20book%20a%20Call%20Girl%20Service%20Lucknow%20with%20Cash%20on%20Delivery."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-[#25D366] hover:bg-[#22c35e] text-white rounded-md text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.03] shadow-md shadow-green-950/40 hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] border border-emerald-400/30 shrink-0 cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
              <span>WhatsApp Us</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#c5a059] hover:bg-white/5 rounded-md transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Search & Menu */}
        {isMobileMenuOpen && (
          <div className="mt-3 pt-3 border-t border-white/10 space-y-3 lg:hidden pb-2 bg-[#0d0d0d] p-3.5 rounded-md shadow-2xl">
            <div className="flex flex-col gap-2 border-b border-white/10 pb-3">
              <button
                onClick={() => {
                  onNavigateHome();
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left text-xs uppercase font-bold py-1.5 px-2 rounded transition-colors ${
                  !currentSlug ? 'text-[#c5a059] bg-white/5' : 'text-white hover:text-[#c5a059]'
                }`}
              >
                Home Page
              </button>

              <div className="py-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c5a059] block mb-1.5 px-2">
                  Location Area Pages:
                </span>
                <div className="grid grid-cols-1 gap-1 pl-1">
                  {LOCATION_PAGES.map((loc) => (
                    <button
                      key={loc.slug}
                      onClick={() => {
                        onNavigateLocation(loc.slug);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`text-left text-xs py-1.5 px-2 rounded flex items-center gap-2 transition-colors ${
                        currentSlug === loc.slug ? 'text-[#c5a059] font-bold bg-white/10' : 'text-white/80 hover:bg-white/5'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#c5a059]" />
                      <span>{loc.areaName} Call Girls</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search profiles or locations..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-md pl-9 pr-3 py-2 text-xs text-[#e0e0e0] placeholder-white/40 focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            <div className="pt-1">
              <a
                href="https://wa.me/918726179837?text=Hi%20Juli%20Club%2C%20I%20want%20to%20book%20a%20Call%20Girl%20Service%20Lucknow%20with%20Cash%20on%20Delivery."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 py-3 bg-[#25D366] hover:bg-[#22c35e] text-white rounded-md text-xs font-bold uppercase tracking-wider shadow-lg shadow-green-950/40 active:scale-95 transition-all"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
                <span>WhatsApp Us Directly</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};



