import BaseError from './BaseError';
import { ValidationError as ValidationErrorType } from 'express-validator';

interface ValidationErrorProps {
  message: string;
  validation: ValidationErrorType[];
}

class ValidationError extends BaseError {
  constructor(error: ValidationErrorProps) {
    super(error.message);
    this.code = 'validationError';
    this.status = 400;
    this.validation = error.validation;
  }
}

export default ValidationError;
