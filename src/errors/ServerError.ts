import BaseError from './BaseError';

class ServerError extends BaseError {
  constructor(message: string) {
    super(message);
    this.code = 'serverError';
    this.status = 500;
  }
}

export default ServerError;
