// Domain Entity Models

import {
  CityRow,
  CategoryRow,
  UserRow,
  MediaRow,
  SeoMetadataRow,
  ProfileRow,
  ProfileImageRow,
  LocationPageRow,
  BlogRow,
  FaqRow,
  ReviewRow,
  SiteSettingRow,
  NavigationItemRow,
  RedirectRuleRow,
  HomepageSectionRow
} from '../db/types';

export class CityEntity {
  constructor(
    public id: string,
    public name: string,
    public slug: string,
    public state: string = 'Uttar Pradesh',
    public country: string = 'India',
    public adsCount: number = 0,
    public isPopular: boolean = true,
    public isActive: boolean = true
  ) {}

  public static fromRow(row: CityRow): CityEntity {
    return new CityEntity(
      row.id,
      row.name,
      row.slug,
      row.state,
      row.country,
      row.ads_count,
      row.is_popular,
      row.is_active
    );
  }

  public toRow(): CityRow {
    return {
      id: this.id,
      name: this.name,
      slug: this.slug,
      state: this.state,
      country: this.country,
      ads_count: this.adsCount,
      is_popular: this.isPopular,
      is_active: this.isActive
    };
  }
}

export class CategoryEntity {
  constructor(
    public id: string,
    public name: string,
    public slug: string,
    public description: string = '',
    public displayOrder: number = 0,
    public isActive: boolean = true
  ) {}

  public static fromRow(row: CategoryRow): CategoryEntity {
    return new CategoryEntity(
      row.id,
      row.name,
      row.slug,
      row.description || '',
      row.display_order,
      row.is_active
    );
  }

  public toRow(): CategoryRow {
    return {
      id: this.id,
      name: this.name,
      slug: this.slug,
      description: this.description,
      display_order: this.displayOrder,
      is_active: this.isActive
    };
  }
}

export class UserEntity {
  constructor(
    public id: string,
    public email: string,
    public name: string,
    public role: 'superadmin' | 'admin' | 'editor',
    public isActive: boolean = true,
    public lastLogin?: string
  ) {}

  public static fromRow(row: UserRow): UserEntity {
    return new UserEntity(
      row.id,
      row.email,
      row.name,
      row.role,
      row.is_active,
      row.last_login
    );
  }
}

export class MediaEntity {
  constructor(
    public id: string,
    public filename: string,
    public originalName: string,
    public mimeType: string,
    public sizeBytes: number,
    public storagePath: string,
    public publicUrl: string,
    public altText: string = '',
    public width?: number,
    public height?: number,
    public uploadedBy?: string,
    public createdAt?: string
  ) {}

  public static fromRow(row: MediaRow): MediaEntity {
    return new MediaEntity(
      row.id,
      row.filename,
      row.original_name,
      row.mime_type,
      row.size_bytes,
      row.storage_path,
      row.public_url,
      row.alt_text || '',
      row.width,
      row.height,
      row.uploaded_by,
      row.created_at
    );
  }

  public toRow(): MediaRow {
    return {
      id: this.id,
      filename: this.filename,
      original_name: this.originalName,
      mime_type: this.mimeType,
      size_bytes: this.sizeBytes,
      storage_path: this.storagePath,
      public_url: this.publicUrl,
      alt_text: this.altText,
      width: this.width,
      height: this.height,
      uploaded_by: this.uploadedBy,
      created_at: this.createdAt
    };
  }
}

export class SeoMetadataEntity {
  constructor(
    public id: string,
    public entityType: 'profile' | 'location_page' | 'homepage' | 'blog' | 'site',
    public entityId: string,
    public metaTitle: string,
    public metaDescription: string,
    public canonicalUrl?: string,
    public robotsMeta: string = 'index, follow, max-image-preview:large',
    public ogTitle?: string,
    public ogDescription?: string,
    public ogImageId?: string,
    public ogImageUrl?: string,
    public twitterCard: string = 'summary_large_image',
    public focusKeyword?: string,
    public schemaMarkup?: string
  ) {}

  public static fromRow(row: SeoMetadataRow): SeoMetadataEntity {
    return new SeoMetadataEntity(
      row.id,
      row.entity_type,
      row.entity_id,
      row.meta_title,
      row.meta_description,
      row.canonical_url,
      row.robots_meta || 'index, follow',
      row.og_title,
      row.og_description,
      row.og_image_id,
      row.og_image_url,
      row.twitter_card || 'summary_large_image',
      row.focus_keyword,
      row.schema_markup
    );
  }

  public toRow(): SeoMetadataRow {
    return {
      id: this.id,
      entity_type: this.entityType,
      entity_id: this.entityId,
      meta_title: this.metaTitle,
      meta_description: this.metaDescription,
      canonical_url: this.canonicalUrl,
      robots_meta: this.robotsMeta,
      og_title: this.ogTitle,
      og_description: this.ogDescription,
      og_image_id: this.ogImageId,
      og_image_url: this.ogImageUrl,
      twitter_card: this.twitterCard,
      focus_keyword: this.focusKeyword,
      schema_markup: this.schemaMarkup
    };
  }
}
