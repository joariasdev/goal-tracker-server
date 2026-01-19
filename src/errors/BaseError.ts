// import { ValidationError as ValidationErrorType } from 'express-validator';

abstract class BaseError extends Error {
  public code: string = 'Error';
  public status: number = 500;
  public validation?: unknown;

  constructor(message: string) {
    super(message);
  }
}

export default BaseError;
