import { COMPANION_PROFILES, CLIENT_REVIEWS, FAQS } from './mockData';
import { LOCATION_PAGES } from './locationData';
import { CompanionProfile, Review, LocationPageInfo, CMSSection, RedirectRule } from '../types';

export interface NavItemConfig {
  id: string;
  label: string;
  url: string;
  show: boolean;
  order: number;
}

export interface QuickLinkConfig {
  id: string;
  label: string;
  url: string;
}

export interface PopupConfig {
  enabled: boolean;
  title: string;
  badge?: string;
  content: string;
  delaySeconds?: number;
  code?: string;
}

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  borderRadius: string;
  fontFamily: string;
  customCss?: string;
}

export interface SiteSettings {
  siteTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  robotsMeta: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;
  whatsappNumber: string;
  whatsappMessage: string;
  contactPhone: string;
  logoText: string;
  announcementText: string;
  googleAnalyticsId: string;
  googleSearchConsoleTag: string;
  customHeaderScript: string;
  schemaMarkup: string;
  heroHeading: string;
  heroSubheading: string;
  badgeText: string;

  // General Settings
  websiteName?: string;
  brandName?: string;
  websiteTagline?: string;
  companyDescription?: string;
  copyrightText?: string;
  footerText?: string;

  // Branding Assets
  logoUrl?: string;
  footerLogoUrl?: string;
  faviconUrl?: string;

  // Contact Info
  secondaryWhatsApp?: string;
  contactEmail?: string;

  // Social Media Links
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  telegramUrl?: string;
  youtubeUrl?: string;

  // Header & Navigation
  navigationMenu?: NavItemConfig[];
  headerCtaText?: string;
  headerCtaUrl?: string;

  // Footer Config
  footerDescription?: string;
  footerQuickLinks?: QuickLinkConfig[];
  disclaimerText?: string;
  privacyPolicyUrl?: string;
  termsUrl?: string;
  footerAddress?: string;

  // WhatsApp Global Settings
  whatsappFloatingEnabled?: boolean;
  whatsappPosition?: 'bottom-right' | 'bottom-left';
  whatsappCtaText?: string;

  // Popups (Future Ready)
  announcementPopup?: PopupConfig;
  exitPopup?: PopupConfig;
  offerPopup?: PopupConfig;

  // Theme Settings (Future Ready Architecture)
  themeConfig?: ThemeConfig;

  // Custom Code & Scripts
  customFooterScript?: string;
  customCss?: string;
  customJs?: string;
  verificationCodes?: string;

  // Integrations
  googleTagManagerId?: string;
  metaPixelId?: string;
  googleSiteVerification?: string;
  bingVerification?: string;

  // SMTP Email Settings
  smtpHost?: string;
  smtpPort?: number;
  smtpUsername?: string;
  smtpPassword?: string;
  smtpEncryption?: 'tls' | 'ssl' | 'none';

  // Security & Modes
  maintenanceMode?: boolean;
  comingSoonMode?: boolean;
  forceHttps?: boolean;
  sessionTimeoutMinutes?: number;
}

