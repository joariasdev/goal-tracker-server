import { validationResult } from 'express-validator';
import ValidationError from '../errors/ValidationError';
import { Request } from 'express';

export default function validateInput(request: Request) {
  const validationErrors = validationResult(request);

  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array();

    const error = {
      message: 'Your request is invalid',
      validation: errors,
    };

    throw new ValidationError(error);
  }
}
