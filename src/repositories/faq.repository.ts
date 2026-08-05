// FAQ Repository

import { BaseRepository } from './base.repository';
import { FaqRow } from '../db/types';
import { DatabaseTables } from '../db/database';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export class FaqRepository extends BaseRepository<FaqItem, FaqRow> {
  protected tableName: keyof DatabaseTables = 'faqs';

  protected mapRowToEntity(row: FaqRow): FaqItem {
    return {
      id: row.id,
      question: row.question,
      answer: row.answer,
      category: row.category
    };
  }

  protected mapEntityToRow(entity: Partial<FaqItem>): FaqRow {
    return {
      id: entity.id || `faq-${Date.now()}`,
      question: entity.question || '',
      answer: entity.answer || '',
      category: entity.category || 'General',
      display_order: 1,
      is_active: true,
      created_at: new Date().toISOString()
    };
  }
}

export const faqRepository = new FaqRepository();
