// Input Sanitization & Security Protection Layer
// Prevents XSS attacks, strips malicious script blocks, and sanitizes input vectors.

export class Sanitizer {
  /**
   * Escape HTML entities to prevent XSS vulnerability
   */
  public static escapeHtml(str: string): string {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Strip dangerous HTML tags and script elements
   */
  public static stripDangerousTags(html: string): string {
    if (!html) return '';
    return String(html)
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/javascript:[^\s'"]*/gi, '');
  }

  /**
   * Sanitize text string by trimming and escaping dangerous markup
   */
  public static sanitizeText(text: string): string {
    if (!text) return '';
    return this.stripDangerousTags(text.trim());
  }

  /**
   * Sanitize URL slug to enforce safe alphanumeric hyphenated format
   */
  public static sanitizeSlug(slug: string): string {
    if (!slug) return '';
    return slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\-\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/\-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Verify and sanitize phone numbers
   */
  public static sanitizePhone(phone: string): string {
    if (!phone) return '';
    return phone.replace(/[^0-9+]/g, '');
  }

  /**
   * Deep sanitize object properties
   */
  public static sanitizeObject<T extends Record<string, any>>(obj: T): T {
    if (!obj || typeof obj !== 'object') return obj;
    const sanitized: Record<string, any> = Array.isArray(obj) ? [] : {};

    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (typeof val === 'string') {
        sanitized[key] = this.sanitizeText(val);
      } else if (typeof val === 'object' && val !== null) {
        sanitized[key] = this.sanitizeObject(val);
      } else {
        sanitized[key] = val;
      }
    }

    return sanitized as T;
  }
}
