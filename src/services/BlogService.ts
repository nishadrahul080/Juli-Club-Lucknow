// Blog Service Layer

import { blogRepository } from '../repositories/blog.repository';
import { BlogPost } from '../data/cmsStore';
import { Sanitizer } from '../validation/sanitizer';

export class BlogService {
  public async getBlogs(): Promise<BlogPost[]> {
    const res = await blogRepository.findAll();
    return res.data;
  }

  public async getBlogBySlug(slug: string): Promise<BlogPost | null> {
    const cleanSlug = Sanitizer.sanitizeSlug(slug);
    return blogRepository.findBySlug(cleanSlug);
  }

  public async createBlog(blog: Partial<BlogPost>): Promise<BlogPost> {
    const sanitized = Sanitizer.sanitizeObject(blog);
    return blogRepository.create(sanitized);
  }

  public async updateBlog(id: string, blog: Partial<BlogPost>): Promise<BlogPost> {
    const sanitized = Sanitizer.sanitizeObject(blog);
    return blogRepository.update(id, sanitized);
  }

  public async deleteBlog(id: string): Promise<boolean> {
    return blogRepository.delete(id);
  }
}

export const blogService = new BlogService();
