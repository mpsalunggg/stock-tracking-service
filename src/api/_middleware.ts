import { Request, Response, NextFunction } from 'express';

/**
 * Shared error-handling middleware for all API handlers.
 * Catches async errors and returns consistent JSON responses.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(`[ERROR] ${err.message}`, {
    stack: err.stack,
    timestamp: new Date().toISOString(),
  });

  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
}

/**
 * Async wrapper to catch errors in async route handlers.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