export interface HomepageConfig {
  seoTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  robots: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;
  focusKeyword: string;
  schemaMarkup: string;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  scheduledAt?: string;
  sections: CMSSection[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  author: string;
  date: string;
  publishedAt?: string;
  scheduledAt?: string;
  category: string;
  tags?: string[];
  image: string;
  excerpt: string;
  content: string;
  published: boolean;
  status?: 'draft' | 'published' | 'scheduled' | 'archived';
  readingTime?: string;
  isFeatured?: boolean;
  isSticky?: boolean;
  focusKeyword?: string;
  secondaryKeywords?: string[];
  canonicalUrl?: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  autoToc?: boolean;
  faqs?: { question: string; answer: string }[];
}

export interface CMSData {
  settings: SiteSettings;
  homepage: HomepageConfig;
  profiles: CompanionProfile[];
  reviews: Review[];
  faqs: { id: string; question: string; answer: string; category: string }[];
  locations: Record<string, LocationPageInfo>;
  redirects: RedirectRule[];
  blogs: BlogPost[];
}

export const DEFAULT_HOMEPAGE_SECTIONS: CMSSection[] = [
  {
    id: 'hp-text-1',
    type: 'text',
    title: 'Premier Call Girl Service Lucknow | 100% Cash on Delivery & No Advance',
    subtitle: 'Juli Club Verified COD Guarantee',
    description: 'In the culturally rich city of Lucknow—from the bustling avenues of Hazratganj to the luxury high-rises of Gomti Nagar—finding a passionate, well-mannered companion shouldn\'t be complicated or stressful. At Juli Club, we redefine Call Girl Service Lucknow by offering transparent, safe, and elite female companionship with zero advance payments required.',
    bgColor: '#0a0a0a',
    spacing: 'medium',
    order: 1,
    show: true,
    status: 'published'
  },
  {
    id: 'hp-imgtext-1',
    type: 'image-text',
    title: 'Fulfill Your Fantasy & Experience Unmatched Romance',
    subtitle: 'Luxury Stays & Total Confidentiality',
    description: 'Choose from curvy fashion divas, delicate Asian companions, or high-society air hostesses for private dinners, riverfront drives, or 5-star hotel relaxation in Gomti Nagar and Hazratganj.',
    ctaText: 'View All Companions',
    ctaUrl: '#profiles',
    bgImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    bgColor: '#0f0f0f',
    spacing: 'medium',
    order: 2,
    show: true,
    status: 'published'
  },
  {
    id: 'hp-hinglish-1',
    type: 'text',
    title: 'लखनऊ में सुरक्षित Call Girl Service - Cash On Delivery के साथ',
    subtitle: 'No Advance • Real Pictures • Local Outcalls',
    description: 'Lucknow ki busy lifestyle aur executive stays ke dauran, jab aap ek relaxing companion chahte hain, toh Juli Club aapka trusted destination hai. Hum bina kisi advance payment ya hidden cab charges ke, real pictures ke saath 100% authentic Call Girl Service Lucknow provide karte hain.',
    bgColor: '#1a1a1a',
    spacing: 'medium',
    order: 3,
    show: true,
    status: 'published'
  },
  {
    id: 'hp-stats-1',
    type: 'statistics',
    title: 'Why Choose Juli Club for Call Girl Service Lucknow?',
    subtitle: 'We lead the market with uncompromising quality, total safety, and client-first ethics.',
    bgColor: '#0f0f0f',
    spacing: 'large',
    order: 4,
    show: true,
    status: 'published',
    customData: {
      stats: [
        { label: 'Starting Rate', value: '₹3,999', detail: 'Affordable short time & full night packages' },
        { label: 'Payment Guarantee', value: 'Zero Advance', detail: '100% Cash on Delivery when companion arrives' },
        { label: 'Cab Service', value: 'Free Pickup', detail: 'Free private driver delivery to any hotel or residence' },
        { label: 'Verification', value: '100% Real', detail: 'Unedited photos with guaranteed real measurements' }
      ]
    }
  }
];

export const DEFAULT_HOMEPAGE_CONFIG: HomepageConfig = {
  seoTitle: 'Juli Club - Call Girl Service Lucknow | 100% Cash on Delivery (0 Advance)',
  metaDescription: 'Verified 5-Star VIP Call Girl Service in Lucknow. 0 Advance Payment, 100% Cash on Delivery. Free 30-Min Hotel & Home Delivery in Gomti Nagar, Hazratganj, Charbagh.',
  canonicalUrl: 'https://lucknow.juliclub.in/',
  robots: 'index, follow, max-image-preview:large',
  ogTitle: 'VIP Call Girl Service Lucknow - 100% Cash on Delivery | Juli Club',
  ogDescription: 'Verified High Profile Call Girls in Lucknow. 0 Advance Payment. 24/7 Hotel Outcall in Gomti Nagar, Hazratganj, Airport.',
  ogImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1200',
  twitterCard: 'summary_large_image',
  focusKeyword: 'Call Girl Service Lucknow',
  schemaMarkup: JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'AdultEntertainment',
      'name': 'Juli Club Lucknow',
      'image': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
      'telephone': '+918726179837',
      'priceRange': '₹3000 - ₹15000',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Lucknow',
        'addressRegion': 'Uttar Pradesh',
        'addressCountry': 'IN'
      },
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.9',
        'reviewCount': '342'
      }
    },
    null,
    2
  ),
  status: 'published',
  sections: DEFAULT_HOMEPAGE_SECTIONS
};

