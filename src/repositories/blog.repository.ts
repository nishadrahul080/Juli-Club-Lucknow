// Blog Repository - Manages Blog Posts

import { BaseRepository } from './base.repository';
import { BlogRow } from '../db/types';
import { BlogPost } from '../data/cmsStore';
import { DatabaseTables } from '../db/database';

export class BlogRepository extends BaseRepository<BlogPost, BlogRow> {
  protected tableName: keyof DatabaseTables = 'blogs';

  protected mapRowToEntity(row: BlogRow): BlogPost {
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      metaTitle: row.meta_title,
      metaDescription: row.meta_description,
      author: row.author,
      date: row.published_date,
      category: row.category,
      image: row.featured_image_url,
      excerpt: row.excerpt,
      content: row.content,
      published: row.is_published
    };
  }

  protected mapEntityToRow(entity: Partial<BlogPost>): BlogRow {
    return {
      id: entity.id || `blog-${Date.now()}`,
      slug: entity.slug || `post-${Date.now()}`,
      title: entity.title || '',
      meta_title: entity.metaTitle || entity.title || '',
      meta_description: entity.metaDescription || entity.excerpt || '',
      author: entity.author || 'Juli Club Editorial',
      published_date: entity.date || new Date().toISOString().split('T')[0],
      category: entity.category || 'Lucknow Guide',
      featured_image_url: entity.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      excerpt: entity.excerpt || '',
      content: entity.content || '',
      is_published: entity.published ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  public async findBySlug(slug: string): Promise<BlogPost | null> {
    const rows = this.getRecords();
    const found = rows.find(r => r.slug === slug);
    if (!found) return null;
    return this.mapRowToEntity(found);
  }
}

export const blogRepository = new BlogRepository();
