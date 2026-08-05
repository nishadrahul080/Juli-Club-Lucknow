// Form & Data Entity Validation Rules

import { CreateProfileDTO, CreateLocationPageDTO, CreateSeoDTO, CreateMediaDTO } from '../dtos';

export interface ValidationError {
  field: string;
  message: string;
}

export class ValidationResult {
  public errors: ValidationError[] = [];

  public get isValid(): boolean {
    return this.errors.length === 0;
  }

  public addError(field: string, message: string): void {
    this.errors.push({ field, message });
  }
}

export class Validator {
  public static validateProfile(data: Partial<CreateProfileDTO>): ValidationResult {
    const res = new ValidationResult();

    if (!data.name || data.name.trim().length < 2) {
      res.addError('name', 'Companion name must be at least 2 characters long.');
    }

    if (!data.title || data.title.trim().length < 5) {
      res.addError('title', 'Profile title must be at least 5 characters long.');
    }

    if (!data.age || data.age < 18 || data.age > 60) {
      res.addError('age', 'Age must be between 18 and 60.');
    }

    if (!data.rateShort || data.rateShort <= 0) {
      res.addError('rateShort', 'Short time rate must be greater than 0.');
    }

    if (!data.rateFull || data.rateFull <= 0) {
      res.addError('rateFull', 'Full night rate must be greater than 0.');
    }

    if (!data.phone || data.phone.length < 8) {
      res.addError('phone', 'A valid phone number is required.');
    }

    if (!data.bio || data.bio.trim().length < 10) {
      res.addError('bio', 'Bio description must be at least 10 characters long.');
    }

    return res;
  }

  public static validateLocationPage(data: Partial<CreateLocationPageDTO>): ValidationResult {
    const res = new ValidationResult();

    if (!data.slug || data.slug.trim().length < 2) {
      res.addError('slug', 'Location page slug is required.');
    }

    if (!data.areaName || data.areaName.trim().length < 2) {
      res.addError('areaName', 'Area name is required.');
    }

    if (!data.title || data.title.trim().length < 5) {
      res.addError('title', 'SEO Title is required and must be descriptive.');
    }

    if (!data.metaDescription || data.metaDescription.trim().length < 20) {
      res.addError('metaDescription', 'Meta description must be at least 20 characters.');
    }

    if (!data.h1 || data.h1.trim().length < 3) {
      res.addError('h1', 'H1 Heading is required.');
    }

    return res;
  }

  public static validateSeo(data: Partial<CreateSeoDTO>): ValidationResult {
    const res = new ValidationResult();

    if (!data.metaTitle || data.metaTitle.trim().length < 5) {
      res.addError('metaTitle', 'Meta Title must be at least 5 characters long.');
    }

    if (!data.metaDescription || data.metaDescription.trim().length < 10) {
      res.addError('metaDescription', 'Meta Description must be at least 10 characters long.');
    }

    return res;
  }

  public static validateMediaUpload(data: Partial<CreateMediaDTO>): ValidationResult {
    const res = new ValidationResult();

    if (!data.publicUrl || !data.publicUrl.startsWith('http')) {
      res.addError('publicUrl', 'A valid public URL or path is required for media uploads.');
    }

    if (!data.filename) {
      res.addError('filename', 'Filename is required.');
    }

    return res;
  }
}
