import BaseError from './BaseError';

class NotFoundError extends BaseError {
  constructor(message: string) {
    super(message);
    this.code = 'notFoundError';
    this.status = 404;
  }
}

export default NotFoundError;
