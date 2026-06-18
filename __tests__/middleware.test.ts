import { describe, it, expect, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { errorHandler, asyncHandler } from '../src/api/_middleware.js';

describe('API Middleware', () => {
  describe('errorHandler', () => {
    it('should return 500 with error message', () => {
      const err = new Error('Test error');
      const req = {} as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;
      const next = vi.fn();

      errorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Test error',
      });
    });
  });

  describe('asyncHandler', () => {
    it('should call next with error on rejection', async () => {
      const error = new Error('Async error');
      const handler = asyncHandler(async () => {
        throw error;
      });

      const req = {} as Request;
      const res = {} as Response;
      const next = vi.fn();

      await handler(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });

    it('should not call next on success', async () => {
      const handler = asyncHandler(async (_req, res) => {
        res.json({ success: true });
      });

      const req = {} as Request;
      const res = {
        json: vi.fn(),
      } as unknown as Response;
      const next = vi.fn();

      await handler(req, res, next);

      expect(res.json).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });
  });
});
