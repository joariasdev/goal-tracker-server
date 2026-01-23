import { Request, Response, NextFunction } from 'express';
import BaseError from '../errors/BaseError';

interface ErrorResponse {
  code: string;
  message: string;
  validation?: unknown;
}

const errorHandler = (
  err: BaseError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) return next(err);

  const isProduction = process.env.NODE_ENV === 'production';
  const statusCode = err.status || 500;

  if (!isProduction) {
    console.error(`[DEV LOG - ${statusCode}] ${req.method} ${req.originalUrl}`);
    console.error(err.stack);
  } else {
    console.error(`[PROD ERROR] ${statusCode} on ${req.originalUrl}`);
  }

  const error: ErrorResponse = {
    code: statusCode >= 500 && isProduction ? 'serverError' : err.code,
    message:
      statusCode >= 500 && isProduction
        ? 'An unexpected internal server error ocurred.'
        : err.message || 'Something went wrong.',
  };

  if (err.validation) {
    error.validation = err.validation;
  }

  res.status(statusCode).json({ error });
};

export default errorHandler;
