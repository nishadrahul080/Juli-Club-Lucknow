-- PostgreSQL Production Schema for Juli Club CMS
-- Supports multi-city expansion, relational media library, SEO separation, and full audit tracking.

-- 1. Cities Entity (Future-ready for multi-city: Lucknow, Noida, Delhi, Bangalore, Mumbai, etc.)
CREATE TABLE IF NOT EXISTS cities (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    state VARCHAR(100) NOT NULL DEFAULT 'Uttar Pradesh',
    country VARCHAR(50) NOT NULL DEFAULT 'India',
    ads_count INT NOT NULL DEFAULT 0,
    is_popular BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cities_slug ON cities(slug);
CREATE INDEX idx_cities_active ON cities(is_active);

-- 2. Categories Entity
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_slug ON categories(slug);

-- 3. Users Entity
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin', -- 'superadmin', 'admin', 'editor'
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- 4. Media Library & Uploads Entity
CREATE TABLE IF NOT EXISTS media_library (
    id VARCHAR(64) PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size_bytes INT NOT NULL,
    storage_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    alt_text VARCHAR(255) DEFAULT '',
    width INT,
    height INT,
    uploaded_by VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_media_public_url ON media_library(public_url);

-- 5. SEO Metadata Entity (Stored Separately)
CREATE TABLE IF NOT EXISTS seo_metadata (
    id VARCHAR(64) PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL, -- 'profile', 'location_page', 'homepage', 'blog'
    entity_id VARCHAR(64) NOT NULL,
    meta_title VARCHAR(255) NOT NULL,
    meta_description TEXT NOT NULL,
    canonical_url TEXT,
    robots_meta VARCHAR(100) DEFAULT 'index, follow, max-image-preview:large',
    og_title VARCHAR(255),
    og_description TEXT,
    og_image_id VARCHAR(64) REFERENCES media_library(id) ON DELETE SET NULL,
    og_image_url TEXT,
    twitter_card VARCHAR(50) DEFAULT 'summary_large_image',
    focus_keyword VARCHAR(100),
    schema_markup TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unq_entity_seo UNIQUE (entity_type, entity_id)
);

CREATE INDEX idx_seo_entity ON seo_metadata(entity_type, entity_id);

-- 6. Companion Profiles Entity
CREATE TABLE IF NOT EXISTS profiles (
    id VARCHAR(64) PRIMARY KEY,
    city_id VARCHAR(64) NOT NULL REFERENCES cities(id) ON DELETE RESTRICT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    nick_name VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    category_id VARCHAR(64) NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    category_name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    height VARCHAR(50) NOT NULL,
    weight VARCHAR(50),
    body_type VARCHAR(50),
    figure VARCHAR(50) NOT NULL,
    rate_1hr INT DEFAULT 3000,
    rate_short INT NOT NULL,
    rate_full INT NOT NULL,
    incall BOOLEAN NOT NULL DEFAULT TRUE,
    outcall BOOLEAN NOT NULL DEFAULT TRUE,
    location_area VARCHAR(100) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    whatsapp VARCHAR(30) NOT NULL,
    telegram VARCHAR(50),
    verified BOOLEAN NOT NULL DEFAULT TRUE,
    pickup_drop_free BOOLEAN NOT NULL DEFAULT TRUE,
    no_advance_cod BOOLEAN NOT NULL DEFAULT TRUE,
    avatar_media_id VARCHAR(64) REFERENCES media_library(id) ON DELETE SET NULL,
    avatar_url TEXT NOT NULL,
    short_intro TEXT,
    bio TEXT NOT NULL,
    services JSONB NOT NULL DEFAULT '[]',
    specialities JSONB DEFAULT '[]',
    expectations TEXT,
    rules TEXT,
    rating NUMERIC(3,2) NOT NULL DEFAULT 4.9,
    reviews_count INT NOT NULL DEFAULT 0,
    is_online BOOLEAN NOT NULL DEFAULT TRUE,
    languages JSONB NOT NULL DEFAULT '["Hindi", "English"]',
    nationality VARCHAR(50) DEFAULT 'Indian',
    profession VARCHAR(100),
    experience VARCHAR(50),
    availability VARCHAR(100) DEFAULT '24/7 Available',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_profiles_city ON profiles(city_id);
CREATE INDEX idx_profiles_slug ON profiles(slug);
CREATE INDEX idx_profiles_category ON profiles(category_id);
CREATE INDEX idx_profiles_active ON profiles(is_active);
CREATE INDEX idx_profiles_featured ON profiles(is_featured);

-- 7. Profile Gallery Images Relation Table
CREATE TABLE IF NOT EXISTS profile_images (
    id VARCHAR(64) PRIMARY KEY,
    profile_id VARCHAR(64) NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    media_id VARCHAR(64) REFERENCES media_library(id) ON DELETE SET NULL,
    image_url TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_profile_images_profile ON profile_images(profile_id);

-- 8. Location Pages Entity
CREATE TABLE IF NOT EXISTS location_pages (
    id VARCHAR(64) PRIMARY KEY,
    city_id VARCHAR(64) NOT NULL REFERENCES cities(id) ON DELETE RESTRICT,
    slug VARCHAR(120) NOT NULL UNIQUE,
    area_name VARCHAR(100) NOT NULL,
    location_name VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    meta_description TEXT NOT NULL,
    h1 VARCHAR(255) NOT NULL,
    hero_title VARCHAR(255),
    hero_description TEXT,
    hero_image_id VARCHAR(64) REFERENCES media_library(id) ON DELETE SET NULL,
    hero_image_url TEXT,
    tagline VARCHAR(255) NOT NULL,
    intro TEXT NOT NULL,
    keywords JSONB DEFAULT '[]',
    landmarks JSONB DEFAULT '[]',
    highlights JSONB DEFAULT '[]',
    popular_hotels JSONB DEFAULT '[]',
    pricing_overrides JSONB DEFAULT '{}',
    breadcrumb_text VARCHAR(100),
    cta_text VARCHAR(100),
    whatsapp_number VARCHAR(30),
    status VARCHAR(50) NOT NULL DEFAULT 'published',
    scheduled_at TIMESTAMP WITH TIME ZONE,
    is_featured BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_location_slug ON location_pages(slug);
CREATE INDEX idx_location_city ON location_pages(city_id);
CREATE INDEX idx_location_status ON location_pages(status);

-- 9. Location Content Sections
CREATE TABLE IF NOT EXISTS location_content_sections (
    id VARCHAR(64) PRIMARY KEY,
    location_page_id VARCHAR(64) NOT NULL REFERENCES location_pages(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    paragraphs JSONB NOT NULL DEFAULT '[]',
    display_order INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_location_sections_page ON location_content_sections(location_page_id);

-- 10. Location FAQs
CREATE TABLE IF NOT EXISTS location_faqs (
    id VARCHAR(64) PRIMARY KEY,
    location_page_id VARCHAR(64) NOT NULL REFERENCES location_pages(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_location_faqs_page ON location_faqs(location_page_id);

-- 11. Homepage Config & Sections
CREATE TABLE IF NOT EXISTS homepage_configs (
    id VARCHAR(64) PRIMARY KEY,
    city_id VARCHAR(64) NOT NULL REFERENCES cities(id) ON DELETE RESTRICT,
    status VARCHAR(50) NOT NULL DEFAULT 'published',
    scheduled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS homepage_sections (
    id VARCHAR(64) PRIMARY KEY,
    homepage_config_id VARCHAR(64) NOT NULL REFERENCES homepage_configs(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    cta_text VARCHAR(100),
    cta_url TEXT,
    bg_image_id VARCHAR(64) REFERENCES media_library(id) ON DELETE SET NULL,
    bg_image_url TEXT,
    bg_color VARCHAR(50) DEFAULT '#0a0a0a',
    spacing VARCHAR(20) DEFAULT 'medium',
    display_order INT NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT TRUE,
    status VARCHAR(50) NOT NULL DEFAULT 'published',
    custom_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_hp_sections_config ON homepage_sections(homepage_config_id);

-- 12. Blog Posts Entity
CREATE TABLE IF NOT EXISTS blogs (
    id VARCHAR(64) PRIMARY KEY,
    slug VARCHAR(120) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    meta_title VARCHAR(255) NOT NULL,
    meta_description TEXT NOT NULL,
    author VARCHAR(100) NOT NULL DEFAULT 'Juli Club Editorial',
    published_date DATE NOT NULL,
    category VARCHAR(100) NOT NULL,
    featured_image_id VARCHAR(64) REFERENCES media_library(id) ON DELETE SET NULL,
    featured_image_url TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_blogs_slug ON blogs(slug);
CREATE INDEX idx_blogs_published ON blogs(is_published);

-- 13. FAQs Entity
CREATE TABLE IF NOT EXISTS faqs (
    id VARCHAR(64) PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'General',
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Client Reviews Entity
CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(64) PRIMARY KEY,
    profile_id VARCHAR(64) REFERENCES profiles(id) ON DELETE SET NULL,
    client_name VARCHAR(100) NOT NULL,
    profile_name VARCHAR(100) NOT NULL,
    rating NUMERIC(2,1) NOT NULL DEFAULT 5.0,
    review_date VARCHAR(50) NOT NULL,
    comment TEXT NOT NULL,
    location VARCHAR(100) NOT NULL,
    verified_booking BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_profile ON reviews(profile_id);

-- 15. Site Settings Entity
CREATE TABLE IF NOT EXISTS site_settings (
    id VARCHAR(64) PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 16. Navigation Links Entity
CREATE TABLE IF NOT EXISTS navigation_items (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    url VARCHAR(255) NOT NULL,
    icon VARCHAR(50),
    parent_id VARCHAR(64) REFERENCES navigation_items(id) ON DELETE CASCADE,
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 17. Redirect Rules Entity
CREATE TABLE IF NOT EXISTS redirect_rules (
    id VARCHAR(64) PRIMARY KEY,
    from_slug VARCHAR(255) NOT NULL UNIQUE,
    to_target VARCHAR(255) NOT NULL,
    status_code INT NOT NULL DEFAULT 301,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_redirects_from ON redirect_rules(from_slug);
