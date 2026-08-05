import React from 'react';
import { Layers, ShieldCheck, Wrench, Sparkles, CheckCircle2 } from 'lucide-react';

interface PlaceholderModuleProps {
  title: string;
  description: string;
  category: string;
  icon?: React.ReactNode;
}

export const PlaceholderModule: React.FC<PlaceholderModuleProps> = ({
  title,
  description,
  category,
  icon
}) => {
  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-[#141414] border border-white/10 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/20 rounded-xl">
            {icon || <Layers className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#c5a059] uppercase tracking-wider bg-[#c5a059]/10 px-2 py-0.5 rounded">
                CMS Sub-Module
              </span>
              <span className="text-[10px] text-white/40 uppercase tracking-wider font-mono">
                {category}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif text-white mt-1 font-medium">{title}</h1>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          <span>Module Route Prepared</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-[#141414] border border-white/10 rounded-xl p-8 sm:p-12 text-center space-y-6 max-w-3xl mx-auto shadow-2xl">
        <div className="w-16 h-16 bg-[#1a1712] border border-[#c5a059]/30 rounded-2xl flex items-center justify-center mx-auto text-[#c5a059] shadow-inner">
          <Wrench className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-serif text-white">{title} Control Hub</h2>
          <p className="text-sm text-white/60 max-w-md mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        <div className="bg-[#1a1a1a] border border-white/5 rounded-lg p-4 max-w-md mx-auto text-left space-y-3">
          <div className="flex items-center gap-2 text-xs text-[#c5a059] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Architecture Status</span>
          </div>
          <ul className="text-xs text-white/70 space-y-2 font-mono">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Protected route handler linked
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Modular layout container ready
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              Awaiting CMS data editor expansion
            </li>
          </ul>
        </div>

        <div className="pt-2">
          <span className="text-xs text-white/40 font-mono">
            Juli Club Lucknow CMS Architecture • Ready for Module Standard Integration
          </span>
        </div>
      </div>
    </div>
  );
};