export const DEFAULT_SETTINGS: SiteSettings = {
  siteTitle: 'Juli Club - Call Girl Service Lucknow | 100% Cash on Delivery (0 Advance)',
  metaDescription: 'Verified 5-Star VIP Call Girl Service in Lucknow. 0 Advance Payment, 100% Cash on Delivery. Free 30-Min Hotel & Home Delivery in Gomti Nagar, Hazratganj, Charbagh.',
  canonicalUrl: 'https://lucknow.juliclub.in/',
  robotsMeta: 'index, follow, max-image-preview:large',
  ogTitle: 'VIP Call Girl Service Lucknow - 100% Cash on Delivery | Juli Club',
  ogDescription: 'Verified High Profile Call Girls in Lucknow. 0 Advance Payment. 24/7 Hotel Outcall in Gomti Nagar, Hazratganj, Airport.',
  ogImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1200',
  twitterCard: 'summary_large_image',
  whatsappNumber: '918726179837',
  whatsappMessage: 'Hello Juli Club, I want to book a VIP companion in Lucknow.',
  contactPhone: '+91 8726179837',
  logoText: 'JULI CLUB',
  announcementText: '⚡ 100% Cash on Delivery | 0 Advance Payment Required | Free 30-Min Hotel Pickup',
  googleAnalyticsId: 'G-XXXXXXXXXX',
  googleSearchConsoleTag: 'google-site-verification=XXXXXXXXXXXXXXXX',
  customHeaderScript: '<!-- Custom Header Analytics or Pixel Scripts -->',
  schemaMarkup: JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'AdultEntertainment',
      'name': 'Juli Club Lucknow',
      'image': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
      'telephone': '+918726179837',
      'priceRange': '₹3000 - ₹15000',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Lucknow',
        'addressRegion': 'Uttar Pradesh',
        'addressCountry': 'IN'
      },
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.9',
        'reviewCount': '342'
      }
    },
    null,
    2
  ),
  heroHeading: 'Exclusive VIP Call Girl Service in Lucknow',
  heroSubheading: '100% Cash on Delivery • 0 Advance Payment • Free 30-Min Hotel & Doorstep Delivery',
  badgeText: 'VERIFIED LUCKNOW ESCORT SERVICE',

  // General Settings
  websiteName: 'Juli Club Lucknow',
  brandName: 'Juli Club',
  websiteTagline: 'CALL GIRL SERVICE LUCKNOW',
  companyDescription: 'Juli Club Lucknow is a 5-star verified VIP female companion and escort directory offering 100% Cash on Delivery with zero advance payment and complimentary private cab delivery.',
  copyrightText: '© 2026 Juli Club Lucknow. All Rights Reserved.',
  footerText: 'Lucknow Premier 100% Cash on Delivery VIP Call Girl Service.',

  // Branding Assets
  logoUrl: '',
  footerLogoUrl: '',
  faviconUrl: '',

  // Contact Info
  secondaryWhatsApp: '918726179837',
  contactEmail: 'ramanarora7869@gmail.com',

  // Social Links
  facebookUrl: 'https://facebook.com/juliclublucknow',
  instagramUrl: 'https://instagram.com/juliclublucknow',
  twitterUrl: 'https://x.com/juliclublucknow',
  telegramUrl: 'https://t.me/juliclublucknow',
  youtubeUrl: 'https://youtube.com/@juliclublucknow',

  // Header & Nav
  navigationMenu: [
    { id: 'nav-1', label: 'Home', url: '/', show: true, order: 1 },
    { id: 'nav-2', label: 'Companions', url: '#profiles', show: true, order: 2 },
    { id: 'nav-3', label: 'Locations', url: '#locations', show: true, order: 3 },
    { id: 'nav-4', label: 'Rates', url: '#rates', show: true, order: 4 },
    { id: 'nav-5', label: 'Reviews', url: '#reviews', show: true, order: 5 },
    { id: 'nav-6', label: 'Blog', url: '#blogs', show: true, order: 6 }
  ],
  headerCtaText: 'Book via WhatsApp',
  headerCtaUrl: 'https://wa.me/918726179837?text=Hi%20Juli%20Club%2C%20I%20want%20to%20book%20a%20Call%20Girl%20Service%20Lucknow.',

  // Footer Config
  footerDescription: 'Juli Club Lucknow provides premium, discreet, and 100% authentic adult female companionship across Gomti Nagar, Hazratganj, Alambagh, Charbagh, and all top 5-star hotels in Lucknow with 0 advance payment.',
  footerQuickLinks: [
    { id: 'ql-1', label: 'Home', url: '/' },
    { id: 'ql-2', label: 'Companions', url: '#profiles' },
    { id: 'ql-3', label: 'Gomti Nagar Escorts', url: '/call-girl-service-gomti-nagar' },
    { id: 'ql-4', label: 'Hazratganj Escorts', url: '/call-girl-service-hazratganj' },
    { id: 'ql-5', label: 'Privacy Policy', url: '#privacy' },
    { id: 'ql-6', label: 'Terms & Conditions', url: '#terms' }
  ],
  disclaimerText: '18+ Adults Only. Juli Club strictly operates as an independent companion directory in Lucknow. All models are consenting adults (18+). Zero advance payment required.',
  privacyPolicyUrl: '#privacy',
  termsUrl: '#terms',
  footerAddress: 'Gomti Nagar Main Road, Lucknow, Uttar Pradesh 226010',

  // WhatsApp
  whatsappFloatingEnabled: true,
  whatsappPosition: 'bottom-right',
  whatsappCtaText: 'WhatsApp Us (0 Advance)',

  // Popups (Future Ready)
  announcementPopup: {
    enabled: false,
    title: '⚡ Instant 100% COD Booking',
    content: 'No advance payment required. Free 30-min private driver pickup in Gomti Nagar & Hazratganj.',
    delaySeconds: 5
  },
  exitPopup: {
    enabled: false,
    title: 'Wait! Want 100% Cash on Delivery?',
    content: 'Chat with our Lucknow manager now on WhatsApp with zero advance fee.'
  },
  offerPopup: {
    enabled: false,
    title: 'Special VIP Discount',
    badge: '10% OFF',
    content: 'Book 2+ hours and receive complimentary 5-star hotel room pickup.',
    code: 'JULI10'
  },

  // Theme Settings (Future Ready Architecture)
  themeConfig: {
    primaryColor: '#c5a059',
    secondaryColor: '#141414',
    accentColor: '#d4b578',
    borderRadius: '0.75rem',
    fontFamily: 'Playfair Display, Plus Jakarta Sans, sans-serif'
  },

  // Custom Code
  customFooterScript: '<!-- Custom Footer Script Block -->',
  customCss: '/* Custom Global Styling Override */',
  customJs: '// Custom JS Logic Block',
  verificationCodes: '<meta name="google-site-verification" content="JULI_CLUB_VERIFY_KEY" />',

  // Integrations
  googleTagManagerId: 'GTM-XXXXXXXX',
  metaPixelId: '1234567890123456',
  googleSiteVerification: 'JULI_CLUB_GSC_VERIFICATION_KEY',
  bingVerification: 'JULI_CLUB_BING_VERIFICATION_KEY',

  // Email / SMTP Settings
  smtpHost: 'smtp.hostinger.com',
  smtpPort: 465,
  smtpUsername: 'contact@juliclub.in',
  smtpPassword: '••••••••••••',
  smtpEncryption: 'ssl',

  // Security & Modes
  maintenanceMode: false,
  comingSoonMode: false,
  forceHttps: true,
  sessionTimeoutMinutes: 120
};

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'top-hotels-in-gomti-nagar-for-couples-and-outcall',
    title: 'Top 5 Star Hotels in Gomti Nagar Lucknow for Safe & Private Stay',
    metaTitle: 'Safe Hotels in Gomti Nagar Lucknow | Juli Club Guide',
    metaDescription: 'Detailed guide to top luxury hotels in Gomti Nagar Lucknow for seamless, private outcall service with 0 advance payment.',
    author: 'Juli Club Editorial',
    date: '2026-08-01',
    category: 'Lucknow Guide',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
    excerpt: 'Discover the safest and most luxury 5-star hotels in Gomti Nagar for direct, hassle-free outcalls with 0 advance payment guarantee.',
    content: `Gomti Nagar is the luxury capital of Lucknow, housing premium hotels like Taj Mahal Lucknow, Novotel, Renaissance, and Hyatt Regency. Whether you are visiting for business or leisure, choosing the right hotel ensures privacy and top-tier service. All Juli Club companions offer free 30-minute doorstep or hotel room pickup with zero advance payment.`,
    published: true
  },
  {
    id: 'blog-2',
    slug: 'how-to-avoid-call-girl-scams-in-lucknow',
    title: 'How to Avoid Call Girl Scams in Lucknow: Why 0 Advance Payment is Essential',
    metaTitle: 'Avoid Call Girl Scams in Lucknow - 0 Advance Payment Safety Rule',
    metaDescription: 'Learn how to identify fake escort agencies in Lucknow. Always insist on 100% Cash on Delivery and zero upfront online transfers.',
    author: 'Safety Team',
    date: '2026-08-04',
    category: 'Safety & Advice',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
    excerpt: 'Never transfer online money before meeting your companion. Discover why Juli Club strictly enforces 100% Cash on Delivery across Lucknow.',
    content: `Online scams in escort services usually start with small advance requests like registration fees, taxi charges, or hotel deposits. At Juli Club, we guarantee 100% Cash on Delivery. You inspect and verify your companion in person before making any payment.`,
    published: true
  }
];

