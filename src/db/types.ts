// Database Table Types corresponding to relational database tables

export interface CityRow {
  id: string;
  name: string;
  slug: string;
  state: string;
  country: string;
  ads_count: number;
  is_popular: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description?: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: 'superadmin' | 'admin' | 'editor';
  is_active: boolean;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MediaRow {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size_bytes: number;
  storage_path: string;
  public_url: string;
  alt_text?: string;
  width?: number;
  height?: number;
  uploaded_by?: string;
  created_at?: string;
}

export interface SeoMetadataRow {
  id: string;
  entity_type: 'profile' | 'location_page' | 'homepage' | 'blog' | 'site';
  entity_id: string;
  meta_title: string;
  meta_description: string;
  canonical_url?: string;
  robots_meta?: string;
  og_title?: string;
  og_description?: string;
  og_image_id?: string;
  og_image_url?: string;
  twitter_card?: string;
  focus_keyword?: string;
  schema_markup?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileRow {
  id: string;
  city_id: string;
  name: string;
  slug: string;
  nick_name?: string;
  title: string;
  category_id: string;
  category_name: string;
  age: number;
  height: string;
  weight?: string;
  body_type?: string;
  figure: string;
  rate_1hr?: number;
  rate_short: number;
  rate_full: number;
  incall: boolean;
  outcall: boolean;
  location_area: string;
  phone: string;
  whatsapp: string;
  telegram?: string;
  verified: boolean;
  pickup_drop_free: boolean;
  no_advance_cod: boolean;
  avatar_media_id?: string;
  avatar_url: string;
  short_intro?: string;
  bio: string;
  services: string[]; // parsed from JSON
  specialities?: string[];
  expectations?: string;
  rules?: string;
  rating: number;
  reviews_count: number;
  is_online: boolean;
  languages: string[];
  nationality?: string;
  profession?: string;
  experience?: string;
  availability?: string;
  is_active: boolean;
  is_featured: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileImageRow {
  id: string;
  profile_id: string;
  media_id?: string;
  image_url: string;
  display_order: number;
  is_primary: boolean;
  created_at?: string;
}

export interface LocationPageRow {
  id: string;
  city_id: string;
  slug: string;
  area_name: string;
  location_name?: string;
  title: string;
  meta_description: string;
  h1: string;
  hero_title?: string;
  hero_description?: string;
  hero_image_id?: string;
  hero_image_url?: string;
  tagline: string;
  intro: string;
  keywords: string[];
  landmarks: string[];
  highlights?: string[];
  popular_hotels?: string[];
  pricing_overrides?: Record<string, any>;
  breadcrumb_text?: string;
  cta_text?: string;
  whatsapp_number?: string;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  scheduled_at?: string;
  is_featured: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface LocationContentSectionRow {
  id: string;
  location_page_id: string;
  title: string;
  paragraphs: string[];
  display_order: number;
}

export interface LocationFaqRow {
  id: string;
  location_page_id: string;
  question: string;
  answer: string;
  display_order: number;
}

export interface HomepageConfigRow {
  id: string;
  city_id: string;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  scheduled_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface HomepageSectionRow {
  id: string;
  homepage_config_id: string;
  type: string;
  title: string;
  subtitle?: string;
  description?: string;
  cta_text?: string;
  cta_url?: string;
  bg_image_id?: string;
  bg_image_url?: string;
  bg_color?: string;
  spacing?: 'none' | 'small' | 'medium' | 'large';
  display_order: number;
  is_visible: boolean;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  custom_data?: Record<string, any>;
  created_at?: string;
}

export interface BlogRow {
  id: string;
  slug: string;
  title: string;
  meta_title: string;
  meta_description: string;
  author: string;
  published_date: string;
  category: string;
  featured_image_id?: string;
  featured_image_url: string;
  excerpt: string;
  content: string;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FaqRow {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface ReviewRow {
  id: string;
  profile_id?: string;
  client_name: string;
  profile_name: string;
  rating: number;
  review_date: string;
  comment: string;
  location: string;
  verified_booking: boolean;
  created_at?: string;
}

export interface SiteSettingRow {
  id: string;
  setting_key: string;
  setting_value: string;
  description?: string;
  updated_at?: string;
}

export interface NavigationItemRow {
  id: string;
  title: string;
  url: string;
  icon?: string;
  parent_id?: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface RedirectRuleRow {
  id: string;
  from_slug: string;
  to_target: string;
  status_code: 301 | 302 | 307 | 410;
  is_active: boolean;
  created_at?: string;
}
