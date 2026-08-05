// Base Repository Pattern Abstraction
// Provides generic CRUD, search, pagination, filtering, and sorting capabilities.

import { db } from '../db/database';
import { DatabaseTables } from '../db/database';
import { QueryParams, PaginatedResponse } from '../dtos';

export interface IRepository<T, RowType> {
  findAll(params?: QueryParams): Promise<PaginatedResponse<T>>;
  findById(id: string): Promise<T | null>;
  findBySlug?(slug: string): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
  count(filter?: Partial<RowType>): Promise<number>;
}

export abstract class BaseRepository<T, RowType extends { id: string }> implements IRepository<T, RowType> {
  protected abstract tableName: keyof DatabaseTables;

  public getRecords(): RowType[] {
    return db.getTable(this.tableName) as unknown as RowType[];
  }

  public setRecords(records: RowType[]): void {
    db.setTable(this.tableName, records as any);
  }

  protected abstract mapRowToEntity(row: RowType): T;
  protected abstract mapEntityToRow(entity: Partial<T>): RowType;

  public async findAll(params: QueryParams = {}): Promise<PaginatedResponse<T>> {
    let records = [...this.getRecords()];

    // Filtering
    if (params.search) {
      const term = params.search.toLowerCase();
      records = records.filter(r =>
        JSON.stringify(r).toLowerCase().includes(term)
      );
    }

    if (params.isActive !== undefined) {
      records = records.filter((r: any) => Boolean(r.is_active) === params.isActive);
    }

    // Sorting
    if (params.sortBy) {
      const field = params.sortBy as keyof RowType;
      const order = params.sortOrder === 'desc' ? -1 : 1;
      records.sort((a, b) => {
        const valA = a[field];
        const valB = b[field];
        if (valA < valB) return -1 * order;
        if (valA > valB) return 1 * order;
        return 0;
      });
    }

    // Pagination
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : 1000;
    const total = records.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedRecords = records.slice(startIndex, startIndex + limit);

    return {
      data: paginatedRecords.map(r => this.mapRowToEntity(r)),
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };
  }

  public async findById(id: string): Promise<T | null> {
    const records = this.getRecords();
    const found = records.find(r => r.id === id);
    if (!found) return null;
    return this.mapRowToEntity(found);
  }

  public async create(data: Partial<T>): Promise<T> {
    const records = this.getRecords();
    const newRow = this.mapEntityToRow(data);
    if (!newRow.id) {
      newRow.id = `entity-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    }
    records.push(newRow);
    this.setRecords(records);
    return this.mapRowToEntity(newRow);
  }

  public async update(id: string, data: Partial<T>): Promise<T> {
    const records = this.getRecords();
    const index = records.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error(`Record with id ${id} not found in ${String(this.tableName)}`);
    }

    const updatedRow = {
      ...records[index],
      ...this.mapEntityToRow(data),
      id // preserve ID
    };

    records[index] = updatedRow;
    this.setRecords(records);
    return this.mapRowToEntity(updatedRow);
  }

  public async delete(id: string): Promise<boolean> {
    const records = this.getRecords();
    const initialLen = records.length;
    const filtered = records.filter(r => r.id !== id);
    if (filtered.length === initialLen) return false;
    this.setRecords(filtered);
    return true;
  }

  public async count(filter?: Partial<RowType>): Promise<number> {
    let records = this.getRecords();
    if (filter) {
      records = records.filter(r => {
        return Object.entries(filter).every(([k, v]) => (r as any)[k] === v);
      });
    }
    return records.length;
  }
}
