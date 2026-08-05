import React from 'react';
import { useCMS } from '../../context/CMSContext';
import {
  Users,
  MapPin,
  Star,
  HelpCircle,
  ShieldCheck,
  Server,
  ArrowUpRight,
  Activity,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface DashboardModuleProps {
  onNavigateTab: (tab: string) => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({ onNavigateTab }) => {
  const { cmsData } = useCMS();

  const activeProfilesCount = cmsData.profiles.length;
  const locationPagesCount = Object.keys(cmsData.locations).length;
  const reviewsCount = cmsData.reviews.length;
  const faqCount = cmsData.faqs.length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#141414] via-[#1a1712] to-[#141414] border border-[#c5a059]/30 rounded-xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c5a059]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#c5a059]/10 border border-[#c5a059]/30 rounded-full text-[11px] font-bold text-[#c5a059] uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Juli Club Custom CMS Engine v2.0</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif text-white">
              Lucknow Site Control Center
            </h1>
            <p className="text-sm text-white/60 font-sans leading-relaxed">
              Manage profiles, location landing pages, rate charts, and automated Hostinger CI/CD deployments directly from your secure background admin portal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg text-xs transition-colors border border-white/10"
            >
              <span>Preview Live Site</span>
              <ArrowUpRight className="w-4 h-4 text-[#c5a059]" />
            </a>
            <button
              onClick={() => onNavigateTab('settings')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#c5a059] hover:bg-[#d4b578] text-black font-bold rounded-lg text-xs uppercase tracking-wider shadow-lg transition-colors"
            >
              <span>Security Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div
          onClick={() => onNavigateTab('profiles')}
          className="bg-[#141414] border border-white/10 hover:border-[#c5a059]/40 rounded-xl p-5 cursor-pointer transition-all hover:bg-[#171717] group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Active Profiles</span>
            <div className="p-2.5 bg-[#c5a059]/10 rounded-lg text-[#c5a059] group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-serif text-white font-bold">{activeProfilesCount}</span>
            <span className="text-xs text-emerald-400 font-medium">100% Verified</span>
          </div>
          <p className="text-[11px] text-white/40 mt-2">Companion directory listings</p>
        </div>

        <div
          onClick={() => onNavigateTab('location-pages')}
          className="bg-[#141414] border border-white/10 hover:border-[#c5a059]/40 rounded-xl p-5 cursor-pointer transition-all hover:bg-[#171717] group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Location Pages</span>
            <div className="p-2.5 bg-blue-500/10 rounded-lg text-blue-400 group-hover:scale-110 transition-transform">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-serif text-white font-bold">{locationPagesCount}</span>
            <span className="text-xs text-blue-400 font-medium">SEO Optimized</span>
          </div>
          <p className="text-[11px] text-white/40 mt-2">Lucknow area landing routes</p>
        </div>

        <div
          onClick={() => onNavigateTab('reviews')}
          className="bg-[#141414] border border-white/10 hover:border-[#c5a059]/40 rounded-xl p-5 cursor-pointer transition-all hover:bg-[#171717] group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Client Reviews</span>
            <div className="p-2.5 bg-amber-500/10 rounded-lg text-amber-400 group-hover:scale-110 transition-transform">
              <Star className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-serif text-white font-bold">{reviewsCount}</span>
            <span className="text-xs text-amber-400 font-medium">4.9 / 5.0 Rating</span>
          </div>
          <p className="text-[11px] text-white/40 mt-2">Testimonials & Ratings</p>
        </div>

        <div
          onClick={() => onNavigateTab('faq')}
          className="bg-[#141414] border border-white/10 hover:border-[#c5a059]/40 rounded-xl p-5 cursor-pointer transition-all hover:bg-[#171717] group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-white/50 uppercase tracking-wider">FAQs</span>
            <div className="p-2.5 bg-purple-500/10 rounded-lg text-purple-400 group-hover:scale-110 transition-transform">
              <HelpCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-serif text-white font-bold">{faqCount}</span>
            <span className="text-xs text-purple-400 font-medium">Schema Ready</span>
          </div>
          <p className="text-[11px] text-white/40 mt-2">Structured Search Answers</p>
        </div>
      </div>

      {/* CI/CD & Deployment Status Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#141414] border border-white/10 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-medium text-white">Hostinger Automated Deployment Pipeline</h3>
                <p className="text-xs text-white/50">GitHub Actions CI/CD to Hostinger server</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Active Sync
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-[#1a1a1a] p-3.5 rounded-lg border border-white/5 space-y-1">
              <span className="text-white/40 block text-[11px]">FTP Target Directory</span>
              <span className="font-mono text-[#c5a059] font-medium font-bold text-xs">./lucknow/</span>
            </div>
            <div className="bg-[#1a1a1a] p-3.5 rounded-lg border border-white/5 space-y-1">
              <span className="text-white/40 block text-[11px]">GitHub Action Workflow</span>
              <span className="font-mono text-emerald-400 font-medium text-xs">.github/workflows/deploy.yml</span>
            </div>
          </div>

          <p className="text-xs text-white/60 leading-relaxed pt-2">
            Every code or configuration update saved in AI Studio or pushed to the GitHub repository automatically compiles clean Vite assets and mirrors the bundle straight to your Hostinger server target folder.
          </p>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-[#141414] border border-white/10 rounded-xl p-6 space-y-4">
          <h3 className="text-base font-medium text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#c5a059]" />
            Quick CMS Actions
          </h3>

          <div className="space-y-2.5">
            <button
              onClick={() => onNavigateTab('profiles')}
              className="w-full flex items-center justify-between p-3 bg-[#1c1c1c] hover:bg-[#252525] border border-white/5 hover:border-white/15 rounded-lg text-xs text-white font-medium transition-colors text-left"
            >
              <span>Manage Companion Directory</span>
              <ArrowUpRight className="w-4 h-4 text-white/40" />
            </button>

            <button
              onClick={() => onNavigateTab('location-pages')}
              className="w-full flex items-center justify-between p-3 bg-[#1c1c1c] hover:bg-[#252525] border border-white/5 hover:border-white/15 rounded-lg text-xs text-white font-medium transition-colors text-left"
            >
              <span>Edit Lucknow Area Routes</span>
              <ArrowUpRight className="w-4 h-4 text-white/40" />
            </button>

            <button
              onClick={() => onNavigateTab('settings')}
              className="w-full flex items-center justify-between p-3 bg-[#1c1c1c] hover:bg-[#252525] border border-white/5 hover:border-white/15 rounded-lg text-xs text-white font-medium transition-colors text-left"
            >
              <span>Update Security Passcode</span>
              <ArrowUpRight className="w-4 h-4 text-[#c5a059]" />
            </button>

            <button
              onClick={() => onNavigateTab('system')}
              className="w-full flex items-center justify-between p-3 bg-[#1c1c1c] hover:bg-[#252525] border border-white/5 hover:border-white/15 rounded-lg text-xs text-white font-medium transition-colors text-left"
            >
              <span>View System & Cache Logs</span>
              <RefreshCw className="w-4 h-4 text-white/40" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
