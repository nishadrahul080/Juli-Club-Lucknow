export type CategoryType =
  | 'All'
  | 'Independent'
  | 'College Girls'
  | 'Housewife'
  | 'Supermodels'
  | 'Russian / Exotic'
  | 'VIP Celebrity'
  | 'Air Hostess'
  | 'South Indian'
  | 'North Indian'
  | 'Asian';

export type { BlogPost } from './data/cmsStore';

export type LucknowArea =
  | 'All Lucknow'
  | 'Gomti Nagar'
  | 'Hazratganj'
  | 'Alambagh'
  | 'Indira Nagar'
  | 'Mahanagar'
  | 'Charbagh'
  | 'Chowk'
  | 'Sushant Golf City'
  | 'Vrkand Park';

export interface CompanionProfile {
  id: string;
  name: string;
  slug?: string;
  nickName?: string;
  title: string;
  category: CategoryType;
  age: number;
  height: string;
  weight?: string;
  bodyType?: string;
  figure: string; // measurements e.g. "34B-26-36"
  rate1Hour?: number;
  rateShort: number; // ₹ Short time (2 hours)
  rateFull: number;  // ₹ Full night (8 hours)
  incall?: boolean;
  outcall?: boolean;
  location: LucknowArea;
  city: string;
  phone: string;
  whatsapp: string;
  telegram?: string;
  verified: boolean;
  pickupDropFree: boolean;
  noAdvanceCashOnDelivery: boolean;
  image: string;
  gallery: string[];
  shortIntro?: string;
  bio: string;
  services: string[];
  specialities?: string[];
  expectations?: string;
  rules?: string;
  rating: number;
  reviewsCount: number;
  isOnline: boolean;
  languages: string[];
  nationality?: string;
  profession?: string;
  experience?: string;
  availability?: string;
  nearbyAreas?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
  seoTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  focusKeyword?: string;
  robots?: string;
  schemaMarkup?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type EscortProfile = CompanionProfile;

export interface Review {
  id: string;
  clientName: string;
  profileName: string;
  rating: number;
  date: string;
  comment: string;
  location: string;
  verifiedBooking: boolean;
}

export interface BookingForm {
  profileId: string;
  profileName: string;
  clientName: string;
  clientPhone: string;
  selectedCity: string;
  selectedArea: string;
  hotelOrAddress: string;
  duration: '2 Hours' | '4 Hours' | 'Full Night (8 Hours)' | '24 Hours VIP';
  pickupRequired: boolean;
  specialInstructions: string;
  paymentMode: 'Cash on Delivery (0 Advance)' | 'Pay after Service';
}

export interface CityInfo {
  name: string;
  adsCount: number;
  isPopular?: boolean;
}

export type PublishStatus = 'draft' | 'published' | 'scheduled' | 'archived';

export type SectionType =
  | 'hero'
  | 'text'
  | 'image'
  | 'image-text'
  | 'gallery'
  | 'cards'
  | 'faq'
  | 'cta'
  | 'statistics'
  | 'review'
  | 'features'
  | 'video'
  | 'custom-block'
  | 'custom-html'
  | 'divider'
  | 'spacer';

export interface CMSSectionButton {
  id: string;
  label: string;
  url: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'whatsapp';
  target?: '_blank' | '_self';
}

export interface CMSSectionImage {
  id: string;
  url: string;
  alt?: string;
  caption?: string;
}

export interface CMSSection {
  id: string;
  type: SectionType;
  title: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
  buttons?: CMSSectionButton[];
  images?: CMSSectionImage[];
  icon?: string;
  bgImage?: string;
  bgColor?: string;
  bgOverlayOpacity?: number;
  visibility?: 'all' | 'desktop' | 'mobile';
  animation?: 'none' | 'fade' | 'slide' | 'zoom';
  spacing?: 'none' | 'small' | 'medium' | 'large';
  order: number;
  show: boolean;
  status: PublishStatus;
  scheduledAt?: string;
  seoNotes?: string;
  customData?: Record<string, any>;
}

export interface VersionSnapshot {
  id: string;
  pageId: string;
  timestamp: string;
  author?: string;
  note?: string;
  sections: CMSSection[];
}

export interface ReusableTemplate {
  id: string;
  name: string;
  category: string;
  description?: string;
  section: CMSSection;
  createdAt: string;
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
  status: PublishStatus;
  scheduledAt?: string;
  sections: CMSSection[];
}

export interface RedirectRule {
  id: string;
  fromSlug: string;
  toTarget: string;
  oldSlug?: string;
  newSlug?: string;
  statusCode: 301 | 302 | 307 | 410;
  isActive: boolean;
  createdAt?: string;
}

export interface Log404Item {
  id: string;
  url: string;
  hitCount: number;
  lastVisited: string;
  referrer?: string;
  userAgent?: string;
  suggestedRedirect?: string;
}

export interface LocationPageInfo {
  slug: string;
  areaName: LucknowArea | string;
  locationName?: string;
  title: string;
  metaDescription: string;
  h1: string;
  heroTitle?: string;
  heroDescription?: string;
  heroImage?: string;
  tagline: string;
  intro: string;
  keywords: string[];
  landmarks: string[];
  highlights?: string[];
  popularHotels?: string[];
  pricingOverrides?: {
    shortTime1Hr?: string;
    shortTime2Hr?: string;
    fullNight?: string;
  };
  canonicalUrl?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterCard?: string;
  robotsMeta?: string;
  focusKeyword?: string;
  schemaMarkup?: string;
  nearbyAreas?: string[];
  relatedPages?: string[];
  breadcrumbText?: string;
  ctaText?: string;
  whatsappNumber?: string;
  status?: PublishStatus;
  scheduledAt?: string;
  isFeatured?: boolean;
  contentSections: {
    title: string;
    paragraphs: string[];
  }[];
  customSections?: CMSSection[];
  faqs: {
    question: string;
    answer: string;
  }[];
  oldSlugs?: string[];
  createdAt?: string;
  updatedAt?: string;
}

