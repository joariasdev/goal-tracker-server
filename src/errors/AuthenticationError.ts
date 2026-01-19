import BaseError from './BaseError';

class AuthenticationError extends BaseError {
  constructor(message: string) {
    super(message);
    this.code = 'authenticationError';
    this.status = 401;
  }
}

export default AuthenticationError;