const CMS_STORAGE_KEY = 'juli_club_cms_data_v1';

const DEFAULT_LOCATIONS_MAP: Record<string, LocationPageInfo> = LOCATION_PAGES.reduce(
  (acc, loc) => ({
    ...acc,
    [loc.slug]: {
      ...loc,
      status: loc.status || 'published',
      locationName: loc.locationName || `${loc.areaName} Call Girls`,
      heroTitle: loc.heroTitle || loc.h1,
      heroDescription: loc.heroDescription || loc.intro,
      canonicalUrl: loc.canonicalUrl || `https://lucknow.juliclub.in/${loc.slug}`,
      robotsMeta: loc.robotsMeta || 'index, follow, max-image-preview:large',
      focusKeyword: loc.focusKeyword || `${loc.areaName} Call Girl Service Lucknow`,
      whatsappNumber: loc.whatsappNumber || '918726179837',
      isFeatured: loc.isFeatured ?? true
    }
  }),
  {}
);

export function getCMSData(): CMSData {
  try {
    const stored = localStorage.getItem(CMS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const settings = { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) };
      if (settings.logoText === 'JULI CLUB LUCKNOW') {
        settings.logoText = 'JULI CLUB';
      }
      if (settings.websiteTagline && settings.websiteTagline.includes('Premier VIP')) {
        settings.websiteTagline = 'CALL GIRL SERVICE LUCKNOW';
      }
      if (typeof settings.footerQuickLinks === 'string') {
        try {
          const p = JSON.parse(settings.footerQuickLinks);
          settings.footerQuickLinks = Array.isArray(p) ? p : DEFAULT_SETTINGS.footerQuickLinks;
        } catch {
          settings.footerQuickLinks = DEFAULT_SETTINGS.footerQuickLinks;
        }
      }
      if (typeof settings.navigationMenu === 'string') {
        try {
          const p = JSON.parse(settings.navigationMenu);
          settings.navigationMenu = Array.isArray(p) ? p : DEFAULT_SETTINGS.navigationMenu;
        } catch {
          settings.navigationMenu = DEFAULT_SETTINGS.navigationMenu;
        }
      }

      const homepage = { ...DEFAULT_HOMEPAGE_CONFIG, ...(parsed.homepage || {}) };
      if (homepage.sections && Array.isArray(homepage.sections)) {
        homepage.sections = homepage.sections.filter(
          (sec: any) => !['hp-hero-1', 'hp-cards-1', 'hp-reviews-1', 'hp-faq-1'].includes(sec.id)
        );
      }

      return {
        settings,
        homepage,
        profiles: parsed.profiles || COMPANION_PROFILES,
        reviews: parsed.reviews || CLIENT_REVIEWS,
        faqs: parsed.faqs || FAQS.map((item, idx) => ({ id: `faq-${idx}`, question: item.question, answer: item.answer, category: 'General' })),
        locations: parsed.locations || DEFAULT_LOCATIONS_MAP,
        redirects: parsed.redirects || [],
        blogs: parsed.blogs || INITIAL_BLOGS
      };
    }
  } catch (e) {
    console.error('Failed to parse CMS data from localStorage:', e);
  }

  // Fallback default
  return {
    settings: DEFAULT_SETTINGS,
    homepage: DEFAULT_HOMEPAGE_CONFIG,
    profiles: COMPANION_PROFILES,
    reviews: CLIENT_REVIEWS,
    faqs: FAQS.map((item, idx) => ({ id: `faq-${idx}`, question: item.question, answer: item.answer, category: 'General' })),
    locations: DEFAULT_LOCATIONS_MAP,
    redirects: [],
    blogs: INITIAL_BLOGS
  };
}

export function saveCMSData(data: CMSData): void {
  try {
    localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save CMS data to localStorage:', e);
  }
}

export function resetCMSData(): CMSData {
  localStorage.removeItem(CMS_STORAGE_KEY);
  return getCMSData();
}
