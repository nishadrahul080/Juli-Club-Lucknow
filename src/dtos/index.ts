// Data Transfer Objects for Database & Repository Queries

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  cityId?: string;
  cityName?: string;
  categoryId?: string;
  categoryName?: string;
  locationArea?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  status?: string;
}

export interface QueryParams extends PaginationParams, SortParams, FilterParams {}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Entity DTOs

export interface CreateMediaDTO {
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  storagePath: string;
  publicUrl: string;
  altText?: string;
  width?: number;
  height?: number;
  uploadedBy?: string;
}

export interface CreateSeoDTO {
  entityType: 'profile' | 'location_page' | 'homepage' | 'blog' | 'site';
  entityId: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl?: string;
  robotsMeta?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageId?: string;
  ogImageUrl?: string;
  twitterCard?: string;
  focusKeyword?: string;
  schemaMarkup?: string;
}

export interface UpdateSeoDTO extends Partial<CreateSeoDTO> {}

export interface CreateProfileDTO {
  cityId: string;
  name: string;
  slug?: string;
  nickName?: string;
  title: string;
  categoryId: string;
  categoryName: string;
  age: number;
  height: string;
  weight?: string;
  bodyType?: string;
  figure: string;
  rate1Hr?: number;
  rateShort: number;
  rateFull: number;
  incall?: boolean;
  outcall?: boolean;
  locationArea: string;
  phone: string;
  whatsapp: string;
  telegram?: string;
  verified?: boolean;
  pickupDropFree?: boolean;
  noAdvanceCod?: boolean;
  avatarMediaId?: string;
  avatarUrl: string;
  galleryUrls?: string[];
  shortIntro?: string;
  bio: string;
  services?: string[];
  specialities?: string[];
  expectations?: string;
  rules?: string;
  languages?: string[];
  nationality?: string;
  profession?: string;
  experience?: string;
  availability?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  seoTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  focusKeyword?: string;
}

export interface UpdateProfileDTO extends Partial<CreateProfileDTO> {}

export interface CreateLocationPageDTO {
  cityId: string;
  slug: string;
  areaName: string;
  locationName?: string;
  title: string;
  metaDescription: string;
  h1: string;
  heroTitle?: string;
  heroDescription?: string;
  heroImageId?: string;
  heroImageUrl?: string;
  tagline: string;
  intro: string;
  keywords?: string[];
  landmarks?: string[];
  highlights?: string[];
  popularHotels?: string[];
  pricingOverrides?: Record<string, any>;
  breadcrumbText?: string;
  ctaText?: string;
  whatsappNumber?: string;
  status?: 'draft' | 'published' | 'scheduled' | 'archived';
  scheduledAt?: string;
  isFeatured?: boolean;
  contentSections?: { title: string; paragraphs: string[] }[];
  faqs?: { question: string; answer: string }[];
  customSections?: any[];
}

export interface UpdateLocationPageDTO extends Partial<CreateLocationPageDTO> {}
