import React, { useState } from 'react';
import { COMPANION_PROFILES } from '../data/mockData';
import { Phone, CheckCircle2, Search, Table, Sparkles } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

interface RateChartTableProps {
  onSelectCompanion: (profileId: string) => void;
}

export const RateChartTable: React.FC<RateChartTableProps> = ({ onSelectCompanion }) => {
  const [filterText, setFilterText] = useState('');

  const filtered = COMPANION_PROFILES.filter(
    (p) =>
      p.name.toLowerCase().includes(filterText.toLowerCase()) ||
      p.category.toLowerCase().includes(filterText.toLowerCase()) ||
      p.location.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <section id="rate-chart" className="py-16 bg-[#0a0a0a] text-[#e0e0e0] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#c5a059] text-[10px] font-bold uppercase tracking-[0.2em]">
            <Table className="w-3.5 h-3.5" /> Pricing Transparency
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif text-[#e0e0e0]">
            Lucknow Call Girls Rate Chart With Name And Number
          </h2>
          <p className="text-xs sm:text-sm text-white/60 font-sans">
            Compare rates for 2-hour short time & 8-hour full night stays in Lucknow. 100% Cash on delivery with free pickup.
          </p>
        </div>

        {/* Filter Input */}
        <div className="max-w-md mx-auto relative">
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter rate chart by name, category or area..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/10 rounded pl-9 pr-3 py-2 text-xs text-[#e0e0e0] placeholder-white/30 focus:outline-none focus:border-[#c5a059]"
          />
        </div>

        {/* Responsive Table */}
        <div className="bg-[#0f0f0f] border border-white/10 rounded overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#1a1a1a] text-[#c5a059] font-bold border-b border-white/10 uppercase tracking-[0.2em] text-[9px]">
                  <th className="p-4">Companion Name & Info</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Lucknow Area</th>
                  <th className="p-4">Short Time (2h)</th>
                  <th className="p-4">Full Night (8h)</th>
                  <th className="p-4">Verified Status</th>
                  <th className="p-4 text-right">Quick Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {filtered.map((profile) => (
                  <tr key={profile.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={profile.image}
                          alt={profile.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded object-cover border border-white/10"
                        />
                        <div>
                          <button
                            onClick={() => onSelectCompanion(profile.id)}
                            className="font-serif font-bold text-[#e0e0e0] hover:text-[#c5a059] transition-colors text-sm text-left"
                          >
                            {profile.name}
                          </button>
                          <span className="text-[10px] text-white/50 block">{profile.age} yrs • {profile.height}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-[#1a1a1a] text-[#c5a059] border border-[#c5a059]/30 text-[10px] font-bold uppercase tracking-wider">
                        {profile.category}
                      </span>
                    </td>

                    <td className="p-4 text-white/70 font-medium">{profile.location}</td>

                    <td className="p-4">
                      <span className="text-[#c5a059] font-bold italic text-sm">₹{profile.rateShort.toLocaleString()}</span>
                    </td>

                    <td className="p-4">
                      <span className="text-[#c5a059] font-bold italic text-sm">₹{profile.rateFull.toLocaleString()}</span>
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-[9px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 font-bold uppercase tracking-wider">
                        <CheckCircle2 className="w-3 h-3" /> Genuine
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end">
                        <a
                          href={`https://wa.me/${profile.whatsapp}?text=Hi%20Juli%20Club%2C%20I%20want%20to%20book%20${encodeURIComponent(
                            profile.name
                          )}%20from%20the%20Lucknow%20rate%20chart.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                          title="WhatsApp Booking"
                        >
                          <WhatsAppIcon className="w-3.5 h-3.5 fill-current shrink-0" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

