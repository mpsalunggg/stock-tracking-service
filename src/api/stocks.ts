import { Router, Request, Response } from 'express';
import { asyncHandler } from './_middleware.js';
import { stockRepository } from '../db/repositories/stock.repository.js';
import { CreateStockInput, UpdateStockInput } from '../types/stock.js';

const router = Router();

// GET /api/stocks - List all stocks
router.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    const stocks = await stockRepository.findAll();
    res.json({ success: true, data: stocks });
  })
);

// GET /api/stocks/:id - Get single stock
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const stock = await stockRepository.findById(req.params.id);
    if (!stock) {
      res.status(404).json({ success: false, error: 'Stock not found' });
      return;
    }
    res.json({ success: true, data: stock });
  })
);

// POST /api/stocks - Create new stock
router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const input: CreateStockInput = req.body;

    if (!input.symbol || !input.name || input.price === undefined || input.quantity === undefined) {
      res.status(400).json({ success: false, error: 'Missing required fields' });
      return;
    }

    const existing = await stockRepository.findBySymbol(input.symbol);
    if (existing) {
      res.status(409).json({ success: false, error: 'Stock symbol already exists' });
      return;
    }

    const stock = await stockRepository.create(input);
    res.status(201).json({ success: true, data: stock });
  })
);

// PATCH /api/stocks/:id - Update stock
router.patch(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const input: UpdateStockInput = req.body;

    if (Object.keys(input).length === 0) {
      res.status(400).json({ success: false, error: 'No update fields provided' });
      return;
    }

    const stock = await stockRepository.update(req.params.id, input);
    if (!stock) {
      res.status(404).json({ success: false, error: 'Stock not found' });
      return;
    }
    res.json({ success: true, data: stock });
  })
);

// DELETE /api/stocks/:id - Delete stock
router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const deleted = await stockRepository.delete(req.params.id);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Stock not found' });
      return;
    }
    res.json({ success: true, data: { id: req.params.id } });
  })
);

export default router;
