import { describe, it, expect, beforeEach } from 'vitest';
import { stockRepository } from '../src/db/repositories/stock.repository.js';
import type { CreateStockInput } from '../src/types/stock.js';

describe('StockRepository', () => {
  beforeEach(async () => {
    await stockRepository.clear();
  });

  describe('create', () => {
    it('should create a new stock', async () => {
      const input: CreateStockInput = {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 175.50,
        quantity: 100,
      };

      const stock = await stockRepository.create(input);

      expect(stock).toMatchObject({
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 175.50,
        quantity: 100,
      });
      expect(stock.id).toBeDefined();
      expect(stock.lastUpdated).toBeInstanceOf(Date);
    });

    it('should uppercase the symbol', async () => {
      const input: CreateStockInput = {
        symbol: 'aapl',
        name: 'Apple',
        price: 175,
        quantity: 10,
      };

      const stock = await stockRepository.create(input);
      expect(stock.symbol).toBe('AAPL');
    });
  });

  describe('findAll', () => {
    it('should return empty array when no stocks', async () => {
      const stocks = await stockRepository.findAll();
      expect(stocks).toEqual([]);
    });

    it('should return all created stocks', async () => {
      await stockRepository.create({
        symbol: 'AAPL',
        name: 'Apple',
        price: 175,
        quantity: 10,
      });
      await stockRepository.create({
        symbol: 'GOOGL',
        name: 'Google',
        price: 140,
        quantity: 20,
      });

      const stocks = await stockRepository.findAll();
      expect(stocks).toHaveLength(2);
    });
  });

  describe('findById', () => {
    it('should return stock by id', async () => {
      const created = await stockRepository.create({
        symbol: 'AAPL',
        name: 'Apple',
        price: 175,
        quantity: 10,
      });

      const stock = await stockRepository.findById(created.id);
      expect(stock).not.toBeNull();
      expect(stock?.symbol).toBe('AAPL');
    });

    it('should return null for non-existent id', async () => {
      const stock = await stockRepository.findById('00000000-0000-0000-0000-000000000000');
      expect(stock).toBeNull();
    });
  });

  describe('update', () => {
    it('should update stock price', async () => {
      const created = await stockRepository.create({
        symbol: 'AAPL',
        name: 'Apple',
        price: 175,
        quantity: 10,
      });

      const updated = await stockRepository.update(created.id, { price: 180 });
      expect(updated?.price).toBe(180);
      expect(updated?.quantity).toBe(10); // unchanged
    });

    it('should return null for non-existent id', async () => {
      const updated = await stockRepository.update('00000000-0000-0000-0000-000000000000', { price: 100 });
      expect(updated).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete existing stock', async () => {
      const created = await stockRepository.create({
        symbol: 'AAPL',
        name: 'Apple',
        price: 175,
        quantity: 10,
      });

      const deleted = await stockRepository.delete(created.id);
      expect(deleted).toBe(true);

      const stock = await stockRepository.findById(created.id);
      expect(stock).toBeNull();
    });

    it('should return false for non-existent id', async () => {
      const deleted = await stockRepository.delete('00000000-0000-0000-0000-000000000000');
      expect(deleted).toBe(false);
    });
  });
});
