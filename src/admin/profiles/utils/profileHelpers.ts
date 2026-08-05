import { CompanionProfile } from '../../../types';

export function generateSlug(name: string): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateProfileSchema(profile: Partial<CompanionProfile>): string {
  const name = profile.name || 'Companion Profile';
  const slug = profile.slug || generateSlug(name);
  const canonicalUrl = profile.canonicalUrl || `https://lucknow.juliclub.in/profile/${slug}`;
  const location = profile.location || 'Gomti Nagar';
  const city = profile.city || 'Lucknow';
  const shortIntro = profile.shortIntro || profile.bio || `${name} - VIP Call Girl Service in Lucknow`;
  const image = profile.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb';

  const schemaObj = {
    '@context': 'https://schema.org',
    '@type': 'IndividualProduct',
    'name': `${name} - VIP Escort Lucknow`,
    'image': image,
    'description': shortIntro,
    'category': profile.category || 'Independent Companion',
    'url': canonicalUrl,
    'offers': {
      '@type': 'AggregateOffer',
      'priceCurrency': 'INR',
      'lowPrice': profile.rate1Hour || profile.rateShort || 3000,
      'highPrice': profile.rateFull || 15000,
      'offerCount': 3,
      'availability': 'https://schema.org/InStock'
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': (profile.rating || 4.9).toString(),
      'reviewCount': (profile.reviewsCount || 50).toString()
    },
    'areaServed': {
      '@type': 'AdministrativeArea',
      'name': `${location}, ${city}, Uttar Pradesh`
    }
  };

  return JSON.stringify(schemaObj, null, 2);
}

export function normalizeProfile(raw: Partial<CompanionProfile>): CompanionProfile {
  const name = raw.name || 'New Companion';
  const slug = raw.slug ? generateSlug(raw.slug) : generateSlug(name);
  const shortRate = raw.rateShort ?? 3999;
  const fullRate = raw.rateFull ?? 9999;

  return {
    id: raw.id || `lko-${Date.now().toString(36)}`,
    name,
    slug,
    nickName: raw.nickName || name.split(' ')[0] || '',
    title: raw.title || `VIP ${raw.category || 'Independent'} Companion Lucknow`,
    category: raw.category || 'Independent',
    age: raw.age || 22,
    height: raw.height || "5'6\"",
    weight: raw.weight || '52 kg',
    bodyType: raw.bodyType || 'Slim / Busty',
    figure: raw.figure || '34B-26-36',
    rate1Hour: raw.rate1Hour || Math.round(shortRate * 0.75),
    rateShort: shortRate,
    rateFull: fullRate,
    incall: raw.incall ?? true,
    outcall: raw.outcall ?? true,
    location: raw.location || 'Gomti Nagar',
    city: raw.city || 'Lucknow',
    phone: raw.phone || '+91 87261 79837',
    whatsapp: raw.whatsapp || '918726179837',
    telegram: raw.telegram || '',
    verified: raw.verified ?? true,
    pickupDropFree: raw.pickupDropFree ?? true,
    noAdvanceCashOnDelivery: raw.noAdvanceCashOnDelivery ?? true,
    image: raw.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    gallery: Array.isArray(raw.gallery) && raw.gallery.length > 0 ? raw.gallery : [
      raw.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
    ],
    shortIntro: raw.shortIntro || `${name} is a high-profile verified companion available in ${raw.location || 'Lucknow'} with zero advance payment.`,
    bio: raw.bio || `${name} offers top-tier companion services with complete privacy, zero advance payment, and free 30-minute doorstep pickup across ${raw.location || 'Lucknow'}.`,
    services: Array.isArray(raw.services) && raw.services.length > 0 ? raw.services : [
      'Girlfriend Experience (GFE)',
      'Body to Body Massage',
      'Dinner Date & Social Events',
      '5-Star Hotel Outcall',
      'Free Pickup & Drop',
      'Cash on Delivery (No Advance)'
    ],
    specialities: Array.isArray(raw.specialities) ? raw.specialities : ['Romantic Escort', 'Dinner Partner', 'Sensual Massage'],
    expectations: raw.expectations || 'Respectful clients, hygienic hotel or residence, cash on delivery upon arrival.',
    rules: raw.rules || 'Strictly 0 advance payment, zero recording/photos without consent, clean environment.',
    rating: raw.rating ?? 4.9,
    reviewsCount: raw.reviewsCount ?? 45,
    isOnline: raw.isOnline ?? true,
    languages: Array.isArray(raw.languages) && raw.languages.length > 0 ? raw.languages : ['Hindi', 'English'],
    nationality: raw.nationality || 'Indian',
    profession: raw.profession || 'Model / Companion',
    experience: raw.experience || '2+ Years',
    availability: raw.availability || '24/7 Available',
    nearbyAreas: Array.isArray(raw.nearbyAreas) ? raw.nearbyAreas : ['Hazratganj', 'Indira Nagar', 'Charbagh'],
    isActive: raw.isActive ?? true,
    isFeatured: raw.isFeatured ?? false,
    seoTitle: raw.seoTitle || `${name} (${raw.category || 'Call Girl'}) in ${raw.location || 'Lucknow'} | 0 Advance Payment`,
    metaDescription: raw.metaDescription || `Book ${name} in ${raw.location || 'Lucknow'}. Verified profile, 100% Cash on Delivery (COD), 0 advance payment required. Free pickup within 30 mins.`,
    canonicalUrl: raw.canonicalUrl || `https://lucknow.juliclub.in/profile/${slug}`,
    ogImage: raw.ogImage || raw.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    focusKeyword: raw.focusKeyword || `${name} ${raw.location || 'Lucknow'} call girl`,
    robots: raw.robots || 'index, follow',
    schemaMarkup: raw.schemaMarkup || generateProfileSchema(raw),
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString()
  };
}
