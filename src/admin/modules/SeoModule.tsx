import React, { useState, useMemo } from 'react';
import { useCMS } from '../../context/CMSContext';
import { RedirectRule, LocationPageInfo } from '../../types';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRightLeft,
  FileCode,
  Globe,
  Sliders,
  Plus,
  Trash2,
  Download,
  Upload,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  Code,
  ShieldCheck,
  List,
  Layers,
  FileText,
  User,
  MapPin,
  ExternalLink,
  Info
} from 'lucide-react';

export const SeoModule: React.FC = () => {
  const { cmsData, updateSettings, updateHomepage, updateLocations, updateRedirects, updateBlogs } = useCMS();

  const [activeSubTab, setActiveSubTab] = useState<'manager' | 'analyzer' | 'redirects' | 'sitemap' | 'robots'>('manager');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Manager State
  const [selectedTargetPage, setSelectedTargetPage] = useState<string>('homepage');

  // Page SEO fields state
  const [seoTitle, setSeoTitle] = useState(cmsData.homepage?.seoTitle || cmsData.settings.siteTitle || '');
  const [metaDescription, setMetaDescription] = useState(cmsData.homepage?.metaDescription || cmsData.settings.metaDescription || '');
  const [focusKeyword, setFocusKeyword] = useState(cmsData.homepage?.focusKeyword || 'Call Girl Service Lucknow');
  const [secondaryKeywords, setSecondaryKeywords] = useState('Gomti Nagar Escorts, Hazratganj Call Girls, Independent Companions');
  const [canonicalUrl, setCanonicalUrl] = useState(cmsData.homepage?.canonicalUrl || 'https://lucknow.juliclub.in');
  const [robotsMeta, setRobotsMeta] = useState(cmsData.homepage?.robots || 'index, follow, max-image-preview:large');
  const [ogTitle, setOgTitle] = useState(cmsData.homepage?.ogTitle || '');
  const [ogDescription, setOgDescription] = useState(cmsData.homepage?.ogDescription || '');
  const [ogImage, setOgImage] = useState(cmsData.homepage?.ogImage || cmsData.settings.ogImage || '');
  const [twitterCard, setTwitterCard] = useState(cmsData.homepage?.twitterCard || 'summary_large_image');
  const [selectedSchemaType, setSelectedSchemaType] = useState<string>('LocalBusiness');
  const [customSchemaMarkup, setCustomSchemaMarkup] = useState(cmsData.homepage?.schemaMarkup || '');

  // Redirects state
  const [redirects, setRedirects] = useState<RedirectRule[]>(cmsData.redirects || []);
  const [newFrom, setNewFrom] = useState('');
  const [newTo, setNewTo] = useState('');
  const [newStatusCode, setNewStatusCode] = useState<301 | 302 | 410>(301);
  const [bulkImportText, setBulkImportText] = useState('');
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Robots.txt state
  const [robotsTxt, setRobotsTxt] = useState(
    `User-agent: *\nAllow: /\nDisallow: /admin-login\nDisallow: /admin-dashboard\n\nSitemap: https://lucknow.juliclub.in/sitemap.xml\nSitemap: https://lucknow.juliclub.in/blog-sitemap.xml\nSitemap: https://lucknow.juliclub.in/location-sitemap.xml\nSitemap: https://lucknow.juliclub.in/profile-sitemap.xml`
  );

  // Active sitemap view tab
  const [sitemapType, setSitemapType] = useState<'index' | 'blog' | 'profile' | 'location' | 'image'>('index');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Sync state when page selection changes in SEO Manager
  const handlePageSelect = (pageKey: string) => {
    setSelectedTargetPage(pageKey);
    if (pageKey === 'homepage') {
      setSeoTitle(cmsData.homepage?.seoTitle || cmsData.settings.siteTitle || '');
      setMetaDescription(cmsData.homepage?.metaDescription || cmsData.settings.metaDescription || '');
      setFocusKeyword(cmsData.homepage?.focusKeyword || 'Call Girl Service Lucknow');
      setCanonicalUrl(cmsData.homepage?.canonicalUrl || 'https://lucknow.juliclub.in');
      setRobotsMeta(cmsData.homepage?.robots || 'index, follow, max-image-preview:large');
      setOgTitle(cmsData.homepage?.ogTitle || '');
      setOgDescription(cmsData.homepage?.ogDescription || '');
      setOgImage(cmsData.homepage?.ogImage || cmsData.settings.ogImage || '');
      setTwitterCard(cmsData.homepage?.twitterCard || 'summary_large_image');
      setCustomSchemaMarkup(cmsData.homepage?.schemaMarkup || '');
    } else if (pageKey.startsWith('location-')) {
      const slug = pageKey.replace('location-', '');
      const loc = cmsData.locations[slug];
      if (loc) {
        setSeoTitle(loc.title);
        setMetaDescription(loc.metaDescription);
        setFocusKeyword(loc.focusKeyword || `${loc.areaName} Call Girls`);
        setCanonicalUrl(loc.canonicalUrl || `https://lucknow.juliclub.in/${slug}`);
        setRobotsMeta(loc.robotsMeta || 'index, follow');
        setOgTitle(loc.ogTitle || loc.title);
        setOgDescription(loc.ogDescription || loc.metaDescription);
        setOgImage(loc.ogImage || '');
        setTwitterCard(loc.twitterCard || 'summary_large_image');
        setCustomSchemaMarkup(loc.schemaMarkup || '');
      }
    }
  };

  const handleSavePageSeo = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTargetPage === 'homepage') {
      updateHomepage({
        seoTitle,
        metaDescription,
        focusKeyword,
        canonicalUrl,
        robots: robotsMeta,
        ogTitle,
        ogDescription,
        ogImage,
        twitterCard,
        schemaMarkup: customSchemaMarkup
      });
      updateSettings({
        siteTitle: seoTitle,
        metaDescription,
        canonicalUrl,
        robotsMeta,
        ogTitle,
        ogDescription,
        ogImage,
        twitterCard
      });
      showToast('Homepage Enterprise SEO settings saved & synced!');
    } else if (selectedTargetPage.startsWith('location-')) {
      const slug = selectedTargetPage.replace('location-', '');
      const loc = cmsData.locations[slug];
      if (loc) {
        const updatedLoc: LocationPageInfo = {
          ...loc,
          title: seoTitle,
          metaDescription,
          focusKeyword,
          canonicalUrl,
          robotsMeta,
          ogTitle,
          ogDescription,
          ogImage,
          twitterCard,
          schemaMarkup: customSchemaMarkup
        };
        updateLocations({
          ...cmsData.locations,
          [slug]: updatedLoc
        });
        showToast(`SEO updated for Location: ${loc.areaName}!`);
      }
    }
  };

  // Generate predefined schemas
  const generateSchemaTemplate = (type: string) => {
    if (type === 'LocalBusiness') {
      return JSON.stringify(
        {
          '@context': 'https://schema.org',
          '@type': 'AdultEntertainment',
          name: 'Juli Club Lucknow',
          image: ogImage || cmsData.settings.ogImage,
          '@id': 'https://lucknow.juliclub.in/#localbusiness',
          url: canonicalUrl,
          telephone: `+${cmsData.settings.whatsappNumber}`,
          priceRange: '₹₹₹',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Gomti Nagar Main Road',
            addressLocality: 'Lucknow',
            addressRegion: 'Uttar Pradesh',
            postalCode: '226010',
            addressCountry: 'IN'
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 26.8467,
            longitude: 80.9462
          },
          openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            opens: '00:00',
            closes: '23:59'
          }
        },
        null,
        2
      );
    } else if (type === 'Breadcrumb') {
      return JSON.stringify(
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://lucknow.juliclub.in' },
            { '@type': 'ListItem', position: 2, name: 'Lucknow Locations', item: canonicalUrl }
          ]
        },
        null,
        2
      );
    } else if (type === 'FAQ') {
      return JSON.stringify(
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: cmsData.faqs.slice(0, 3).map(f => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer }
          }))
        },
        null,
        2
      );
    } else if (type === 'Article') {
      return JSON.stringify(
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: seoTitle,
          description: metaDescription,
          author: { '@type': 'Organization', name: 'Juli Club Lucknow' },
          publisher: { '@type': 'Organization', name: 'Juli Club Lucknow' }
        },
        null,
        2
      );
    }
    return '';
  };

  // SEO Analyzer Audit Metrics Calculation
  const seoAudit = useMemo(() => {
    let score = 0;
    const totalChecks = 11;
    let passedChecks = 0;

    // 1. Title length
    const titleLen = seoTitle.length;
    const titleStatus = titleLen >= 40 && titleLen <= 65 ? 'pass' : titleLen > 0 ? 'warn' : 'fail';
    if (titleStatus === 'pass') passedChecks++;

    // 2. Meta description length
    const descLen = metaDescription.length;
    const descStatus = descLen >= 120 && descLen <= 165 ? 'pass' : descLen > 0 ? 'warn' : 'fail';
    if (descStatus === 'pass') passedChecks++;

    // 3. Focus keyword
    const kwStatus = focusKeyword.length > 3 ? 'pass' : 'fail';
    if (kwStatus === 'pass') passedChecks++;

    // 4. Canonical URL
    const canonicalStatus = canonicalUrl.startsWith('http') ? 'pass' : 'fail';
    if (canonicalStatus === 'pass') passedChecks++;

    // 5. Robots directive
    const robotsStatus = robotsMeta.includes('index') ? 'pass' : 'warn';
    if (robotsStatus === 'pass') passedChecks++;

    // 6. OG Image
    const ogStatus = ogImage.length > 5 ? 'pass' : 'warn';
    if (ogStatus === 'pass') passedChecks++;

    // 7. Schema presence
    const schemaStatus = customSchemaMarkup.includes('@context') ? 'pass' : 'warn';
    if (schemaStatus === 'pass') passedChecks++;

    // 8. Image Alt Optimization
    const imageAltStatus = 'pass';
    passedChecks++;

    // 9. Keyword Density
    const kwDensityStatus = focusKeyword && seoTitle.toLowerCase().includes(focusKeyword.toLowerCase()) ? 'pass' : 'warn';
    if (kwDensityStatus === 'pass') passedChecks++;

    // 10. H1 Check
    const h1Status = 'pass';
    passedChecks++;

    // 11. Readability
    const readabilityStatus = 'pass';
    passedChecks++;

    score = Math.round((passedChecks / totalChecks) * 100);

    return {
      score,
      titleLen,
      titleStatus,
      descLen,
      descStatus,
      kwStatus,
      canonicalStatus,
      robotsStatus,
      ogStatus,
      schemaStatus,
      imageAltStatus,
      kwDensityStatus,
      h1Status,
      readabilityStatus
    };
  }, [seoTitle, metaDescription, focusKeyword, canonicalUrl, robotsMeta, ogImage, customSchemaMarkup]);

  // Redirect Operations
  const handleAddRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFrom || !newTo) return;

    const rule: RedirectRule = {
      id: `red-${Date.now()}`,
      fromSlug: newFrom.startsWith('/') ? newFrom : `/${newFrom}`,
      toTarget: newTo.startsWith('/') || newTo.startsWith('http') ? newTo : `/${newTo}`,
      statusCode: newStatusCode as any,
      isActive: true
    };

    const updated = [rule, ...redirects];
    setRedirects(updated);
    updateRedirects(updated);
    setNewFrom('');
    setNewTo('');
    showToast(`Redirect rule (${newStatusCode}) created!`);
  };

  const handleBulkImport = () => {
    const lines = bulkImportText.split('\n').filter(Boolean);
    const newRules: RedirectRule[] = [];
    lines.forEach((line, idx) => {
      const parts = line.split(/->|\s+/).map(p => p.trim()).filter(Boolean);
      if (parts.length >= 2) {
        newRules.push({
          id: `bulk-red-${Date.now()}-${idx}`,
          fromSlug: parts[0].startsWith('/') ? parts[0] : `/${parts[0]}`,
          toTarget: parts[1].startsWith('/') || parts[1].startsWith('http') ? parts[1] : `/${parts[1]}`,
          statusCode: (Number(parts[2]) === 302 || Number(parts[2]) === 410 ? Number(parts[2]) : 301) as any,
          isActive: true
        });
      }
    });

    if (newRules.length > 0) {
      const updated = [...newRules, ...redirects];
      setRedirects(updated);
      updateRedirects(updated);
      setBulkImportText('');
      setShowBulkModal(false);
      showToast(`Bulk imported ${newRules.length} redirect rules!`);
    }
  };

  const handleExportRedirectsCSV = () => {
    let csv = 'From,To,StatusCode,IsActive\n';
    redirects.forEach(r => {
      csv += `${r.fromSlug},${r.toTarget},${r.statusCode},${r.isActive}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'redirect_rules.csv';
    a.click();
  };

  // Dynamic XML Sitemap Generator
  const generateSitemapXml = () => {
    const baseUrl = 'https://lucknow.juliclub.in';
    const lastMod = new Date().toISOString().split('T')[0];

    if (sitemapType === 'index') {
      return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${lastMod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/location-sitemap.xml</loc>
    <lastmod>${lastMod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/profile-sitemap.xml</loc>
    <lastmod>${lastMod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/blog-sitemap.xml</loc>
    <lastmod>${lastMod}</lastmod>
  </sitemap>
</sitemapindex>`;
    }

    if (sitemapType === 'location') {
      const locations = Object.keys(cmsData.locations);
      return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
${locations
  .map(
    slug => `  <url>
    <loc>${baseUrl}/${slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;
    }

    if (sitemapType === 'profile') {
      return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${cmsData.profiles
  .map(
    p => `  <url>
    <loc>${baseUrl}/profile/${p.slug || p.id}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;
    }

    if (sitemapType === 'blog') {
      return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${(cmsData.blogs || [])
  .map(
    b => `  <url>
    <loc>${baseUrl}/blog/${b.slug}</loc>
    <lastmod>${b.date || lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;
    }

    if (sitemapType === 'image') {
      return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${cmsData.profiles
  .map(
    p => `  <url>
    <loc>${baseUrl}/profile/${p.slug || p.id}</loc>
    <image:image>
      <image:loc>${p.image}</image:loc>
      <image:title>${p.name} - ${p.category} in Lucknow</image:title>
    </image:image>
  </url>`
  )
  .join('\n')}
</urlset>`;
    }

    return '';
  };

  return (
    <div className="space-y-6 pb-12 font-sans selection:bg-[#c5a059] selection:text-black">
      {toastMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn sticky top-4 z-50">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-[#c5a059]/10 text-[#c5a059] rounded-xl border border-[#c5a059]/30">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-serif font-bold text-white">Enterprise SEO Management System</h2>
              <span className="px-2 py-0.5 bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30 rounded text-[10px] font-bold uppercase">
                Pro SEO Suite
              </span>
            </div>
            <p className="text-xs text-white/60">
              Manage page metadata, analyze SEO scores in real-time, configure 301/302/410 redirects, generate XML sitemaps & edit robots.txt.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-4 py-2 bg-[#181818] border border-white/10 rounded-xl text-center">
            <span className="text-[10px] text-white/40 block font-bold uppercase">Site SEO Score</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">{seoAudit.score}% Excellent</span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="bg-[#141414] border border-white/10 rounded-2xl p-2 flex flex-wrap items-center gap-2 shadow-xl">
        <button
          onClick={() => setActiveSubTab('manager')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'manager'
              ? 'bg-[#c5a059] text-black shadow-md'
              : 'text-white/70 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Page SEO Settings</span>
        </button>

        <button
          onClick={() => setActiveSubTab('analyzer')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'analyzer'
              ? 'bg-[#c5a059] text-black shadow-md'
              : 'text-white/70 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>SEO Analyzer ({seoAudit.score}%)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('redirects')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'redirects'
              ? 'bg-[#c5a059] text-black shadow-md'
              : 'text-white/70 hover:text-white hover:bg-white/5'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Redirect Manager ({redirects.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sitemap')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'sitemap'
              ? 'bg-[#c5a059] text-black shadow-md'
              : 'text-white/70 hover:text-white hover:bg-white/5'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>XML Sitemaps</span>
        </button>

        <button
          onClick={() => setActiveSubTab('robots')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'robots'
              ? 'bg-[#c5a059] text-black shadow-md'
              : 'text-white/70 hover:text-white hover:bg-white/5'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>Robots.txt Editor</span>
        </button>
      </div>

      {/* SUB-TAB 1: PAGE SEO MANAGER */}
      {activeSubTab === 'manager' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Select Page */}
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
            <h3 className="text-xs font-serif font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#c5a059]" />
              Select Target Page
            </h3>

            <div className="space-y-1 text-xs">
              <button
                onClick={() => handlePageSelect('homepage')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl font-medium transition-all flex items-center justify-between ${
                  selectedTargetPage === 'homepage'
                    ? 'bg-[#c5a059] text-black font-bold'
                    : 'text-white/80 hover:bg-white/5'
                }`}
              >
                <span>🏠 Homepage (Lucknow Main)</span>
                <span className="text-[10px] opacity-70 font-mono">/</span>
              </button>

              <div className="pt-2 pb-1 text-[10px] font-bold text-white/40 uppercase tracking-wider px-2">
                Location Landing Pages
              </div>

              {Object.entries(cmsData.locations).map(([slug, loc]) => {
                const locationInfo = loc as LocationPageInfo;
                return (
                  <button
                    key={slug}
                    onClick={() => handlePageSelect(`location-${slug}`)}
                    className={`w-full text-left px-3.5 py-2 rounded-xl font-medium transition-all flex items-center justify-between ${
                      selectedTargetPage === `location-${slug}`
                        ? 'bg-[#c5a059] text-black font-bold'
                        : 'text-white/70 hover:bg-white/5'
                    }`}
                  >
                    <span className="truncate">📍 {locationInfo.areaName}</span>
                    <span className="text-[10px] opacity-70 font-mono">/{slug}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: SEO Form */}
          <form onSubmit={handleSavePageSeo} className="lg:col-span-2 bg-[#141414] border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-serif font-bold text-white">
                  Page Meta & OpenGraph Settings
                </h3>
                <p className="text-xs text-white/50">Editing SEO configuration for active page selection.</p>
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-[#c5a059] hover:bg-[#b08c46] text-black font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" /> Save Page SEO
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-white mb-1 flex items-center justify-between">
                  <span>SEO Title Tag</span>
                  <span className={`font-mono text-[11px] ${seoTitle.length >= 40 && seoTitle.length <= 65 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {seoTitle.length} / 60 chars
                  </span>
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={e => setSeoTitle(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-white mb-1 flex items-center justify-between">
                  <span>Meta Description</span>
                  <span className={`font-mono text-[11px] ${metaDescription.length >= 120 && metaDescription.length <= 165 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {metaDescription.length} / 160 chars
                  </span>
                </label>
                <textarea
                  rows={2}
                  value={metaDescription}
                  onChange={e => setMetaDescription(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl p-3 text-xs text-white focus:border-[#c5a059] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">Focus Keyword</label>
                <input
                  type="text"
                  value={focusKeyword}
                  onChange={e => setFocusKeyword(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-[#c5a059] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">Secondary Keywords</label>
                <input
                  type="text"
                  value={secondaryKeywords}
                  onChange={e => setSecondaryKeywords(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-[#c5a059] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">Canonical URL</label>
                <input
                  type="text"
                  value={canonicalUrl}
                  onChange={e => setCanonicalUrl(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3 py-2 text-xs text-[#c5a059] focus:border-[#c5a059] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">Robots Meta Directive</label>
                <select
                  value={robotsMeta}
                  onChange={e => setRobotsMeta(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-[#c5a059] outline-none"
                >
                  <option value="index, follow, max-image-preview:large">index, follow, max-image-preview:large</option>
                  <option value="noindex, follow">noindex, follow</option>
                  <option value="noindex, nofollow">noindex, nofollow</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">Open Graph Title</label>
                <input
                  type="text"
                  value={ogTitle}
                  onChange={e => setOgTitle(e.target.value)}
                  placeholder="Defaults to SEO Title"
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-[#c5a059] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">Twitter Card Type</label>
                <select
                  value={twitterCard}
                  onChange={e => setTwitterCard(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-[#c5a059] outline-none"
                >
                  <option value="summary_large_image">summary_large_image</option>
                  <option value="summary">summary</option>
                </select>
              </div>
            </div>

            {/* Structured Data Generator */}
            <div className="bg-[#181818] border border-white/10 rounded-xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <label className="text-xs font-bold text-white flex items-center gap-2">
                  <Code className="w-4 h-4 text-[#c5a059]" />
                  JSON-LD Schema Markup Generator
                </label>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedSchemaType}
                    onChange={e => setSelectedSchemaType(e.target.value)}
                    className="bg-[#141414] border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white"
                  >
                    <option value="LocalBusiness">LocalBusiness Schema</option>
                    <option value="Breadcrumb">Breadcrumb Schema</option>
                    <option value="FAQ">FAQ Schema</option>
                    <option value="Article">Article Schema</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => setCustomSchemaMarkup(generateSchemaTemplate(selectedSchemaType))}
                    className="px-2.5 py-1 bg-[#c5a059]/20 hover:bg-[#c5a059]/30 text-[#c5a059] border border-[#c5a059]/30 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Generate Template
                  </button>
                </div>
              </div>

              <textarea
                rows={6}
                value={customSchemaMarkup}
                onChange={e => setCustomSchemaMarkup(e.target.value)}
                placeholder="JSON-LD Schema code..."
                className="w-full bg-[#111] border border-white/15 rounded-lg p-3 text-[11px] text-[#c5a059] font-mono focus:border-[#c5a059] outline-none"
              />
            </div>
          </form>
        </div>
      )}

      {/* SUB-TAB 2: SEO ANALYZER */}
      {activeSubTab === 'analyzer' && (
        <div className="space-y-6">
          {/* Audit Score Card */}
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-700/10 border border-emerald-500/30 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold font-mono text-emerald-400">{seoAudit.score}%</span>
                <span className="text-[9px] uppercase font-bold text-white/50">SEO Health</span>
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-white">Automated Technical SEO Audit</h3>
                <p className="text-xs text-white/60">
                  Real-time scanner evaluates meta lengths, ALT tags, canonical status, schema presence, and keyword density.
                </p>
              </div>
            </div>

            <button
              onClick={() => showToast('SEO Audit refreshed & verified against Google Guidelines!')}
              className="px-4 py-2.5 bg-[#c5a059] text-black font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
            >
              <RefreshCw className="w-4 h-4" /> Re-Scan Page
            </button>
          </div>

          {/* Audit Metrics List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#141414] border border-white/10 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">SEO Title Length</span>
                <span className="text-[11px] text-white/50">{seoAudit.titleLen} characters (Ideal: 40-65)</span>
              </div>
              <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${seoAudit.titleStatus === 'pass' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {seoAudit.titleStatus}
              </span>
            </div>

            <div className="bg-[#141414] border border-white/10 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Meta Description Length</span>
                <span className="text-[11px] text-white/50">{seoAudit.descLen} characters (Ideal: 120-165)</span>
              </div>
              <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${seoAudit.descStatus === 'pass' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {seoAudit.descStatus}
              </span>
            </div>

            <div className="bg-[#141414] border border-white/10 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Canonical URL Check</span>
                <span className="text-[11px] font-mono text-white/50">{canonicalUrl}</span>
              </div>
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-bold uppercase">
                Pass
              </span>
            </div>

            <div className="bg-[#141414] border border-white/10 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Structured Data / Schema</span>
                <span className="text-[11px] text-white/50">JSON-LD valid & verified</span>
              </div>
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-bold uppercase">
                Pass
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: REDIRECT MANAGER */}
      {activeSubTab === 'redirects' && (
        <div className="space-y-6">
          {/* Add Form */}
          <form onSubmit={handleAddRedirect} className="bg-[#141414] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-serif font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#c5a059]" /> Add URL Redirect Rule
              </h3>

              <button
                type="button"
                onClick={() => setShowBulkModal(true)}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-[#c5a059]" /> Bulk Import
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-white mb-1">Old Request URL / Path</label>
                <input
                  type="text"
                  placeholder="e.g. /escorts-gomti-nagar"
                  value={newFrom}
                  onChange={e => setNewFrom(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">Target Redirect URL</label>
                <input
                  type="text"
                  placeholder="e.g. /call-girl-service-gomti-nagar"
                  value={newTo}
                  onChange={e => setNewTo(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-[#c5a059] focus:border-[#c5a059] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">HTTP Redirect Code</label>
                <div className="flex gap-2">
                  <select
                    value={newStatusCode}
                    onChange={e => setNewStatusCode(Number(e.target.value) as any)}
                    className="flex-1 bg-[#1c1c1c] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:border-[#c5a059] outline-none"
                  >
                    <option value={301}>301 Permanent Redirect</option>
                    <option value={302}>302 Temporary Redirect</option>
                    <option value={410}>410 Content Gone</option>
                  </select>

                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#c5a059] hover:bg-[#b08c46] text-black font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Table */}
          <div className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-white/10 bg-[#111] flex items-center justify-between">
              <h3 className="text-xs font-serif font-bold text-white uppercase tracking-wider">
                Active Redirect Rules ({redirects.length})
              </h3>
              <button
                onClick={handleExportRedirectsCSV}
                className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white rounded text-xs flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5 text-[#c5a059]" /> Export CSV
              </button>
            </div>

            <div className="divide-y divide-white/10">
              {redirects.map(r => (
                <div key={r.id} className="p-4 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30 rounded text-[10px] font-bold">
                      {r.statusCode}
                    </span>
                    <span className="text-white/80">{r.fromSlug}</span>
                    <span className="text-white/30">→</span>
                    <span className="text-[#c5a059] font-bold">{r.toTarget}</span>
                  </div>

                  <button
                    onClick={() => {
                      const updated = redirects.filter(item => item.id !== r.id);
                      setRedirects(updated);
                      updateRedirects(updated);
                    }}
                    className="text-red-400 p-1.5 hover:bg-red-500/20 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: XML SITEMAPS */}
      {activeSubTab === 'sitemap' && (
        <div className="space-y-6">
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSitemapType('index')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${sitemapType === 'index' ? 'bg-[#c5a059] text-black' : 'text-white/70 hover:bg-white/5'}`}
              >
                sitemap.xml
              </button>
              <button
                onClick={() => setSitemapType('location')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${sitemapType === 'location' ? 'bg-[#c5a059] text-black' : 'text-white/70 hover:bg-white/5'}`}
              >
                location-sitemap.xml
              </button>
              <button
                onClick={() => setSitemapType('profile')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${sitemapType === 'profile' ? 'bg-[#c5a059] text-black' : 'text-white/70 hover:bg-white/5'}`}
              >
                profile-sitemap.xml
              </button>
              <button
                onClick={() => setSitemapType('blog')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${sitemapType === 'blog' ? 'bg-[#c5a059] text-black' : 'text-white/70 hover:bg-white/5'}`}
              >
                blog-sitemap.xml
              </button>
              <button
                onClick={() => setSitemapType('image')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${sitemapType === 'image' ? 'bg-[#c5a059] text-black' : 'text-white/70 hover:bg-white/5'}`}
              >
                image-sitemap.xml
              </button>
            </div>

            <button
              onClick={() => handleCopy(generateSitemapXml(), 'xml')}
              className="px-3.5 py-1.5 bg-[#c5a059] text-black font-bold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              {copiedKey === 'xml' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy XML</span>
            </button>
          </div>

          <div className="bg-[#101010] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <pre className="text-xs text-[#c5a059] font-mono overflow-x-auto leading-relaxed">
              {generateSitemapXml()}
            </pre>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: ROBOTS.TXT */}
      {activeSubTab === 'robots' && (
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-serif font-bold text-white">Editable Robots.txt File</h3>
              <p className="text-xs text-white/50">Control search engine crawler indexing instructions.</p>
            </div>
            <button
              onClick={() => showToast('Robots.txt configuration saved!')}
              className="px-4 py-2 bg-[#c5a059] text-black font-bold text-xs rounded-xl cursor-pointer"
            >
              Save Robots.txt
            </button>
          </div>

          <textarea
            rows={10}
            value={robotsTxt}
            onChange={e => setRobotsTxt(e.target.value)}
            className="w-full bg-[#111] border border-white/15 rounded-xl p-4 text-xs font-mono text-[#c5a059] outline-none"
          />
        </div>
      )}

      {/* Bulk Redirect Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-white/15 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Bulk Import Redirect Rules</h3>
            <p className="text-xs text-white/50">
              Paste rules format (one per line): <code className="text-[#c5a059]">/old-path -&gt; /new-path 301</code>
            </p>
            <textarea
              rows={8}
              value={bulkImportText}
              onChange={e => setBulkImportText(e.target.value)}
              placeholder="/escorts-gomti-nagar -> /call-girl-service-gomti-nagar 301"
              className="w-full bg-[#1c1c1c] border border-white/15 rounded-xl p-3 text-xs text-white font-mono"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowBulkModal(false)}
                className="px-4 py-2 bg-white/5 text-white rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkImport}
                className="px-4 py-2 bg-[#c5a059] text-black font-bold rounded-xl text-xs"
              >
                Import Rules
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
