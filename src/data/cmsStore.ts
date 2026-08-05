import { COMPANION_PROFILES, CLIENT_REVIEWS, FAQS } from './mockData';
import { LOCATION_PAGES } from './locationData';
import { CompanionProfile, Review, LocationPageInfo } from '../types';

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
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  author: string;
  date: string;
  category: string;
  image: string;
  excerpt: string;
  content: string;
  published: boolean;
}

export interface CMSData {
  settings: SiteSettings;
  profiles: CompanionProfile[];
  reviews: Review[];
  faqs: { id: string; question: string; answer: string; category: string }[];
  locations: Record<string, LocationPageInfo>;
  blogs: BlogPost[];
}

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
  logoText: 'JULI CLUB LUCKNOW',
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
  badgeText: 'VERIFIED LUCKNOW ESCORT SERVICE'
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
  (acc, loc) => ({ ...acc, [loc.slug]: loc }),
  {}
);

export function getCMSData(): CMSData {
  try {
    const stored = localStorage.getItem(CMS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
        profiles: parsed.profiles || COMPANION_PROFILES,
        reviews: parsed.reviews || CLIENT_REVIEWS,
        faqs: parsed.faqs || FAQS.map((item, idx) => ({ id: `faq-${idx}`, question: item.question, answer: item.answer, category: 'General' })),
        locations: parsed.locations || DEFAULT_LOCATIONS_MAP,
        blogs: parsed.blogs || INITIAL_BLOGS
      };
    }
  } catch (e) {
    console.error('Failed to parse CMS data from localStorage:', e);
  }

  // Fallback default
  return {
    settings: DEFAULT_SETTINGS,
    profiles: COMPANION_PROFILES,
    reviews: CLIENT_REVIEWS,
    faqs: FAQS.map((item, idx) => ({ id: `faq-${idx}`, question: item.question, answer: item.answer, category: 'General' })),
    locations: DEFAULT_LOCATIONS_MAP,
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
