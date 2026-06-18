import { query, queryOne } from '../connection.js';
import { Stock, CreateStockInput, UpdateStockInput } from '../../types/stock.js';

interface StockRow {
  id: string;
  symbol: string;
  name: string;
  price: string;
  quantity: string;
  last_updated: Date;
}

function mapRowToStock(row: StockRow): Stock {
  return {
    id: row.id,
    symbol: row.symbol,
    name: row.name,
    price: parseFloat(row.price),
    quantity: parseInt(row.quantity, 10),
    lastUpdated: new Date(row.last_updated),
  };
}

/**
 * Repository for Stock entities.
 * All database operations MUST go through this repository.
 * No raw queries allowed outside this directory.
 */
export class StockRepository {
  async findAll(): Promise<Stock[]> {
    const rows = await query<StockRow>(
      'SELECT id, symbol, name, price::text, quantity::text, last_updated FROM stocks ORDER BY symbol'
    );
    return rows.map(mapRowToStock);
  }

  async findById(id: string): Promise<Stock | null> {
    const row = await queryOne<StockRow>(
      'SELECT id, symbol, name, price::text, quantity::text, last_updated FROM stocks WHERE id = $1',
      [id]
    );
    return row ? mapRowToStock(row) : null;
  }

  async findBySymbol(symbol: string): Promise<Stock | null> {
    const row = await queryOne<StockRow>(
      'SELECT id, symbol, name, price::text, quantity::text, last_updated FROM stocks WHERE LOWER(symbol) = LOWER($1)',
      [symbol]
    );
    return row ? mapRowToStock(row) : null;
  }

  async create(input: CreateStockInput): Promise<Stock> {
    const row = await queryOne<StockRow>(
      `INSERT INTO stocks (symbol, name, price, quantity)
       VALUES ($1, $2, $3, $4)
       RETURNING id, symbol, name, price::text, quantity::text, last_updated`,
      [input.symbol.toUpperCase(), input.name, input.price, input.quantity]
    );
    return mapRowToStock(row!);
  }

  async update(id: string, input: UpdateStockInput): Promise<Stock | null> {
    const updates: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (input.price !== undefined) {
      updates.push(`price = $${paramIndex++}`);
      values.push(input.price);
    }
    if (input.quantity !== undefined) {
      updates.push(`quantity = $${paramIndex++}`);
      values.push(input.quantity);
    }

    if (updates.length === 0) return this.findById(id);

    updates.push(`last_updated = NOW()`);
    values.push(id);

    const row = await queryOne<StockRow>(
      `UPDATE stocks SET ${updates.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING id, symbol, name, price::text, quantity::text, last_updated`,
      values
    );
    return row ? mapRowToStock(row) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await query<{ id: string }>(
      'DELETE FROM stocks WHERE id = $1 RETURNING id',
      [id]
    );
    return result.length > 0;
  }

  async clear(): Promise<void> {
    await query('DELETE FROM stocks');
  }
}

// Singleton instance
export const stockRepository = new StockRepository();
