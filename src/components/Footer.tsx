import React from 'react';
import { SERVICE_TAGS } from '../data/mockData';
import { Phone, ShieldCheck, Sparkles, MapPin } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

interface FooterProps {
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking }) => {
  return (
    <footer className="bg-[#0a0a0a] text-white/70 border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Footer Callout */}
        <div className="bg-[#0f0f0f] p-6 rounded border border-[#c5a059]/30 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl font-serif text-[#e0e0e0]">
              Ready for an Unforgettable Experience in Lucknow?
            </h3>
            <p className="text-xs text-white/60 font-sans">
              No Advance Payment • 100% Cash on Delivery • Free Driver Pickup & Drop in 30 Mins.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/918726179837?text=Hi%20Juli%20Club%2C%20I%20want%20to%20book%20a%20Call%20Girl%20Service%20Lucknow%20with%20Cash%20on%20Delivery."
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-sm text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
              WhatsApp Us
            </a>

            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 bg-[#c5a059] hover:bg-[#d4b578] text-black font-bold rounded-sm text-xs uppercase tracking-widest shadow-lg transition-colors"
            >
              Book Now
            </button>
          </div>
        </div>

        {/* Tag Cloud */}
        <div className="space-y-3 border-b border-white/5 pb-8 font-sans">
          <h4 className="text-[10px] font-bold uppercase text-[#c5a059] tracking-[0.2em] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Popular Lucknow Companion Tags
          </h4>
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            {SERVICE_TAGS.map((tag, idx) => (
              <span
                key={idx}
                className="bg-[#0f0f0f] border border-white/5 text-white/60 hover:text-[#c5a059] px-2.5 py-1 rounded cursor-pointer transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Main Footer Links & Admin Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs font-sans">
          {/* Col 1: Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-sm bg-[#c5a059] flex items-center justify-center text-black font-bold">
                J
              </div>
              <span className="font-serif text-lg text-[#e0e0e0]">JULI CLUB LUCKNOW</span>
            </div>
            <p className="text-white/50 leading-relaxed text-[11px]">
              Exclusive Independent Lucknow Call Girl Service offering verified companion profiles, 5-star hotel outcalls, body-to-body massages, and romantic dates in Lucknow.
            </p>
            <div className="text-[11px] text-[#c5a059] font-medium tracking-wide">
              100% Cash On Delivery • 0 Advance Payment
            </div>
          </div>

          {/* Col 2: Top Locations */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-[#e0e0e0] uppercase tracking-[0.2em]">Top Lucknow Areas</h4>
            <ul className="space-y-1.5 text-white/50 text-[11px]">
              <li className="hover:text-[#c5a059] cursor-pointer">Gomti Nagar Call Girls</li>
              <li className="hover:text-[#c5a059] cursor-pointer">Hazratganj Luxury Companions</li>
              <li className="hover:text-[#c5a059] cursor-pointer">Alambagh Escort Services</li>
              <li className="hover:text-[#c5a059] cursor-pointer">Indira Nagar Housewife Escorts</li>
              <li className="hover:text-[#c5a059] cursor-pointer">Mahanagar Russian Models</li>
              <li className="hover:text-[#c5a059] cursor-pointer">Sushant Golf City Escorts</li>
            </ul>
          </div>

          {/* Col 3: Quick Site Nav */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-[#e0e0e0] uppercase tracking-[0.2em]">Site Navigation</h4>
            <ul className="space-y-1.5 text-white/50 text-[11px]">
              <li className="hover:text-[#c5a059] cursor-pointer">Home</li>
              <li className="hover:text-[#c5a059] cursor-pointer">Rate Chart With Name & Number</li>
              <li className="hover:text-[#c5a059] cursor-pointer">Independent Lucknow Escorts</li>
              <li className="hover:text-[#c5a059] cursor-pointer">Russian Escort Agency</li>
              <li className="hover:text-[#c5a059] cursor-pointer">Privacy Policy</li>
              <li className="hover:text-[#c5a059] cursor-pointer">Terms and Conditions</li>
              <li className="hover:text-[#c5a059] cursor-pointer">About Us</li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="border-t border-white/5 pt-6 text-center text-[10px] text-white/40 font-sans space-y-2">
          <p>
            Disclaimer: This site is intended solely for consenting adults over 18 years of age. All companion profiles are independent contractors. All meetings are 100% voluntary with total privacy and cash on delivery payment.
          </p>
          <p className="text-white/60 font-medium">
            © 2026 Juli Club - Call Girl Service Lucknow. All Rights Reserved. Administration Mail: ramanarora7869@gmail.com
          </p>
        </div>
      </div>
    </footer>
  );
};

