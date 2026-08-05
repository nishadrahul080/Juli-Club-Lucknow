// Media Upload Service - Validates and registers uploads in database with relations

import { mediaRepository } from '../repositories/media.repository';
import { MediaEntity } from '../models/entities';
import { CreateMediaDTO } from '../dtos';
import { Validator } from '../validation/validators';
import { Sanitizer } from '../validation/sanitizer';

export class MediaService {
  public async getMediaItems(): Promise<MediaEntity[]> {
    const res = await mediaRepository.findAll();
    return res.data;
  }

  public async uploadMedia(dto: CreateMediaDTO): Promise<MediaEntity> {
    const sanitized = Sanitizer.sanitizeObject(dto);
    const validation = Validator.validateMediaUpload(sanitized);

    if (!validation.isValid) {
      throw new Error(`Media Upload Invalid: ${validation.errors.map(e => e.message).join(', ')}`);
    }

    return mediaRepository.create(sanitized as unknown as Partial<MediaEntity>);
  }

  public async deleteMedia(id: string): Promise<boolean> {
    return mediaRepository.delete(id);
  }
}

export const mediaService = new MediaService();
