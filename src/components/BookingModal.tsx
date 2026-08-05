import React, { useState } from 'react';
import { CompanionProfile, BookingForm } from '../types';
import { COMPANION_PROFILES, LUCKNOW_AREAS } from '../data/mockData';
import { X, CheckCircle2, ShieldCheck, Truck, Clock, Phone, Calendar, MapPin, User, Sparkles } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

interface BookingModalProps {
  initialProfile?: CompanionProfile | null;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ initialProfile, onClose }) => {
  const [formData, setFormData] = useState<BookingForm>({
    profileId: initialProfile?.id || COMPANION_PROFILES[0].id,
    profileName: initialProfile?.name || COMPANION_PROFILES[0].name,
    clientName: '',
    clientPhone: '',
    selectedCity: 'Lucknow',
    selectedArea: initialProfile?.location || 'Gomti Nagar',
    hotelOrAddress: '',
    duration: '2 Hours',
    pickupRequired: true,
    specialInstructions: '',
    paymentMode: 'Cash on Delivery (0 Advance)',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const selectedCompanion = COMPANION_PROFILES.find((p) => p.id === formData.profileId) || COMPANION_PROFILES[0];

  const calculateCost = () => {
    switch (formData.duration) {
      case '2 Hours':
        return selectedCompanion.rateShort;
      case '4 Hours':
        return selectedCompanion.rateShort + 2000;
      case 'Full Night (8 Hours)':
        return selectedCompanion.rateFull;
      case '24 Hours VIP':
        return selectedCompanion.rateFull * 2;
      default:
        return selectedCompanion.rateShort;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = 'LKO-LXB-' + Math.floor(100000 + Math.random() * 900000);
    setTicketId(generatedId);
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#0f0f0f] border border-white/10 rounded overflow-hidden text-[#e0e0e0] my-8 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/80 hover:bg-white/10 text-white/70 hover:text-white rounded-full border border-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border-b border-white/10 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c5a059] bg-[#c5a059]/10 px-2 py-0.5 rounded border border-[#c5a059]/30">
                100% Cash on Delivery
              </span>
              <h3 className="text-xl font-serif text-[#e0e0e0] mt-1">
                Book Call Girl in Lucknow (Zero Advance)
              </h3>
              <p className="text-xs text-white/60">
                Fill details below. Pay only cash after your companion arrives. Free cab pickup included.
              </p>
            </div>

            {/* Select Companion */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#c5a059] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" /> Select Companion:
              </label>
              <select
                value={formData.profileId}
                onChange={(e) => {
                  const comp = COMPANION_PROFILES.find((p) => p.id === e.target.value);
                  if (comp) {
                    setFormData({
                      ...formData,
                      profileId: comp.id,
                      profileName: comp.name,
                      selectedArea: comp.location,
                    });
                  }
                }}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded px-3 py-2 text-xs text-[#c5a059] focus:outline-none focus:border-[#c5a059] font-semibold"
              >
                {COMPANION_PROFILES.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#0f0f0f] text-[#e0e0e0]">
                    {p.name} ({p.category} - {p.location}) - ₹{p.rateShort.toLocaleString()} / 2h
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Companion Preview Card */}
            <div className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded border border-white/5">
              <img
                src={selectedCompanion.image}
                alt=""
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded object-cover"
              />
              <div className="text-xs">
                <span className="font-serif text-[#e0e0e0] font-bold block text-sm">{selectedCompanion.name}</span>
                <span className="text-[#c5a059] text-[10px] uppercase tracking-wider block">{selectedCompanion.title}</span>
                <span className="text-white/50 text-[10px]">Area: {selectedCompanion.location}, Lucknow</span>
              </div>
            </div>

            {/* Two Column Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/60 block mb-1">
                  Your Name / Alias:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded pl-9 pr-3 py-2 text-xs text-[#e0e0e0] placeholder-white/30 focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/60 block mb-1">
                  Phone Number:
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded pl-9 pr-3 py-2 text-xs text-[#e0e0e0] placeholder-white/30 focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/60 block mb-1">
                  Lucknow Area:
                </label>
                <select
                  value={formData.selectedArea}
                  onChange={(e) => setFormData({ ...formData, selectedArea: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded px-3 py-2 text-xs text-[#e0e0e0] focus:outline-none focus:border-[#c5a059]"
                >
                  {LUCKNOW_AREAS.filter((a) => a !== 'All Lucknow').map((area) => (
                    <option key={area} value={area} className="bg-[#0f0f0f]">
                      {area}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/60 block mb-1">
                  Duration:
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration: e.target.value as any,
                    })
                  }
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded px-3 py-2 text-xs text-[#c5a059] font-bold focus:outline-none focus:border-[#c5a059]"
                >
                  <option value="2 Hours" className="bg-[#0f0f0f] text-[#e0e0e0]">2 Hours (Short Time)</option>
                  <option value="4 Hours" className="bg-[#0f0f0f] text-[#e0e0e0]">4 Hours (Half Night)</option>
                  <option value="Full Night (8 Hours)" className="bg-[#0f0f0f] text-[#e0e0e0]">Full Night (8 Hours)</option>
                  <option value="24 Hours VIP" className="bg-[#0f0f0f] text-[#e0e0e0]">24 Hours VIP Companion</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/60 block mb-1">
                Hotel Name or Address in Lucknow:
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g., Hyatt Regency / Taj Mahal Hotel Gomti Nagar"
                  value={formData.hotelOrAddress}
                  onChange={(e) => setFormData({ ...formData, hotelOrAddress: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded pl-9 pr-3 py-2 text-xs text-[#e0e0e0] placeholder-white/30 focus:outline-none focus:border-[#c5a059]"
                />
              </div>
            </div>

            {/* Pickup & Drop Checkbox */}
            <div className="flex items-center gap-2 p-2.5 bg-[#1a1a1a] rounded border border-white/5">
              <input
                type="checkbox"
                id="pickupReq"
                checked={formData.pickupRequired}
                onChange={(e) => setFormData({ ...formData, pickupRequired: e.target.checked })}
                className="w-4 h-4 accent-[#c5a059] rounded cursor-pointer"
              />
              <label htmlFor="pickupReq" className="text-xs text-white/80 cursor-pointer flex items-center gap-1.5 font-medium">
                <Truck className="w-4 h-4 text-[#c5a059]" />
                Require Free Private Driver Pickup & Drop to Hotel
              </label>
            </div>

            {/* Total Price Summary */}
            <div className="bg-[#1a1a1a] p-3.5 rounded border border-[#c5a059]/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-white/50 uppercase font-bold tracking-wider block">Estimated Total Cost</span>
                <span className="text-xl font-bold italic text-[#c5a059]">₹{calculateCost().toLocaleString()}</span>
              </div>
              <div className="text-right">
                <span className="inline-block px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                  Cash On Delivery (₹0 Advance)
                </span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 bg-[#c5a059] hover:bg-[#d4b578] text-black font-bold rounded-sm text-xs uppercase tracking-widest transition-colors shadow-lg"
            >
              Confirm 0-Advance Booking
            </button>
          </form>
        ) : (
          /* Confirmation Success Ticket */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-[#c5a059] tracking-widest bg-[#c5a059]/10 px-2.5 py-1 rounded border border-[#c5a059]/30">
                Booking Reference: {ticketId}
              </span>
              <h3 className="text-2xl font-serif text-[#e0e0e0] mt-2">
                Booking Request Confirmed!
              </h3>
              <p className="text-xs text-white/70 mt-1 max-w-sm mx-auto">
                Thank you <strong className="text-[#c5a059]">{formData.clientName}</strong>. Our manager is dispatching <strong className="text-[#c5a059]">{formData.profileName}</strong> to {formData.hotelOrAddress} ({formData.selectedArea}, Lucknow).
              </p>
            </div>

            <div className="bg-[#1a1a1a] p-4 rounded border border-white/5 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-white/50">Companion:</span>
                <span className="font-serif text-[#c5a059] font-bold">{formData.profileName}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-white/50">Duration:</span>
                <span className="font-bold text-[#e0e0e0]">{formData.duration}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-white/50">Estimated Arrival:</span>
                <span className="font-bold text-emerald-400">35 - 45 Minutes</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-white/50">Amount Payable:</span>
                <span className="font-bold italic text-[#c5a059] text-sm">₹{calculateCost().toLocaleString()} (Cash)</span>
              </div>
            </div>

            <div className="p-3 bg-[#c5a059]/10 border border-[#c5a059]/30 rounded text-xs text-[#c5a059] flex items-center gap-2 text-left">
              <ShieldCheck className="w-5 h-5 text-[#c5a059] shrink-0" />
              <span>
                <strong>Zero Advance Guarantee:</strong> Do not pay anything online. Pay cash directly to the companion upon arrival.
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <a
                href={`https://wa.me/918726179837?text=Hi%20Juli%20Club%2C%20I%20just%20submitted%20booking%20ticket%20${ticketId}%20for%20${encodeURIComponent(
                  formData.profileName
                )}%20at%20${encodeURIComponent(formData.hotelOrAddress)}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-sm text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
                WhatsApp Confirmation
              </a>

              <button
                onClick={onClose}
                className="py-3 px-4 bg-white/10 hover:bg-white/20 text-[#e0e0e0] font-bold uppercase tracking-wider rounded-sm text-xs border border-white/10"
              >
                Close Window
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

