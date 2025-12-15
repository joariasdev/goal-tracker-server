import { Request, Response, NextFunction } from 'express';

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) return next(err);

  const isProduction = process.env.NODE_ENV === 'production';
  const statusCode = err.status || err.statusCode || 500;

  if (!isProduction) {
    console.error(`[DEV LOG - ${statusCode}] ${req.method} ${req.originalUrl}`);
    console.error(err.stack);
  } else {
    console.error(`[PROD ERROR] ${statusCode} on ${req.originalUrl}`);
  }

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message:
      statusCode >= 500 && isProduction
        ? 'An unexpected internal server error ocurred.'
        : err.message || 'Something went wrong.',
  });
};

export default errorHandler;
