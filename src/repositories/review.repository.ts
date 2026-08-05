// Review Repository - Manages Client Testimonials

import { BaseRepository } from './base.repository';
import { ReviewRow } from '../db/types';
import { Review } from '../types';
import { DatabaseTables } from '../db/database';

export class ReviewRepository extends BaseRepository<Review, ReviewRow> {
  protected tableName: keyof DatabaseTables = 'reviews';

  protected mapRowToEntity(row: ReviewRow): Review {
    return {
      id: row.id,
      clientName: row.client_name,
      profileName: row.profile_name,
      rating: row.rating,
      date: row.review_date,
      comment: row.comment,
      location: row.location,
      verifiedBooking: row.verified_booking
    };
  }

  protected mapEntityToRow(entity: Partial<Review>): ReviewRow {
    return {
      id: entity.id || `rev-${Date.now()}`,
      client_name: entity.clientName || 'Anonymous',
      profile_name: entity.profileName || 'Lucknow Companion',
      rating: entity.rating || 5,
      review_date: entity.date || new Date().toISOString().split('T')[0],
      comment: entity.comment || '',
      location: entity.location || 'Gomti Nagar',
      verified_booking: entity.verifiedBooking ?? true,
      created_at: new Date().toISOString()
    };
  }
}

export const reviewRepository = new ReviewRepository();
