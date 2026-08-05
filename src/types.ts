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
  title: string;
  category: CategoryType;
  age: number;
  height: string;
  figure: string;
  rateShort: number; // ₹ Short time (2 hours)
  rateFull: number;  // ₹ Full night (8 hours)
  location: LucknowArea;
  city: string;
  phone: string;
  whatsapp: string;
  verified: boolean;
  pickupDropFree: boolean;
  noAdvanceCashOnDelivery: boolean;
  image: string;
  gallery: string[];
  bio: string;
  services: string[];
  rating: number;
  reviewsCount: number;
  isOnline: boolean;
  languages: string[];
}

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

export interface LocationPageInfo {
  slug: string;
  areaName: LucknowArea;
  title: string;
  metaDescription: string;
  h1: string;
  tagline: string;
  intro: string;
  keywords: string[];
  landmarks: string[];
  contentSections: {
    title: string;
    paragraphs: string[];
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

