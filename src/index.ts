import express from 'express';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import stocksRouter from './api/stocks.js';
import { errorHandler } from './api/_middleware.js';
import { query } from './db/connection.js';
import { closePool } from './db/connection.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function initDatabase(): Promise<void> {
  try {
    console.log('[DB] Initializing schema...');
    const schema = readFileSync(join(__dirname, 'db', 'schema.sql'), 'utf-8');
    await query(schema);
    console.log('[DB] Schema initialized successfully');
  } catch (err) {
    console.error('[DB] Failed to initialize schema:', err);
    throw err;
  }
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/stocks', stocksRouter);

// Error handling middleware
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('[SERVER] SIGTERM received, closing connections...');
  await closePool();
  process.exit(0);
});

async function start() {
  await initDatabase();

  app.listen(PORT, () => {
    console.log(`[SERVER] Stock Tracking Service running on port ${PORT}`);
    console.log(`[SERVER] Health check: http://localhost:${PORT}/health`);
  });
}

start().catch((err) => {
  console.error('[SERVER] Failed to start:', err);
  process.exit(1);
});
